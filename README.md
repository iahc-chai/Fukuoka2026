# Fukuoka / Kyushu · 17–23 ธันวาคม 2026

เว็บแผนทริปผู้ใหญ่ 2 คน · Hakata → Kurume → Kumamoto → Aso → Beppu → Tenjin

## เปิดเว็บทริป

**[Fukuoka Trip Planner บน GitHub Pages](https://iahc-chai.github.io/Fukuoka2026/)**

เว็บหลักเผยแพร่จาก `main / (root)` ใช้ลิงก์นี้บนมือถือได้เลย ไม่ต้องรัน localhost

เลือกวัน 17–23 ธ.ค. แล้วดูแผนที่ Google Maps ในหน้าเว็บ เลือกหมุดเพื่อดูทีละสถานที่ของวันนั้น และใช้ปุ่มเส้นทางอ้างอิงเพื่อเปิดการเดินทางใน Google Maps แผนที่ต้องใช้อินเทอร์เน็ต หากโหลดไม่ได้ยังเปิดลิงก์หมุดภายนอกได้

Shin Shin ramen อยู่ในรายการอยากไปและแผนมื้อเย็น 22 ธ.ค. ที่ Tenjin Honten หลังกลับจาก Tosu ดู [ข้อมูลสาขาจากร้าน](https://www.hakata-shinshin.com/tenpo_tenjin) และ [หมุด Google Maps](https://www.google.com/maps/search/?api=1&query=ShinShin+Tenjin+Honten+Fukuoka) โดยตรวจวันเปิดและคิวอีกครั้งใกล้เดินทาง

### เปิดแผนและแผนที่รายวัน

| วัน | แผนและแผนที่ในเว็บ |
|---|---|
| 17 ธ.ค. | [สนามบิน / Hakata / Nanzoin](https://iahc-chai.github.io/Fukuoka2026/?day=17#itinerary) |
| 18 ธ.ค. | [Kokura / Karato / Outlet / Mojiko](https://iahc-chai.github.io/Fukuoka2026/?day=18#itinerary) |
| 19 ธ.ค. | [Relax / Fruitelier / Kumamoto](https://iahc-chai.github.io/Fukuoka2026/?day=19#itinerary) |
| 20 ธ.ค. | [Aso / Akaushi / Beppu](https://iahc-chai.github.io/Fukuoka2026/?day=20#itinerary) |
| 21 ธ.ค. | [คืนรถ / LaLaport / Momochi / Tenjin](https://iahc-chai.github.io/Fukuoka2026/?day=21#itinerary) |
| 22 ธ.ค. | [Dazaifu / Tosu / Shin Shin](https://iahc-chai.github.io/Fukuoka2026/?day=22#itinerary) |
| 23 ธ.ค. | [THE KNOT / สนามบิน](https://iahc-chai.github.io/Fukuoka2026/?day=23#itinerary) |

## แนวดีไซน์

ใช้ Halloran เป็นแนวทางด้านภาพสำหรับ Fukuoka: พื้นเทาอุ่น #F2F1EE, ตัวอักษร #16181A, ส้มอิฐ #C2410C, เส้นแบ่งบาง และตัวอักษรอย่างน้อย 14px ไม่มีเงาการ์ดหรือ gradient ข้อมูลและแบรนด์เป็นทริป Fukuoka

เส้นทาง SVG แสดงลำดับเมือง เมื่อเลื่อนมาถึงจะวาดครั้งเดียวใน 1.8 วินาทีพร้อมตัวนับ 0 ถึง 7 วัน ไม่แสดงระยะทางที่ยังไม่ได้ตรวจ หากลดการเคลื่อนไหว เส้นทางและตัวเลขสุดท้ายจะแสดงทันที แผนที่ Google Maps รายวันยังใช้สำหรับดูสถานที่จริงแยกจากแผนภาพเส้นทาง

ภาพ `assets/kyushu-winter.png` เป็นภาพบรรยากาศที่สร้างขึ้นสำหรับเว็บ ไม่ใช่ภาพจากทริปจริงหรือการพยากรณ์อากาศ โค้ดยังใช้ HTML/CSS/JavaScript ธรรมดา

## สำหรับแก้เว็บในเครื่อง (ทางเลือก)

```bash
python3 -m http.server 8000
```

เปิด http://localhost:8000 ในเครื่องที่รันคำสั่ง หากเป็นคลาวด์ให้ใช้ port forwarding ของเครื่องมือ

- `index.html` — หน้าเว็บ
- `style.css` — รูปแบบมือถือ/เดสก์ท็อป และการพิมพ์
- `trip.js` — แผนรายวัน หมุด ที่พัก และงานค้าง
- `script.js` — เลือกวัน แผนที่รายวัน/เลือกหมุด กรองสถานที่ เช็กลิสต์ แผน Aso และปุ่มพิมพ์/รีเซ็ต

ไม่ต้องติดตั้งแพ็กเกจ สถานะบันทึกใน localStorage ของเบราว์เซอร์และ origin เดียวกัน ไม่ซิงก์ข้ามเครื่องหรือข้าม origin (localhost กับ Pages บันทึกแยกกัน) สถานะ v2 แยกจากแผนเก่า ไม่ยกเครื่องหมายติ๊กเก่ามาใช้กับการจองใหม่ การรีเซ็ตล้างเฉพาะสิ่งที่ติ๊กในเว็บ ไม่เปลี่ยนสถานะจองจากสรุปผู้ใช้

## แหล่งข้อมูลและสถานะ

อ้างอิงสรุปล่าสุดที่ผู้ใช้ส่งมาใน session นี้ ยังไม่ได้ตรวจ Gmail ตั๋ว voucher รอบรถไฟ ราคา หรือเวลาเปิดแบบสด ข้อมูลเที่ยวบินแสดงเป็นรอตรวจ ไม่ใช่เวลายืนยัน ไม่มีการซื้อตั๋ว จองโรงแรม หรือส่งอีเมลในงานนี้

- รถ Relax: 19 ธ.ค. 12:00 → 21 ธ.ค. 12:00 รอตรวจ voucher และยางฤดูหนาว ไม่ใช้ราคา/ประกัน/ETC ของ HM แทน
- [หมุด Relax รับ–คืนรถที่ผู้ใช้ยืนยัน](https://maps.app.goo.gl/7bySW1826KqPGumC8?g_st=ic) · 19 ธ.ค. 12:00 → 21 ธ.ค. 12:00 เปิดลิงก์นี้แล้วกดนำทางใน Google Maps เส้นทางรวมวันรับ/คืนรถในเว็บใช้ Hakata เป็นเพียงภาพรวม ไม่ใช่พิกัด Relax
- Aso วันที่ 20: เดินหนึ่งยอดเมื่อเหมาะสม ไม่มี Nakadake ปรับตามอากาศ ถนน และประกาศทางเดิน แผนสำรองยังต้องยืนยันเส้นทางปลอดภัย
- Takachiho Gorge: ยังรอตัดสินใจ ไม่ถือว่าผู้ใช้ยกเลิก หากใส่กลับต้องลดกิจกรรม Aso และจัดวันใหม่
- Umi Jigoku: รอจัดเวลา ไม่ใช่ Aso Monzenmachi และอาจต้องเลือกระหว่างบ่อกับออนเซ็น
- Yufuin: เก็บไว้รอบหน้าด้วยรถไฟ ไม่ใส่ปราสาท Kumamoto หรือ Kagoshima ในแผนนี้
- eSIM มีแล้ว / ยื่นขอ IDP แล้ว / กรอก Guest Information Beppu แล้ว ตามผู้ใช้แจ้ง รอยืนยันการรับเล่ม IDP

## ที่พัก

| คืน | ที่พัก / ย่าน | สถานะตามสรุป |
|---|---|---|
| 17–19 ธ.ค. · 2 คืน | EN HOTEL Hakata | รอตรวจชื่อ · มีข้อมูลวันเข้าพักตามสรุป แต่ชื่อ EN HOTEL Hakata ต้องเทียบอีเมลอีกครั้ง |
| 19–20 ธ.ค. · 1 คืน | Sakuramachi / Karashimacho | ยังไม่จอง · 1 ห้อง ผู้ใหญ่ 2 คน พร้อมที่จอดรถ เล็ง Sakuramachi / Karashimacho ลิงก์เป็นย่าน ไม่ใช่โรงแรมที่จองแล้ว |
| 20–21 ธ.ค. · 1 คืน | Prime Room Beppu Root | ตามสรุปมีจอง · Prime Room Beppu Root · Standard House ที่จอดรถฟรีและกรอกข้อมูลผู้เข้าพักแล้วตามผู้ใช้แจ้ง ยังไม่ได้ตรวจ voucher ใน session นี้ |
| 21–23 ธ.ค. · 2 คืน | THE KNOT FUKUOKA Tenjin | ตามสรุปชำระแล้ว · Superior Small Double · ต้องการห้องไม่สูบบุหรี่ คำขอส่งสำเร็จ/โรงแรมตอบรับหรือยัง ต้องตรวจ Gmail |

## Google Maps ทุกหมุด

ยกเว้น Relax ที่ใช้ลิงก์ตรงจากผู้ใช้ ลิงก์อื่นค้นชื่อสถานที่ ไม่ใช่ Place ID ที่ตรวจยืนยันแล้ว ให้ตรวจชื่อ ตำแหน่ง และเวลาเปิดใน Maps ก่อนนำทาง บางหมุดเป็นย่านหรือจุดทางเลือกที่ยังไม่เข้าตาราง

| หมวด | สถานที่ | ลิงก์ Google Maps |
|---|---|---|
| รถเช่า | Relax · รับและคืนรถ | [เปิดหมุดที่ผู้ใช้ยืนยัน](https://maps.app.goo.gl/7bySW1826KqPGumC8?g_st=ic) |
| สถานที่ | Fukuoka Airport · International | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Fukuoka%20Airport%20International%20Terminal) |
| สถานที่ | Hakata Station | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Hakata%20Station%20Fukuoka) |
| ที่พัก | EN HOTEL Hakata | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=EN%20HOTEL%20Hakata%20Fukuoka) |
| สถานที่ | Nanzoin | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Nanzoin%20Sasaguri%20Fukuoka) |
| สถานที่ | Hakata Christmas Market | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Hakata%20Station%20Christmas%20Market) |
| อาหาร | Shin Shin · Tenjin Honten | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=ShinShin+Tenjin+Honten+Fukuoka) |
| อาหาร | Nakasu yatai | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Nakasu%20Yatai%20Fukuoka) |
| สถานที่ | Kokura Station | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Kokura%20Station%20Kitakyushu) |
| สถานที่ | Shimonoseki Station | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Shimonoseki%20Station%20Yamaguchi) |
| อาหาร | Karato Market | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Karato%20Market%20Shimonoseki) |
| ช้อปปิ้ง | THE OUTLETS KITAKYUSHU | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=THE%20OUTLETS%20KITAKYUSHU) |
| สถานที่ | Mojiko Retro | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Mojiko%20Retro%20Kitakyushu) |
| อาหาร | Fruitelier Nakamura Orchard | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Fruitelier%20Nakamura%20Orchard%20Kurume) |
| สถานที่ | Sakuramachi / Karashimacho | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Sakuramachi%20Kumamoto) |
| อาหาร | Shimotori Shopping Arcade | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Shimotori%20Shopping%20Arcade%20Kumamoto) |
| ธรรมชาติ | Kusasenri | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Kusasenri%20Aso%20Kumamoto) |
| ธรรมชาติ | Kishimadake | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Kishimadake%20Aso%20Kumamoto) |
| กาแฟ | Kusasenri Coffee Roastery | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Kusasenri%20Coffee%20Roastery%20Aso) |
| เนื้อ | Aso Hanabishi · Akaushi | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Aso%20Hanabishi%20Miyaji%20Kumamoto) |
| สถานที่ | Aso Monzenmachi | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Aso%20Monzenmachi%20Aso%20Shrine%20Miyaji) |
| กาแฟ | The 24 Club | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=The%2024%20Club%20Aso%20Miyaji) |
| ธรรมชาติ | Daikanbo | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Daikanbo%20Aso%20Kumamoto) |
| ที่พัก | Prime Room Beppu Root | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Prime%20Room%20Beppu%20Root%20Beppu) |
| ออนเซ็น | Hyotan Onsen | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Hyotan%20Onsen%20Beppu) |
| ออนเซ็น | Umi Jigoku | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Umi%20Jigoku%20Beppu) |
| ธรรมชาติ | Takachiho Gorge | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Takachiho%20Gorge%20Miyazaki) |
| ช้อปปิ้ง | LaLaport Fukuoka | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Mitsui%20Shopping%20Park%20LaLaport%20Fukuoka) |
| สถานที่ | Momochi / Fukuoka Tower | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Fukuoka%20Tower%20Momochi%20Fukuoka) |
| ที่พัก | THE KNOT FUKUOKA Tenjin | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=THE%20KNOT%20FUKUOKA%20Tenjin) |
| สถานที่ | Tenjin Christmas Market | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Tenjin%20Christmas%20Market%20Fukuoka) |
| สถานที่ | Dazaifu Tenmangu | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Dazaifu%20Tenmangu) |
| กาแฟ | Starbucks Dazaifu | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Starbucks%20Dazaifu%20Tenmangu%20Omotesando) |
| ช้อปปิ้ง | Tosu Premium Outlets | [เปิดแผนที่](https://www.google.com/maps/search/?api=1&query=Tosu%20Premium%20Outlets%20Saga) |

## เผยแพร่ GitHub Pages

เว็บหลัก: **https://iahc-chai.github.io/Fukuoka2026/**

Repository เป็น Public และเปิด Pages แล้ว ใช้ Deploy from a branch → `main` → `/(root)` ไฟล์ HTML/CSS/JavaScript อยู่ที่ root ไม่ต้องติดตั้งแพ็กเกจหรือรัน build

หลังอัปโหลดการแก้ไขไป `main` ให้ตรวจ [Actions](https://github.com/iahc-chai/Fukuoka2026/actions) ว่า Pages build และ deploy ผ่าน แล้วรีเฟรชเว็บหลัก

### แก้เว็บครั้งถัดไป

```bash
git diff
git add index.html style.css trip.js script.js README.md .nojekyll assets/
git commit -m "Update Fukuoka trip plan"
git push origin main
```

## การตรวจที่ทำแล้ว

รุ่นดีไซน์ Halloran: ตรวจการวาดเส้นทางและตัวนับเมื่อเลื่อนมาถึง, โหมดลดการเคลื่อนไหวทั้งก่อนโหลดและขณะทำงาน, ปุ่มเปิดแผนตามวันที่เลือกบนมือถือ, ตัวอักษรขั้นต่ำ 14px และคู่สีข้อความที่ใช้บนพื้นหลักทั้งหมดอย่างน้อย 4.5:1 ตรวจฟังก์ชันด้วย DOM และ syntax; ยังไม่ได้ตรวจภาพหน้าจอจริงของดีไซน์รุ่นใหม่นี้

รุ่นแผนที่รายวัน: ตรวจ DOM และการกดเลือกครบ 7 วัน/ทุกหมุด, ลิงก์ Relax ต้นฉบับ, สลับแผน Aso แล้วหมุดเปลี่ยนตาม, Shin Shin วันที่ 22, ลิงก์เปิดวันโดยตรง, สถานะเช็กลิสต์หลังโหลดใหม่ และพิมพ์ครบทั้งทริป การตรวจชุดนี้ไม่ได้ทดสอบการเรนเดอร์เนื้อหาจาก Google Maps ภายใน iframe จึงมีลิงก์เปิด Maps โดยตรงสำรองไว้

ก่อนปรับดีไซน์: ตรวจ JavaScript syntax และใช้งานจริงด้วย Chromium เลือกครบ 7 วัน, ลิงก์ Maps, ที่พัก 4 จุด, งานค้าง 10 รายการ, แผน Aso/สำรองและการแยกเช็กลิสต์, localStorage หลัง reload/ข้อมูลเสีย/ถูกบล็อก, reset ยืนยันและยกเลิก, พิมพ์ครบทั้งทริป ไม่มีเนื้อหาล้นที่ความกว้าง 375/390/768/1440 และไม่มี JavaScript error ตรวจภาพหน้าจอมือถือและเดสก์ท็อปของรุ่นก่อนแล้ว ไม่ได้ตรวจเวลาเดินทางหรือเวลาเปิดของสถานที่จริง

ไม่มีเลขจอง PIN พาสปอร์ต หรือ QR ตั๋วในโค้ด ฟอนต์ Google Fonts ต้องใช้อินเทอร์เน็ต ถ้าโหลดไม่ได้ใช้ฟอนต์ระบบ ส่วนการเลือกวันและเช็กลิสต์ทำงานฝั่งเบราว์เซอร์
