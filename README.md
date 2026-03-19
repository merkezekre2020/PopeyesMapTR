# PopeyesMapTR

Türkiye'deki tüm Popeyes şubelerini Leaflet tabanlı interaktif haritada gösteren React uygulaması.

480 gerçek şube verisi, [popeyes.com.tr](https://www.popeyes.com.tr) API'sinden alınmaktadır.

## Ekran Görüntüsü

Haritada Türkiye genelinde 73 ildeki tüm Popeyes şubeleri gösterilir. Sidebar'dan arama, şehir filtreleme ve şube detaylarına ulaşılabilir.

## Özellikler

- **480 gerçek şube** — koordinat, adres, şehir ve ilçe bilgileri dahil
- **Leaflet/OpenStreetMap** tabanlı interaktif harita
- **Arama** — şube adı, adres, ilçe veya şehre göre filtreleme
- **Şehir filtresi** — dropdown ile şehir bazlı filtreleme
- **Fly-to animasyonı** — sidebar'dan şube seçince haritada o konuma animasyonlu geçiş
- **Responsive tasarım** — mobil cihazlarda sidebar alta kayar

## Teknolojiler

| Paket | Sürüm |
|-------|-------|
| React | ^19.2.4 |
| react-leaflet | ^5.0.0 |
| Leaflet | ^1.9.4 |
| react-scripts | 5.0.1 |

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Production build
npm run build
```

`npm start` komutu uygulamayı `http://localhost:3000` adresinde açar.

## GitHub Pages'e Deploy

Uygulama GitHub Actions ile otomatik olarak GitHub Pages'e deploy edilir.

1. GitHub'da repo oluşturun
2. **Settings → Pages → Source** kısmını **GitHub Actions** olarak seçin
3. Kodu `main` branch'ine push edin

Workflow otomatik çalışır ve site yayınlanır:

```
https://<kullaniciadi>.github.io/PopeyesMapTR
```

## Veri Kaynağı

Şube verileri `src/data/branches.json` dosyasında saklanır. Veri formatı:

```json
{
  "lat": "36.990852",
  "lng": "35.339552",
  "data": {
    "title": "Adana Optimum AVM",
    "address": "Hacı Ömer Sabancı Bulvarı No: 28",
    "city": "Adana",
    "county": "Yüreğir",
    "phone": null
  }
}
```

Veriler [popeyes.com.tr/Restaurants/GetRestaurants/](https://www.popeyes.com.tr/Restaurants/GetRestaurants/) API endpoint'inden çekilir.

## Proje Yapısı

```
├── .github/workflows/deploy.yml   # GitHub Pages workflow
├── public/index.html               # HTML şablonu
├── src/
│   ├── data/branches.json          # 480 şube verisi
│   ├── index.js                    # Entry point
│   ├── index.css                   # Global stiller
│   ├── App.js                      # Ana bileşen
│   └── App.css                     # Uygulama stilleri
├── package.json
└── README.md
```

## Lisans

MIT
