// One entry corresponds to one physical ticket; pool contents are fixed before drawing.
const junkBases=[
 ['垃圾袋','accessory','裝得下夢想，裝不下週一。'],['磚頭','weapon','事情解決不了？至少這塊很有份量。'],['衛生紙','armor','柔軟守護，是戰士最後的體面。'],['單隻襪子','helmet','另一隻正在尋找人生方向。'],
 ['香蕉皮','accessory','敵人不一定跌倒，尊嚴倒是先滑走了。'],['生鏽湯匙','weapon','能挖寶也能挖布丁，兩者都很辛苦。'],['裂碗','helmet','防護能力未知，盛湯能力堪憂。'],['破拖鞋','weapon','傳說中的遠程教育神器。'],
 ['破雨傘','weapon','能遮雨的部分，剛好沒帶來。'],['空罐頭','accessory','搖一搖，聽見錢包的回音。'],['木棍','weapon','樸實無華，樹看了都說眼熟。'],['紙箱','armor','只要躲進去，壓力就看不到你。'],
 ['乾麵包','accessory','比意志堅定，比石頭好入口一點。'],['皺紙團','weapon','曾經是一份雄心壯志的計畫。'],['舊牙刷','weapon','刷不掉煩惱，至少可以努力一下。'],['彎釘子','accessory','筆直的人生，似乎跟它無關。'],
 ['空玻璃瓶','accessory','裡面裝滿了免費的空氣。'],['橡皮鴨','accessory','遇到問題先問牠，牠會認真沉默。'],['小石頭','weapon','沒有任何魔力，但非常擅長當石頭。'],['樹葉扇','accessory','風量取決於你的求生欲。']
];
const jokePrefixes=['普通的','微妙的','神秘的','特製的','限量版'];
export const JUNK_PRIZES=junkBases.flatMap(([base,slot,flavor],i)=>jokePrefixes.map((prefix,n)=>({
 name:prefix+base,kind:'equipment',slot,stats:n===4?{hp:1}:{},icon:'📦',flavor,artGroup:'junk',artIndex:i
})));

const premiumBases=[
 {name:'星耀長劍',kind:'equipment',slot:'weapon',stats:{atk:24,crit:.08},flavor:'劍光很帥，拔劍前請先確認附近沒有吊扇。'},
 {name:'疾風細劍',kind:'equipment',slot:'weapon',stats:{atk:19,speed:.4},flavor:'速度快得連藉口都追不上。'},
 {name:'熾焰巨劍',kind:'equipment',slot:'weapon',stats:{atk:28},flavor:'附帶烤吐司功能，早餐有著落。'},
 {name:'星界守護鎧',kind:'equipment',slot:'armor',stats:{hp:65,def:14},flavor:'穿上很可靠，脫下可能需要朋友幫忙。'},
 {name:'赤曜重甲',kind:'equipment',slot:'armor',stats:{hp:45,def:18},flavor:'防禦力十足，搭電梯時記得留空間。'},
 {name:'天羽戰盔',kind:'equipment',slot:'helmet',stats:{hp:42,def:9},flavor:'保護腦袋，也保護今天沒整理的髮型。'},
 {name:'星辰墜飾',kind:'equipment',slot:'accessory',stats:{crit:.14,critDamage:.3},flavor:'閃耀程度超過鬧鐘，卻不會叫你起床。'},
 {name:'生命翡翠護符',kind:'equipment',slot:'accessory',stats:{hp:60,def:5},flavor:'一點綠意，讓冒險者的血條比較有安全感。'},
 {name:'雷光秘術',kind:'active',effect:'damage',power:3.4,cooldown:4,flavor:'打雷不下雨，只對敵人不客氣。'},
 {name:'奧術本能',kind:'passive',stats:{crit:.1,skillPower:.3},flavor:'聰明的力量，是先想好再耍帥。'}
];
const premiumPrefixes=['精鑄','卓越','璀璨'];
export const PREMIUM_PRIZES=premiumBases.flatMap((base,i)=>premiumPrefixes.map((prefix,n)=>({
 ...base,name:prefix+base.name,artGroup:'premium',artIndex:i,
 ...(base.stats?{stats:Object.fromEntries(Object.entries(base.stats).map(([k,v])=>[k,Number((v*(1+n*.1)).toFixed(3))]))}:{}),
 ...(base.power?{power:Number((base.power+n*.15).toFixed(2))}:{})
})));

const legacyFlavors={
 '星辰聖劍':'星光照亮前路，也照亮你昨晚忘記整理的房間。','雷霆突襲':'雷聲很大，敵人最好自備耳塞。','治癒之光':'溫暖的光，沒有附掛號費。',
 '守護者鎧甲':'可靠的防護，唯一弱點是忘記帶鑰匙。','疾風之刃':'揮得比下班打卡還快。','銀羽頭盔':'羽毛不保證能飛，但髮型安全了。','星輝護符':'亮得像你終於完成待辦清單。',
 '熾火大劍':'拔劍之前，請先遠離瓦斯爐。','戰鬥本能':'危險來臨時，身體比腦袋先說「糟了」。','鋼鐵意志':'硬得像假日早晨不肯起床的決心。',
 '迅捷步伐':'跑得再快，也記得先把鞋帶綁好。','魔力增幅':'不是咖啡，效果卻很提神。','勇者頭盔':'有了它，你的頭至少比計畫更有保障。','生命護符':'讓血條多一點從容。',
 '鐵甲':'結實耐用，上廁所略需規劃。','火焰斬擊':'熱情滿點，請勿用於烤棉花糖。','旋風劍舞':'帥氣旋轉，請確認周圍沒有花瓶。','勇氣徽章':'勇氣有了，帳單還是要面對。',
 '生命藥水組':'紅通通的勇氣，請勿誤認成番茄汁。','力量藥水組':'喝完很有力，搬家時請適量使用。','防禦藥水組':'抗打擊，也許不包括老闆的訊息。','戰鬥卷軸':'展開之前請確認不是發票。','艾特拉王冠':'壓軸的榮耀，重量由脖子承擔。'
};
const catalog=[...JUNK_PRIZES,...PREMIUM_PRIZES];
export function prizeFlavor(item){return item?.flavor||legacyFlavors[item?.name]||'看起來很有故事，背包則需要更多空間。'}
export function prizeArtInfo(name){const x=catalog.find(p=>p.name===name);return x?{group:x.artGroup,index:x.artIndex}:null}
