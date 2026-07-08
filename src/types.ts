export type Screen = 'menu'|'name'|'class'|'buff'|'battle'|'reward'|'summary'|'achievements'|'settings'|'league';
export type ClassId = 'wizard'|'goblin'|'rat'|'necro'|'gremlin'|'commissioner';
export type BuildSet = 'Waiver Wire'|'Goalie Gear'|'Injury Report'|'Advanced Metrics'|'Commissioner';
export type ItemEffectKind = 'critBurn'|'thorns'|'healShield'|'execute'|'abilityPower'|'openingShield';
export interface ItemEffect { kind:ItemEffectKind; value:number; description:string }
export interface Hero { name:string; classId:ClassId; maxHp:number; hp:number; attack:number; defense:number; speed:number; crit:number; abilityPower:number; shield:number; gold:number; essence:number; rerolls:number; buffs:string[]; gear:Item[] }
export interface Item { id:string; name:string; slot:'Weapon'|'Helmet'|'Armor'|'Boots'|'Trinket'|'Relic'; rarity:'Common'|'Uncommon'|'Rare'|'Epic'|'Legendary'|'Mythic'|'Cursed'; stat:'attack'|'defense'|'maxHp'|'speed'; value:number; set?:BuildSet; effect?:ItemEffect; curse?:string }
export interface Enemy { name:string; maxHp:number; hp:number; attack:number; defense:number; speed:number; boss?:boolean; mechanic?:string; phase?:number }
export interface Telemetry { damage:number[]; healing:number[]; elapsed:number; encounterElapsed:number }
export interface RunState { screen:Screen; hero:Hero|null; floor:number; encounter:number; enemy:Enemy|null; heroClock:number; enemyClock:number; abilityClock:number; log:string[]; rewards:Reward[]; telemetry:Telemetry; paused:boolean; won?:boolean; seed:number; achievements:string[] }
export interface Reward { id:string; title:string; detail:string; kind:'attack'|'defense'|'heal'|'gold'|'gear'|'speed'|'maxHp'|'curse'; amount:number; item?:Item }
