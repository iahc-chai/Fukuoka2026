'use strict';
const SCENARIOS = {
  owner: {
    kicker: 'YOUR REPOSITORY / OWNER', title: 'เว็บ Fukuoka เป็น repo ของเรา',
    description: 'ลองเพิ่มส่วนราเมนในเว็บ โดยแยก branch ไปแก้ แล้วเปิด PR กลับเข้า main เพื่อตรวจงานก่อนขึ้นเว็บจริง',
    context: [['Repo บน GitHub', 'iahc-chai/Fukuoka2026'], ['Branch เป้าหมาย', 'main'], ['Branch ที่ใช้ทดลองแก้', 'add-ramen']],
    note: 'ตัวอย่างนี้ใช้ branch และ PR ก่อนรวมงาน ก่อนหน้านี้เราเคย push เข้า main โดยตรง ถ้ากติกา repo อนุญาตก็ทำได้ แต่ branch ที่ยังไม่ merge เข้า main จะยังไม่เปลี่ยนเว็บ Fukuoka ที่เผยแพร่อยู่',
    syncDescription: 'Merge บน GitHub ไม่ได้แก้ไฟล์ในเครื่องเราให้เอง กลับมาที่ main แล้ว pull เพื่อรับเวอร์ชันที่รวมงานแล้ว การอัปเดตเครื่องเป็นอีกงานหนึ่ง แยกจากการ deploy',
    sync: 'git switch main\ngit pull --ff-only origin main',
    steps: [
      { id:'clone', title:'Clone repo', hint:'เอาโปรเจกต์มาเริ่มในเครื่อง', location:'local', description:'ครั้งแรกที่เครื่องนี้ยังไม่มีเว็บ Fukuoka ให้ clone จาก repo ของเรา ได้ทั้งไฟล์และประวัติการแก้ไข', before:'โค้ดอยู่บน GitHub ยังไม่มีโฟลเดอร์โปรเจกต์ในเครื่องนี้', after:'มีโฟลเดอร์ Fukuoka2026 ในเครื่อง และ origin ชี้ repo ของเรา', kind:'คำสั่งใน Terminal', command:'git clone https://github.com/iahc-chai/Fukuoka2026.git\ncd Fukuoka2026', tip:'ถ้ามี repo ในเครื่องแล้ว ไม่ต้อง clone ใหม่ทุกครั้ง ใช้ pull เพื่ออัปเดต แล้วไปขั้นสร้าง branch ได้เลย' },
      { id:'branch', title:'แยก Branch', hint:'เริ่มสายงาน add-ramen', location:'local', description:'อัปเดต main ในเครื่องก่อน แล้วแยก branch ชื่อ add-ramen เพื่อแก้เรื่องนี้โดย main ยังไม่เปลี่ยน', before:'เราอยู่ในโฟลเดอร์ repo และบันทึกงานค้างเรียบร้อยแล้ว', after:'branch ที่กำลังใช้งานคือ add-ramen เริ่มจาก main ล่าสุด', kind:'คำสั่งใน Terminal', command:'git switch main\ngit pull --ff-only origin main\ngit switch -c add-ramen', tip:'Branch คือสายงานใน repo เดิม ไม่ใช่ fork และการสร้าง branch ในเครื่องยังไม่ทำให้ branch นี้ขึ้น GitHub' },
      { id:'edit', title:'แก้โค้ด + Commit', hint:'บันทึกงานเป็นเวอร์ชัน', location:'local', description:'ลองแก้ HTML, CSS หรือ JavaScript เพิ่มส่วนราเมน ตรวจผลในเครื่อง แล้วเลือกไฟล์และ commit พร้อมข้อความอธิบาย', before:'branch add-ramen ยังเหมือน main ตอนที่แยกมา', after:'มี commit ใหม่ใน add-ramen ที่เครื่องเรา แต่ GitHub ยังไม่ได้รับงาน', kind:'คำสั่งหลังแก้และตรวจไฟล์', command:'git diff\ngit add index.html style.css script.js\ngit commit -m "Add ramen section"', tip:'git add เลือกสิ่งที่จะเก็บใน commit ส่วน commit บันทึกเวอร์ชัน ยังไม่ใช่ push ถ้าแก้ไฟล์อื่นให้เลือกชื่อไฟล์นั้นด้วย' },
      { id:'push', title:'Push Branch', hint:'ส่ง add-ramen ขึ้น GitHub', location:'cloud', description:'ส่ง commit จาก branch ที่แก้ขึ้น repo ของเรา โดยยังไม่แตะ main', before:'commit ใหม่มีเฉพาะในเครื่อง', after:'GitHub มี branch add-ramen พร้อม commit ที่ส่งขึ้นไป', kind:'คำสั่งใน Terminal', command:'git push -u origin add-ramen', tip:'origin คือชื่อ remote ของ repo ที่เรา clone มา คำสั่งนี้ส่งไป add-ramen ไม่ใช่ main จึงยังไม่ deploy เว็บหลัก' },
      { id:'pr', title:'เปิด PR', hint:'ขอรวม add-ramen → main', location:'cloud', description:'เปิด Pull Request เพื่อดูว่าแก้อะไร และขอรวม branch นี้เข้า main แม้ทำคนเดียวก็ใช้เป็นจุดตรวจงานได้', before:'GitHub มีทั้ง main และ branch ที่เราแก้', after:'มี PR ให้ตรวจ diff และผลตรวจอัตโนมัติ main ยังไม่เปลี่ยน', kind:'ทำบนหน้า GitHub', command:'Pull requests → New pull request\nbase: main\ncompare: add-ramen\nเขียนสิ่งที่แก้ → Create pull request', tip:'เปิด PR ยังไม่เท่ากับ Merge และ PR ไม่ใช่คำสั่ง git pull คำว่า base คือปลายทางที่จะรับงาน' },
      { id:'merge', title:'ตรวจแล้ว Merge', hint:'รวมงานเข้า main', location:'cloud', description:'ตรวจการเปลี่ยนแปลงและผล checks ให้เรียบร้อย แล้วผู้มีสิทธิ์กด Merge ตามกติกาของ repo', before:'งานยังอยู่ใน PR อาจถูกขอให้แก้เพิ่มเติมได้', after:'main บน GitHub มีงานที่รวมเข้ามาแล้ว', kind:'ทำบนหน้า GitHub', command:'เปิด PR → ตรวจ Files changed และ checks\nเมื่อพร้อมและมีสิทธิ์ → Merge pull request', tip:'ถ้าถูกขอแก้ ให้แก้และ push branch เดิม PR เดิมจะอัปเดต ปุ่มจำลองขอแก้ใต้แผนภาพจะพากลับไปขั้นนั้น' },
      { id:'deploy', title:'Pages Deploy', hint:'เว็บจริงรับโค้ดจาก main', location:'web', description:'เว็บ Fukuoka ตั้ง GitHub Pages จาก main / (root) ไว้แล้ว เมื่อ main เปลี่ยน GitHub จะ build และ deploy ให้', before:'main อัปเดตแล้ว แต่เว็บอาจยังแสดงเวอร์ชันก่อนหน้า', after:'เมื่อ deployment สำเร็จ คนเปิดลิงก์เว็บจะเห็นเวอร์ชันใหม่', kind:'ตรวจผลบน GitHub', command:'Actions → pages build and deployment\nรอ build และ deploy สำเร็จ\nเปิด https://iahc-chai.github.io/Fukuoka2026/', tip:'Push สำเร็จไม่ได้รับประกันว่า deploy ผ่าน ต้องดูสถานะ deployment ด้วย ส่วนโค้ดในเครื่องอัปเดตด้วย pull ตามช่องด้านล่าง' }
    ]
  },
  contributor: {
    kicker: 'SOMEONE ELSE’S REPOSITORY / CONTRIBUTOR', title:'อยากช่วยแก้ repo ของคนอื่น',
    description:'มุมนี้สมมติว่าเราไม่มีสิทธิ์เขียน repo ต้นฉบับ จึง fork มาไว้ในบัญชีเรา แล้วส่ง PR กลับไปให้เจ้าของพิจารณา',
    context:[['ต้นฉบับบน GitHub','ORIGINAL_OWNER/trip-planner'],['Fork ของเราบน GitHub','YOUR_USERNAME/trip-planner'],['Branch ที่เสนอแก้','add-ramen → main ของต้นฉบับ']],
    note:'ชื่อ repo ในมุมนี้เป็นตัวอย่างสมมติ ให้แทน ORIGINAL_OWNER และ YOUR_USERNAME ด้วยบัญชีจริงก่อนใช้คำสั่ง หากเจ้าของให้สิทธิ์เขียนในฐานะ collaborator อาจสร้าง branch ใน repo ต้นฉบับได้โดยไม่ต้อง fork',
    syncDescription:'หลังเจ้าของรวม PR ต้นฉบับจะเปลี่ยน แต่ fork และเครื่องเราไม่ได้ตามมาทันที ตัวอย่างนี้ตั้ง upstream ให้ชี้ต้นฉบับ แล้วอัปเดต main ในเครื่องและส่งกลับไปที่ fork ของเรา',
    sync:'git switch main\ngit fetch upstream\ngit merge --ff-only upstream/main\ngit push origin main',
    steps:[
      { id:'fork',title:'Fork บน GitHub',hint:'สร้างสำเนาในบัญชีเรา',location:'cloud',description:'เปิด repo ต้นฉบับแล้วกด Fork เพื่อมี repo ของเราเองบน GitHub ขั้นนี้ยังไม่ได้สร้างโฟลเดอร์ในเครื่อง',before:'repo ต้นฉบับเป็นของคนอื่น เราไม่มีสิทธิ์ push เข้า repo นั้น',after:'มี YOUR_USERNAME/trip-planner บน GitHub เชื่อมโยงกับต้นฉบับ',kind:'ทำบนหน้า GitHub',command:'เปิด ORIGINAL_OWNER/trip-planner\nกด Fork → เลือกบัญชีเรา → Create fork',tip:'Fork สร้างสำเนาบน GitHub ส่วน Clone เอา repo ลงเครื่อง เป็นคนละขั้นกัน และ fork ไม่ได้อัปเดตตามต้นฉบับให้อัตโนมัติ'},
      { id:'clone',title:'Clone Fork',hint:'เอาสำเนาของเราลงเครื่อง',location:'local',description:'Clone จาก fork ของเรา แล้วเพิ่ม remote ชื่อ upstream ให้ชี้ repo ต้นฉบับ เพื่อใช้อัปเดตภายหลัง',before:'มี fork บน GitHub แล้ว แต่เครื่องยังไม่มีโปรเจกต์',after:'origin ชี้ fork ของเรา ส่วน upstream ชี้ repo ต้นฉบับ',kind:'คำสั่งใน Terminal',command:'git clone https://github.com/YOUR_USERNAME/trip-planner.git\ncd trip-planner\ngit remote add upstream https://github.com/ORIGINAL_OWNER/trip-planner.git',tip:'แทนชื่อบัญชีตัวพิมพ์ใหญ่ก่อนใช้ origin และ upstream เป็นชื่อ remote ในเครื่อง ไม่ใช่ branch'},
      { id:'branch',title:'แยก Branch',hint:'เตรียมงานที่อยากเสนอ',location:'local',description:'แยก branch add-ramen จาก main ที่เพิ่ง clone มา เพื่อให้การแก้ครั้งนี้เป็นงานชุดเดียวชัดเจน',before:'main ในเครื่องตรงกับ fork ตอน clone',after:'กำลังทำงานบน add-ramen แยกจาก main',kind:'คำสั่งใน Terminal',command:'git switch main\ngit switch -c add-ramen',tip:'ถ้า fork มีมานานแล้ว ให้อัปเดตจาก upstream ก่อนเริ่มงาน ตามคำสั่ง sync ด้านล่าง ตัวอย่างนี้สมมติว่าเพิ่ง fork และ clone'},
      { id:'edit',title:'แก้โค้ด + Commit',hint:'บันทึกการแก้ในเครื่อง',location:'local',description:'แก้ไฟล์และตรวจผล แล้ว commit การเปลี่ยนแปลงที่ต้องการเสนอให้เจ้าของ',before:'ยังไม่มี commit ใหม่ของงานที่เสนอ',after:'add-ramen ในเครื่องมี commit ใหม่ แต่ fork บน GitHub ยังไม่เปลี่ยน',kind:'คำสั่งหลังแก้และตรวจไฟล์',command:'git diff\ngit add index.html style.css script.js\ngit commit -m "Add ramen section"',tip:'เลือกเฉพาะไฟล์ที่แก้จริง ไม่ใส่รหัสผ่านหรือข้อมูลส่วนตัวใน commit ถ้าถูกขอแก้ภายหลังให้ทำงานต่อบน branch เดิม'},
      { id:'push',title:'Push ไป Fork',hint:'ส่งขึ้น repo ของเรา',location:'cloud',description:'ส่ง branch ที่แก้ไป origin ซึ่งในมุมนี้คือ fork ของเรา ไม่ใช่ repo ต้นฉบับของคนอื่น',before:'commit ใหม่อยู่เฉพาะในเครื่อง',after:'YOUR_USERNAME/trip-planner มี branch add-ramen พร้อมงานที่เสนอ',kind:'คำสั่งใน Terminal',command:'git push -u origin add-ramen',tip:'ต้นฉบับยังไม่เปลี่ยน การ push ขึ้น fork ไม่ได้เท่ากับส่งงานเข้า main ของเจ้าของ'},
      { id:'pr',title:'PR กลับต้นฉบับ',hint:'ขอให้เจ้าของรับงาน',location:'cloud',description:'เปิด PR จาก branch ใน fork ไปยัง main ของ repo ต้นฉบับ ตรวจชื่อ repo ทั้งสองฝั่งก่อนส่ง',before:'งานอยู่บน fork ของเรา',after:'เจ้าของต้นฉบับเห็น PR และตรวจการแก้ไขได้ แต่ main ของเขายังไม่เปลี่ยน',kind:'ทำบนหน้า GitHub',command:'ต้นฉบับ: ORIGINAL_OWNER/trip-planner\nbase branch: main\nhead fork: YOUR_USERNAME/trip-planner\ncompare branch: add-ramen\nเขียนสิ่งที่แก้ → Create pull request',tip:'ถ้าเลือก base เป็น main ใน fork ของเรา PR จะไม่ได้ขอรวมเข้าต้นฉบับ ตรวจปลายทางให้ถูก'},
      { id:'merge',title:'เจ้าของตรวจ + Merge',hint:'ผู้ดูแลตัดสินใจรับงาน',location:'cloud',description:'เจ้าของหรือผู้ดูแลที่มีสิทธิ์ตรวจงาน อาจขอแก้ ปิด PR หรือรวมงานเมื่อพร้อม เราไม่ถือว่าเปิด PR แล้วต้องได้รับการรับเสมอ',before:'PR กำลังรอการพิจารณาหรือการแก้ไขเพิ่มเติม',after:'ถ้าเจ้าของ Merge main ของต้นฉบับจะมีงานของเรา',kind:'การตัดสินใจของผู้ดูแลต้นฉบับ',command:'ผู้ดูแลตรวจ diff และ checks\nอาจขอแก้ → เรา commit และ push branch เดิม\nเมื่อผู้ดูแลพร้อม → Merge pull request',tip:'หากไม่มีสิทธิ์ Merge เราต้องรอผู้ดูแล ปุ่มขอแก้ใต้แผนภาพเป็นการจำลองวงจรกลับไปทำงานต่อ'},
      { id:'deploy',title:'Deploy ถ้าตั้งไว้',hint:'ขึ้นกับระบบของต้นฉบับ',location:'web',description:'ถ้าต้นฉบับมีระบบ deploy จาก main ก็จะเผยแพร่หลังรวมงานและผ่านการตรวจ หากไม่ได้ตั้งระบบไว้ จะยังไม่มีเว็บออนไลน์จากการ Merge เพียงอย่างเดียว',before:'main ของต้นฉบับรวมงานแล้ว',after:'เมื่อมีระบบเผยแพร่และทำงานสำเร็จ ผู้ใช้จึงเห็นเวอร์ชันใหม่',kind:'ตรวจตามระบบของต้นฉบับ',command:'ดู Actions / deployment ของ repo ต้นฉบับ\nตรวจว่าตั้งเผยแพร่จาก branch ใด\nรอ deployment สำเร็จก่อนสรุปว่าออนไลน์',tip:'repo บางอย่างเป็นไลบรารีหรือเอกสาร ไม่ใช่เว็บ ทุก repo จึงไม่จำเป็นต้องมีขั้น deploy แบบ Pages'}
    ]
  }
};
const $=s=>document.querySelector(s);
const make=(tag,className,text)=>{const n=document.createElement(tag);n.className=className;if(text!==undefined)n.textContent=text;return n;};
const locationNames={local:'ในเครื่องเรา',cloud:'บน GitHub',web:'เว็บออนไลน์'};
const params=new URLSearchParams(window.location.search);
let scenario=params.get('case')==='contributor'?'contributor':'owner';
const indexes={owner:0,contributor:0};
const requested=Number(params.get('step'));
if(Number.isInteger(requested)&&requested>=1&&requested<=SCENARIOS[scenario].steps.length)indexes[scenario]=requested-1;
let resizeFrame=null;
function updateUrl(){const url=new URL(window.location.href);url.searchParams.set('case',scenario);url.searchParams.set('step',String(indexes[scenario]+1));window.history.replaceState(null,'',url);}
function reducedMotion(){return window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)').matches:true;}
function scrollToNode(node){if(typeof node.scrollIntoView==='function')node.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'});}
function selectStep(index,scroll=false){indexes[scenario]=index;updateUrl();renderDetail();if(scroll&&window.innerWidth<1100)scrollToNode($('#step-detail'));}
function renderScenario(){
 const data=SCENARIOS[scenario];$('#review-feedback').hidden=true;
 document.querySelectorAll('[data-scenario]').forEach(tab=>{const selected=tab.dataset.scenario===scenario;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
 $('#scenario').setAttribute('aria-labelledby',`tab-${scenario}`);
 $('#scenario-kicker').textContent=data.kicker;$('#scenario-title').textContent=data.title;$('#scenario-description').textContent=data.description;$('#scenario-note').textContent=data.note;
 $('#repo-context').replaceChildren();for(const [term,value]of data.context){const row=make('div','');row.append(make('dt','',term),make('dd','',value));$('#repo-context').append(row);}
 $('#flow-nodes').replaceChildren();
 data.steps.forEach((step,index)=>{const item=make('li','flow-node');const button=make('button','');button.type='button';button.dataset.step=String(index);button.setAttribute('aria-controls','step-detail');
 const meta=make('span','node-meta');meta.append(make('span','',String(index+1).padStart(2,'0')),make('span','',step.location==='local'?'LOCAL':step.location==='cloud'?'GITHUB':'WEB'));
 button.append(meta,make('span','node-title',step.title),make('span','node-hint',step.hint),make('span','node-location',locationNames[step.location]));
 button.addEventListener('click',()=>selectStep(index,true));item.append(button);$('#flow-nodes').append(item);});
 $('#sync-description').textContent=data.syncDescription;$('#sync-command').textContent=data.sync;renderDetail();layoutDiagram();updateUrl();
}
function renderDetail(){
 const data=SCENARIOS[scenario],index=indexes[scenario],step=data.steps[index];
 $('#step-index').textContent=`STEP ${String(index+1).padStart(2,'0')} / ${String(data.steps.length).padStart(2,'0')} · ${locationNames[step.location]}`;
 $('#step-title').textContent=step.title;$('#step-description').textContent=step.description;$('#step-before').textContent=step.before;$('#step-after').textContent=step.after;$('#command-kind').textContent=step.kind;$('#step-command').textContent=step.command;$('#step-tip').textContent=step.tip;$('#copy-status').textContent='';
 $('#reading-status').textContent=`กำลังอ่านขั้น ${index+1} จาก ${data.steps.length} · ${step.title}`;
 $('#previous-step').disabled=index===0;$('#next-step').disabled=index===data.steps.length-1;
 document.querySelectorAll('[data-step]').forEach(button=>{const active=Number(button.dataset.step)===index;button.setAttribute('aria-pressed',String(active));if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
 document.querySelectorAll('.connector').forEach((path,i)=>path.classList.toggle('active',i<index));
}
function layoutDiagram(){
 const cols=window.innerWidth>=1000?3:window.innerWidth>=680?2:1;
 const nodes=[...$('#flow-nodes').children];$('#flow-nodes').style.setProperty('--columns',String(cols));
 nodes.forEach((node,i)=>{const row=Math.floor(i/cols),offset=i%cols;node.style.gridRow=String(row+1);node.style.gridColumn=String(row%2===0?offset+1:cols-offset);});
 drawConnectors();
}
function drawConnectors(){
 const board=$('#flow-board'),nodes=[...$('#flow-nodes').children];const base=board.getBoundingClientRect();const svg=$('#flow-connectors');svg.setAttribute('viewBox',`0 0 ${Math.max(board.clientWidth,1)} ${Math.max(board.clientHeight,1)}`);$('#connector-paths').replaceChildren();
 nodes.slice(0,-1).forEach((node,i)=>{const a=node.getBoundingClientRect(),b=nodes[i+1].getBoundingClientRect();const sameRow=node.style.gridRow===nodes[i+1].style.gridRow;let path;
 if(sameRow){const forward=a.left<b.left;const x1=(forward?a.right:a.left)-base.left+(forward?2:-2),x2=(forward?b.left:b.right)-base.left+(forward?-7:7);const y1=a.top-base.top+a.height/2,y2=b.top-base.top+b.height/2;const mid=(x1+x2)/2;path=`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;}
 else{const x1=a.left-base.left+a.width/2,x2=b.left-base.left+b.width/2,y1=a.bottom-base.top+2,y2=b.top-base.top-7,mid=(y1+y2)/2;path=`M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`;}
 const edge=document.createElementNS('http://www.w3.org/2000/svg','path');edge.setAttribute('d',path);edge.setAttribute('class',`connector${i<indexes[scenario]?' active':''}`);$('#connector-paths').append(edge);});
}
function renderPrint(){
 const container=$('#print-workflows');container.replaceChildren();
 for(const data of Object.values(SCENARIOS)){const article=make('article','');article.append(make('h1','',data.title),make('p','print-note',data.note));
 data.steps.forEach((step,i)=>{const row=make('section','print-step');row.append(make('h3','',`${i+1}. ${step.title} / ${locationNames[step.location]}`),make('p','',step.description),make('p','',`หลังขั้นนี้: ${step.after}`));const pre=make('pre','');pre.append(make('code','',step.command));row.append(pre);article.append(row);});
 article.append(make('h2','','อัปเดตเครื่องหลัง Merge'),make('p','',data.syncDescription));const pre=make('pre','');pre.append(make('code','',data.sync));article.append(pre);container.append(article);}
}
document.querySelectorAll('[data-scenario]').forEach(tab=>{
 tab.addEventListener('click',()=>{scenario=tab.dataset.scenario;renderScenario();});
 tab.addEventListener('keydown',event=>{const tabs=[...document.querySelectorAll('[data-scenario]')];let index=tabs.indexOf(tab);if(event.key==='ArrowRight'||event.key==='ArrowLeft')index=1-index;else if(event.key==='Home')index=0;else if(event.key==='End')index=1;else return;event.preventDefault();tabs[index].focus();tabs[index].click();});
});
$('#previous-step').addEventListener('click',()=>{if(indexes[scenario]>0)selectStep(indexes[scenario]-1);});
$('#next-step').addEventListener('click',()=>{if(indexes[scenario]<SCENARIOS[scenario].steps.length-1)selectStep(indexes[scenario]+1);});
$('#review-loop').addEventListener('click',()=>{$('#review-feedback').hidden=false;selectStep(SCENARIOS[scenario].steps.findIndex(step=>step.id==='edit'),true);});
$('#back-diagram').addEventListener('click',()=>scrollToNode($('#flow-board')));
$('#copy-command').addEventListener('click',async()=>{
 const text=SCENARIOS[scenario].steps[indexes[scenario]].command;
 try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(text);$('#copy-status').textContent='คัดลอกตัวอย่างแล้ว ตรวจชื่อบัญชีและ repo ก่อนนำไปใช้';}
 catch{$('#copy-status').textContent='คัดลอกอัตโนมัติไม่ได้ เลือกข้อความในช่องแล้วคัดลอกได้';}
});
$('#print-guide').addEventListener('click',()=>{renderPrint();window.print();});window.addEventListener('beforeprint',renderPrint);
window.addEventListener('resize',()=>{if(resizeFrame!==null)window.cancelAnimationFrame(resizeFrame);resizeFrame=window.requestAnimationFrame(()=>{layoutDiagram();resizeFrame=null;});});
if(window.ResizeObserver){const observer=new window.ResizeObserver(drawConnectors);observer.observe($('#flow-nodes'));}
renderScenario();renderPrint();
if(document.fonts?.ready)document.fonts.ready.then(drawConnectors);
