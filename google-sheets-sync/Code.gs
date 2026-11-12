/**
 * Fukuoka Chai & Care — Google Sheets backend
 *
 * Settings > Script properties (DO NOT commit values to GitHub):
 *   SHEET_ID        = the Google spreadsheet ID
 *   WISHLIST_KEY    = a long random passphrase shared privately with the two travelers
 *
 * Deploy as a Web App: Execute as Me / Access: Anyone.
 * Only use this for low-sensitivity travel notes, not personal/financial data.
 * The access key is sent over HTTPS by the client; JSONP GET places it in the
 * request URL, so this is not a high-security authentication solution.
 */
const TAB_NAME = 'Wishlist';
const HEADERS = ['ID','Type','Item','Added by','Category','Trip day','Done','Created at','Updated at'];

function sheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('SHEET_ID property not configured');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(TAB_NAME);
  if (!sheet) throw new Error('Wishlist sheet not found');
  return sheet;
}

function allowed_(e) {
  const secret = PropertiesService.getScriptProperties().getProperty('WISHLIST_KEY');
  const supplied = String(e && e.parameter && e.parameter.key || '');
  return !!secret && secret.length >= 12 && supplied === secret;
}

function reply_(payload, callback) {
  const serialized = JSON.stringify(payload).replace(/</g, '\\u003c');
  const cb = String(callback || '');
  if (cb && /^[A-Za-z_$][A-Za-z0-9_$]{0,60}$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + serialized + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(serialized)
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const callback = e && e.parameter ? e.parameter.callback : '';
  if (!allowed_(e)) return reply_({ok:false,error:'Not authorized'},callback);
  try {
    const sheet = sheet_(), last = sheet.getLastRow();
    if (last < 2) return reply_({ok:true,items:[]},callback);
    const values = sheet.getRange(2,1,last-1,HEADERS.length).getValues();
    const items = values.filter(row=>String(row[0]).trim()).map(row=>({
      id:String(row[0]),type:row[1]==='reminder'?'reminder':'wish',
      text:String(row[2]),author:String(row[3]||'Chai'),
      category:String(row[4]||'other'),day:String(row[5]||'any'),
      done:row[6]===true||String(row[6]).toLowerCase()==='true',
      createdAt:String(row[7]||''),updatedAt:String(row[8]||'')
    }));
    return reply_({ok:true,items},callback);
  } catch (err) {
    return reply_({ok:false,error:'Failed to read sheet'},callback);
  }
}

function doPost(e) {
  if (!allowed_(e)) return reply_({ok:false,error:'Not authorized'});
  const p = e.parameter || {}, action=String(p.action||''), sheet=sheet_();
  const lock=LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const id=String(p.id||'').slice(0,100);
    const now=new Date().toISOString();
    if (action==='add') {
      const title=String(p.text||'').trim().slice(0,300);
      if (!title || !id || !/^[A-Za-z0-9_-]+$/.test(id)) return reply_({ok:false,error:'Invalid item'});
      const type=p.type==='reminder'?'reminder':'wish';
      const author=['Care','Chai'].includes(p.author)?p.author:'Chai';
      const category=['food','shop','places','other'].includes(p.category)?p.category:'other';
      const day=['any','17','18','19','20','21','22','23'].includes(String(p.day))?String(p.day):'any';
      const last=sheet.getLastRow();
      if(last>1&&sheet.getRange(2,1,last-1,1).createTextFinder(id).matchEntireCell(true).findNext())return reply_({ok:true,id,duplicate:true});
      sheet.appendRow([id,type,title,author,category,day,false,now,now]);
      return reply_({ok:true,id});
    }
    if (!id) return reply_({ok:false,error:'Missing ID'});
    const last=sheet.getLastRow();
    const found=last>1?sheet.getRange(2,1,last-1,1).createTextFinder(id).matchEntireCell(true).findNext():null;
    if (!found) return reply_({ok:false,error:'Not found'});
    const row=found.getRow();
    if (action==='done') {
      sheet.getRange(row,7).setValue(p.done==='true');
      sheet.getRange(row,9).setValue(now);
      return reply_({ok:true,id});
    }
    if (action==='delete') {
      sheet.deleteRow(row);
      return reply_({ok:true,id});
    }
    return reply_({ok:false,error:'Unknown action'});
  } catch (err) {
    return reply_({ok:false,error:'Operation failed'});
  } finally {
    try {lock.releaseLock();} catch (_) {}
  }
}
