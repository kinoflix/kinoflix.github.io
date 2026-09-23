# Worker

Təhlükəsiz API-Football adapteri. Məxfi açar: `FOOTBALL_API_KEY`.

Əsas paket qovluğundan:

```sh
npm ci
cp worker/wrangler.toml.example worker/wrangler.toml
npx wrangler login
npm run worker:deploy
npx wrangler secret put FOOTBALL_API_KEY --config worker/wrangler.toml
```

Windows-da surət üçün `Copy-Item` istifadə edin. İstənilən real açarı `.gitignore`-da
olan `.dev.vars` xaricində fayla yazmayın. Production-da secret əmri istifadə edin.

`FOOTBALL_HUB` SQLite Durable Object avtomatik migration ilə yaranır.
Ayrıca namespace ID yaratmaq lazım deyil. Default production origin:
`https://kinoflix.github.io`. Origin-siz birbaşa URL girişi 403-dür.

Default `economy`: 95 cəhd/gün, 35 əsas məlumat ehtiyatı, 10 upstream sorğu/dəqiqə,
60 frontend sorğu/dəqiqə/IP. Bu dəyərlər API planınıza uyğun saxlanmalıdır.

`routes.js` yalnız sabit API-Sports hostuna məlum GET endpointlərini buraxır.
`provider.js` API error envelope-larını yoxlayır və cavabları normalize edir.
`worker.js` keş və kvotanı ziyarətçilər arasında paylaşır; cold start kvotanı sıfırlamır.

Tam davranış, limitlər və test: paket kökündəki README və docs qovluğu.
