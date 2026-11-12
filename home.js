'use strict';
const LEGACY_KEY = 'our-fukuoka-trip-2026-v2';
const EXTRA_KEY = 'fukuoka-our-list-meta-v1';
const defaults = [
  {id:'wish-torius-stock',text:'เช็กสต็อกและราคา Factory Outlet ที่ mont-bell Torius: สีดำ BK และไซซ์ที่ใส่ ก่อนเดินทาง',done:false},
  {id:'wish-torius-visit',text:'17 ธ.ค. ไป mont-bell Torius Store · จุดที่ต้องไปก่อนออก Aso',done:false},
  {id:'wish-down-fitting',text:'ลอง US Superior Down Jacket #2301377 ไม่มีฮู้ด 800 FP; เทียบรุ่นมีฮู้ด #2301375 และเลือกตัวที่พอดีในราคา Outlet',done:false}
];
const $ = selector => document.querySelector(selector);
function read(key) {try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function load() {
  const found = read(LEGACY_KEY);
  const legacy = found && typeof found==='object' && !Array.isArray(found) ? found : {selectedDay:17,plan:'aso',done:{},wishes:defaults};
  const extra = read(EXTRA_KEY);
  return {legacy, extra: extra && typeof extra==='object' ? extra : {meta:{},reminders:[]}};
}
let store=load(), filter='all', cloud=null, client=null, busy=false, connecting=false, draft=readDraft();
const MIGRATED_KEY='fukuoka-cloud-import-v1';
function notice(title,description){$('#sync-title').textContent=title;$('#sync-description').textContent=description;$('#connection-message').textContent=title+' · '+description;}
function readDraft(){try{return JSON.parse(sessionStorage.getItem('fukuoka-pending-add')||'null')}catch{return null}}
function sessionRead(key){try{return sessionStorage.getItem(key)||''}catch{return ''}}
function sessionSave(key,value){try{sessionStorage.setItem(key,value)}catch{}}
function localEntries(){return entries(true)}

function entries(localOnly=false) {
  if(cloud!==null&&!localOnly)return cloud;
  const wishes=(Array.isArray(store.legacy.wishes)?store.legacy.wishes:defaults).filter(x=>x&&typeof x.id==='string'&&typeof x.text==='string');
  const reminders=(Array.isArray(store.extra.reminders)?store.extra.reminders:[]).filter(x=>x&&typeof x.id==='string'&&typeof x.text==='string');
  const meta=store.extra.meta||{};
  return [...wishes.map(x=>({...x,...(meta[x.id]||{}),type:'wish'})),...reminders.map(x=>({...x,type:'reminder'}))];
}
function save() {
  try {
    localStorage.setItem(LEGACY_KEY,JSON.stringify(store.legacy));
    localStorage.setItem(EXTRA_KEY,JSON.stringify(store.extra));
    $('#form-message').textContent='เพิ่มรายการแล้ว · บันทึกในเครื่องนี้';
  } catch {
    $('#form-message').textContent='ไม่สามารถบันทึกลงเครื่องได้ กรุณา Export รายการไว้';
  }
}
function iconCategory(c){return ({food:'🍡',shop:'🛍',places:'📍',other:'✳'})[c]||'✳'}
function render(){
  const full=entries(), shown=full.filter(x=>filter==='all'||x.type===filter),done=full.filter(x=>x.done).length;
  $('#all-count').textContent=full.length;
  $('#progress').textContent=done+' / '+full.length;
  $('#progress-fill').style.width=(full.length?done/full.length*100:0)+'%';
  $('#entry-count').textContent=full.length+' ITEMS';
  $('.entries').replaceChildren();
  $('#empty-state').hidden=shown.length>0;
  for(const x of shown){
    const li=document.createElement('li'); li.className='entry'+(x.done?' is-done':'');
    const check=document.createElement('input'); check.className='done-toggle';check.type='checkbox';check.checked=Boolean(x.done);check.setAttribute('aria-label','Done: '+x.text);
    check.disabled=busy||connecting;check.addEventListener('change',async()=>{await setDone(x.id,x.type,check.checked);render()});
    const main=document.createElement('div');main.className='entry-main';
    const title=document.createElement('p');title.className='entry-title';title.textContent=x.text;
    const meta=document.createElement('div');meta.className='entry-meta';
    const tag=document.createElement('span');tag.className='tag'+(x.type==='reminder'?' reminder':'');tag.textContent=x.type==='reminder'?'♧ Reminder':'♡ Wishlist';meta.append(tag);
    for(const info of [x.author||'Chai',iconCategory(x.category)+' '+(x.category||'other'),x.day&&x.day!=='any'?x.day+' Dec':'Any day']){
      const span=document.createElement('span');span.textContent=info;meta.append(span);
    }
    main.append(title,meta);
    const rm=document.createElement('button');rm.className='entry-remove';rm.type='button';rm.setAttribute('aria-label','ลบ '+x.text);rm.textContent='×';
    rm.disabled=busy||connecting;rm.addEventListener('click',async()=>{if(confirm('ลบรายการนี้?')){await remove(x.id,x.type);render()}});
    li.append(check,main,rm);$('.entries').append(li);
  }
}
async function setDone(id,type,done){
  if(client){await mutate({action:"done",id,done});return;}
  if(type==='wish'){store.legacy.wishes=(store.legacy.wishes||[]).map(x=>x.id===id?{...x,done}:x)}
  else {store.extra.reminders=(store.extra.reminders||[]).map(x=>x.id===id?{...x,done}:x)}
  save();
}
async function remove(id,type){
  if(client){await mutate({action:"delete",id});return;}
  if(type==='wish'){store.legacy.wishes=(store.legacy.wishes||[]).filter(x=>x.id!==id);if(store.extra.meta)delete store.extra.meta[id]}
  else store.extra.reminders=(store.extra.reminders||[]).filter(x=>x.id!==id);
  save();
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  filter=b.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});
  render();
}));
document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{$('#entry-text').value=b.dataset.example;$('#entry-text').focus()}));
$('#entry-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const text=$('#entry-text').value.trim();
  if(!text)return;
  const type=document.querySelector('[name="type"]:checked').value;
  const author=$('#entry-author').value,category=$('#entry-category').value,day=$('#entry-day').value;
  const id='wish-'+(crypto&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));
  if(client){
    if(busy||connecting)return;
    const data={text:text.slice(0,300),type,author,category,day};
    if(!draft || JSON.stringify(draft.data)!==JSON.stringify(data))draft={id,data};
    sessionSave('fukuoka-pending-add',JSON.stringify(draft));
    if(await mutate({action:'add',id:draft.id,...data,done:false})){draft=null;sessionSave('fukuoka-pending-add','');$('#entry-text').value='';}
    return;
  }
  if(type==='wish'){
    if(!Array.isArray(store.legacy.wishes))store.legacy.wishes=defaults.slice();
    store.legacy.wishes.push({id,text:text.slice(0,300),done:false});
    if(!store.extra.meta)store.extra.meta={};
    store.extra.meta[id]={author,category,day};
  } else {
    if(!Array.isArray(store.extra.reminders))store.extra.reminders=[];
    store.extra.reminders.push({id,text:text.slice(0,300),done:false,author,category,day});
  }
  save();render();$('#entry-text').value='';$('#entry-text').focus();
});
$('#export-button').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),items:entries()},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='fukuoka-our-wishlist.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
window.addEventListener('storage',ev=>{if(ev.key===LEGACY_KEY||ev.key===EXTRA_KEY){store=load();render();updateImport()}});
function controls(){
  $('#entry-form button[type="submit"]').disabled=busy||connecting;
  $('#refresh-button').disabled=busy||connecting||!client;
  $('#import-button').disabled=busy||connecting;
  $('#sync-form button[type="submit"]').disabled=busy||connecting;
  $('#disconnect-button').disabled=busy||connecting;
}
function updateImport(){
  const marker=read(MIGRATED_KEY)||{};
  $('#import-button').hidden=!client||cloud===null||marker[client.endpoint]===true||!localEntries().length;
}
async function refresh(){
  if(!client||busy||connecting)return;
  busy=true;controls();
  try{const result=await client.request({action:'list'});cloud=result.items;notice('Google Sheets · ซิงก์แล้ว',new Date().toLocaleTimeString()+' · อัปเดตทุก 20 วินาที');}
  catch(e){notice(navigator.onLine?'ซิงก์ไม่สำเร็จ':'ออฟไลน์',e.message+' · รายการที่แสดงอาจเก่า');}
  finally{busy=false;controls();render();updateImport();}
}
async function mutate(payload){
  if(busy||connecting)return false;
  busy=true;controls();render();$('#form-message').textContent='กำลังบันทึก…';
  try{
    const result=await client.request(payload);cloud=result.items;
    $('#form-message').textContent='Google Sheets ยืนยันการบันทึกแล้ว';
    notice('Google Sheets · ซิงก์แล้ว','บันทึกและอ่านรายการกลางสำเร็จ');return true;
  }catch(e){$('#form-message').textContent='ยังยืนยันการบันทึกไม่ได้ · '+e.message;notice('บันทึกยังไม่ยืนยัน','กด Sync เพื่อตรวจรายการก่อนลองใหม่');return false;}
  finally{busy=false;controls();render();updateImport();}
}
$('#sync-key').value=sessionRead('fukuoka-key');
async function connect(){
  if(busy||connecting)return;
  connecting=true;controls();notice('กำลังเชื่อมต่อ…','ขั้นที่ 1/2 กำลังเปิดบริการ Google · รอไม่เกิน 20 วินาที');
  client?.close();cloud=null;
  client=new WishlistSync(WISHLIST_ENDPOINT,$('#sync-key').value.trim());
  try{
    await client.connect();notice('กำลังเชื่อมต่อ…','ขั้นที่ 2/2 ตรวจรหัสผ่านและอ่านรายการจาก Sheet · รอได้สูงสุด 60 วินาที');const result=await client.request({action:'list'});cloud=result.items;
    sessionSave('fukuoka-key',client.key);
    notice('Google Sheets · ซิงก์แล้ว','ใช้รายการร่วมกัน · รายการในเครื่องยังอยู่ กด Import เมื่อต้องการ');
    $('.sync-settings').open=false;
  }catch(e){client.close();client=null;notice('เชื่อมต่อไม่สำเร็จ',(e.message==='Not authorized'?'รหัสผ่านไม่ตรงกับ WISHLIST_KEY ของ deployment นี้ · คัดลอกจากช่อง Value ไม่ใช่ชื่อ Property':e.message)+' · รายการยังอยู่เฉพาะเครื่อง');}
  finally{connecting=false;controls();render();updateImport();}
}
$('#sync-key').addEventListener('invalid',()=>notice('ยังไม่ได้ส่งรหัสผ่าน','กรุณาใส่ค่าจากช่อง Value ของ WISHLIST_KEY ให้ครบอย่างน้อย 32 ตัวอักษร'));
$('#sync-form').addEventListener('submit',e=>{e.preventDefault();connect()});
$('#refresh-button').addEventListener('click',refresh);
$('#disconnect-button').addEventListener('click',()=>{
  if(busy||connecting)return;
  client?.close();client=null;cloud=null;draft=null;sessionSave('fukuoka-key','');$('#sync-key').value='';
  notice('บันทึกบนเครื่องนี้','ยังไม่ได้ซิงก์ · เชื่อมต่อ Google Sheets เพื่อใช้รายการร่วมกัน');controls();render();updateImport();
});
$('#import-button').addEventListener('click',async()=>{
  if(!client||busy||connecting||!confirm('นำรายการในเครื่องนี้เข้า Google Sheets? สำเนาเดิมจะเก็บไว้ และ ID เดิมจะไม่ถูกเพิ่มซ้ำ'))return;
  const items=localEntries(), ledger=read('fukuoka-imported-ids-v1')||{}, endpoint=client.endpoint;
  const imported=ledger[endpoint]||[];
  for(const x of items){
    if(imported.includes(x.id))continue;
    if(!await mutate({action:'add',id:x.id,type:x.type,text:x.text,author:x.author||'Chai',category:x.category||'other',day:x.day||'any',done:!!x.done}))return;
    imported.push(x.id);ledger[endpoint]=imported;
    try{localStorage.setItem('fukuoka-imported-ids-v1',JSON.stringify(ledger));}catch{}
  }
  const marker=read(MIGRATED_KEY)||{};marker[client.endpoint]=true;
  try{localStorage.setItem(MIGRATED_KEY,JSON.stringify(marker));}catch{}
  updateImport();$('#form-message').textContent='นำเข้าครบแล้ว · เก็บสำเนาเดิมในเครื่องไว้';
});
window.addEventListener('online',refresh);
window.addEventListener('offline',()=>notice('ออฟไลน์','แสดงรายการล่าสุด · ยังไม่สามารถยืนยันการบันทึกได้'));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
setInterval(()=>{if(!document.hidden)refresh()},20000);
if(draft?.data){$('#entry-text').value=draft.data.text;$('#entry-author').value=draft.data.author;$('#entry-category').value=draft.data.category;$('#entry-day').value=draft.data.day;document.querySelector('[name="type"][value="'+draft.data.type+'"]').checked=true;}
controls();render();
if($('#sync-key').value)connect();
