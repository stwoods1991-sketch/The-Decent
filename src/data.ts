import type { ClassId, Item } from './types';

export const BALANCE = {
  tickMs: 250, encountersPerFloor: 4, baseEnemyHp: 220, baseEnemyAttack: 7,
  enemyHpPerFloor: 0.18, enemyAttackPerFloor: 0.092, bossHpMultiplier: 2.45,
  bossAttackMultiplier: 1.32, difficultyActMultipliers: [1,1.08,1.2,1.36],
  healingAvailability: 0.18, lootQualityPerFloor: 0.025, goldIncome: 9,
  shrineRiskSeverity: 0.18, rewardEvery: 2, expectedClearMinutes: 84, encounterRest: 0.08,
};
export const FLOORS = [
 'The Draft Lobby','The Waiver Wire Sewers','The Bench Point Catacombs','The Injury Report Clinic','The Goalie Graveyard','The Trade Deadline Bazaar','The Parlays Pit','The Stat Correction Archives','The Rivalry Tunnel','The Tilted Manager Tavern','The Frozen Lineup Wastes','The Bye Week Abyss','The Bad Beat Casino','The Sleeper Pick Sanctum','The Playoff Bubble','The Commissioner’s Court','The Championship Gate','The Final Floor'];
export const CLASSES: Record<ClassId,{name:string;icon:string;tag:string;desc:string;stats:[number,number,number];ability:string}> = {
 wizard:{name:'Waiver Wizard',icon:'✦',tag:'Burst · Lifesteal',desc:'Finds value where sensible managers see garbage.',stats:[115,14,5],ability:'Claim Priority: a 340% arcane nuke that siphons life.'},
 goblin:{name:'Goalie Goblin',icon:'⬡',tag:'Shield · Thorns',desc:'A tiny fortress with deeply territorial pads.',stats:[125,10,7],ability:'Stonewall: strike and refresh a modest shield.'},
 rat:{name:'Stat Rat',icon:'⌁',tag:'Scaling · Speed',desc:'Every cell in the spreadsheet says more.',stats:[110,12,6],ability:'Spreadsheet Surge: a double strike that permanently sharpens your attack.'},
 necro:{name:'Injury Necromancer',icon:'✚',tag:'Lifesteal · Sustain',desc:'Questionable to play. Cleared to return.',stats:[110,14,4],ability:'Questionable Return: a healing strike. Every hit drains life.'},
 gremlin:{name:'Trade Gremlin',icon:'◆',tag:'Gold · Scaling',desc:'Turns yesterday’s mistakes into today’s leverage.',stats:[120,13,6],ability:'Buy Low: spend gold for a burst. Your attack scales with gold.'},
 commissioner:{name:'Commissioner',icon:'⚖',tag:'Control · Bulwark',desc:'The rulebook is whatever survives contact.',stats:[125,12,7],ability:'Emergency Ruling: strike, shield up, and delay the enemy.'}
};
export const BUFFS = [
 {title:'First-Round Reach',detail:'+18% attack. The experts hated it.',kind:'attack',amount:0.18},
 {title:'Goalie Run',detail:'+28 max HP and start fights shielded.',kind:'maxHp',amount:28},
 {title:'Advanced Metrics',detail:'+16% speed. Sample size: vibes.',kind:'speed',amount:0.16},
 {title:'Cap Circumvention',detail:'+5 defense and 20 gold.',kind:'defense',amount:5},
 {title:'Cheese Futures',detail:'+45 gold and a reroll token.',kind:'gold',amount:45},
];
export const ITEMS: Item[] = [
 // Weapons — attack
 {id:'blade',name:'Rusty Waiver Blade',slot:'Weapon',rarity:'Common',stat:'attack',value:3,set:'Waiver Wire'},
 {id:'stick',name:'Splintered Hockey Stick',slot:'Weapon',rarity:'Common',stat:'attack',value:3},
 {id:'skate',name:'Sharpened Skate Blade',slot:'Weapon',rarity:'Uncommon',stat:'attack',value:5,set:'Waiver Wire',effect:{kind:'critBurn',value:.35,description:'Critical hits add 35% Attack as Burn damage.'}},
 {id:'saber',name:'Rookie Contract Saber',slot:'Weapon',rarity:'Uncommon',stat:'attack',value:5},
 {id:'slap',name:'Slapshot Cannon',slot:'Weapon',rarity:'Rare',stat:'attack',value:8},
 {id:'pike',name:'Poke-Check Pike',slot:'Weapon',rarity:'Rare',stat:'attack',value:8},
 {id:'hammer',name:'One-Timer Warhammer',slot:'Weapon',rarity:'Epic',stat:'attack',value:11},
 {id:'gavel',name:'Commissioner’s Gavel',slot:'Weapon',rarity:'Legendary',stat:'attack',value:16,set:'Commissioner',effect:{kind:'abilityPower',value:.35,description:'Automatic abilities deal 35% more damage.'}},
 {id:'exec',name:'Overtime Executioner',slot:'Weapon',rarity:'Legendary',stat:'attack',value:18},
 {id:'halberd',name:'Hat Trick Halberd',slot:'Weapon',rarity:'Mythic',stat:'attack',value:25},
 {id:'buzzer',name:'The Final Buzzer',slot:'Weapon',rarity:'Mythic',stat:'attack',value:27},
 // Helmets — defense / maxHp
 {id:'helm',name:'Bargain-Bin Helmet',slot:'Helmet',rarity:'Common',stat:'defense',value:3},
 {id:'cage',name:'Cracked Cage',slot:'Helmet',rarity:'Common',stat:'maxHp',value:12},
 {id:'bucket',name:'Bucket of Confidence',slot:'Helmet',rarity:'Uncommon',stat:'maxHp',value:20},
 {id:'ironbucket',name:'Iron Bucket of the Bubble',slot:'Helmet',rarity:'Rare',stat:'defense',value:6},
 {id:'visor',name:'Tilt-Proof Visor',slot:'Helmet',rarity:'Epic',stat:'maxHp',value:35,set:'Injury Report',effect:{kind:'healShield',value:.5,description:'Healing also grants Shield equal to 50% of the healing.'}},
 {id:'skull',name:'Gravekeeper’s Skull',slot:'Helmet',rarity:'Legendary',stat:'defense',value:13},
 {id:'crown',name:'Crown of Draft Capital',slot:'Helmet',rarity:'Mythic',stat:'maxHp',value:95},
 {id:'mask',name:'Cursed Goalie Mask',slot:'Helmet',rarity:'Cursed',stat:'defense',value:9,set:'Goalie Gear',effect:{kind:'thorns',value:.30,description:'Reflect 30% of health damage taken.'},curse:'Enemy attack +8%'},
 // Armor — defense / maxHp
 {id:'jersey',name:'Practice Jersey',slot:'Armor',rarity:'Common',stat:'defense',value:3},
 {id:'coat',name:'Padded Bench Coat',slot:'Armor',rarity:'Uncommon',stat:'defense',value:4},
 {id:'cloak',name:'Injury Report Cloak',slot:'Armor',rarity:'Rare',stat:'defense',value:7,set:'Injury Report',effect:{kind:'execute',value:.20,description:'Deal 20% more damage to enemies below 30% HP.'}},
 {id:'pads',name:'Overpriced Goalie Pads',slot:'Armor',rarity:'Rare',stat:'maxHp',value:28,set:'Goalie Gear',effect:{kind:'openingShield',value:.12,description:'Start each encounter with Shield equal to 12% Max HP.'}},
 {id:'kevlar',name:'Kevlar Compression Shirt',slot:'Armor',rarity:'Epic',stat:'defense',value:9},
 {id:'aegis',name:'Aegis of the Waiver Wire',slot:'Armor',rarity:'Legendary',stat:'defense',value:13},
 {id:'plate',name:'Championship Plate Armor',slot:'Armor',rarity:'Mythic',stat:'defense',value:20},
 {id:'sweater',name:'Cursed Lucky Sweater',slot:'Armor',rarity:'Cursed',stat:'maxHp',value:60,set:'Injury Report',effect:{kind:'healShield',value:.75,description:'Healing also grants Shield equal to 75% of the healing.'},curse:'Enemy attack +8%'},
 // Boots — speed
 {id:'untied',name:'Untied Skates',slot:'Boots',rarity:'Common',stat:'speed',value:0.06},
 {id:'boots',name:'Bench Point Boots',slot:'Boots',rarity:'Uncommon',stat:'speed',value:0.10},
 {id:'sneakers',name:'Sleeper Pick Sneakers',slot:'Boots',rarity:'Uncommon',stat:'speed',value:0.10},
 {id:'breakaway',name:'Breakaway Blades',slot:'Boots',rarity:'Rare',stat:'speed',value:0.14},
 {id:'zamboni',name:'Zamboni-Tread Greaves',slot:'Boots',rarity:'Epic',stat:'speed',value:0.18},
 {id:'powerplay',name:'Boots of the Power Play',slot:'Boots',rarity:'Legendary',stat:'speed',value:0.24},
 {id:'wings',name:'Wings of the Final Floor',slot:'Boots',rarity:'Mythic',stat:'speed',value:0.32},
 {id:'cleats',name:'Cursed Cleats',slot:'Boots',rarity:'Cursed',stat:'speed',value:0.20,curse:'Enemy attack +8%'},
 // Trinkets — mixed
 {id:'luckypuck',name:'Lucky Puck',slot:'Trinket',rarity:'Common',stat:'maxHp',value:12},
 {id:'foam',name:'Foam Finger of Fury',slot:'Trinket',rarity:'Uncommon',stat:'attack',value:5},
 {id:'towel',name:'Rally Towel',slot:'Trinket',rarity:'Uncommon',stat:'maxHp',value:20},
 {id:'cheese',name:'Golden Cheese Charm',slot:'Trinket',rarity:'Rare',stat:'maxHp',value:24,set:'Waiver Wire',effect:{kind:'healShield',value:.30,description:'Healing also grants Shield equal to 30% of the healing.'}},
 {id:'secondline',name:'Second-Line Charm',slot:'Trinket',rarity:'Rare',stat:'attack',value:8},
 {id:'rabbit',name:'Rabbit’s Foot (Amputated)',slot:'Trinket',rarity:'Epic',stat:'speed',value:0.18,set:'Advanced Metrics',effect:{kind:'critBurn',value:.40,description:'Critical hits add 40% Attack as Burn damage.'}},
 {id:'ring',name:'Championship Ring',slot:'Trinket',rarity:'Legendary',stat:'attack',value:16},
 {id:'heart',name:'Heart of the Underdog',slot:'Trinket',rarity:'Mythic',stat:'maxHp',value:95},
 {id:'coin',name:'Cursed Coin Flip',slot:'Trinket',rarity:'Cursed',stat:'attack',value:12,set:'Advanced Metrics',effect:{kind:'critBurn',value:.50,description:'Critical hits add 50% Attack as Burn damage.'},curse:'Enemy attack +8%'},
 // Relics — high impact
 {id:'trophy',name:'Deflated Participation Trophy',slot:'Relic',rarity:'Uncommon',stat:'maxHp',value:20},
 {id:'spreadsheet',name:'Spreadsheet of Doom',slot:'Relic',rarity:'Rare',stat:'attack',value:8,set:'Advanced Metrics',effect:{kind:'abilityPower',value:.20,description:'Automatic abilities deal 20% more damage.'}},
 {id:'parlays',name:'Parlays of Power',slot:'Relic',rarity:'Epic',stat:'attack',value:10,set:'Waiver Wire',effect:{kind:'execute',value:.25,description:'Deal 25% more damage to enemies below 30% HP.'}},
 {id:'bracket',name:'Sacred Bracket',slot:'Relic',rarity:'Epic',stat:'maxHp',value:40},
 {id:'rulebook',name:'The Commissioner’s Rulebook',slot:'Relic',rarity:'Legendary',stat:'defense',value:13,set:'Commissioner',effect:{kind:'openingShield',value:.10,description:'Start each encounter with Shield equal to 10% Max HP.'}},
 {id:'glory',name:'Frozen Moment of Glory',slot:'Relic',rarity:'Legendary',stat:'speed',value:0.24},
 {id:'trade',name:'The Trade That Broke the League',slot:'Relic',rarity:'Mythic',stat:'attack',value:26,set:'Commissioner',effect:{kind:'abilityPower',value:.50,description:'Automatic abilities deal 50% more damage.'}},
 {id:'badbeat',name:'Relic of the Bad Beat',slot:'Relic',rarity:'Cursed',stat:'attack',value:14,set:'Injury Report',effect:{kind:'execute',value:.40,description:'Deal 40% more damage to enemies below 30% HP.'},curse:'Enemy attack +8%'},
];
export const ENEMY_NAMES = ['Waiver Rat','Injured Goblin','Bench Gremlin','Stat Mite','Tilt Imp','Bad Beat Bat','Lineup Skeleton','Frozen Puck Wraith','Trade Deadline Hag','Goalie Mask Mimic','Cursed Spreadsheet','Overthinking Ooze','Sleeper Pick Slime','Bye Week Phantom'];
export const BOSSES:Record<number,{name:string;mechanic:string;intro:string}> = {
 5:{name:'The Goalie Gravekeeper',mechanic:'Bone Check: heavy strikes test defense.',intro:'“You brought offense to a pad fight.”'},
 10:{name:'The Tilted Tavern King',mechanic:'Last Call: enrages as the fight drags on.',intro:'The King rings a bell. Nobody remembers ordering despair.'},
 15:{name:'The Bubble Beast',mechanic:'Bubble Pressure: stacking defense shred.',intro:'Every projection says you are “just outside.”'},
 18:{name:'The Final Commissioner of Chaos',mechanic:'Emergency Powers: counters shields and disables healing.',intro:'The bylaws unfold. They are mostly teeth.'}
};
