export const CATEGORIES={
 study:['智慧圖書館','知識守衛者','📚'],fitness:['鋼鐵競技場','鋼鐵巨人','⚔️'],career:['工匠堡壘','機械統領','⚒️'],finance:['黃金商業城','貪婪魔像','💰'],health:['生命森林','迷霧精靈','🌲'],creative:['靈感工坊','幻彩傀儡','🎨'],social:['旅人港口','沉默騎士','⛵'],other:['冒險試煉塔','混沌守門人','🗼']};
export const REWARDS={easy:[15,20],normal:[25,40],hard:[40,70],milestone:[80,120],outcome:[150,180]};
export const PRIZES=[
 {tier:'A',name:'星辰聖劍',kind:'equipment',slot:'weapon',stats:{atk:22,crit:0.08},count:1,icon:'🗡️'},
 {tier:'B',name:'雷霆突襲',kind:'active',power:2.8,cooldown:4,count:2,icon:'⚡'},
 {tier:'C',name:'守護者鎧甲',kind:'equipment',slot:'armor',stats:{hp:45,def:10},count:5,icon:'🛡️'},
 {tier:'D',name:'戰鬥本能',kind:'passive',stats:{crit:0.12},count:10,icon:'💠'},
 {tier:'E',name:'生命藥水組',kind:'consumable',count:22,icon:'🧪'}
];
export const PRICE=100;
export const THEMES={
 study:['基礎知識廳','技能研習室','應用試煉'],fitness:['初心訓練場','耐力走廊','極限競技場'],career:['學徒工坊','專案熔爐','大師殿堂'],finance:['商人市集','財富礦坑','黃金金庫'],health:['晨光草原','習慣密林','生命聖殿'],creative:['靈感庭院','創作工坊','傑作展廳'],social:['交流碼頭','會話酒館','外交高塔'],other:['試煉階梯','未知迴廊','命運之塔']};
export const VARIANTS={
 A:[{name:'星辰聖劍',kind:'equipment',slot:'weapon',stats:{atk:22,crit:.08},icon:'🗡️'}],
 B:[{name:'雷霆突襲',kind:'active',effect:'damage',power:2.8,cooldown:4,icon:'⚡'},{name:'治癒之光',kind:'active',effect:'heal',power:.3,cooldown:5,icon:'✨'}],
 C:[{name:'守護者鎧甲',kind:'equipment',slot:'armor',stats:{hp:45,def:10},icon:'🛡️'},{name:'疾風之刃',kind:'equipment',slot:'weapon',stats:{atk:15,speed:.3},icon:'⚔️'},{name:'銀羽頭盔',kind:'equipment',slot:'helmet',stats:{hp:25,def:5},icon:'🪖'},{name:'星輝護符',kind:'equipment',slot:'accessory',stats:{crit:.1,critDamage:.25},icon:'💍'},{name:'熾火大劍',kind:'equipment',slot:'weapon',stats:{atk:18},icon:'🗡️'}],
 D:[{name:'戰鬥本能',kind:'passive',stats:{crit:.12},icon:'💠'},{name:'鋼鐵意志',kind:'passive',stats:{def:6},icon:'🔰'},{name:'迅捷步伐',kind:'passive',stats:{speed:.25},icon:'💨'},{name:'魔力增幅',kind:'passive',stats:{skillPower:.25},icon:'🔮'},{name:'勇者頭盔',kind:'equipment',slot:'helmet',stats:{hp:20,def:4},icon:'🪖'},{name:'生命護符',kind:'equipment',slot:'accessory',stats:{hp:25},icon:'💍'},{name:'鐵甲',kind:'equipment',slot:'armor',stats:{def:7},icon:'🛡️'},{name:'火焰斬擊',kind:'active',effect:'damage',power:2,cooldown:3,icon:'🔥'},{name:'旋風劍舞',kind:'active',effect:'damage',power:2.3,cooldown:4,icon:'🌀'},{name:'勇氣徽章',kind:'equipment',slot:'accessory',stats:{atk:6,crit:.04},icon:'🏅'}],
 E:Array.from({length:22},(_,i)=>[{name:'生命藥水組',effect:'heal',icon:'🧪'},{name:'力量藥水組',effect:'strength',icon:'🍶'},{name:'防禦藥水組',effect:'defense',icon:'🧴'},{name:'戰鬥卷軸',effect:'scroll',icon:'📜'}][i%4]).map(p=>({...p,kind:'consumable'}))
};
export const ENHANCE_COST=80;
export function fresh(){return {version:1,character:'',exp:0,balance:0,earned:0,spent:0,goals:[],transactions:[],claims:{},inventory:[],equipped:{},skills:[],autoPotion:true,round:1,pool:PRIZES.map(p=>p.count),activeGoal:null,battle:null,history:[]}}
export function level(s){return 1+Math.floor(s.exp/100)}
export function uuid(){return crypto.randomUUID()}
export function normalize(raw,category){
 if(!raw || typeof raw!=='object'||!raw.goalId||!raw.goalTitle||!raw.startDate||!raw.deadline)throw Error('缺少 goalId、goalTitle、startDate 或 deadline');
 const cat=category||raw.goalCategory;if(!CATEGORIES[cat])throw Error('請選擇有效的目標分類');
 const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
 if(!validDate(raw.startDate)||!validDate(raw.deadline)||raw.deadline<raw.startDate)throw Error('日期格式或順序不正確，請使用 YYYY-MM-DD');
 if(!String(raw.goalId).trim()||!String(raw.goalTitle).trim())throw Error('目標 ID 與名稱不可空白');
 if(!Array.isArray(raw.chapters)||!raw.chapters.length)throw Error('至少需要一個章節');
 const ids=new Set();const ident=(x,prefix)=>{const id=String(x||'').trim();if(!id||ids.has(prefix+id))throw Error('章節、任務與里程碑必須有不重複的 ID');ids.add(prefix+id);return id};
 const chapters=raw.chapters.map((c,i)=>({id:ident(c.id||c.chapterId,'c:'),title:String(c.title||c.name||'章節 '+(i+1)),bossName:String(c.bossName||(raw.bossChallenges||[]).find(b=>b.chapterId===(c.id||c.chapterId))?.boss||CATEGORIES[cat][1]),stages:Math.max(1,Math.min(20,Number.isInteger(c.stages)?c.stages:2)),milestones:(c.milestones||[]).map(m=>({id:ident(m.id||m.milestoneId,'m:'),title:String(m.title||m.name||''),criteria:String(m.criteria||''),done:false})),bossDefeated:false,stage:0}));
 if(Array.isArray(raw.milestones)) for(const m of raw.milestones){const c=chapters.find(x=>x.id===m.chapterId)||chapters[0];c.milestones.push({id:ident(m.id||m.milestoneId,'m:'),title:String(m.title||m.name||''),criteria:String(m.criteria||''),done:false})}
 const quests=(raw.dailyQuests||[]).map(q=>({id:ident(q.id||q.questId,'q:'),title:String(q.title||q.name||''),difficulty:['easy','normal','hard'].includes(q.difficulty)?q.difficulty:'normal',recurring:q.recurring!==false,date:q.date||null,weekdays:Array.isArray(q.weekdays)?q.weekdays.filter(x=>Number.isInteger(x)&&x>=0&&x<=6):[0,1,2,3,4,5,6]}));
 if(!quests.length)throw Error('至少需要一項每日任務');
 if(quests.some(q=>!q.title.trim()||q.date&&!validDate(q.date)))throw Error('任務名稱或排定日期不正確');
 if(chapters.some(c=>c.milestones.some(m=>!m.title.trim()||!m.criteria.trim())))throw Error('里程碑須包含名稱與驗收條件');
 if(!Array.isArray(raw.successCriteria)||!raw.successCriteria.length||raw.successCriteria.some(x=>!String(x).trim()))throw Error('至少需要一項明確的目標達成條件');
 return {id:String(raw.goalId),title:String(raw.goalTitle),category:cat,startDate:String(raw.startDate),deadline:String(raw.deadline),chapters,quests,successCriteria:Array.isArray(raw.successCriteria)?raw.successCriteria.map(String):[String(raw.successCriteria||'')],outcome:false,completedAt:null,createdAt:new Date().toISOString()};
}
export function reward(s,goalId,sourceId,type,now=new Date().toISOString()){
 let key=JSON.stringify([goalId,sourceId]);if(s.claims[key])throw Error('此獎勵已領取');if(!REWARDS[type])throw Error('獎勵類型錯誤');
 let [exp,nt]=REWARDS[type];let id=uuid();s.claims[key]=id;s.exp+=exp;s.balance+=nt;s.earned+=nt;s.transactions.push({id,goalId,sourceId,type,exp,nt,at:now});return {exp,nt};
}
export function remainingTickets(s){return s.tickets||s.pool.map((count,i)=>Array.from({length:count},(_,k)=>PRIZES[i].count-count+k))}
export function draw(s,rng=Math.random){if(s.balance<PRICE)throw Error('台幣不足');let total=s.pool.reduce((a,b)=>a+b,0);if(!total)throw Error('獎池已抽空');if(s.pool.length!==PRIZES.length||s.pool.some((n,i)=>!Number.isInteger(n)||n<0||n>PRIZES[i].count))throw Error('獎池資料錯誤');let tickets=remainingTickets(s);if(tickets.length!==PRIZES.length||tickets.some((list,i)=>list.length!==s.pool[i]||new Set(list).size!==list.length||list.some(x=>!Number.isInteger(x)||x<0||x>=PRIZES[i].count)))throw Error('獎籤資料錯誤');let r=rng();if(!(r>=0&&r<1))throw Error('亂數錯誤');let n=Math.floor(r*total),i=0;while(n>=s.pool[i]){n-=s.pool[i];i++}const p=PRIZES[i],id=uuid(),variant=VARIANTS[p.tier][tickets[i][n]];tickets[i].splice(n,1);s.tickets=tickets;s.pool[i]--;s.balance-=PRICE;s.spent+=PRICE;const item={...variant,tier:p.tier,id:uuid(),drawId:id,enhancement:0};s.inventory.push(item);if(total===1)s.inventory.push({id:uuid(),drawId:id,tier:'Last One',name:'艾特拉王冠',kind:'equipment',slot:'helmet',stats:{hp:35,def:8},icon:'👑'});s.transactions.push({id,type:'draw',sourceId:'pool:'+s.round,nt:-PRICE,at:new Date().toISOString(),prize:item.name,tier:p.tier});return item}
export function stats(s){const l=level(s);let st={hp:100+l*5,atk:12+l*2,def:4+l,crit:.05,speed:1,critDamage:1.5,skillPower:0};for(const item of s.inventory){if(Object.values(s.equipped).includes(item.id)||s.skills.includes(item.id)&&item.kind==='passive')for(const [k,v] of Object.entries(item.stats||{}))st[k]=(st[k]||0)+v*(1+(item.enhancement||0)*.15)}for(const k of ['hp','atk','def'])st[k]=Math.round(st[k]);st.crit=Math.min(.75,st.crit);return st}
export function enhance(s,id){let item=s.inventory.find(i=>i.id===id);if(!item||item.kind!=='equipment')throw Error('找不到裝備');if((item.enhancement||0)>=5)throw Error('裝備已達強化上限');if(s.balance<ENHANCE_COST)throw Error('台幣不足');s.balance-=ENHANCE_COST;s.spent+=ENHANCE_COST;item.enhancement=(item.enhancement||0)+1;s.transactions.push({id:uuid(),type:'enhance',sourceId:'equipment:'+id,nt:-ENHANCE_COST,at:new Date().toISOString()});}
export function goalProgress(g){let m=g.chapters.flatMap(c=>c.milestones);return g.outcome?100:Math.round(m.filter(x=>x.done).length/(m.length+1)*100)}
export function today(){return new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Taipei'})}
export function questKey(q,date=today()){return 'quest:'+q.id+':'+(q.recurring?date:'once')}
export function questAvailable(g,q,date=today()){if(date<g.startDate||date>g.deadline)return false;if(q.recurring){let day=new Date(date+'T12:00:00Z').getUTCDay();return (q.weekdays||[0,1,2,3,4,5,6]).includes(day)}return !q.date||q.date===date}
export function claimQuest(s,gid,qid,date=today()){let g=s.goals.find(x=>x.id===gid),q=g?.quests.find(x=>x.id===qid);if(!q||!questAvailable(g,q,date))throw Error('此任務今天未排定，或目標不在執行期間');if(!q.recurring&&s.transactions.some(t=>t.goalId===gid&&t.sourceId?.startsWith('quest:'+qid+':')))throw Error('此單次任務已領取');return reward(s,gid,questKey(q,date),q.difficulty)}
export function currentChapter(g){return g.chapters.find(c=>!c.bossDefeated)||g.chapters.at(-1)}
export function combatTick(s,rng=Math.random){const b=s.battle;if(!b||b.result)return;const g=s.goals.find(x=>x.id===b.goalId);if(!g){s.battle=null;return}let st=stats(s);b.turn++;b.buffs||={};b.cooldowns||={};b.log='普通攻擊';let active=s.inventory.filter(x=>s.skills.includes(x.id)&&x.kind==='active');let hit=st.atk*(b.buffs.strength>0?1.4:1)*(b.buffs.scroll>0?1.2:1);for(const skill of active){b.cooldowns[skill.id]=Math.max(0,(b.cooldowns[skill.id]||0)-1);if(!b.cooldowns[skill.id]&&(skill.effect!=='heal'||b.hp<st.hp*.6)){if(skill.effect==='heal'){b.hp=Math.min(st.hp,b.hp+Math.round(st.hp*skill.power*(1+st.skillPower)))}else hit+=st.atk*(skill.power||2)*(1+st.skillPower);b.cooldowns[skill.id]=skill.cooldown||4;b.log=skill.name}}
 if(rng()<Math.max(0,st.speed-1))hit+=st.atk;if(rng()<st.crit)hit*=st.critDamage;b.enemyHp-=Math.max(1,Math.round(hit-b.enemyDef));if(b.enemyHp<=0){b.enemyHp=0;b.result='win';const c=g.chapters.find(x=>x.id===b.chapterId);if(b.boss)c.bossDefeated=true;else c.stage=Math.min(c.stages,c.stage+1);return}
 b.hp-=Math.max(1,Math.round((b.enemyAtk-st.def)*(b.buffs.defense>0?.65:1)));if(s.autoPotion){let i=s.inventory.findIndex(x=>x.kind==='consumable'&&(x.effect==='heal'||!x.effect?b.hp<st.hp*.4:!b.buffs[x.effect]));if(i>=0){let item=s.inventory.splice(i,1)[0];if(item.effect==='heal'||!item.effect)b.hp=Math.min(st.hp,b.hp+50);else b.buffs[item.effect]=5;b.log='使用 '+item.name}}for(const key of Object.keys(b.buffs))b.buffs[key]=Math.max(0,b.buffs[key]-1);if(b.hp<=0){b.hp=0;b.result='lose'}}
export function startBattle(s,g){let c=currentChapter(g);if(c.bossDefeated)throw Error('此目標的章節皆已通關');let boss=c.stage>=c.stages;if(boss&&c.milestones.some(m=>!m.done))throw Error('請先完成本章所有現實里程碑驗收');let rank=g.chapters.indexOf(c);let st=stats(s);s.battle={goalId:g.id,chapterId:c.id,boss,turn:0,hp:st.hp,maxHp:st.hp,enemyHp:(boss?100:45)+rank*25,enemyMax:(boss?100:45)+rank*25,enemyAtk:(boss?18:12)+rank*3,enemyDef:3+rank,result:null}}
