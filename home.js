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
let store=load(), filter='all';
function entries() {
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
    check.addEventListener('change',()=>{setDone(x.id,x.type,check.checked);render()});
    const main=document.createElement('div');main.className='entry-main';
    const title=document.createElement('p');title.className='entry-title';title.textContent=x.text;
    const meta=document.createElement('div');meta.className='entry-meta';
    const tag=document.createElement('span');tag.className='tag'+(x.type==='reminder'?' reminder':'');tag.textContent=x.type==='reminder'?'♧ Reminder':'♡ Wishlist';meta.append(tag);
    for(const info of [x.author||'Chai',iconCategory(x.category)+' '+(x.category||'other'),x.day&&x.day!=='any'?x.day+' Dec':'Any day']){
      const span=document.createElement('span');span.textContent=info;meta.append(span);
    }
    main.append(title,meta);
    const rm=document.createElement('button');rm.className='entry-remove';rm.type='button';rm.setAttribute('aria-label','ลบ '+x.text);rm.textContent='×';
    rm.addEventListener('click',()=>{if(confirm('ลบรายการนี้?')){remove(x.id,x.type);render()}});
    li.append(check,main,rm);$('.entries').append(li);
  }
}
function setDone(id,type,done){
  if(type==='wish'){store.legacy.wishes=(store.legacy.wishes||[]).map(x=>x.id===id?{...x,done}:x)}
  else {store.extra.reminders=(store.extra.reminders||[]).map(x=>x.id===id?{...x,done}:x)}
  save();
}
function remove(id,type){
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
$('#entry-form').addEventListener('submit',event=>{
  event.preventDefault();
  const text=$('#entry-text').value.trim();
  if(!text)return;
  const type=document.querySelector('[name="type"]:checked').value;
  const author=$('#entry-author').value,category=$('#entry-category').value,day=$('#entry-day').value;
  const id='wish-'+(crypto&&crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random().toString(36).slice(2));
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
window.addEventListener('storage',ev=>{if(ev.key===LEGACY_KEY||ev.key===EXTRA_KEY){store=load();render()}});
render();
