# ทาง B — VPS ฟรี + เปิดด้วย IP (ไม่ต้องมีโดเมน)

## ขั้นที่ 1 — สมัคร VPS ฟรี

แนะนำ **Oracle Cloud Always Free**:

1. https://www.oracle.com/cloud/free/
2. สร้าง VM: Ubuntu 22.04, shape **Ampere** (ARM) ฟรี
3. เปิดพอร์ต **80** ใน Security List / Firewall ของ Oracle (Ingress rule TCP 80)
4. จด **Public IP** ของเครื่อง

---

## ขั้นที่ 2 — อัปโหลดโปรเจกต

**Windows (PowerShell):**

```powershell
scp -r "d:\Only work\code for lern\LMIT--main" ubuntu@IP_VPS:~/lmit
```

แทน `ubuntu` ด้วน user ของ VPS, แทน `IP_VPS` ด้วย IP จริง

---

## ขั้นที่ 3 — SSH เข้า VPS แล้วรัน

```bash
ssh ubuntu@IP_VPS
cd ~/lmit
chmod +x deploy-vps.sh
nano .env
```

แก้ใน `.env`:

```env
ADMIN_EMAIL=admin@lab.com
ADMIN_PASSWORD=รหัสที่จำได้
JWT_SECRET=ตัวอักษรยาวสุ่มอย่างน้อย32ตัว
REACT_APP_BACKEND_URL=
HTTP_PORT=80
CORS_ORIGINS=http://IP_VPS
```

(แทน `IP_VPS` ด้วย IP จริง)

```bash
./deploy-vps.sh
```

---

## ขั้นที่ 4 — เปิดเว็บ

- เว็บ: `http://IP_VPS`
- แอดมิน: `http://IP_VPS/admin/login`

---

## คำสั่งหลัง deploy

```bash
docker compose ps
docker compose logs -f api
docker compose up -d --build    # อัปเดตโค้ดใหม่
```

---

## ปัญหาที่เจอบ่อย

| อาการ | แก้ |
|--------|-----|
| เปิด IP ไม่ได้ | เปิดพอร์ต 80 ใน Oracle Security List + `sudo ufw allow 80` |
| Permission denied docker | `sudo usermod -aG docker $USER` แล้ว logout/login |
| หน้าว่าง | `docker compose logs web` |

โดเมนซื้อทีหลังได้ — ชี้ A record มา IP เดิมแล้วใส่ใน `CORS_ORIGINS`
