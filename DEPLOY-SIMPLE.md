# Deploy แบบง่ายสุด

## ทาง A — ไม่มี VPS ไม่มีโดเมน (ฟรี, เร็วสุด)

เหมาะโชว์อาจารย์ / ทด production ชั่วคราว (เปิดเครื่องค้างไว้)

```powershell
cd "d:\Only work\code for lern\LMIT--main"
.\deploy.ps1
winget install Cloudflare.cloudflared
.\expose-online.ps1
```

จะได้ลิงก์ `https://xxxx.trycloudflare.com` ส่งลิงก์นี้ให้คนอื่นเปิดได้

---

## ทาง B — Production จริง (ฟรี VPS, ไม่ต้องซื้อโดเมน)

ใช้ **Oracle Cloud Free** หรือ VPS ราคาถูก → เปิดด้วย **IP** อย่างเดียว

### บน VPS (Linux) — 4 คำสั่ง

```bash
curl -fsSL https://get.docker.com | sh
cd lmit
cp .env.example .env && nano .env
```

ใน `.env` ตั้ง `HTTP_PORT=80` และรหัส admin / JWT

```bash
docker compose up -d --build
sudo ufw allow 80 && sudo ufw enable
```

เปิดเบราว์เซอร์: `http://IP_ของ_VPS`  
แอดมิน: `http://IP_ของ_VPS/admin/login`

---

## แก้ `.env` ขั้นต่ำ

| ตัวแปร | ใส่อะไร |
|--------|---------|
| `ADMIN_EMAIL` | อีเมล เช่น `admin@lab.com` |
| `ADMIN_PASSWORD` | รหัสแอดมิน |
| `JWT_SECRET` | ตัวอักษรยาวสุ่ม |
| `REACT_APP_BACKEND_URL` | **ว่าง** |
| `HTTP_PORT` | `8080` (PC) หรือ `80` (VPS) |

โดเมนซื้อทีหลังได้ — ไม่จำเป็นตอนเริ่ม
