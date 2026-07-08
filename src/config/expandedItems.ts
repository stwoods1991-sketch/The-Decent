import type { Item } from '../types';

// Expansion pool: six equipment pieces for each build family. Values remain
// comparable within a rarity; identity comes from set bonuses and effects.
export const EXPANDED_ITEMS:Item[] = [
 {id:'ww-cleaver',name:'Waiver Claim Cleaver',slot:'Weapon',rarity:'Rare',stat:'attack',value:8,set:'Waiver Wire',effect:{kind:'execute',value:.18,description:'Deal 18% more damage below 30% enemy HP.'}},
 {id:'ww-cap',name:'Claim Priority Cap',slot:'Helmet',rarity:'Uncommon',stat:'maxHp',value:20,set:'Waiver Wire'},
 {id:'ww-mail',name:'Discard-Pile Mail',slot:'Armor',rarity:'Epic',stat:'defense',value:9,set:'Waiver Wire'},
 {id:'ww-skates',name:'Midnight Waiver Skates',slot:'Boots',rarity:'Rare',stat:'speed',value:.14,set:'Waiver Wire'},
 {id:'ww-ticket',name:'Number-One Claim Ticket',slot:'Trinket',rarity:'Legendary',stat:'attack',value:15,set:'Waiver Wire',effect:{kind:'firstStrike',value:.65,description:'First hit each encounter deals 65% bonus damage.'}},
 {id:'ww-ledger',name:'Unclaimed Player Ledger',slot:'Relic',rarity:'Common',stat:'attack',value:3,set:'Waiver Wire'},

 {id:'gg-blocker',name:'Blocker-Side Mace',slot:'Weapon',rarity:'Rare',stat:'attack',value:8,set:'Goalie Gear',effect:{kind:'thorns',value:.12,description:'Reflect 12% of health damage taken.'}},
 {id:'gg-cage',name:'Unbreakable Birdcage',slot:'Helmet',rarity:'Epic',stat:'defense',value:9,set:'Goalie Gear'},
 {id:'gg-chest',name:'Crease-Collapse Chestguard',slot:'Armor',rarity:'Legendary',stat:'maxHp',value:58,set:'Goalie Gear',effect:{kind:'openingShield',value:.14,description:'Start encounters with 14% Max HP Shield.'}},
 {id:'gg-sliders',name:'Post-to-Post Sliders',slot:'Boots',rarity:'Uncommon',stat:'speed',value:.10,set:'Goalie Gear'},
 {id:'gg-water',name:'Backup Goalie Water Bottle',slot:'Trinket',rarity:'Common',stat:'maxHp',value:12,set:'Goalie Gear'},
 {id:'gg-net',name:'Relic of the Empty Net',slot:'Relic',rarity:'Cursed',stat:'defense',value:10,set:'Goalie Gear',effect:{kind:'thorns',value:.32,description:'Reflect 32% of health damage taken.'},curse:'Enemy attack +8%'},

 {id:'ir-scalpel',name:'Questionable Scalpel',slot:'Weapon',rarity:'Epic',stat:'attack',value:11,set:'Injury Report',effect:{kind:'execute',value:.28,description:'Deal 28% more damage below 30% enemy HP.'}},
 {id:'ir-wrap',name:'Concussion Protocol Wrap',slot:'Helmet',rarity:'Rare',stat:'maxHp',value:28,set:'Injury Report'},
 {id:'ir-gown',name:'Day-to-Day Battle Gown',slot:'Armor',rarity:'Uncommon',stat:'defense',value:4,set:'Injury Report'},
 {id:'ir-crutches',name:'Carbon-Fiber Crutches',slot:'Boots',rarity:'Epic',stat:'speed',value:.18,set:'Injury Report'},
 {id:'ir-note',name:'Doctor’s Suspicious Note',slot:'Trinket',rarity:'Legendary',stat:'maxHp',value:55,set:'Injury Report',effect:{kind:'healShield',value:.60,description:'Healing grants Shield equal to 60% of healing.'}},
 {id:'ir-kit',name:'Illegal Recovery Kit',slot:'Relic',rarity:'Cursed',stat:'maxHp',value:62,set:'Injury Report',effect:{kind:'lowHpSpeed',value:.30,description:'Gain 30% combat speed below half HP.'},curse:'Enemy attack +8%'},

 {id:'am-pointer',name:'Regression-to-Mean Rapier',slot:'Weapon',rarity:'Legendary',stat:'attack',value:16,set:'Advanced Metrics',effect:{kind:'critBurn',value:.48,description:'Critical hits add 48% Attack as Burn damage.'}},
 {id:'am-glasses',name:'Expected-Goals Goggles',slot:'Helmet',rarity:'Rare',stat:'defense',value:6,set:'Advanced Metrics'},
 {id:'am-vest',name:'Sample-Size Vest',slot:'Armor',rarity:'Common',stat:'maxHp',value:12,set:'Advanced Metrics'},
 {id:'am-runners',name:'Zone-Entry Runners',slot:'Boots',rarity:'Legendary',stat:'speed',value:.24,set:'Advanced Metrics'},
 {id:'am-abacus',name:'Possession Abacus',slot:'Trinket',rarity:'Epic',stat:'attack',value:11,set:'Advanced Metrics',effect:{kind:'abilityPower',value:.22,description:'Automatic abilities deal 22% more damage.'}},
 {id:'am-model',name:'Model That Cannot Miss',slot:'Relic',rarity:'Mythic',stat:'speed',value:.31,set:'Advanced Metrics',effect:{kind:'critBurn',value:.70,description:'Critical hits add 70% Attack as Burn damage.'}},

 {id:'co-veto',name:'Trade-Veto Broadsword',slot:'Weapon',rarity:'Epic',stat:'attack',value:11,set:'Commissioner',effect:{kind:'abilityPower',value:.25,description:'Automatic abilities deal 25% more damage.'}},
 {id:'co-wig',name:'Procedural Hearing Wig',slot:'Helmet',rarity:'Common',stat:'defense',value:3,set:'Commissioner'},
 {id:'co-suit',name:'Executive Session Suit',slot:'Armor',rarity:'Rare',stat:'defense',value:7,set:'Commissioner'},
 {id:'co-loafers',name:'Closed-Door Loafers',slot:'Boots',rarity:'Uncommon',stat:'speed',value:.10,set:'Commissioner'},
 {id:'co-stamp',name:'Retroactive Approval Stamp',slot:'Trinket',rarity:'Legendary',stat:'maxHp',value:55,set:'Commissioner',effect:{kind:'openingShield',value:.12,description:'Start encounters with 12% Max HP Shield.'}},
 {id:'co-bylaw',name:'Unratified Bylaw',slot:'Relic',rarity:'Mythic',stat:'attack',value:26,set:'Commissioner',effect:{kind:'abilityPower',value:.55,description:'Automatic abilities deal 55% more damage.'}},

 {id:'pp-howitzer',name:'Five-on-Three Howitzer',slot:'Weapon',rarity:'Mythic',stat:'attack',value:25,set:'Power Play',effect:{kind:'abilityPower',value:.48,description:'Automatic abilities deal 48% more damage.'}},
 {id:'pp-visor',name:'Quarterback Visor',slot:'Helmet',rarity:'Uncommon',stat:'maxHp',value:20,set:'Power Play'},
 {id:'pp-jersey',name:'Special-Teams Jersey',slot:'Armor',rarity:'Rare',stat:'defense',value:7,set:'Power Play'},
 {id:'pp-edges',name:'Blue-Line Walking Edges',slot:'Boots',rarity:'Epic',stat:'speed',value:.18,set:'Power Play'},
 {id:'pp-whistle',name:'Phantom Penalty Whistle',slot:'Trinket',rarity:'Cursed',stat:'attack',value:13,set:'Power Play',effect:{kind:'abilityPower',value:.38,description:'Automatic abilities deal 38% more damage.'},curse:'Enemy attack +8%'},
 {id:'pp-board',name:'Magnetic Power-Play Board',slot:'Relic',rarity:'Legendary',stat:'attack',value:16,set:'Power Play'},

 {id:'en-knuckles',name:'Five-Minute Knuckles',slot:'Weapon',rarity:'Epic',stat:'attack',value:12,set:'Enforcer',effect:{kind:'firstStrike',value:.55,description:'First hit each encounter deals 55% bonus damage.'}},
 {id:'en-lid',name:'Penalty-Box Lid',slot:'Helmet',rarity:'Rare',stat:'defense',value:7,set:'Enforcer'},
 {id:'en-pads',name:'Boarding-Call Pauldrons',slot:'Armor',rarity:'Legendary',stat:'defense',value:14,set:'Enforcer',effect:{kind:'thorns',value:.22,description:'Reflect 22% of health damage taken.'}},
 {id:'en-stompers',name:'Bench-Clearing Stompers',slot:'Boots',rarity:'Common',stat:'speed',value:.06,set:'Enforcer'},
 {id:'en-tooth',name:'Opponent’s Missing Tooth',slot:'Trinket',rarity:'Uncommon',stat:'attack',value:5,set:'Enforcer'},
 {id:'en-tape',name:'Bloodied Knuckle Tape',slot:'Relic',rarity:'Cursed',stat:'attack',value:14,set:'Enforcer',effect:{kind:'lowHpSpeed',value:.35,description:'Gain 35% combat speed below half HP.'},curse:'Enemy attack +8%'},

 {id:'ud-sling',name:'Lottery-Pick Slingshot',slot:'Weapon',rarity:'Rare',stat:'attack',value:8,set:'Underdog',effect:{kind:'lowHpSpeed',value:.18,description:'Gain 18% combat speed below half HP.'}},
 {id:'ud-cap',name:'Last-Place Rally Cap',slot:'Helmet',rarity:'Common',stat:'maxHp',value:12,set:'Underdog'},
 {id:'ud-sweater',name:'Miracle Run Sweater',slot:'Armor',rarity:'Mythic',stat:'maxHp',value:92,set:'Underdog',effect:{kind:'execute',value:.35,description:'Deal 35% more damage below 30% enemy HP.'}},
 {id:'ud-skates',name:'Nothing-to-Lose Skates',slot:'Boots',rarity:'Legendary',stat:'speed',value:.24,set:'Underdog'},
 {id:'ud-chip',name:'Shoulder-Sized Chip',slot:'Trinket',rarity:'Epic',stat:'attack',value:11,set:'Underdog'},
 {id:'ud-script',name:'Discarded Cinderella Script',slot:'Relic',rarity:'Uncommon',stat:'maxHp',value:20,set:'Underdog'},

 {id:'th-crowbar',name:'Equipment-Room Crowbar',slot:'Weapon',rarity:'Common',stat:'attack',value:3,set:'Treasure Hunter'},
 {id:'th-lamp',name:'Prospector’s Headlamp',slot:'Helmet',rarity:'Rare',stat:'defense',value:6,set:'Treasure Hunter',effect:{kind:'goldPower',value:.0015,description:'Gain damage equal to 0.15% per gold held.'}},
 {id:'th-pockets',name:'Jersey of Many Pockets',slot:'Armor',rarity:'Uncommon',stat:'maxHp',value:20,set:'Treasure Hunter'},
 {id:'th-boots',name:'Auction-House Boots',slot:'Boots',rarity:'Epic',stat:'speed',value:.18,set:'Treasure Hunter'},
 {id:'th-coin',name:'Future Considerations Coin',slot:'Trinket',rarity:'Mythic',stat:'attack',value:24,set:'Treasure Hunter',effect:{kind:'goldPower',value:.0025,description:'Gain damage equal to 0.25% per gold held.'}},
 {id:'th-chest',name:'Salary-Cap Treasure Chest',slot:'Relic',rarity:'Legendary',stat:'maxHp',value:55,set:'Treasure Hunter'},

 {id:'ot-dagger',name:'Sudden-Death Dagger',slot:'Weapon',rarity:'Legendary',stat:'attack',value:17,set:'Overtime',effect:{kind:'bossDamage',value:.28,description:'Deal 28% more damage to bosses.'}},
 {id:'ot-clock',name:'Running Clock Helmet',slot:'Helmet',rarity:'Common',stat:'defense',value:3,set:'Overtime'},
 {id:'ot-shell',name:'Extra-Period Shell',slot:'Armor',rarity:'Epic',stat:'defense',value:9,set:'Overtime'},
 {id:'ot-blades',name:'Three-on-Three Blades',slot:'Boots',rarity:'Rare',stat:'speed',value:.14,set:'Overtime'},
 {id:'ot-buzzer',name:'Buzzer-Beater Charm',slot:'Trinket',rarity:'Uncommon',stat:'attack',value:5,set:'Overtime'},
 {id:'ot-cup',name:'Endless Overtime Cup',slot:'Relic',rarity:'Cursed',stat:'attack',value:15,set:'Overtime',effect:{kind:'bossDamage',value:.42,description:'Deal 42% more damage to bosses.'},curse:'Enemy attack +8%'},
];
