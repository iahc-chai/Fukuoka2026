'use strict';
// A deployment URL is public configuration. Never put an access key here.
const WISHLIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw0r9vG2TxDOKVyDjRnmAL2Nrde8IZXJraqxd0q705X52uj_WaUJJIs2QxOgsHclR3IHw/exec';
class WishlistSync {
  constructor(endpoint, key) { this.endpoint=endpoint; this.key=key; this.pending=new Map(); }
  static nonce() { return Array.from(crypto.getRandomValues(new Uint8Array(32)), x=>x.toString(16).padStart(2,'0')).join(''); }
  async connect() {
    const url = new URL(this.endpoint);
    if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname) || url.search || url.hash) throw new Error('ต้องใช้ Apps Script production /exec URL');
    this.bridgeId=WishlistSync.nonce();
    this.listener=event=>{
      const d=event.data;
      if (!d || d.channel!=='fukuoka-sync' || d.bridgeId!==this.bridgeId ||
          !/^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(event.origin)) return;
      if (d.ready && !this.source) { this.source=event.source;this.origin=event.origin;this.onReady(); }
      if(event.source!==this.source || event.origin!==this.origin)return;
      const task=this.pending.get(d.requestId);
      if(task){this.pending.delete(d.requestId);clearTimeout(task.timer);d.result&&d.result.ok?task.resolve(d.result):task.reject(new Error(d.result?.error||'Invalid server reply'));}
    };
    window.addEventListener('message',this.listener);
    const ready=new Promise((resolve,reject)=>{this.onReady=resolve;this.readyTimer=setTimeout(()=>reject(new Error('เปิดบริการ Google ไม่สำเร็จภายใน 20 วินาที (G01) · ยังไม่ได้ตรวจรหัสผ่าน')),20000)});
    this.frame=document.createElement('iframe');this.frame.hidden=true;this.frame.title='Google Sheets sync';
    url.searchParams.set('bridge',this.bridgeId);this.frame.src=url.href;document.body.append(this.frame);
    try {await ready;} finally {clearTimeout(this.readyTimer);}
  }
  request(payload) {
    if(!navigator.onLine)return Promise.reject(new Error('ออฟไลน์ · ยังไม่ได้บันทึก กรุณาลองอีกครั้ง'));
    if(!this.source)return Promise.reject(new Error('ยังไม่เชื่อมต่อ Google Sheets'));
    const requestId=WishlistSync.nonce();
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(requestId);reject(new Error('หมดเวลารอ · อาจบันทึกแล้ว กด Sync หรือลองซ้ำด้วยรายการเดิม'));},20000);
      this.pending.set(requestId,{resolve,reject,timer});
      this.source.postMessage({channel:'fukuoka-sync',bridgeId:this.bridgeId,requestId,payload:{...payload,key:this.key}},this.origin);
    });
  }
  close() {
    window.removeEventListener('message',this.listener);clearTimeout(this.readyTimer);this.frame?.remove();
    for(const task of this.pending.values()){clearTimeout(task.timer);task.reject(new Error('Disconnected'));}this.pending.clear();
  }
}
