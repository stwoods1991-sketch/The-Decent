import { BALANCE, BOSSES, BUFFS, CLASSES, ENEMY_NAMES, FLOORS, ITEMS } from './data';
import type { ClassId, Enemy, Hero, Item, Reward, RunState, StartingBuff } from './types';
export const initial:RunState={screen:'menu',hero:null,floor:1,encounter:1,enemy:null,heroClock:0,enemyClock:0,abilityClock:0,log:[],rewards:[],telemetry:{damage:[],healing:[],elapsed:0,encounterElapsed:0},paused:false,seed:Date.now(),achievements:[]};
const rng=(seed:number)=>{const x=Math.sin(seed)*10000;return x-Math.floor(x)};
// Record an earned achievement once per run. The React layer diffs run.achievements
// against a persistent browser set to decide what is newly earned and posts it to the feed.
function award(n:RunState,id:string){if(!n.achievements.includes(id))n.achievements.push(id);}
export function heroFor(name:string,classId:ClassId):Hero { const c=CLASSES[classId], [maxHp,attack,defense]=c.stats; return {name,classId,maxHp,hp:maxHp,attack,defense,speed:classId==='rat'?1.15:1,crit:.08,abilityPower:1,shield:classId==='goblin'?Math.round(maxHp*.10):0,gold:0,essence:0,rerolls:1,buffs:[],gear:[]}; }
export function enemyFor(floor:number,encounter:number,hero:Hero):Enemy { const boss=!!BOSSES[floor]&&encounter===BALANCE.encountersPerFloor; const act=BALANCE.difficultyActMultipliers[Math.min(3,Math.floor((floor-1)/5))]; const curse=hero.gear.filter(i=>i.rarity==='Cursed').length; const hp=Math.round(BALANCE.baseEnemyHp*Math.pow(1+BALANCE.enemyHpPerFloor,floor-1)*act*(boss?BALANCE.bossHpMultiplier:1)); const attack=Math.round(BALANCE.baseEnemyAttack*Math.pow(1+BALANCE.enemyAttackPerFloor,floor-1)*act*(boss?BALANCE.bossAttackMultiplier:1)*(1+curse*.08)); return {name:boss?BOSSES[floor].name:ENEMY_NAMES[(floor*3+encounter)%ENEMY_NAMES.length],maxHp:hp,hp,attack,defense:Math.floor(floor*.7),speed:.72+floor*.012,boss,mechanic:boss?BOSSES[floor].mechanic:undefined,phase:0}; }
const damage=(attack:number,defense:number)=>Math.max(1,Math.round(attack*100/(100+defense*7)));
const effectTotal=(h:Hero,kind:NonNullable<Item['effect']>['kind'])=>h.gear.reduce((sum,item)=>sum+(item.effect?.kind===kind?item.effect.value:0),0);
const setCount=(h:Hero,set:NonNullable<Item['set']>)=>h.gear.filter(item=>item.set===set).length;
const cursedCount=(h:Hero)=>h.gear.filter(item=>item.rarity==='Cursed').length;
const combatDamageMultiplier=(h:Hero,e:Enemy)=>1+(setCount(h,'Waiver Wire')>=2?.12:0)+(setCount(h,'Injury Report')>=2&&h.hp/h.maxHp<.5?.25:0)+(setCount(h,'Underdog')>=2&&h.hp/h.maxHp<.5?.22:0)+(setCount(h,'Enforcer')>=2&&h.hp/h.maxHp<.5?.18:0)+(cursedCount(h)>=3?.25:0)+(e.hp/e.maxHp<.3?effectTotal(h,'execute'):0)+(e.boss?effectTotal(h,'bossDamage')+(setCount(h,'Overtime')>=2?.18:0):0)+Math.min(.75,h.gold*effectTotal(h,'goldPower'));
const openingShield=(h:Hero)=>Math.round(h.maxHp*((h.classId==='goblin'?.10:0)+effectTotal(h,'openingShield')+(setCount(h,'Goalie Gear')>=2?.10:0)));
function grantHealing(n:RunState,requested:number){const h=n.hero!;const boosted=Math.round(requested*(setCount(h,'Injury Report')>=2?1.25:1));const amount=Math.min(boosted,h.maxHp-h.hp);if(amount<=0)return 0;h.hp+=amount;h.shield+=Math.round(amount*effectTotal(h,'healShield'));n.telemetry.healing.push(amount);return amount;}
export function activeSynergies(h:Hero){const out:{name:string;detail:string;active:boolean}[]=[
 {name:'Claim Stack',detail:'2 Waiver Wire: attacks deal 12% more damage.',active:setCount(h,'Waiver Wire')>=2},
 {name:'Crease Control',detail:'2 Goalie Gear: start with +10% Max HP Shield and reflect 15% damage.',active:setCount(h,'Goalie Gear')>=2},
 {name:'Questionable Return',detail:'2 Injury Report: +25% damage below half HP and +25% healing.',active:setCount(h,'Injury Report')>=2},
 {name:'Spreadsheet Stack',detail:'2 Advanced Metrics: combat speed increased by 15%.',active:setCount(h,'Advanced Metrics')>=2},
 {name:'Emergency Powers',detail:'2 Commissioner: automatic abilities deal 25% more damage.',active:setCount(h,'Commissioner')>=2},
 {name:'Special Teams',detail:'2 Power Play: automatic abilities deal 30% more damage.',active:setCount(h,'Power Play')>=2},
 {name:'Drop the Gloves',detail:'2 Enforcer: reflect 12% damage and deal +18% below half HP.',active:setCount(h,'Enforcer')>=2},
 {name:'Cinderella Run',detail:'2 Underdog: +22% damage and +20% speed below half HP.',active:setCount(h,'Underdog')>=2},
 {name:'Asset Management',detail:'2 Treasure Hunter: +40% gold income; held gold powers certain items.',active:setCount(h,'Treasure Hunter')>=2},
 {name:'Sudden Death',detail:'2 Overtime: deal 18% more damage to bosses.',active:setCount(h,'Overtime')>=2},
 {name:'Damn the Projections',detail:'3 Cursed: deal 25% more damage; enemy curse scaling still applies.',active:cursedCount(h)>=3}
 ];return out;
}
export function tick(s:RunState):RunState { if(s.screen!=='battle'||!s.hero||!s.enemy||s.paused)return s; let n=structuredClone(s), dt=BALANCE.tickMs/1000; const h=n.hero!,e=n.enemy!;n.telemetry.elapsed+=dt;n.telemetry.encounterElapsed+=dt;const lowHpSpeed=h.hp/h.maxHp<.5?effectTotal(h,'lowHpSpeed')+(setCount(h,'Underdog')>=2?.20:0):0;n.heroClock+=dt*h.speed*(setCount(h,'Advanced Metrics')>=2?1.15:1)*(1+lowHpSpeed);n.enemyClock+=dt*e.speed;n.abilityClock+=dt;
 if(n.heroClock>=1){n.heroClock-=1;const atk=h.attack+(h.classId==='gremlin'?Math.floor(h.gold/28):0);const crit=rng(n.seed+n.telemetry.elapsed*10)<h.crit;const opening=n.firstStrikeUsed?0:effectTotal(h,'firstStrike');n.firstStrikeUsed=true;const d=damage(atk*(crit?1.7:1)*(1+opening)*combatDamageMultiplier(h,e),e.defense);e.hp-=d;let burn=0;if(crit&&effectTotal(h,'critBurn')>0){burn=Math.max(1,Math.round(atk*effectTotal(h,'critBurn')));e.hp-=burn}if(h.classId==='necro')grantHealing(n,Math.round(d*.10));n.log.unshift(`${crit?'CRIT — ':''}${h.name} hits ${e.name} for ${d}${burn?` + ${burn} Burn`:''}.`)}
 if(n.abilityClock>=8){n.abilityClock=0;const atk=h.attack+(h.classId==='gremlin'?Math.floor(h.gold/28):0);let mult=2.2,hits=1;if(h.classId==='wizard')mult=3.4;if(h.classId==='rat'){mult=1.35;hits=2}if(h.classId==='gremlin')mult=2.4;const abilityBonus=1+effectTotal(h,'abilityPower')+(setCount(h,'Commissioner')>=2?.25:0)+(setCount(h,'Power Play')>=2?.30:0);let total=0;for(let k=0;k<hits;k++){const d=damage(atk*mult*h.abilityPower*abilityBonus*combatDamageMultiplier(h,e),e.defense);e.hp-=d;total+=d}if(h.classId==='goblin')h.shield+=Math.round(h.maxHp*.07);if(h.classId==='commissioner'){n.enemyClock=Math.max(0,n.enemyClock-.6);h.shield+=Math.round(h.maxHp*.08)}if(h.classId==='wizard')grantHealing(n,Math.round(total*.10));if(h.classId==='necro')grantHealing(n,Math.round(total*.20));if(h.classId==='rat')h.attack+=1;n.log.unshift(`${CLASSES[h.classId].ability.split(':')[0]} triggers for ${total}!`)}
 if(e.hp<=0)return victory(n);
 if(n.enemyClock>=1){n.enemyClock-=1;let mult=1;if(e.boss&&n.telemetry.encounterElapsed>45)mult+=Math.min(.8,(n.telemetry.encounterElapsed-45)/90);let d=damage(e.attack*mult,h.defense);if(h.shield){const blocked=Math.min(h.shield,d);h.shield-=blocked;d-=blocked}h.hp-=d;const reflect=Math.round(d*(effectTotal(h,'thorns')+(setCount(h,'Goalie Gear')>=2?.15:0)+(setCount(h,'Enforcer')>=2?.12:0)));if(reflect>0)e.hp-=reflect;n.telemetry.damage.push(d);n.telemetry.damage=n.telemetry.damage.slice(-20);n.log.unshift(`${e.name} deals ${d}${reflect?`; ${reflect} reflected`:''}.`)}
 if(e.hp<=0)return victory(n);
 if(e.boss&&n.telemetry.encounterElapsed>0&&Math.floor(n.telemetry.encounterElapsed)%20===0&&Math.floor(s.telemetry.encounterElapsed)!==Math.floor(n.telemetry.encounterElapsed))n.log.unshift(`⚠ ${e.mechanic}`);
 if(h.hp<=0){n.screen='summary';n.won=false;n.log.unshift(`${h.name} has been mathematically eliminated.`)}n.log=n.log.slice(0,30);return n; }
function victory(n:RunState):RunState { const h=n.hero!;const e=n.enemy!;award(n,'first-blood');if(e.boss&&h.hp/h.maxHp<0.10)award(n,'close-call');const gi=BALANCE.goldIncome+n.floor*2;h.gold+=h.classId==='gremlin'?Math.round(gi*2.0):setCount(h,'Treasure Hunter')>=2?Math.round(gi*1.4):gi;h.essence+=1; n.log.unshift(`${n.enemy!.name} falls. The projections apologize.`); const last=n.floor===18&&n.encounter===BALANCE.encountersPerFloor;if(last){award(n,'clear');n.screen='summary';n.won=true;return n} const checkpoint=n.encounter%BALANCE.rewardEvery===0||n.enemy!.boss; if(checkpoint){n.screen='reward';n.rewards=makeRewards(n)} else advance(n); return n; }
export function advance(n:RunState){if(n.encounter>=BALANCE.encountersPerFloor){n.floor++;n.encounter=1}else n.encounter++;if(n.floor===5)award(n,'floor-5');if(n.floor===10)award(n,'floor-10');if(n.floor===15)award(n,'floor-15');const H=n.hero!;grantHealing(n,Math.round(H.maxHp*BALANCE.encounterRest));n.enemy=enemyFor(n.floor,n.encounter,H);H.shield=openingShield(H);n.heroClock=n.enemyClock=n.abilityClock=0;n.firstStrikeUsed=false;n.telemetry.encounterElapsed=0;n.screen='battle';n.paused=false;}
// Seeded PRNG (mulberry32) for loot — well-distributed, distinct per checkpoint,
// unlike the sin-based combat rng which smeared badly at large seeds.
function mulberry32(a:number){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

export function startingBuffChoices(seed:number,classId:ClassId):StartingBuff[]{
 const classSalt=[...classId].reduce((sum,c)=>sum+c.charCodeAt(0),0);const rand=mulberry32((seed^Math.imul(classSalt,2654435761))>>>0);
 return BUFFS.map(buff=>({buff,score:rand()+(buff.favored?.includes(classId)?.32:0)-(buff.rarity==='Risky'?.04:0)})).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.buff);
}

export function applyStartingBuff(s:RunState,b:StartingBuff):RunState{
 const n=structuredClone(s),h=n.hero!;h.buffs.push(b.title);
 if(b.kind==='attack')h.attack=Math.round(h.attack*(1+b.amount));
 if(b.kind==='maxHp'){h.maxHp+=b.amount;h.hp=h.maxHp;if(b.title==='Goalie Run')h.shield+=18}
 if(b.kind==='speed')h.speed+=b.amount;
 if(b.kind==='defense'){h.defense+=b.amount;if(b.title==='Cap Circumvention')h.gold+=20}
 if(b.kind==='gold'){h.gold+=b.amount;if(b.title==='Cheese Futures')h.rerolls++}
 if(b.kind==='crit')h.crit+=b.amount;
 if(b.kind==='shield'){h.shield+=b.amount;if(b.title==='Taxi Squad')h.rerolls++}
 if(b.kind==='abilityPower')h.abilityPower+=b.amount;
 if(b.kind==='reroll')h.rerolls+=b.amount;
 n.enemy=enemyFor(1,1,h);n.screen='battle';n.log=[`Opening perk: ${b.title}.`,`You enter ${FLOORS[0]}. Nobody has read the waiver.`];return n;
}

// Rarity odds shift with depth: shallow floors skew Common/Uncommon, deep floors
// unlock Epic/Legendary/Mythic. Cursed is a flat "gamble" chance at any depth.
function rollRarity(rand:()=>number,floor:number):Item['rarity']{
 const t=(floor-1)/17;
 const weights:[Item['rarity'],number][]=[
  ['Common',Math.max(2,42*(1-t))],['Uncommon',30*(1-0.5*t)],['Rare',16+16*t],
  ['Epic',7+22*t],['Legendary',2+15*t],['Mythic',7*t],['Cursed',7]];
 const total=weights.reduce((a,[,w])=>a+w,0);let r=rand()*total;
 for(const[rar,w]of weights){if((r-=w)<=0)return rar}return 'Common';
}
function rollItem(rand:()=>number,floor:number,exclude:Set<string>,hero?:Hero):Item{
 const ownedSets=new Set(hero?.gear.flatMap(i=>i.set?[i.set]:[])||[]);
 for(let tries=0;tries<10;tries++){const rar=rollRarity(rand,floor);const all=ITEMS.filter(i=>i.rarity===rar&&!exclude.has(i.id));const focused=all.filter(i=>i.set&&ownedSets.has(i.set));const pool=focused.length&&rand()<.38?focused:all;if(pool.length)return pool[Math.floor(rand()*pool.length)]}
 const any=ITEMS.filter(i=>!exclude.has(i.id));return any[Math.floor(rand()*any.length)]||ITEMS[0];
}
function gearReward(item:Item):Reward{
 const val=item.stat==='speed'?`+${Math.round(item.value*100)}% attack speed`:`+${item.value} ${item.stat}`;
 return {id:'gear',title:item.name,detail:`${item.rarity} ${item.slot}${item.set?` · ${item.set} set`:''}: ${val}${item.effect?` · ${item.effect.description}`:''}${item.curse?` · ${item.curse}`:''}`,kind:'gear',amount:0,item};
}
export function makeRewards(s:RunState,salt=0):Reward[]{
 const seed=((s.seed>>>0)^Math.imul(s.floor,73856093)^Math.imul(s.encounter,19349663)^Math.imul(Math.floor(s.telemetry.elapsed)+salt,2654435761))>>>0;
 const rand=mulberry32(seed);
 const utilities:Reward[]=[
  {id:'atk',title:'Aggressive Projection',detail:'+3 Attack',kind:'attack',amount:3},
  {id:'def',title:'Actual Defensive Depth',detail:'+3 Defense',kind:'defense',amount:3},
  {id:'heal',title:'Emergency IR Potion',detail:'Restore 32% HP',kind:'heal',amount:.32},
  {id:'hp',title:'Roster Expansion',detail:'+18 maximum HP',kind:'maxHp',amount:18},
  {id:'spd',title:'Line Blender',detail:'+10% attack speed',kind:'speed',amount:.1},
  {id:'gold',title:'Future Considerations',detail:'+35 gold',kind:'gold',amount:35}];
 // Heal weighted higher so sustain-dependent classes aren't starved.
 const fillPool=[utilities[0],utilities[1],utilities[2],utilities[2],utilities[2],utilities[3],utilities[4],utilities[5]];
 const out:Reward[]=[];const exclude=new Set(s.hero?.gear.map(i=>i.id)||[]);
 const gearCount=rand()<0.28?3:2; // occasional loot-heavy checkpoint
 for(let k=0;k<gearCount;k++){const item=rollItem(rand,s.floor,exclude,s.hero||undefined);exclude.add(item.id);out.push(gearReward(item))}
 while(out.length<3){const u=fillPool[Math.floor(rand()*fillPool.length)];if(!out.some(r=>!r.item&&r.kind===u.kind))out.push({...u})}
 for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
 return out.map((r,i)=>({...r,id:r.id+i}));
}
function applyItemStat(h:Hero,item:Item,direction:1|-1){const value=item.value*direction;if(item.stat==='attack')h.attack+=value;if(item.stat==='defense')h.defense+=value;if(item.stat==='maxHp'){h.maxHp+=value;h.hp=Math.min(h.maxHp,h.hp+(direction>0?item.value:0))}if(item.stat==='speed')h.speed+=value;}
function equip(h:Hero,item:Item){const old=h.gear.findIndex(i=>i.slot===item.slot);if(old>=0){applyItemStat(h,h.gear[old],-1);h.gear.splice(old,1)}h.gear.push(item);applyItemStat(h,item,1);}
export function applyReward(s:RunState,r:Reward){const n=structuredClone(s),h=n.hero!;if(r.kind==='attack')h.attack+=r.amount;if(r.kind==='defense')h.defense+=r.amount;if(r.kind==='maxHp'){h.maxHp+=r.amount;h.hp+=r.amount}if(r.kind==='speed')h.speed+=r.amount;if(r.kind==='gold')h.gold+=r.amount;if(r.kind==='heal')grantHealing(n,Math.round(h.maxHp*r.amount));if(r.item){if(r.item.rarity==='Cursed')award(n,'cursed');if(r.item.rarity==='Legendary'||r.item.rarity==='Mythic')award(n,'mythic');equip(h,r.item);}advance(n);return n;}
// --- Shop & rerolls (checkpoint screen). Gold and reroll tokens finally do something. ---
export const shopCosts=(floor:number)=>({heal:20+floor*2,reroll:30,item:45+floor*3});
export function shopOffer(s:RunState):Item{const rand=mulberry32(((s.seed>>>0)^Math.imul(s.floor,40503)^Math.imul(s.encounter,90001)^0x5f3759df)>>>0);return rollItem(rand,s.floor,new Set(s.hero?.gear.map(i=>i.id)||[]),s.hero||undefined);}
export function rerollRewards(s:RunState):RunState{const n=structuredClone(s),h=n.hero!;if(h.rerolls<=0)return s;h.rerolls--;n.rewards=makeRewards(n,1+Math.floor(Math.random()*1e9));n.log.unshift('Rewards rerolled.');return n;}
export function buyShop(s:RunState,kind:'heal'|'reroll'|'item'):RunState{const n=structuredClone(s),h=n.hero!;const cost=shopCosts(n.floor)[kind];if(h.gold<cost)return s;
 if(kind==='heal'){if(h.hp>=h.maxHp)return s;h.gold-=cost;const amt=grantHealing(n,Math.round(h.maxHp*.28));n.log.unshift(`Bench medic restores ${amt} HP.`)}
 if(kind==='reroll'){h.gold-=cost;h.rerolls++;n.log.unshift('Bought a reroll token.')}
 if(kind==='item'){const item=shopOffer(n);h.gold-=cost;if(item.rarity==='Cursed')award(n,'cursed');if(item.rarity==='Legendary'||item.rarity==='Mythic')award(n,'mythic');equip(h,item);n.log.unshift(`Bought & equipped ${item.name}.`)}
 return n;}
export const save=(s:RunState)=>localStorage.setItem('descent.run',JSON.stringify(s));
export const load=():RunState|null=>{try{const raw=JSON.parse(localStorage.getItem('descent.run')||'null');return raw?{...initial,...raw}:null}catch{return null}};
export const loadEarned=():string[]=>{try{const v=JSON.parse(localStorage.getItem('descent.achievements')||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
export const saveEarned=(ids:string[])=>localStorage.setItem('descent.achievements',JSON.stringify(ids));
