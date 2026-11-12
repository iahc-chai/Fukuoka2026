/** Private properties: SHEET_ID, WISHLIST_KEY (32+ random characters).
 * Public property PARENT_ORIGIN defaults to the production GitHub Pages origin.
 * Deploy execute-as-owner / Anyone. No keys or mutations accepted in URLs.
 */
const TAB_NAME = 'Wishlist';
const HEADERS = ['ID','Type','Item','Added by','Category','Trip day','Done','Created at','Updated at'];
function sheet_() {
  const props = PropertiesService.getScriptProperties();
  const sheet = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheetByName(TAB_NAME);
  if (!sheet || JSON.stringify(sheet.getRange(1,1,1,9).getValues()[0]) !== JSON.stringify(HEADERS)) {
    throw new Error('Wishlist headers do not match; no data changed');
  }
  return sheet;
}
function doGet(e) {
  const bridgeId = String(e && e.parameter && e.parameter.bridge || '');
  if (!/^[a-f0-9]{64}$/.test(bridgeId)) return HtmlService.createHtmlOutput('Open the Wishlist homepage to connect.');
  const template = HtmlService.createTemplate(`<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
'use strict';
const bridgeId = <?!= JSON.stringify(bridgeId) ?>;
const parentOrigin = <?!= JSON.stringify(parentOrigin).replace(/</g, '\\\\u003c') ?>;
window.addEventListener('message', event => {
  if (event.source !== window.top || event.origin !== parentOrigin) return;
  const data = event.data;
  if (!data || data.channel !== 'fukuoka-sync' || data.bridgeId !== bridgeId || typeof data.requestId !== 'string') return;
  const reply = result => window.top.postMessage({channel:'fukuoka-sync',bridgeId,requestId:data.requestId,result}, parentOrigin);
  google.script.run.withSuccessHandler(reply).withFailureHandler(()=>reply({ok:false,error:'Google service unavailable'})).api(data.payload);
});
window.top.postMessage({channel:'fukuoka-sync',bridgeId,ready:true}, parentOrigin);
</script></body></html>
`);
  template.bridgeId = bridgeId;
  template.parentOrigin = PropertiesService.getScriptProperties().getProperty('PARENT_ORIGIN') || 'https://iahc-chai.github.io';
  return template.evaluate().setTitle('Fukuoka sync').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doPost() { return ContentService.createTextOutput('Use the HTML-service bridge.'); }
function list_(sheet) {
  const last = sheet.getLastRow();
  return last < 2 ? [] : sheet.getRange(2,1,last-1,9).getValues().filter(r=>r[0]).map(r=>({
    id:String(r[0]),type:r[1],text:String(r[2]),author:r[3],category:r[4],day:String(r[5]),
    done:r[6]===true || String(r[6])==='true',createdAt:String(r[7]),updatedAt:String(r[8])
  }));
}
function text_(value) {
  // Sheets interprets a leading '=' as a formula. An apostrophe preserves literal input.
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
function api(p) {
  const secret = PropertiesService.getScriptProperties().getProperty('WISHLIST_KEY');
  if (!secret || secret.length < 32 || !p || p.key !== secret) return {ok:false,error:'Not authorized'};
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = sheet_();
    if (p.action === 'list') return {ok:true,items:list_(sheet)};
    if (!['add','done','delete'].includes(p.action)) throw new Error('Unknown action');
    if (typeof p.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(p.id)) throw new Error('Invalid ID');
    const items = list_(sheet), index = items.findIndex(x=>x.id===p.id), now = new Date().toISOString();
    if (p.action === 'add' && index < 0) {
      if (typeof p.text !== 'string' || !p.text.trim() || p.text.length > 300 ||
          !['wish','reminder'].includes(p.type) || !['Chai','Care'].includes(p.author) ||
          !['food','shop','places','other'].includes(p.category) ||
          !['any','17','18','19','20','21','22','23'].includes(String(p.day))) throw new Error('Invalid item');
      sheet.appendRow([p.id,p.type,text_(p.text.trim()),p.author,p.category,String(p.day),p.done===true,now,now]);
    } else if (p.action === 'done') {
      if (index < 0 || typeof p.done !== 'boolean') throw new Error('Item no longer exists or invalid status');
      // Find physical row by ID, including when the sheet contains blank rows.
      const row = sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext().getRow();
      sheet.getRange(row,7).setValue(p.done); sheet.getRange(row,9).setValue(now);
    } else if (p.action === 'delete' && index >= 0) {
      const row = sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(p.id).matchEntireCell(true).findNext().getRow();
      sheet.deleteRow(row);
    }
    SpreadsheetApp.flush();
    return {ok:true,items:list_(sheet)};
  } catch (err) { return {ok:false,error:String(err.message || 'Operation failed')}; }
  finally { if (lock.hasLock()) lock.releaseLock(); }
}

// Run manually in the Apps Script editor. The trailing underscore prevents
// calls through google.script.run. Never log or return the generated secret.
function setupWishlistKey_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('WISHLIST_KEY')) {
      const key = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
      props.setProperty('WISHLIST_KEY', key);
    }
  } finally {
    lock.releaseLock();
  }
}

// Editor entry point: reject anonymous or non-owner web-app RPC callers.
function setupWishlistKey() {
  const active = Session.getActiveUser().getEmail();
  const owner = Session.getEffectiveUser().getEmail();
  if (!active || active !== owner) {
    throw new Error('Run this from the Apps Script editor as the project owner.');
  }
  setupWishlistKey_();
}
