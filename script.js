'use strict';
// v2 แยกจากข้อมูลแผนรถไฟเก่า เพื่อไม่ให้สถานะกิจกรรมเดิมไปติ๊กแทนรายการใหม่
const STORAGE_KEY = 'our-fukuoka-trip-2026-v2';
let storageAvailable = true;
let state = { selectedDay: 17, plan: 'aso', done: {} };
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && typeof saved === 'object') {
    if (DAYS.some(day => day.date === saved.selectedDay)) state.selectedDay = saved.selectedDay;
    if (saved.plan === 'aso' || saved.plan === 'backup') state.plan = saved.plan;
    if (saved.done && typeof saved.done === 'object' && !Array.isArray(saved.done)) {
      state.done = Object.fromEntries(Object.entries(saved.done).filter(([, value]) => value === true));
    }
  }
} catch { storageAvailable = false; }
const $ = selector => document.querySelector(selector);
function element(tag, className, text) {
  const node = document.createElement(tag); node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function updateStorageStatus() {
  $('#storage-status').textContent = storageAvailable
    ? 'เช็กลิสต์บันทึกเฉพาะในเบราว์เซอร์นี้'
    : 'อ่านหรือบันทึกข้อมูลเดิมไม่ได้ สถานะอยู่เฉพาะรอบนี้จนกว่าจะบันทึกสำเร็จ';
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; }
  updateStorageStatus();
}
function mapUrl(poi) {
  return POIS[poi][3] || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(POIS[poi][1])}`;
}
function routeUrl(origin, destination, mode = 'transit', waypoints = []) {
  const params = new URLSearchParams({api: '1', origin: POIS[origin][1], destination: POIS[destination][1], travelmode: mode});
  if (mode === 'driving' && waypoints.length) params.set('waypoints', waypoints.map(poi => POIS[poi][1]).join('|'));
  return `https://www.google.com/maps/dir/?${params}`;
}
function link(text, url, className = 'map-link') {
  const node = element('a', className, text); node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
}
function currentStops(date = state.selectedDay) {
  return date === 20 ? ASO_PLANS[state.plan].stops : DAYS.find(day => day.date === date).stops;
}
function taskKey(date, item) { return `day-${date}-${item.id}`; }
function updateDayProgress() {
  const stops = currentStops();
  const count = stops.filter(item => state.done[taskKey(state.selectedDay, item)]).length;
  $('#day-progress').textContent = `เก็บความทรงจำแล้ว ${count} / ${stops.length} กิจกรรม`;
}
function renderDays() {
  DAYS.forEach(day => {
    const button = element('button', 'day-button'); button.type = 'button'; button.dataset.date = day.date;
    button.setAttribute('aria-label', `${day.weekday} ${day.date} ธันวาคม 2026 ${day.tag}`);
    button.append(element('span', '', day.weekday), element('strong', '', day.date), element('small', '', day.tag));
    button.addEventListener('click', () => { state.selectedDay = day.date; save(); renderDay(); });
    $('#day-picker').append(button);
  });
}
function renderTimeline(container, date, printable = false, stops = currentStops(date)) {
  container.replaceChildren();
  stops.forEach(item => {
    const row = element('div', 'timeline-item');
    const content = element('div', 'timeline-content'); const top = element('div', 'timeline-top');
    if (printable) {
      top.append(element('strong', '', item.title));
    } else {
      const label = element('label', 'task-label'); const checkbox = element('input', ''); checkbox.type = 'checkbox';
      checkbox.checked = state.done[taskKey(date, item)] === true;
      checkbox.addEventListener('change', () => { state.done[taskKey(date, item)] = checkbox.checked; save(); updateDayProgress(); });
      label.append(checkbox, element('span', '', item.title)); top.append(label);
    }
    if (item.poi) top.append(link('หมุด ↗', mapUrl(item.poi)));
    else top.append(element('small', 'pending-pin', 'รอเส้นทางที่ยืนยัน'));
    content.append(top, element('p', '', item.description), element('span', 'transport', `↗ ${item.transport}`));
    if (item.status !== 'แผนร่าง') content.append(element('span', 'item-status', item.status));
    row.append(element('span', 'timeline-time', item.time), content); container.append(row);
  });
}
function renderDay() {
  const day = DAYS.find(item => item.date === state.selectedDay);
  document.querySelectorAll('.day-button').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.date) === day.date)));
  $('#day-kicker').textContent = `DAY ${day.date - 16} / ${day.weekday} ${day.date} ธันวาคม 2026`;
  $('#day-title').textContent = day.title; $('#day-description').textContent = day.description;
  $('#aso-controls').hidden = day.date !== 20;
  $('#plan-note').textContent = ASO_PLANS[state.plan].note;
  document.querySelectorAll('[data-plan]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.plan === state.plan)));
  // แผนสำรองไม่แนะนำเส้นทางภูเขาโดยอัตโนมัติ ต้องตรวจถนนก่อน
  const hideRoute = day.date === 20 && state.plan === 'backup';
  $('#day-route').hidden = hideRoute;
  if (hideRoute) $('#day-route').removeAttribute('href');
  else $('#day-route').href = routeUrl(day.origin, day.destination, day.mode, day.waypoints);
  $('#day-route').textContent = 'เส้นทางอ้างอิง ↗';
  $('#route-note').textContent = hideRoute ? 'แผนสำรองยังไม่กำหนดเส้นทางข้าม Aso ต้องตรวจถนนก่อนนำทาง' : `${day.routeLabel} · ${day.routeNote}`;
  $('#day-routes').replaceChildren();
  if (day.date === 19 || day.date === 21) $('#day-routes').append(link('Relax · จุดรับ–คืนที่ยืนยันแล้ว ↗', mapUrl('relax'), 'button'));
  if (day.date === 20 && !hideRoute) $('#day-routes').append(link('Monzenmachi → Beppu ↗', routeUrl('monzen', 'beppu', 'driving'), 'button'));
  if (day.date === 18) $('#day-routes').append(link('Mojiko → Hakata (เช็กรอบจริง) ↗', routeUrl('mojiko', 'hakata'), 'button'));
  if (day.date === 22) $('#day-routes').append(link('Dazaifu → Tosu (ตรวจบัส) ↗', routeUrl('dazaifu', 'tosu'), 'button'));
  renderTimeline($('#timeline'), day.date); updateDayProgress(); renderPrint();
}
function renderFilters() {
  ['ทั้งหมด', 'อาหาร', 'เนื้อ', 'กาแฟ', 'ที่พัก', 'ธรรมชาติ', 'ออนเซ็น', 'ช้อปปิ้ง', 'รถเช่า', 'สถานที่'].forEach(category => {
    const button = element('button', '', category); button.type = 'button'; button.dataset.category = category;
    button.addEventListener('click', () => renderPlaces(category)); $('#place-filters').append(button);
  });
}
function renderPlaces(category = 'ทั้งหมด') {
  $('#place-list').replaceChildren();
  Object.entries(POIS).filter(([, poi]) => category === 'ทั้งหมด' || poi[2] === category).forEach(([id, poi]) => {
    const card = element('article', 'place-card');
    card.append(element('span', 'eyebrow', poi[2]), element('h3', '', poi[0]), element('p', '', PLACE_NOTES[id] || 'หมุดคำค้นจากแผน · ตรวจตำแหน่ง เวลาเปิด และการเดินทางจริงก่อนออก'), link('เปิดใน Google Maps ↗', mapUrl(id), ''));
    $('#place-list').append(card);
  });
  document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
}
function renderStays() {
  STAYS.forEach(stay => {
    const card = element('article', 'place-card');
    card.append(element('span', 'eyebrow', stay.nights), element('h3', '', POIS[stay.poi][0]), element('span', 'stay-status', stay.status), element('p', '', stay.text), link('เปิดหมุด / ย่านใน Google Maps ↗', mapUrl(stay.poi), ''));
    $('#stay-list').append(card);
  });
}
function updateBookingProgress() {
  const count = BOOKINGS.filter(item => state.done[`booking-${item.id}`]).length;
  $('#booking-progress').textContent = `งานค้างที่ทำเพิ่มแล้ว ${count} / ${BOOKINGS.length}`;
  $('#booking-bar').style.width = `${count / BOOKINGS.length * 100}%`;
}
function renderBookings() {
  $('#booking-list').replaceChildren();
  BOOKINGS.forEach(item => {
    const label = element('label', 'booking-item'); const checkbox = element('input', ''); checkbox.type = 'checkbox';
    checkbox.checked = state.done[`booking-${item.id}`] === true;
    checkbox.addEventListener('change', () => { state.done[`booking-${item.id}`] = checkbox.checked; save(); updateBookingProgress(); });
    const text = element('span', ''); text.append(element('strong', '', item.title), element('small', '', item.note));
    label.append(checkbox, text); $('#booking-list').append(label);
  });
  updateBookingProgress();
}
function renderPrint() {
  const container = $('#print-plan'); container.replaceChildren();
  container.append(element('h1', '', 'Fukuoka / Kyushu · 17–23 ธ.ค. 2026'), element('p', '', 'ผู้ใหญ่ 2 คน · สถานะตามสรุปผู้ใช้ ยังไม่ได้ตรวจ voucher / Gmail / ตารางจริง'));
  DAYS.forEach(day => {
    const section = element('article', 'print-day');
    section.append(element('h2', '', `${day.date} ธ.ค. · ${day.title}`), element('p', '', day.description));
    if (day.date !== 20 || state.plan !== 'backup') section.append(link(day.routeLabel, routeUrl(day.origin, day.destination, day.mode, day.waypoints)));
    section.append(element('p', 'route-note', day.date === 20 && state.plan === 'backup' ? 'งดเส้นทางอ้างอิงภูเขา ต้องตรวจถนนก่อน' : day.routeNote));
    if (day.date === 19 || day.date === 21) section.append(link('Relax · จุดรับ–คืนรถที่ผู้ใช้ยืนยัน', mapUrl('relax')));
    if (day.date === 20) {
      section.append(element('p', '', `แผนที่เลือก: ${state.plan === 'aso' ? 'Aso' : 'สำรอง งดเดินเขา'} · ${ASO_PLANS[state.plan].note}`));
      section.append(element('p', '', 'Takachiho Gorge ยังรอตัดสินใจ หากใส่กลับต้องลดกิจกรรม Aso · Umi Jigoku รอจัดเวลา อยู่ Beppu คนละที่กับ Monzenmachi'));
    }
    const timeline = element('div', 'timeline'); renderTimeline(timeline, day.date, true); section.append(timeline); container.append(section);
  });
  const stays = element('article', 'print-stays'); stays.append(element('h2', '', 'ที่พักและสถานะ'));
  STAYS.forEach(stay => stays.append(element('p', '', `${stay.nights} · ${POIS[stay.poi][0]} · ${stay.status} · ${stay.text}`)));
  container.append(stays);
  const pending = element('article', 'print-pending'); pending.append(element('h2', '', 'งานค้างที่ต้องตรวจ / ตัดสินใจ'));
  BOOKINGS.forEach(item => pending.append(element('p', '', `${state.done[`booking-${item.id}`] ? '☑' : '☐'} ${item.title} — ${item.note}`)));
  pending.append(element('p', '', 'ทำแล้วตามผู้ใช้แจ้ง: มี eSIM, ยื่นขอใบขับขี่สากล, กรอก Guest Information Beppu · ยืนยันการรับเล่ม IDP แยกอีกครั้ง'));
  container.append(pending);
}
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => { state.plan = button.dataset.plan; save(); renderDay(); }));
$('#print-trip').addEventListener('click', () => { renderPrint(); window.print(); });
window.addEventListener('beforeprint', renderPrint);
$('#reset-checklist').addEventListener('click', () => {
  if (!window.confirm('ล้างเฉพาะเครื่องหมายที่ติ๊กในเว็บนี้? สถานะจองจากสรุปและข้อมูล eSIM/เอกสารจะไม่เปลี่ยน')) return;
  state.done = {}; save(); renderDay(); renderBookings();
});
renderDays(); renderDay(); renderFilters(); renderPlaces(); renderStays(); renderBookings(); updateStorageStatus();
