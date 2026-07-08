import type{ClassId,Hero,MetaProgression,MetaRunAward,RunState}from'./types';

const META_KEY='descent.meta';
const CLASS_IDS:ClassId[]=['wizard','goblin','rat','necro','gremlin','commissioner'];
const uuid=()=>crypto?.randomUUID?.()||`local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
export const META_MAX_DEPTH=40;

const levelForXp=(xp:number)=>{let level=1,need=100;while(xp>=need&&level<50){level++;need+=90+level*35}return level};
const classLevelForXp=(xp:number)=>Math.min(20,Math.floor(Math.sqrt(xp/80))+1);
export const xpToNextMetaLevel=(meta:MetaProgression)=>100+meta.level*90+meta.level*35;
export const metaDepthForLevel=(level:number)=>level>=18?40:level>=12?35:level>=8?30:level>=4?25:18;

export function freshMeta(managerName='Anonymous Menace'):MetaProgression{
 return {playerId:uuid(),managerName,level:1,xp:0,essence:0,lifetimeRuns:0,bestFloor:0,clears18:0,clears40:0,unlockedDepth:18,achievements:[],classMastery:Object.fromEntries(CLASS_IDS.map(id=>[id,{xp:0,level:1}])) as MetaProgression['classMastery'],updatedAt:new Date().toISOString()};
}

export function normalizeMeta(raw:any):MetaProgression{
 const base=freshMeta(raw?.managerName||'Anonymous Menace');
 const meta={...base,...raw,classMastery:{...base.classMastery,...raw?.classMastery}};
 for(const id of CLASS_IDS){const m=meta.classMastery[id]||{xp:0,level:1};meta.classMastery[id]={xp:Number(m.xp)||0,level:Math.max(1,Number(m.level)||1)}}
 meta.level=levelForXp(Number(meta.xp)||0);meta.unlockedDepth=Math.max(Number(meta.unlockedDepth)||18,metaDepthForLevel(meta.level));meta.bestFloor=Math.min(META_MAX_DEPTH,Number(meta.bestFloor)||0);return meta;
}

export function loadMeta():MetaProgression{try{return normalizeMeta(JSON.parse(localStorage.getItem(META_KEY)||'null'))}catch{return freshMeta()}}
export function saveMeta(meta:MetaProgression){localStorage.setItem(META_KEY,JSON.stringify({...meta,updatedAt:new Date().toISOString()}))}

export function metaBonuses(meta:MetaProgression,classId:ClassId){
 const mastery=meta.classMastery[classId]?.level||1;
 return {
  attackPct:Math.min(.12,(meta.level-1)*.006)+Math.min(.08,(mastery-1)*.006),
  maxHp:Math.min(45,(meta.level-1)*3)+Math.min(24,(mastery-1)*2),
  defense:Math.min(8,Math.floor((meta.level-1)/3)),
  startingGold:Math.min(40,(meta.level-1)*3),
  rerolls:meta.level>=6?1:0,
  perkChoices:meta.level>=10?4:3
 };
}

export function applyMetaBonuses(hero:Hero,meta:MetaProgression){
 const b=metaBonuses(meta,hero.classId);
 hero.attack=Math.round(hero.attack*(1+b.attackPct));
 hero.maxHp+=b.maxHp;hero.hp=hero.maxHp;hero.defense+=b.defense;hero.gold+=b.startingGold;hero.rerolls+=b.rerolls;
 hero.buffs.push(`Meta Lv.${meta.level}`);
 return hero;
}

export function awardMetaForRun(meta:MetaProgression,run:RunState):{meta:MetaProgression;award:MetaRunAward}{
 const h=run.hero!,next=normalizeMeta(meta),beforeLevel=next.level,beforeClass=next.classMastery[h.classId].level,beforeDepth=next.unlockedDepth;
 const floor=Math.max(1,Math.min(META_MAX_DEPTH,run.floor));
 const cleared18=!!run.won||floor>=18;
 const cleared40=!!run.won&&floor>=META_MAX_DEPTH;
 const xp=40+floor*18+(cleared18?180:0)+(cleared40?450:0);
 const essence=Math.max(1,Math.floor(floor/3))+(cleared18?6:0)+(cleared40?18:0);
 next.managerName=h.name;next.xp+=xp;next.essence+=essence;next.lifetimeRuns++;next.bestFloor=Math.max(next.bestFloor,floor);next.clears18+=cleared18?1:0;next.clears40+=cleared40?1:0;
 next.classMastery[h.classId].xp+=Math.round(xp*.7);next.classMastery[h.classId].level=classLevelForXp(next.classMastery[h.classId].xp);
 next.achievements=[...new Set([...next.achievements,...run.achievements])];next.level=levelForXp(next.xp);next.unlockedDepth=Math.max(next.unlockedDepth,metaDepthForLevel(next.level));next.updatedAt=new Date().toISOString();
 return {meta:next,award:{xp,essence,levelUps:next.level-beforeLevel,classLevelUps:next.classMastery[h.classId].level-beforeClass,unlockedDepthBefore:beforeDepth,unlockedDepthAfter:next.unlockedDepth}};
}

