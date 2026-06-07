# e-commerce

## Deployment

Proyek ini bisa dijalankan secara lokal dengan:

```powershell
c:/python314/python.exe app.py
```

Untuk online deployment, gunakan Render:

1. Push repository ke GitHub.
2. Buat Web Service baru di Render dan hubungkan ke repo ini.
3. Render akan membaca `render.yaml` atau gunakan:
	- Build Command: `pip install -r requirements.txt`
	- Start Command: `gunicorn app:app`

GitHub Pages hanya menampilkan [index.html](index.html) statis di root repository. Aplikasi Flask penuh harus dijalankan lewat hosting backend seperti Render.
