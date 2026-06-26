// フロア定義（データ駆動）。GameSceneはこれを読むだけ。フロア追加＝データ追加。
// docs/LEVEL_SPEC.md が正本。F1のみ完全実装、F2〜F5はスタブ（横展開フェーズで埋める）。

export const FLOORS = [
  {
    id: 1,
    name: '居酒屋街',
    label: '1F ─ 居酒屋街',
    worldWidth: 3600,
    timeLimit: 90,
    background: 'bgFloor1',
    powerupX: 2680, // ボス手前に固定配置（ハゲ化アイテム）。ボス部屋(x=2800)より手前
    waves: [
      { x: 400,  enemies: [{ type: 'hug' }] },
      { x: 900,  enemies: [{ type: 'card' }] },
      { x: 1500, enemies: [{ type: 'hug' }, { type: 'hug' }] },
      { x: 2100, enemies: [{ type: 'card' }, { type: 'hug' }] },
      { x: 2500, enemies: [{ type: 'hug' }, { type: 'hug' }] }, // ボス部屋前の最終関門
    ],
    boss: { type: 'umbrella' },
  },
  // --- 以下スタブ（FフェーズでLEVEL_SPECに従い実装） ---
  { id: 2, name: 'オフィス', label: '2F ─ オフィス', worldWidth: 3600, timeLimit: 90,
    background: 'bgFloor1', powerupX: 2800, waves: [], boss: { type: 'umbrella' }, stub: true },
  { id: 3, name: '工事現場', label: '3F ─ 工事現場', worldWidth: 4000, timeLimit: 100,
    background: 'bgFloor1', powerupX: 3000, waves: [], boss: { type: 'umbrella' }, stub: true },
  { id: 4, name: '占いバー', label: '4F ─ 占いバー', worldWidth: 3600, timeLimit: 100,
    background: 'bgFloor1', powerupX: 2800, waves: [], boss: { type: 'umbrella' }, stub: true },
  { id: 5, name: '社長室', label: 'RF ─ 社長室', worldWidth: 3200, timeLimit: 110,
    background: 'bgFloor1', powerupX: 2500, waves: [], boss: { type: 'umbrella' }, stub: true },
];

export function getFloor(id) {
  return FLOORS.find((f) => f.id === id) || FLOORS[0];
}
