// ข้อมูลสาธารณะจากสรุปผู้ใช้ล่าสุด ยังไม่ได้ตรวจตั๋ว อีเมล หรือ voucher ใน session นี้
// Google Maps ใช้คำค้นชื่อสถานที่ ไม่ใช่ Place ID ที่ตรวจยืนยันแล้ว
'use strict';
const POIS = {
  relax: ['Relax · จุดรับ–คืนรถ', null, 'รถเช่า', 'https://maps.app.goo.gl/7bySW1826KqPGumC8?g_st=ic'],
  airport: ['Fukuoka Airport · International', 'Fukuoka Airport International Terminal', 'สถานที่'],
  hakata: ['Hakata Station', 'Hakata Station Fukuoka', 'สถานที่'],
  en: ['EN HOTEL Hakata', 'EN HOTEL Hakata Fukuoka', 'ที่พัก'],
  nanzoin: ['Nanzoin', 'Nanzoin Sasaguri Fukuoka', 'สถานที่'],
  market: ['Hakata Christmas Market', 'Hakata Station Christmas Market', 'สถานที่'],
  yatai: ['Nakasu yatai', 'Nakasu Yatai Fukuoka', 'อาหาร'],
  shinshin: ['Shin Shin · Tenjin Honten', '博多らーめん ShinShin 天神本店 福岡市中央区天神3-2-19', 'อาหาร'],
  kokura: ['Kokura Station', 'Kokura Station Kitakyushu', 'สถานที่'],
  shimonoseki: ['Shimonoseki Station', 'Shimonoseki Station Yamaguchi', 'สถานที่'],
  karato: ['Karato Market', 'Karato Market Shimonoseki', 'อาหาร'],
  kitakyushu: ['THE OUTLETS KITAKYUSHU', 'THE OUTLETS KITAKYUSHU', 'ช้อปปิ้ง'],
  mojiko: ['Mojiko Retro', 'Mojiko Retro Kitakyushu', 'สถานที่'],
  orchard: ['Fruitelier Nakamura Orchard', 'Fruitelier Nakamura Orchard Kurume', 'อาหาร'],
  kumamoto: ['Sakuramachi / Karashimacho', 'Sakuramachi Kumamoto', 'สถานที่'],
  shimotori: ['Shimotori Shopping Arcade', 'Shimotori Shopping Arcade Kumamoto', 'อาหาร'],
  kusa: ['Kusasenri', 'Kusasenri Aso Kumamoto', 'ธรรมชาติ'],
  kishi: ['Kishimadake', 'Kishimadake Aso Kumamoto', 'ธรรมชาติ'],
  coffee: ['Kusasenri Coffee Roastery', 'Kusasenri Coffee Roastery Aso', 'กาแฟ'],
  hanabishi: ['Aso Hanabishi · Akaushi', 'Aso Hanabishi Miyaji Kumamoto', 'เนื้อ'],
  monzen: ['Aso Monzenmachi', 'Aso Monzenmachi Aso Shrine Miyaji', 'สถานที่'],
  club: ['The 24 Club', 'The 24 Club Aso Miyaji', 'กาแฟ'],
  daikanbo: ['Daikanbo', 'Daikanbo Aso Kumamoto', 'ธรรมชาติ'],
  beppu: ['Prime Room Beppu Root', 'Prime Room Beppu Root Beppu', 'ที่พัก'],
  hyotan: ['Hyotan Onsen', 'Hyotan Onsen Beppu', 'ออนเซ็น'],
  umi: ['Umi Jigoku', 'Umi Jigoku Beppu', 'ออนเซ็น'],
  takachiho: ['Takachiho Gorge', 'Takachiho Gorge Miyazaki', 'ธรรมชาติ'],
  lalaport: ['LaLaport Fukuoka', 'Mitsui Shopping Park LaLaport Fukuoka', 'ช้อปปิ้ง'],
  tower: ['Momochi / Fukuoka Tower', 'Fukuoka Tower Momochi Fukuoka', 'สถานที่'],
  knot: ['THE KNOT FUKUOKA Tenjin', 'THE KNOT FUKUOKA Tenjin', 'ที่พัก'],
  tenjin: ['Tenjin Christmas Market', 'Tenjin Christmas Market Fukuoka', 'สถานที่'],
  dazaifu: ['Dazaifu Tenmangu', 'Dazaifu Tenmangu', 'สถานที่'],
  starbucks: ['Starbucks Dazaifu', 'Starbucks Dazaifu Tenmangu Omotesando', 'กาแฟ'],
  tosu: ['Tosu Premium Outlets', 'Tosu Premium Outlets Saga', 'ช้อปปิ้ง']
};
const activity = (id, time, title, description, transport, poi = null, status = 'แผนร่าง') => ({ id, time, title, description, transport, poi, status });
const DAYS = [
  { date: 17, weekday: 'พฤหัส', tag: 'Hakata', title: 'สวัสดี Fukuoka · ฝากกระเป๋าแล้วค่อยเที่ยว', description: 'นอน Hakata · เวลาเที่ยวบินรอตรวจจากตั๋ว', mode: 'transit', origin: 'airport', destination: 'hakata', routeLabel: 'สนามบิน → Hakata', routeNote: 'รถรับส่ง International → Domestic ก่อนขึ้น Subway Airport Line', stops: [
    activity('arrival-v2', 'หลังลงเครื่อง', 'เข้าเมือง & ฝากกระเป๋าที่ Hakata', 'รอตรวจ: TG648 BKK 01:00 → FUK 08:10 เป็นข้อมูลจากร่าง ยังไม่ได้ตรวจตั๋ว ชื่อ EN HOTEL Hakata ต้องเทียบอีเมลอีกครั้ง', 'รถรับส่งไป Domestic → Subway → Hakata', 'en', 'รอตรวจ'),
    activity('nanzoin', 'ถ้ามีแรง', 'Nanzoin · ตัวเลือกหลังเดินทาง', 'ไปเฉพาะถ้าเวลาและพลังงานพอ ไม่จำเป็นต้องฝืนหลังเที่ยวบิน', 'JR Hakata → Kido-Nanzoin-mae → เดิน แล้วกลับเส้นเดิม', 'nanzoin', 'ตัวเลือก'),
    activity('hakata-market', 'เย็น', 'Hakata Christmas Market', 'เดินตลาดและชมไฟ รอตรวจกำหนดการและเวลาเปิดปี 2026', 'เดินบริเวณสถานี Hakata', 'market', 'รอตรวจ'),
    activity('yatai-v2', 'ค่ำ', 'ราเมนหรือยาตาอิตามสะดวก', 'เลือกร้านตามความหิวและคิว เตรียมเงินสดสำหรับร้านเล็ก', 'เดิน / รถไฟใต้ดิน', 'yatai')
  ] },
  { date: 18, weekday: 'ศุกร์', tag: 'Kitakyushu', title: 'Kokura · Karato · Outlet · Mojiko', description: 'นอน Hakata · ต้องกลับถึง Hakata ก่อน 20:00', mode: 'transit', origin: 'hakata', destination: 'kokura', routeLabel: 'Hakata → Kokura', routeNote: 'รอตรวจรอบและราคาตั๋ว Sanyo Shinkansen ไป–กลับ ผู้ใหญ่ 2 คน ยังไม่ได้ซื้อ และ Maps ไม่ใช่ตั๋วโดยสาร', stops: [
    activity('kokura-train', 'เช้า', 'Sanyo Shinkansen → Kokura', 'ยังไม่ซื้อตั๋ว ตรวจวันเปิดขาย ราคา และสิทธิ์เปลี่ยนเวลาจากประเภทตั๋วจริง อย่าเหมารวมว่า e-ticket สแกนประตูได้ บางสินค้าเป็น voucher ต้องแลกตั๋ว', 'Hakata → Kokura → JR ผ่าน Moji ไป Shimonoseki', 'kokura', 'รอตรวจ'),
    activity('karato', 'สาย', 'อาหารทะเลที่ Karato Market', 'วันศุกร์ 18 ธ.ค. ต้องตรวจเวลาเปิดและรูปแบบร้านของวันนั้น ก่อนจัดรอบเดินทาง', 'JR ไป Shimonoseki → บัสไป Karato', 'karato', 'รอตรวจ'),
    activity('outlet-kita', 'บ่าย', 'THE OUTLETS KITAKYUSHU', 'ตั้งเวลาออกจาก Outlet ล่วงหน้าเพื่อให้เหลือเวลา Mojiko และรถไฟกลับ', 'กลับด้วย JR → Space World → เดิน', 'kitakyushu'),
    activity('mojiko', 'แสงเย็น', 'Mojiko Retro', 'เผื่อเวลาเดินทางย้อนขึ้นไป Mojiko หากช้าให้ลดเวลาช้อป ไม่ลดเวลารถไฟกลับ', 'JR → Mojiko → เดิน', 'mojiko'),
    activity('return-hakata', 'ก่อน 20:00', 'กลับถึง Hakata', 'ต้องเลือกรอบจริงที่ถึงก่อน 20:00 พร้อมเผื่อเปลี่ยนขบวน ยังไม่ยืนยันเวลา ไม่มีการซื้อสำเร็จจาก WAUG', 'Mojiko → JR Kokura → Shinkansen Hakata', 'hakata', 'รอตรวจ')
  ] },
  { date: 19, weekday: 'เสาร์', tag: 'Kurume', title: 'รับรถ · สตรอว์เบอร์รี · Kumamoto', description: 'นอน Kumamoto · ยังต้องจองโรงแรมพร้อมที่จอดรถ', mode: 'driving', origin: 'hakata', destination: 'kumamoto', waypoints: ['orchard'], routeLabel: 'Hakata → ฟาร์ม → Kumamoto', routeNote: 'เส้นทางรวมนี้เริ่ม Hakata เพื่อดูภาพรวม เปิดหมุด Relax ที่ผู้ใช้ยืนยันแยกด้านล่างสำหรับจุดรับรถจริง', stops: [
    activity('relax-pickup', '12:00', 'เช็กเอาต์ & รับรถ Relax', 'ช่วงเช่า 19 ธ.ค. 12:00 → 21 ธ.ค. 12:00 รอตรวจ voucher รถ รุ่น ประกัน ETC ยางฤดูหนาว และค่าจ่ายเพิ่ม ห้ามนำเงื่อนไข HM มาปน', 'เปิดหมุด Relax ที่ผู้ใช้ยืนยัน', 'relax', 'รอตรวจ voucher'),
    activity('strawberry', 'เป้า 14:00', 'Fruitelier Nakamura Orchard', 'ยังไม่จองรอบ โบรชัวร์ระบุเริ่มฤดู 19 ธ.ค. 2026 ราคา ¥2,400 / 50 นาที รอตรวจรอบว่าง ราคา และเงื่อนไขจริงสำหรับ 2 คน', 'ขับรถไป Kurume เผื่อเวลารับรถ', 'orchard', 'ยังไม่จอง'),
    activity('kumamoto-hotel', 'เย็น', 'เช็กอิน Kumamoto', 'หา 1 ห้อง ผู้ใหญ่ 2 คน คืน 19–20 ธ.ค. มีที่จอดรถ เล็ง Sakuramachi / Karashimacho', 'Kurume → Kumamoto', 'kumamoto', 'ยังไม่จอง'),
    activity('shimotori', 'ค่ำ', 'เดิน Sakuramachi / Shimotori', 'หามื้อเย็นในเมือง ไม่ใส่ปราสาท Kumamoto ในทริปนี้', 'เดินจากโรงแรมตามตำแหน่งจริง', 'shimotori')
  ] },
  { date: 20, weekday: 'อาทิตย์', tag: 'Aso → Beppu', title: 'ภูเขา กาแฟ เนื้ออากะ แล้วไป Beppu', description: 'นอน Prime Room Beppu Root · ไม่ใส่ปากปล่อง Nakadake', mode: 'driving', origin: 'kumamoto', destination: 'hanabishi', waypoints: ['kusa'], routeLabel: 'Kumamoto → Kusasenri → Akaushi', routeNote: 'เป็นแผนขับรถอ้างอิง ไม่ใช่เส้นทางเดินเขา ช่วง Aso → Beppu เปิดได้จากลิงก์แยกด้านล่าง', stops: [] },
  { date: 21, weekday: 'จันทร์', tag: 'Fukuoka', title: 'คืนรถก่อนเที่ยง · LaLaport · ทะเลยามเย็น', description: 'นอน THE KNOT FUKUOKA Tenjin · ไม่แวะ Yufuin เช้านี้', mode: 'driving', origin: 'beppu', destination: 'hakata', routeLabel: 'Beppu → ย่าน Hakata (อ้างอิง)', routeNote: 'เส้นทางรวมเป็นภาพอ้างอิงถึง Hakata ให้เปิดหมุด Relax ที่ผู้ใช้ยืนยันแยกด้านล่างแล้วกดนำทางไปจุดคืนรถจริง เผื่อเติมน้ำมันก่อน 12:00', stops: [
    activity('leave-beppu', '07:00–07:30', 'ออกจาก Beppu กลับ Fukuoka', 'ตั้งเป้าถึงสาขา Relax 11:00–11:30 เผื่อเติมน้ำมันและการจราจร ถนนจริงอาจใช้เวลามากกว่าที่ Maps ประเมิน', 'ขับรถกลับ · เปิดหมุด Relax ที่ยืนยันแล้ว', 'relax', 'รอตรวจ voucher'),
    activity('relax-return', 'ก่อน 12:00', 'คืนรถ Relax', 'ยืนยันจุดคืนและเงื่อนไขจาก voucher ก่อน ไม่แวะ Yufuin เพื่อรักษาเวลาคืนรถ', 'คืนรถตามหมุด Relax แล้วใช้ขนส่งสาธารณะ / แท็กซี่', 'relax', 'รอตรวจ voucher'),
    activity('lalaport', 'บ่าย', 'LaLaport Fukuoka', 'ปรับเวลาตามการคืนรถและฝากกระเป๋า', 'JR Hakata → Takeshita → เดิน หรือแท็กซี่', 'lalaport'),
    activity('momochi', 'ก่อนตะวันตก', 'Momochi Seaside / Fukuoka Tower', 'เช็กเวลาพระอาทิตย์ตกจริงและเวลาเดินทาง ไม่ล็อก 17:30 เป็นเวลาถึง ถ้าเวลาน้อยให้ลด LaLaport', 'Subway Airport Line → Nishijin → เดิน / แท็กซี่', 'tower', 'รอตรวจ'),
    activity('knot-checkin', 'เย็น–ค่ำ', 'เช็กอิน THE KNOT & มื้อเย็น Tenjin', 'ตามสรุปมี voucher ชำระแล้ว คำขอห้องไม่สูบบุหรี่ยังไม่มีหลักฐานส่งสำเร็จหรือโรงแรมตอบรับ ตรวจ Gmail ก่อนสรุป ตลาดคริสต์มาสไปถ้าเปิด', 'ไป Tenjin ด้วยรถไฟใต้ดิน / แท็กซี่', 'knot', 'รอตรวจคำขอ')
  ] },
  { date: 22, weekday: 'อังคาร', tag: 'Dazaifu / Tosu', title: 'Dazaifu ตอนเช้า · Tosu ตอนบ่าย', description: 'นอน THE KNOT · คืนสุดท้ายเตรียมกระเป๋า', mode: 'transit', origin: 'knot', destination: 'dazaifu', routeLabel: 'Tenjin → Dazaifu', routeNote: 'ตรวจรอบบัส Outlet ไป–กลับก่อนเริ่มช้อป แผนวันนี้ไม่มีรถเช่า', stops: [
    activity('dazaifu-v2', 'เช้า', 'Dazaifu Tenmangu', 'เดินศาลเจ้าและถนนหน้าศาลเจ้า หาของกินตามสะดวก', 'Nishitetsu Fukuoka (Tenjin) → Futsukaichi → สาย Dazaifu', 'dazaifu'),
    activity('dazaifu-coffee', 'สาย', 'กาแฟแถว Dazaifu', 'Starbucks Dazaifu เป็นตัวเลือกในย่าน ตรวจเวลาเปิดและคิวจริง', 'เดินถนนหน้าศาลเจ้า', 'starbucks', 'ตัวเลือก'),
    activity('tosu', 'เที่ยง–บ่าย', 'Tosu Premium Outlets', 'เส้นทางจากร่าง: กลับ Futsukaichi → Nishitetsu Ogori → บัส Outlet ต้องตรวจว่ามีบริการและรอบตรงวันที่ไป', 'Nishitetsu + บัส · รอบจริงรอตรวจ', 'tosu', 'รอตรวจ'),
    activity('shinshin-dinner', 'เย็น', 'Shin Shin ramen · มื้อเย็น Tenjin', 'ร้านที่อยากไป เล็งสาขา Tenjin Honten หลังกลับจาก Tosu ตรวจเวลาเปิดและคิวใกล้วันเดินทาง แล้วกลับโรงแรมจัดกระเป๋า', 'บัส + รถไฟกลับ Tenjin → เดินไปสาขา Tenjin Honten', 'shinshin', 'อยากไป')
  ] },
  { date: 23, weekday: 'พุธ', tag: 'BKK', title: 'กลับกรุงเทพฯ พร้อมความทรงจำ', description: 'เวลาเที่ยวบินต้องตรวจตั๋วจริงก่อนใช้', mode: 'driving', origin: 'knot', destination: 'airport', routeLabel: 'THE KNOT → International Terminal', routeNote: 'ลิงก์เส้นทางถนนสำหรับแท็กซี่ ไม่ใช่การจองรถหรือการรับรองเวลาเดินทาง', stops: [
    activity('checkout-v2', 'เช้า', 'เช็กเอาต์ & ไปสนามบิน', 'แท็กซี่ไป Fukuoka Airport International Terminal โดยตรงสะดวกเมื่อมีกระเป๋า เผื่อเวลาเช็กอินระหว่างประเทศตามคำแนะนำสายการบิน', 'แท็กซี่ หรือขนส่งสาธารณะตามเวลาจริง', 'airport'),
    activity('flight-home', 'รอตรวจตั๋ว', 'FUK → BKK', 'ร่างระบุ TG649 FUK 11:40 → BKK 15:40 ยังไม่ได้ตรวจตั๋วหรือ Gmail ใน session นี้ ห้ามใช้เวลานี้เป็นเวลายืนยัน', 'เที่ยวบินระหว่างประเทศ', 'airport', 'รอตรวจ')
  ] }
];
const ASO_PLANS = {
  aso: {
    note: 'เลือกเดินเพียงหนึ่งยอดเมื่อเหมาะสม ตรวจอากาศ ถนน น้ำแข็ง ทางเดิน และประกาศพื้นที่ก่อนออก ยางฤดูหนาวต้องยืนยันกับ Relax; Snow chains เป็นโซ่ ไม่ใช่ยางฤดูหนาว หากไม่ปลอดภัยให้สลับแผนสำรอง',
    stops: [
      activity('aso-leave', 'ประมาณ 07:30', 'ออก Kumamoto → Kusasenri', 'เช็กอากาศ ถนน และการเปิดพื้นที่ก่อนออก ปรับหรือยกเลิกกิจกรรมภูเขาตามคำแนะนำเจ้าหน้าที่', 'ขับรถ · รอยืนยันยางฤดูหนาว', 'kusa', 'รอตรวจ'),
      activity('aso-hike', 'เช้า', 'Kusasenri / Kishimadake', 'เดินธรรมชาติหรือหนึ่งยอดเท่านั้นเมื่อสภาพเหมาะ ไม่ล็อกหลายยอด และไม่รวมปากปล่อง Nakadake หมุด Maps ไม่ใช่เส้นทางเดินเขา', 'เดินตามเส้นทางที่เปิดและเหมาะกับอุปกรณ์', 'kishi', 'ตามอากาศ'),
      activity('aso-coffee', 'หลังเดิน', 'Kusasenri Coffee Roastery', 'พักกาแฟและเช็กเวลาที่เหลือก่อนมื้อเที่ยง', 'ขับรถ / เดินตามจุดจอด', 'coffee'),
      activity('akaushi', 'เที่ยง', 'Aso Hanabishi · ข้าวหน้าเนื้ออากะ', 'มื้อที่ต้องกิน อยู่ย่าน Miyaji / Monzenmachi รอตรวจวันเปิด เวลา ราคา และคิว', 'ขับไป Miyaji', 'hanabishi', 'รอตรวจ'),
      activity('monzen', 'หลังอาหาร', 'Aso Monzenmachi · ประมาณ 1 ชั่วโมง', 'เดินร้านค้าและดูบ่อน้ำ The 24 Club เป็นกาแฟสำรอง ที่นี่อยู่ Aso คนละที่กับ Umi Jigoku ใน Beppu', 'เดินในย่าน Monzenmachi', 'monzen'),
      activity('daikanbo', 'ถ้าทัน', 'Daikanbo · ชมวิว', 'ตัดได้ถ้าช้าหรืออากาศไม่เหมาะ เพื่อให้เหลือเวลาไป Beppu', 'ขับรถตามสภาพถนนจริง', 'daikanbo', 'ตัวเลือก'),
      activity('to-beppu', 'ประมาณ 15:00+', 'ออกไป Beppu & เช็กอิน', 'ปรับเวลาออกตามสภาพจริง ที่พัก Prime Room Beppu Root มีที่จอดฟรีตามที่ผู้ใช้แจ้ง กรอก guest registration แล้ว', 'ขับรถ → Prime Room Beppu Root', 'beppu'),
      activity('hyotan', 'เย็น–ค่ำ', 'ออนเซ็น & มื้อเย็น', 'Hyotan Onsen เป็นตัวเลือก ยังไม่จองห้องส่วนตัว ถ้าถึงช้าอาจต้องเลือกระหว่าง Umi Jigoku กับออนเซ็น', 'ขับรถ / แท็กซี่ใน Beppu', 'hyotan', 'ตัวเลือก')
    ]
  },
  backup: {
    note: 'แผนสำรองเสนอ: งดเดินเขาและจุดสูง เปลี่ยนเป็นกิจกรรมที่เข้าถึงได้เมื่อถนนปลอดภัย หากเส้นทางข้ามไป Beppu มีหิมะ/ปิดถนน ต้องประเมินเส้นทางใหม่จากข้อมูลจริง ไม่ถือว่า Maps รับรองความปลอดภัย',
    stops: [
      activity('backup-road', 'ก่อนออก', 'ตรวจถนนแล้วตัดสินใจเส้นทาง', 'งดเดินเขาและ Daikanbo ตรวจอากาศ ประกาศถนน และปรึกษาผู้ให้เช่าก่อนเดินทาง ถ้าข้าม Aso ไม่ได้ ต้องปรับแผนใหม่', 'ยังไม่ล็อกเส้นทางในอากาศรุนแรง', null, 'รอตรวจ'),
      activity('backup-akaushi', 'กลางวัน', 'Akaushi / Monzenmachi ถ้าเข้าถึงได้', 'คงมื้อ Aso Hanabishi เฉพาะเมื่อร้านเปิดและถนนปลอดภัย หากเข้า Aso ไม่ได้ให้เลื่อนมื้อ ไม่ฝืนขับเพื่อร้านอาหาร', 'ขับรถตามเส้นทางที่ตรวจแล้ว', 'hanabishi', 'ตามอากาศ'),
      activity('backup-beppu', 'บ่าย', 'ไป Beppu เร็วขึ้น ถ้าเส้นทางเปิด', 'เช็กอินหรือฝากกระเป๋าตามเงื่อนไขที่พัก แล้วเลือกกิจกรรมในเมือง', 'ขับรถ · ยืนยันเส้นทางก่อน', 'beppu', 'ตามอากาศ'),
      activity('backup-onsen', 'เย็น', 'Hyotan Onsen & มื้อเย็น', 'ตรวจเวลาเปิดและห้องส่วนตัวก่อนเข้า ยังไม่จอง ไม่เพิ่ม Umi Jigoku โดยถือว่าไปทันแน่นอน', 'รถในเมือง / แท็กซี่', 'hyotan', 'ตัวเลือก')
    ]
  }
};
const STAYS = [
  { poi: 'en', nights: '17–19 ธ.ค. · 2 คืน', status: 'รอตรวจชื่อ', text: 'มีข้อมูลวันเข้าพักตามสรุป แต่ชื่อ EN HOTEL Hakata ต้องเทียบอีเมลอีกครั้ง' },
  { poi: 'kumamoto', nights: '19–20 ธ.ค. · 1 คืน', status: 'ยังไม่จอง', text: '1 ห้อง ผู้ใหญ่ 2 คน พร้อมที่จอดรถ เล็ง Sakuramachi / Karashimacho ลิงก์เป็นย่าน ไม่ใช่โรงแรมที่จองแล้ว' },
  { poi: 'beppu', nights: '20–21 ธ.ค. · 1 คืน', status: 'ตามสรุปมีจอง', text: 'Prime Room Beppu Root · Standard House ที่จอดรถฟรีและกรอกข้อมูลผู้เข้าพักแล้วตามผู้ใช้แจ้ง ยังไม่ได้ตรวจ voucher ใน session นี้' },
  { poi: 'knot', nights: '21–23 ธ.ค. · 2 คืน', status: 'ตามสรุปชำระแล้ว', text: 'Superior Small Double · ต้องการห้องไม่สูบบุหรี่ คำขอส่งสำเร็จ/โรงแรมตอบรับหรือยัง ต้องตรวจ Gmail' }
];
const BOOKINGS = [
  { id: 'kokura-v2', title: 'ซื้อตั๋ว Hakata–Kokura ไปกลับ 18 ธ.ค. · 2 คน', note: 'ถึง Hakata ก่อน 20:00 · ตรวจรอบ ราคา วันขาย การเปลี่ยนเวลา และวิธีรับตั๋ว' },
  { id: 'kumamoto-v2', title: 'จอง Kumamoto 19–20 ธ.ค. พร้อมที่จอดรถ', note: '1 ห้อง ผู้ใหญ่ 2 คน · ย่าน Sakuramachi / Karashimacho' },
  { id: 'orchard-v2', title: 'จอง / ยืนยันฟาร์ม 19 ธ.ค. เป้า 14:00', note: 'Fruitelier · ราคา ¥2,400 / 50 นาทีมาจากโบรชัวร์ รอตรวจรอบจริง' },
  { id: 'relax-v2', title: 'ตรวจ voucher Relax และยางฤดูหนาว', note: 'รถ รุ่น ประกัน ETC ค่าเพิ่ม จุดรับ–คืน · ไม่ใช้เงื่อนไข HM' },
  { id: 'idp-receive-v2', title: 'ตรวจว่าได้รับเล่มใบขับขี่สากลแล้วหรือยัง', note: 'ยื่นขอแล้วตามผู้ใช้แจ้ง แต่ยังไม่ทราบสถานะรับเล่ม' },
  { id: 'knot-email-v2', title: 'ตรวจ Gmail เรื่องห้องไม่สูบบุหรี่ THE KNOT', note: 'ยังไม่มีหลักฐานว่าส่งคำขอสำเร็จหรือโรงแรมตอบรับ ไม่ส่งซ้ำอัตโนมัติ' },
  { id: 'takachiho-v2', title: 'ตัดสินใจ Takachiho เทียบกับเวลาเดิน Aso', note: 'ยังไม่ถือว่ายกเลิก ถ้าใส่กลับต้องลดกิจกรรมและจัดวันที่ 20 ใหม่' },
  { id: 'umi-v2', title: 'จัดเวลา Umi Jigoku หากยังต้องการ', note: 'ไม่ใช่ Aso Monzenmachi · ต้องดูเวลาถึง Beppu และเวลาเปิดจริง' },
  { id: 'weather-v2', title: 'ตรวจอากาศ ถนน ทางเดิน ร้าน และตลาดปี 2026', note: 'ใกล้เดินทางและก่อนออก Aso · เช็กบัส Outlet และเวลาแสงเย็นด้วย' },
  { id: 'flight-v2', title: 'ตรวจเที่ยวบินและชื่อโรงแรม Hakata จากตั๋ว/อีเมล', note: 'TG648/TG649 และเวลาจากร่างยังไม่ได้ยืนยันใน session นี้' }
];
const PLACE_NOTES = {
  shinshin: 'อยากไป · วางไว้เย็น 22 ธ.ค. หลังกลับจาก Tosu สาขา Tenjin Honten ที่อยู่ตามเว็บร้าน Tenjin 3-2-19 ตรวจเวลาเปิดและคิวอีกครั้งก่อนเดินทาง',
  relax: 'หมุดรับ–คืนที่ผู้ใช้ยืนยัน · 19 ธ.ค. 12:00 → 21 ธ.ค. 12:00 ส่วนรุ่นรถ ประกัน ยางฤดูหนาว ETC และค่าเพิ่มยังรอตรวจ voucher',
  takachiho: 'รอตัดสินใจ · ผู้ใช้ยังไม่ได้ยกเลิก หากใส่กลับต้องจัดวัน Aso ใหม่',
  umi: 'รอจัดเวลา · อยู่ Beppu ไม่ใช่ Aso Monzenmachi อาจต้องเลือกระหว่างบ่อกับออนเซ็น',
  beppu: 'ตามสรุปมีจอง · ผู้ใช้แจ้งจอดรถฟรีและลงทะเบียนแล้ว',
  knot: 'ตามสรุปชำระแล้ว · คำขอห้องไม่สูบบุหรี่รอตรวจ Gmail',
  en: 'รอตรวจชื่อจากอีเมล · มีข้อมูลเข้าพัก 17–19 ธ.ค.',
  orchard: 'ยังไม่จอง · เป้ารอบ 19 ธ.ค. 14:00 ราคาและรอบจริงรอตรวจ',
  hanabishi: 'มื้อต้องกิน · Akaushi ย่าน Miyaji / Monzenmachi รอตรวจเวลาเปิด',
  kishi: 'เดินหนึ่งยอดเฉพาะเมื่อสภาพเหมาะ · หมุดนี้ไม่ใช่แผนเส้นทางเดินเขา',
  hyotan: 'ตัวเลือกออนเซ็น · ห้องส่วนตัวยังไม่จอง',
  kumamoto: 'ย่านสำหรับหาโรงแรมพร้อมที่จอดรถ · ยังไม่เลือกที่พัก',
  market: 'รอตรวจกำหนดการตลาดปี 2026', tenjin: 'รอตรวจกำหนดการตลาดปี 2026'
};
