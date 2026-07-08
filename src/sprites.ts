import type { ClassId } from './types';

const root = '/assets/sprites';

export const CLASS_SPRITES: Record<ClassId,string> = {
  wizard:`${root}/classes/wizard.png`, goblin:`${root}/classes/goblin.png`,
  rat:`${root}/classes/rat.png`, necro:`${root}/classes/necro.png`,
  gremlin:`${root}/classes/gremlin.png`, commissioner:`${root}/classes/commissioner.png`,
};

export const ENEMY_SPRITES: Record<string,string> = {
  'Waiver Rat':`${root}/enemies/waiver-rat.png`, 'Injured Goblin':`${root}/enemies/injured-goblin.png`,
  'Bench Gremlin':`${root}/enemies/bench-gremlin.png`, 'Stat Mite':`${root}/enemies/stat-mite.png`,
  'Tilt Imp':`${root}/enemies/tilt-imp.png`, 'Bad Beat Bat':`${root}/enemies/bad-beat-bat.png`,
  'Lineup Skeleton':`${root}/enemies/lineup-skeleton.png`, 'Frozen Puck Wraith':`${root}/enemies/frozen-puck-wraith.png`,
  'Trade Deadline Hag':`${root}/enemies/trade-deadline-hag.png`, 'Goalie Mask Mimic':`${root}/enemies/goalie-mask-mimic.png`,
  'Cursed Spreadsheet':`${root}/enemies/cursed-spreadsheet.png`, 'Overthinking Ooze':`${root}/enemies/overthinking-ooze.png`,
  'Sleeper Pick Slime':`${root}/enemies/sleeper-pick-slime.png`, 'Bye Week Phantom':`${root}/enemies/bye-week-phantom.png`,
  'The Goalie Gravekeeper':`${root}/bosses/goalie-gravekeeper.png`,
  'The Tilted Tavern King':`${root}/bosses/tavern-king.png`,
  'The Bubble Beast':`${root}/bosses/bubble-beast.png`,
  'The Final Commissioner of Chaos':`${root}/bosses/final-commissioner.png`,
};

export const SPRITE_CREDIT = {
  name:'Sprite Foundry Packs', url:'https://github.com/mcp-tool-shop-org/sprite-foundry-packs', license:'MIT'
};
