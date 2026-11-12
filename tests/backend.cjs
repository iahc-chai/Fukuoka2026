const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
function backend(){
 const rows=[['ID','Type','Item','Added by','Category','Trip day','Done','Created at','Updated at']];
 const sheet={getLastRow:()=>rows.length,getRange:(r,c,n=1,m=1)=>({
  getValues:()=>rows.slice(r-1,r-1+n).map(row=>row.slice(c-1,c-1+m)),
  setValue:v=>{rows[r-1][c-1]=v},createTextFinder:id=>({matchEntireCell(){return this},findNext:()=>{const i=rows.findIndex((row,i)=>i>=r-1&&row[c-1]===id);return i<0?null:{getRow:()=>i+1}}})
 }),appendRow:r=>rows.push(r),deleteRow:r=>rows.splice(r-1,1)};
 const secret='test-only-credential-00000000000000000000';let held=false;
 const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:k=>({SHEET_ID:'mock',WISHLIST_KEY:secret})[k]})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush(){}},LockService:{getScriptLock:()=>({waitLock(){held=true},hasLock:()=>held,releaseLock(){held=false}})}});
 vm.runInContext(fs.readFileSync('google-sheets-sync/Code.gs','utf8'),ctx);
 return {rows,secret,request:p=>JSON.parse(JSON.stringify(ctx.api({...p,key:p.key===undefined?secret:p.key})))};
}
if(require.main===module){const b=backend(),add={action:'add',id:'test-1',type:'wish',text:'กินน้ำปั่น 7-Eleven',author:'Care',category:'food',day:'any',done:false};
 assert.equal(b.request({...add,key:'wrong'}).ok,false);assert.equal(b.rows.length,1);
 assert.equal(b.request(add).items.length,1);assert.equal(b.request(add).items.length,1);
 assert.equal(b.request({action:'done',id:'test-1',done:true}).items[0].done,true);
 assert.equal(b.request({action:'done',id:'test-1',done:'false'}).ok,false);
 assert.equal(b.request({...add,id:'reminder',type:'reminder',day:'21',text:'ตรวจสัมภาระก่อนคืนรถ Relax'}).items[1].day,'21');
 assert.equal(b.request({...add,id:'bad',day:'24'}).ok,false);
 assert.equal(b.request({...add,id:'formula',text:'=IMPORTXML("https://example.com")'}).ok,true);assert.ok(b.rows.at(-1)[2].startsWith("'="));
 b.request({action:'delete',id:'test-1'});assert.equal(b.request({action:'delete',id:'test-1'}).ok,true);
 b.rows[0][0]='wrong';assert.equal(b.request(add).ok,false);
 console.log('Backend: authentication, add retry, explicit status, reminder date, validation, formula safety, delete retry, headers PASS');}
module.exports=backend;
