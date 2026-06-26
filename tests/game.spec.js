import { test, expect } from '@playwright/test';

// ゲーム本体（GameScene）が動作中になるまで待ち、F1を開始する。
async function startGame(page) {
  await page.goto('/');
  await page.waitForFunction(() => {
    const g = window.__game;
    if (!g) return false;
    const t = g.scene.getScene('TitleScene');
    return t && t.sys.settings.status === 5;
  }, { timeout: 15000 });
  await page.evaluate(() => {
    window.__game.scene.getScene('TitleScene').scene.start('GameScene', { floorId: 1, score: 0 });
  });
  await page.waitForFunction(() => {
    const gs = window.__game.scene.getScene('GameScene');
    return gs && gs.sys.settings.status === 5 && gs.player && gs.player.body;
  }, { timeout: 15000 });
  // 接地が安定するまで待つ（spawn直後の数フレームのジッターを避ける）
  await page.waitForFunction(() => {
    const p = window.__game.scene.getScene('GameScene').player;
    return (p.body.blocked.down || p.body.onFloor()) && Math.abs(p.body.bottom - 575) < 2;
  }, { timeout: 5000 });
}

// JustDownを確実に拾うため、キーを数フレーム押下してから離す（瞬間pressだと取りこぼす）
async function tapKey(page, key) {
  await page.keyboard.down(key);
  await page.waitForTimeout(80);
  await page.keyboard.up(key);
}

const playerState = () => {
  const gs = window.__game.scene.getScene('GameScene');
  const p = gs.player;
  return {
    x: Math.round(p.x),
    bottom: Math.round(p.body.bottom),
    grounded: p.body.blocked.down || p.body.onFloor(),
    state: p.state,
    hp: p.hp,
    powered: p.powered,
    beams: gs.playerBeams.getChildren().length,
  };
};

test('起動してタイトル→ゲームへ。コンソールエラーなし', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await startGame(page);
  const s = await page.evaluate(playerState);
  expect(s.bottom).toBeGreaterThan(572);
  expect(s.bottom).toBeLessThan(578); // 接地（足元=床575付近）
  expect(s.grounded).toBe(true);
  expect(errors, errors.join('\n')).toHaveLength(0);
});

test('ジャンプ：床から離れて、着地後に同じ床へ戻る（段ズレしない）', async ({ page }) => {
  await startGame(page);
  const before = await page.evaluate(playerState);
  expect(before.grounded).toBe(true);

  // 実キー入力でジャンプ（数フレーム押下）
  await tapKey(page, 'ArrowUp');

  // 空中に出たことを確認（grounded=false の瞬間がある）
  await page.waitForFunction(() => {
    const gs = window.__game.scene.getScene('GameScene');
    return !(gs.player.body.blocked.down || gs.player.body.onFloor());
  }, { timeout: 3000 });

  // 着地して同じ床に戻ることを確認
  await page.waitForFunction(() => {
    const gs = window.__game.scene.getScene('GameScene');
    const p = gs.player;
    return (p.body.blocked.down || p.body.onFloor()) && Math.abs(p.body.bottom - 575) < 3;
  }, { timeout: 4000 });

  const after = await page.evaluate(playerState);
  expect(Math.abs(after.bottom - before.bottom)).toBeLessThan(3); // 段が変わっていない
  expect(after.grounded).toBe(true);
});

test('移動：→で右に進む', async ({ page }) => {
  await startGame(page);
  const x0 = (await page.evaluate(playerState)).x;
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowRight');
  const x1 = (await page.evaluate(playerState)).x;
  expect(x1).toBeGreaterThan(x0 + 30);
});

test('歩行アニメ：→で歩くと walk アニメが再生される', async ({ page }) => {
  await startGame(page);
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(200);
  const a = await page.evaluate(() => {
    const p = window.__game.scene.getScene('GameScene').player;
    return { state: p.state, playing: p.anims.isPlaying, key: p.anims.currentAnim ? p.anims.currentAnim.key : null };
  });
  await page.keyboard.up('ArrowRight');
  expect(a.state).toBe('walk');
  expect(a.playing).toBe(true);                 // アニメ再生中
  expect(a.key).toBe('anim_player_walk');       // 歩行アニメ
});

test('ハゲ化：パワーアップ後の攻撃でビームが出る', async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => window.__game.scene.getScene('GameScene').player.powerUp());
  const powered = (await page.evaluate(playerState)).powered;
  expect(powered).toBe(true);
  // 攻撃（パンチ）でビーム発射
  await tapKey(page, 'KeyZ');
  await page.waitForTimeout(100);
  const beams = (await page.evaluate(playerState)).beams;
  expect(beams).toBeGreaterThan(0);
});

test('つかまれ→タッチ攻撃ボタン連打で脱出できる', async ({ page }) => {
  await startGame(page);
  // 強制的につかまれ状態にする（スタブgripper）
  await page.evaluate(() => {
    window.__game.scene.getScene('GameScene').player.startGrab({ onEscaped: () => {} });
  });
  expect((await page.evaluate(playerState)).state).toBe('grabbed');
  // タッチ攻撃キューを毎フレーム立て直して連打を再現（6回で脱出）
  for (let i = 0; i < 8; i++) {
    await page.evaluate(() => { window.__game.scene.getScene('GameScene').touch.attackQueued = true; });
    await page.waitForTimeout(60);
  }
  expect((await page.evaluate(playerState)).state).not.toBe('grabbed'); // 脱出できた
});

test('2体に囲まれても：脱出直後は無敵で即再つかみされない', async ({ page }) => {
  await startGame(page);
  const res = await page.evaluate(() => {
    const gs = window.__game.scene.getScene('GameScene');
    const p = gs.player;
    const A = { x: p.x + 30, onEscaped() {} };
    const B = { x: p.x - 30, onEscaped() {} };
    p.startGrab(A);
    for (let i = 0; i < 6; i++) p.tryMashEscape(); // 連打で脱出
    const escaped = p.state !== 'grabbed';
    const reGrabbed = p.startGrab(B); // 隣の2体目が即つかもうとする
    return { escaped, reGrabbed, invincible: p.invincible };
  });
  expect(res.escaped).toBe(true);       // 1体目から脱出できる
  expect(res.invincible).toBe(true);    // 脱出直後は無敵
  expect(res.reGrabbed).toBe(false);    // 2体目に即再つかみされない（無限ループ防止）
});

test('しゃがみ：↓で crouch になり、上段弾を回避・下段弾は当たる', async ({ page }) => {
  await startGame(page);
  await page.evaluate(() => { window.__game.scene.getScene('GameScene').touch.down = true; });
  await page.waitForTimeout(120);
  const res = await page.evaluate(() => {
    const gs = window.__game.scene.getScene('GameScene');
    const p = gs.player;
    const stateBefore = p.state; // 被弾前のしゃがみ状態を記録（被弾でhurtに変わるため）
    const crouchBottom = Math.round(p.body.bottom);   // しゃがみ中の足元（床575のはず）
    const crouchDH = Math.round(p.displayHeight);      // しゃがみ中の表示高さ（160より小さいはず）
    const hp0 = p.hp;
    let highDestroyed = false, lowDestroyed = false;
    // 上段弾：しゃがみで回避（同じ弾オブジェクトを2回当てる＝通過中の複数フレームを再現）
    const highProj = { level: 'high', damage: 5, x: p.x + 50, destroy() { highDestroyed = true; } };
    gs._projHitPlayer(highProj, p);
    const hpHigh1 = p.hp;
    p.state = 'idle'; // 通過中にしゃがみを解除しても…
    gs._projHitPlayer(highProj, p); // …回避済みフラグで当たらない
    const hpHigh2 = p.hp;
    p.state = stateBefore;
    gs._projHitPlayer({ level: 'low', damage: 3, x: p.x + 50, destroy() { lowDestroyed = true; } }, p); // 下段＝当たる
    const hpLow = p.hp;
    return { state: stateBefore, crouchBottom, crouchDH, hp0, hpHigh1, hpHigh2, hpLow, highDestroyed, lowDestroyed };
  });
  expect(res.state).toBe('crouch');
  expect(Math.abs(res.crouchBottom - 575)).toBeLessThan(3); // しゃがんでも足元は床から離れない
  expect(res.crouchDH).toBeLessThan(160);                   // しゃがみは表示高さが縮む（低く見える）
  expect(res.hpHigh1).toBe(res.hp0);        // 上段は回避＝無傷
  expect(res.hpHigh2).toBe(res.hp0);        // 通過中に立っても再ヒットしない（確実に回避）
  expect(res.hpLow).toBeLessThan(res.hp0);  // 下段は当たる
  expect(res.highDestroyed).toBe(false);    // 回避した弾は消えず通過する
  expect(res.lowDestroyed).toBe(true);      // 当たった弾は消える
});

test('タッチ操作：仮想ジャンプボタンで床から離れる', async ({ page }) => {
  await startGame(page);
  // タッチのjumpキューを立てる（オンスクリーンボタンが書き込む状態と同じ）
  await page.evaluate(() => { window.__game.scene.getScene('GameScene').touch.jumpQueued = true; });
  await page.waitForFunction(() => {
    const gs = window.__game.scene.getScene('GameScene');
    return !(gs.player.body.blocked.down || gs.player.body.onFloor());
  }, { timeout: 3000 });
  const s = await page.evaluate(playerState);
  expect(s.grounded).toBe(false); // ジャンプして浮いた
});
