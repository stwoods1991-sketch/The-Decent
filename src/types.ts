export type Screen = 'menu'|'name'|'class'|'buff'|'battle'|'reward'|'summary'|'achievements'|'settings'|'league'|'meta';
export type ClassId = 'wizard'|'goblin'|'rat'|'necro'|'gremlin'|'commissioner';
export type BuildSet = 'Waiver Wire'|'Goalie Gear'|'Injury Report'|'Advanced Metrics'|'Commissioner'|'Power Play'|'Enforcer'|'Underdog'|'Treasure Hunter'|'Overtime';
export type ItemEffectKind = 'critBurn'|'thorns'|'healShield'|'execute'|'abilityPower'|'openingShield'|'bossDamage'|'lowHpSpeed'|'goldPower'|'firstStrike';
export interface ItemEffect { kind:ItemEffectKind; value:number; description:string }
export type BuffKind = 'attack'|'maxHp'|'speed'|'defense'|'gold'|'crit'|'shield'|'abilityPower'|'reroll';
export interface StartingBuff { title:string; detail:string; kind:BuffKind; amount:number; favored?:ClassId[]; rarity?:'Common'|'Rare'|'Risky' }
export interface Hero { name:string; classId:ClassId; maxHp:number; hp:number; attack:number; defense:number; speed:number; crit:number; abilityPower:number; shield:number; gold:number; essence:number; rerolls:number; buffs:string[]; gear:Item[] }
export interface Item { id:string; name:string; slot:'Weapon'|'Helmet'|'Armor'|'Boots'|'Trinket'|'Relic'; rarity:'Common'|'Uncommon'|'Rare'|'Epic'|'Legendary'|'Mythic'|'Cursed'; stat:'attack'|'defense'|'maxHp'|'speed'; value:number; set?:BuildSet; effect?:ItemEffect; curse?:string }
export interface Enemy { name:string; maxHp:number; hp:number; attack:number; defense:number; speed:number; boss?:boolean; mechanic?:string; phase?:number }
export interface Telemetry { damage:number[]; healing:number[]; elapsed:number; encounterElapsed:number }
export interface RunState { screen:Screen; hero:Hero|null; floor:number; encounter:number; enemy:Enemy|null; heroClock:number; enemyClock:number; abilityClock:number; firstStrikeUsed?:boolean; log:string[]; rewards:Reward[]; telemetry:Telemetry; paused:boolean; won?:boolean; campaignCleared?:boolean; maxFloor?:number; seed:number; achievements:string[] }
export interface Reward { id:string; title:string; detail:string; kind:'attack'|'defense'|'heal'|'gold'|'gear'|'speed'|'maxHp'|'curse'; amount:number; item?:Item }
export interface ClassMastery { xp:number; level:number }
export interface MetaProgression { playerId:string; managerName:string; level:number; xp:number; essence:number; lifetimeRuns:number; bestFloor:number; clears18:number; clears40:number; unlockedDepth:number; achievements:string[]; classMastery:Record<ClassId,ClassMastery>; updatedAt:string }
export interface MetaRunAward { xp:number; essence:number; levelUps:number; classLevelUps:number; unlockedDepthBefore:number; unlockedDepthAfter:number }
