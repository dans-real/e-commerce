# Amazon Hybrid Recommender

Cara menjalankan secara lokal:

1. Pasang dependensi:

```powershell
cd "d:\Programming\Text Mining\e_commerce"
c:/python314/python.exe -m pip install -r requirements.txt
```

2. Jalankan development server (Windows):

```powershell
c:/python314/python.exe app.py
# buka http://127.0.0.1:5000
```

3. Untuk deployment (Render / Railway / Heroku):

- Pastikan `wsgi.py` dan `Procfile` ada.
- Gunakan command start `gunicorn wsgi:application --workers 2 --bind 0.0.0.0:$PORT`.
- Tambahkan `gunicorn` ke `requirements.txt` (sudah ditambahkan).

Catatan:
- Di Windows, `gunicorn` tidak direkomendasikan; gunakan `waitress` atau jalankan melalui hosting Linux.
- GitHub Pages hanya melayani file statis; untuk demo interaktif, deploy Flask ke Render/Railway.
# e-commerce
