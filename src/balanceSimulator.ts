import {BALANCE,CLASSES} from './data';
import {applyReward,applyStartingBuff,buyShop,heroFor,initial,shopCosts,shopOffer,startingBuffChoices,tick} from './engine';
import type{BuildSet,ClassId,Hero,Item,Reward,RunState,StartingBuff}from'./types';

export interface SimClassSummary{classId:ClassId;className:string;runs:number;clears:number;clearRate:number;averageFloor:number;averageSeconds:number;deathFloors:string;bestFloor:number;bestSeconds:number}
export interface SimReport{runs:number;clears:number;clearRate:number;averageFloor:number;averageSeconds:number;classes:SimClassSummary[];notes:string[]}

const CLASS_IDS=Object.keys(CLASSES) as ClassId[];
const rarityValue:Record<Item['rarity'],number>={Common:2,Uncommon:3,Rare:5,Epic:8,Legendary:12,Mythic:18,Cursed:6};
const setCount=(h:Hero,set:BuildSet)=>h.gear.filter(i=>i.set===set).length;

function buffScore(buff:StartingBuff,classId:ClassId){
 const kindScore:Record<StartingBuff['kind'],number>={attack:8,maxHp:6,speed:8,defense:6,gold:4,crit:7,shield:5,abilityPower:7,reroll:4};
 return kindScore[buff.kind]+(buff.favored?.includes(classId)?4:0)+(buff.rarity==='Rare'?1:0)-(buff.rarity==='Risky'?.5:0);
}

function itemScore(item:Item,h:Hero){
 const current=h.gear.find(i=>i.slot===item.slot);
 const statDelta=current&&current.stat===item.stat?item.value-current.value:item.value;
 const statValue=item.stat==='speed'?statDelta*38:item.stat==='attack'?statDelta*1.1:item.stat==='defense'?statDelta*.9:statDelta*.45;
 const setValue=item.set?(setCount(h,item.set)===1?8:setCount(h,item.set)>1?4:2):0;
 const effectValue=item.effect?4:0;
 const cursePenalty=item.rarity==='Cursed'?(h.gear.filter(i=>i.rarity==='Cursed').length>=2?8:2):0;
 return rarityValue[item.rarity]+statValue+setValue+effectValue-cursePenalty;
}

function rewardScore(r:Reward,h:Hero){
 if(r.item)return itemScore(r.item,h);
 if(r.kind==='heal')return h.hp/h.maxHp<.45?14:h.hp/h.maxHp<.7?8:1;
 if(r.kind==='attack')return 7+r.amount;
 if(r.kind==='speed')return 8+r.amount*25;
 if(r.kind==='defense')return 5+r.amount*.9;
 if(r.kind==='maxHp')return 5+r.amount*.22;
 if(r.kind==='gold')return 3+r.amount*.04;
 return 0;
}

function chooseReward(s:RunState){
 const h=s.hero!;
 return [...s.rewards].sort((a,b)=>rewardScore(b,h)-rewardScore(a,h))[0]||s.rewards[0];
}

function shopBeforeReward(s:RunState){
 let n=s,h=n.hero!,cost=shopCosts(n.floor);
 if(h.hp/h.maxHp<.48&&h.gold>=cost.heal)n=buyShop(n,'heal');
 h=n.hero!;cost=shopCosts(n.floor);
 const offer=shopOffer(n);
 if(h.gold>=cost.item&&itemScore(offer,h)>9)n=buyShop(n,'item');
 return n;
}

function buildRun(classId:ClassId,seed:number){
 const hero=heroFor(`Sim ${CLASSES[classId].name}`,classId);
 const base:RunState={...structuredClone(initial),seed,hero,screen:'buff'};
 const buff=[...startingBuffChoices(seed,classId)].sort((a,b)=>buffScore(b,classId)-buffScore(a,classId))[0];
 return applyStartingBuff(base,buff);
}

function simulateOne(classId:ClassId,seed:number){
 let run=buildRun(classId,seed),ticks=0;
 while(run.screen!=='summary'&&ticks<50000&&run.telemetry.elapsed<12600){
  if(run.screen==='battle'){run=tick(run);ticks++;continue}
  if(run.screen==='reward'){run=shopBeforeReward(run);run=applyReward(run,chooseReward(run));continue}
  break;
 }
 return {classId,won:!!run.won,floor:run.floor,seconds:run.telemetry.elapsed};
}

export function runBalanceSimulation(runsPerClass=10,baseSeed=Date.now()):SimReport{
 const results=CLASS_IDS.flatMap((classId,ci)=>Array.from({length:runsPerClass},(_,i)=>simulateOne(classId,(baseSeed+ci*1009+i*7919)>>>0)));
 const classes=CLASS_IDS.map(classId=>{
  const rows=results.filter(r=>r.classId===classId),clears=rows.filter(r=>r.won).length;
  const deaths=rows.filter(r=>!r.won).reduce<Record<number,number>>((m,r)=>({...m,[r.floor]:(m[r.floor]||0)+1}),{});
  const deathFloors=Object.entries(deaths).sort((a,b)=>Number(a[0])-Number(b[0])).map(([f,c])=>`F${f}:${c}`).join(' ')||'none';
  return {classId,className:CLASSES[classId].name,runs:rows.length,clears,clearRate:clears/rows.length,averageFloor:rows.reduce((a,r)=>a+r.floor,0)/rows.length,averageSeconds:rows.reduce((a,r)=>a+r.seconds,0)/rows.length,deathFloors,bestFloor:Math.max(...rows.map(r=>r.floor)),bestSeconds:Math.max(...rows.map(r=>r.seconds))};
 });
 const clears=results.filter(r=>r.won).length,averageFloor=results.reduce((a,r)=>a+r.floor,0)/results.length,averageSeconds=results.reduce((a,r)=>a+r.seconds,0)/results.length;
 const notes:string[]=[];
 for(const c of classes){if(c.clearRate>.45)notes.push(`${c.className} may be too safe (${Math.round(c.clearRate*100)}% clear rate).`);if(c.averageFloor<3.5)notes.push(`${c.className} may be undertuned (avg floor ${c.averageFloor.toFixed(1)}).`)}
 if(clears/results.length>.35)notes.push('Overall clear rate is above the current target for a hard Floor 18 clear.');
 if(averageSeconds<1800)notes.push('Average simulated run duration is short; failures may be happening too early or combat may be too fast.');
 if(averageSeconds>7200)notes.push('Average simulated run duration is long; check for HP-sponge pacing.');
 return {runs:results.length,clears,clearRate:clears/results.length,averageFloor,averageSeconds,classes,notes};
}

