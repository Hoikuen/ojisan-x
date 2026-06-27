// フロア定義（データ駆動）。GameSceneはこれを読むだけ。フロア追加＝データ追加。
// docs/LEVEL_SPEC.md が正本。

export const FLOORS = [
  {
    id: 1, name: '居酒屋街', label: '1F ─ 居酒屋街',
    worldWidth: 3600, timeLimit: 90, background: 'bgFloor1', powerupX: 2680,
    waves: [
      { x: 400,  enemies: [{ type: 'hug' }] },
      { x: 900,  enemies: [{ type: 'card' }] },
      { x: 1500, enemies: [{ type: 'hug' }, { type: 'hug' }] },
      { x: 2100, enemies: [{ type: 'card' }, { type: 'hug' }] },
      { x: 2500, enemies: [{ type: 'hug' }, { type: 'hug' }] },
    ],
    boss: { type: 'umbrella' },
  },
  {
    id: 2, name: 'オフィス', label: '2F ─ オフィス',
    worldWidth: 3600, timeLimit: 90, background: 'bgFloor2', powerupX: 2680,
    waves: [
      { x: 500,  enemies: [{ type: 'chibi' }, { type: 'chibi' }] },
      { x: 1100, enemies: [{ type: 'card' }, { type: 'card' }] },
      { x: 1700, enemies: [{ type: 'chibi' }, { type: 'chibi' }, { type: 'hug' }] },
      { x: 2400, enemies: [{ type: 'card' }, { type: 'chibi' }] },
    ],
    boss: { type: 'boomerang' },
  },
  {
    id: 3, name: '工事現場', label: '3F ─ 工事現場',
    worldWidth: 4000, timeLimit: 100, background: 'bgFloor3', powerupX: 3080,
    waves: [
      { x: 500,  enemies: [{ type: 'banana' }] },
      { x: 1200, enemies: [{ type: 'chibi' }, { type: 'chibi' }, { type: 'chibi' }] },
      { x: 2000, enemies: [{ type: 'banana' }, { type: 'hug' }, { type: 'hug' }] },
      { x: 2900, enemies: [{ type: 'chibi' }, { type: 'chibi' }, { type: 'banana' }] },
    ],
    boss: { type: 'muscle' },
  },
  {
    id: 4, name: '占いバー', label: '4F ─ 占いバー',
    worldWidth: 3600, timeLimit: 100, background: 'bgFloor4', powerupX: 2680,
    waves: [
      { x: 500,  enemies: [{ type: 'fruit' }, { type: 'fruit' }] },
      { x: 1300, enemies: [{ type: 'card' }, { type: 'card' }, { type: 'hug' }] },
      { x: 2200, enemies: [{ type: 'fruit' }, { type: 'card' }, { type: 'card' }] },
    ],
    boss: { type: 'fortune' },
  },
  {
    id: 5, name: '社長室', label: 'RF ─ 社長室',
    worldWidth: 3200, timeLimit: 110, background: 'bgFloor5', powerupX: 2260,
    waves: [
      { x: 400,  enemies: [{ type: 'hug' }, { type: 'hug' }, { type: 'card' }] },
      { x: 1000, enemies: [{ type: 'chibi' }, { type: 'chibi' }, { type: 'banana' }] },
      { x: 1700, enemies: [{ type: 'fruit' }, { type: 'card' }, { type: 'card' }] },
    ],
    boss: { type: 'mrx' },
  },
];

export function getFloor(id) {
  return FLOORS.find((f) => f.id === id) || FLOORS[0];
}
