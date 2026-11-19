const legends = Object.freeze({
  study:'銅羽翻過最後一頁，書庫才肯讓路。',
  fitness:'鐘聲未落，鐵拳已在沙地上留下兩道深痕。',
  career:'爐火熄了，堡壘深處仍傳來齒輪的低鳴。',
  finance:'每踏出一步，石縫裡就落下一枚古金幣。',
  health:'霧裡先亮起一對鹿角，林間才漸漸安靜。',
  creative:'彩窗投下三道人影，舞台上卻只有一具傀儡。',
  social:'潮水淹過石階，持盾的身影始終沒有開口。',
  other:'紫星在石環間倒轉，塔門便有了眼睛。'
});
export const guardianLegend=category=>legends[category]||'';
export const guardianActor=category=>'wardens/'+(Object.hasOwn(legends,category)?category:'other');
export function guardianGate(chapter){
  if(chapter.bossDefeated)return '首領已擊敗';
  const stages=Math.max(0,chapter.stages-chapter.stage);
  const checks=chapter.milestones.filter(m=>!m.done).length;
  if(!stages&&!checks)return '已解鎖首領';
  return [stages&&`剩 ${stages} 關`,checks&&`${checks} 項里程碑待驗收`].filter(Boolean).join(' · ');
}
