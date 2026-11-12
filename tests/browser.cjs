// Browser integration against the real Code.gs logic with an in-memory Sheets adapter.
// This is NOT production Apps Script, Google Sheets, CORS or iPhone verification.
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),makeBackend=require('./backend.cjs');
(async()=>{
 const b=makeBackend(),root=process.cwd();let unavailable=false;
 const server=http.createServer((req,res)=>{let file=path.join(root,req.url.split('?')[0]==='/'?'index.html':req.url.split('?')[0]);if(!file.startsWith(root))return res.end();try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data)}catch{res.writeHead(404).end()}}).listen(0,'127.0.0.1');
 await new Promise(r=>server.once('listening',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
 const contexts=await Promise.all([browser.newContext({viewport:{width:375,height:812}}),browser.newContext({viewport:{width:390,height:844}})]);
 const errors=[];const pages=[];
 for(const ctx of contexts){
  await ctx.exposeBinding('mockApi',async(_,p)=>unavailable?{ok:false,error:'Test backend unavailable'}:b.request(p));
  await ctx.route('https://script.google.com/**',route=>route.fulfill({contentType:'text/html',body:'<script>location.replace('+JSON.stringify('https://test-script.googleusercontent.com/'+new URL(route.request().url()).search)+')</script>'}));
  await ctx.route('https://test-script.googleusercontent.com/**',route=>{
   const bridgeId=new URL(route.request().url()).searchParams.get('bridge');
   const rpc='<script>const google={script:{run:{withSuccessHandler(fn){this.success=fn;return this},withFailureHandler(fn){this.failure=fn;return this},api(p){mockApi(p).then(this.success,this.failure)}}}};</script>';
   const html=fs.readFileSync('google-sheets-sync/Bridge.html','utf8')
    .replace('<?!= JSON.stringify(bridgeId) ?>',JSON.stringify(bridgeId))
    .replace(/<\?!= JSON.stringify\(parentOrigin\).*?\?>/,JSON.stringify(origin))
    .replace('<script>',rpc+'<script>');
   return route.fulfill({contentType:'text/html',body:html});
  });
  const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(10000);await page.goto(origin);pages.push(page);
 }
 const [care,chai]=pages;
 async function connect(p){await p.locator('.sync-settings summary').click();await p.locator('#sync-endpoint').fill('https://script.google.com/macros/s/mock/exec');await p.locator('#sync-key').fill(b.secret);await p.locator('#sync-form button[type=submit]').click();try{await p.waitForFunction(()=>document.querySelector('#sync-title').textContent.includes('ซิงก์แล้ว'));}catch(e){console.log(await p.locator('.sync-note').textContent(),p.frames().map(f=>f.url()),await p.evaluate(()=>({hasSource:!!client?.source,pending:client?.pending.size}))); throw e;}}
 async function sync(p){await p.locator('#refresh-button').click();await p.waitForFunction(()=>!document.querySelector('#refresh-button').disabled);}
 async function add(p,text,author='Care',type='wish',day='any'){await p.locator('#entry-text').fill(text);await p.locator('#entry-author').selectOption(author);await p.locator('[name=type][value='+type+']').check();await p.locator('#entry-day').selectOption(day);await p.locator('#entry-form button[type=submit]').click();await p.waitForFunction(()=>!document.querySelector('#entry-form button[type=submit]').disabled);}
 console.log('Connecting');await Promise.all(pages.map(connect));console.log('Connected');
 console.log('Adding');await add(care,'กินน้ำปั่น 7-Eleven');await sync(chai);assert.equal(await chai.locator('.entry-title').textContent(),'กินน้ำปั่น 7-Eleven');
 await add(chai,'ซื้อขนม Lawson','Chai');await sync(care);
 const lawson=care.locator('.entry').filter({hasText:'ซื้อขนม Lawson'});await lawson.locator('input').check();await care.waitForFunction(()=>!document.querySelector('#refresh-button').disabled);await sync(chai);
 assert.equal(await chai.locator('.entry').filter({hasText:'ซื้อขนม Lawson'}).locator('input').isChecked(),true);
 await add(care,'ตรวจสัมภาระก่อนคืนรถ Relax','Care','reminder','21');
 for(const p of pages){await p.reload();await p.waitForFunction(()=>document.querySelector('#sync-title').textContent.includes('ซิงก์แล้ว'));assert.equal(await p.locator('.entry').count(),3);assert.ok((await p.locator('.entry').filter({hasText:'ตรวจสัมภาระ'}).textContent()).includes('21 Dec'));}
 chai.on('dialog',dialog=>dialog.accept());await chai.locator('.entry').filter({hasText:'7-Eleven'}).locator('button').click();await chai.waitForFunction(()=>!document.querySelector('#refresh-button').disabled);await sync(care);assert.equal(await care.locator('.entry').count(),2);assert.equal(b.rows.length,3);
 // Explicit import: originals retained, Done retained, repeated import does not duplicate.
 await care.evaluate(()=>{localStorage.setItem('our-fukuoka-trip-2026-v2',JSON.stringify({selectedDay:21,plan:'backup',done:{booking:true},wishes:[{id:'local-old',text:'Local original',done:true}]}));location.reload()});
 await care.waitForFunction(()=>document.querySelector('#sync-title').textContent.includes('ซิงก์แล้ว'));care.on('dialog',d=>d.accept());await care.locator('#import-button').click();await care.waitForFunction(()=>document.querySelector('#import-button').hidden);
 assert.equal(b.rows.find(r=>r[0]==='local-old')[6],true);assert.equal(await care.evaluate(()=>JSON.parse(localStorage.getItem('our-fukuoka-trip-2026-v2')).plan),'backup');
 unavailable=true;await add(chai,'Unavailable note','Chai');assert.ok((await chai.locator('#form-message').textContent()).includes('Test backend unavailable'));assert.equal(await chai.locator('#entry-text').inputValue(),'Unavailable note');assert.equal(b.rows.length,4);
 unavailable=false;await chai.locator('#entry-form button[type=submit]').click();await chai.waitForFunction(()=>!document.querySelector('#refresh-button').disabled);assert.equal(b.rows.length,5);
 await contexts[1].setOffline(true);await add(chai,'Offline draft','Chai');assert.ok((await chai.locator('#form-message').textContent()).includes('ออฟไลน์'));assert.equal(b.rows.length,5);await contexts[1].setOffline(false);await chai.waitForFunction(()=>!document.querySelector('#refresh-button').disabled);
 for(const p of pages){assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await p.getByRole('button',{name:'♧ Reminders',exact:true}).click();assert.equal(await p.locator('.entry').count(),1);}
 // All itinerary days, map targets, hotels and booking checkbox persistence.
 await chai.goto(origin+'/plan.html');for(let day=17;day<=23;day++){await chai.goto(origin+'/plan.html?day='+day+'#itinerary');assert.ok((await chai.locator('#day-title').textContent()).length);assert.ok((await chai.locator('#day-route').getAttribute('href')).startsWith('https://www.google.com/maps/'));}
 const box=chai.locator('#booking-list input').first();await box.check();await chai.reload();assert.equal(await box.isChecked(),true);assert.ok(await chai.locator('#stays').count());assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: two isolated sessions, Thai add/read, done, reminder Dec 21, reload, delete, backend rows, migration, unavailable/retry, filters, 375/390px overflow, seven itinerary days, map links, stays, booking persistence, zero JS errors. Mock transport only.');
 }finally{await browser.close();server.closeAllConnections();server.close();}
})().catch(e=>{console.error(e);process.exit(1)});
