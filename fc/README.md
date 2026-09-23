# KINOFLIX • Futbol Mərkəzi

Mövcud GitHub Pages saytı üçün ayrıca HTML/CSS/vanilla JavaScript modulu və Cloudflare Worker backend-i.

**Əvvəl bunu bilin:** bu paket saxta nəticələr göstərmir. API açarı və deploy edilmiş Worker olmadan oyunlar yüklənmir. Bütün liqaları, geniş axtarışı və 30 saniyəlik canlı yenilənməni **həmişə və limitsiz pulsuz** təmin edən uyğun rəsmi xidmət bu araşdırmada təsdiqlənməyib. Hazır paket pulsuz API kvotası daxilində real məlumatla işləmək üçün hazırlanıb; pulsuz rejim real vaxt dəqiqliyini təmin etmir.

## Qısa başlanğıc

1. API-Football-da **Free** hesab açın.
2. Aşağıdakı təlimatla Worker-i Cloudflare Free hesabınıza yerləşdirin.
3. API açarını `FOOTBALL_API_KEY` secret-i kimi əlavə edin.
4. `football/js/config.js` faylındakı `WORKER_BASE_URL` sahəsinə Worker ünvanını yazın.
5. **Yalnız `football/` qovluğunu** mövcud repository-nin əsas qovluğuna köçürün.
6. GitHub Pages yenilənəndən sonra `https://kinoflix.github.io/football/` ünvanını açın.

Frontend üçün npm/build tələb olunmur. Node yalnız Worker alətləri və avtomatik testlər üçündür.

## 1. Mövcud layihə üzrə analiz

İş mühitində sizin repository checkout-unuz və GitHub yazma bağlantısı yox idi. Saytın cari yayımlanmış faylları oxundu:

| Fayl / xüsusiyyət | Təsdiqlənən quruluş | Yeni modulun qərarı |
| --- | --- | --- |
| `/index.html` | Xarici CSS və JS; əlavə film/chat bölmələri | Ana fayl dəyişdirilməyib |
| `/CSS/styles.css` | `--bg`, `--surface`, `--muted`, `--accent`, `--text`, `--glass`, `--radius` | Eyni rəng tokenləri ayrıca CSS-də saxlanılıb |
| `/JS/javascripts.js` | `flix-theme`; `<html data-theme>` | Eyni açar və atribut istifadə edilir |
| Tünd rənglər | `#08101a`, `#0f1720`, vurğu `#1db954` | Uyğun saxlanılıb |
| Açıq rənglər | `#f6f8fb`, ağ səth, vurğu `#0b74ff` | Uyğun saxlanılıb |
| İkonlar | Font Awesome **6.5.0** | Eyni versiya |
| Başlıq | Loqo solda, idarələr sağda; mobil ölçü | KINOFLIX+ yazı loqosu, Home və theme düymələri |
| Kartlar/modal | Yumru 12px sərhəd, tünd səth; modal maksimum 1100px | Məlumat pəncərəsi 880px, mobil uyğun ölçü |
| Mobil | 420/520/768px ətrafında qaydalar | Futbol məlumatı üçün 650/900px qırılmaları |

Film səhifəsinin CSS/JS faylları futbol səhifəsinə qoşulmur: həmin skriptlər olmayan film DOM elementlərinə müraciət edir və ayrıca səhifəni poza bilər. Tokenlər uyğunlaşdırılıb, qlobal film/player/chat kodu izolə edilib. Əsas saytın loqo şəkillərinə yeni asılılıq yaradılmayıb. Serverdə heç bir fayl dəyişdirilməyib və paylaşılmayıb; bu, repository-yə köçürüləcək hazır mənbə paketidir.

## 2. Pulsuz və pullu imkanların sərhədi

Rəsmi qiymət səhifələri 22 sentyabr 2026-da yoxlanıb. Qiymətlər/paketlər provayder tərəfindən dəyişə bilər.

| Seçim | Pulsuz imkan | Bu layihəyə təsiri |
| --- | --- | --- |
| API-Football Free | 100 sorğu/gün; endpointlər var, mövsüm əlçatanlığı məhduddur | Əsas adapter; sərt büdcə və gecikməli yenilənmə |
| API-Football paid | Daha yüksək kvota və daha geniş mövsüm çıxışı | Bu paket pullu plan almır; sürətli rejim yalnız sahibin ayrıca qərarı ilə mümkündür |
| football-data.org Free | Məhdud turnirlər; gecikmiş nəticələr | Tam canlı axtarış tələbinin ekvivalenti deyil |
| Sportmonks Free | Danimarka və Şotlandiya liqaları | İstənən bütün liqaları əhatə etmir |

**FREE:** bu kod, GitHub Pages frontend, Cloudflare Free limitləri daxilində Worker + SQLite Durable Object, API-Football Free limitləri daxilində real cavablar, favoritlər, tarixçə, paylaşım və bütün interfeys.

**PAID:** bu kodda ödəniş yoxdur. API-Football-un yüksək sorğu kvotası/mövsüm çıxışı ayrıca pullu ola bilər. Profil fotosu və matç statistikası burada əsassız şəkildə “pullu funksiya” adlandırılmır: mövcudluq liqa, mövsüm, coverage və paketə bağlıdır.

**Alternative:** football-data.org və ya Sportmonks adapteri sonradan Worker-də eyni daxili modelə uyğun əlavə edilə bilər. Paketdə işlək ikinci adapter olduğu iddia edilmir.

### Pulsuz rejim necə davranır?

- Default `DATA_MODE="economy"`.
- Canlı və günlük oyun cavabları minimum **30 dəqiqə** saxlanılır. Bu, həqiqi canlı yenilənmə deyil; UI gecikməni göstərir.
- Qlobal `DAILY_BUDGET=95` ilə provayderə maksimum 95 uğurlu/uğursuz cəhd ayrılır; 5 sorğu hesabın əl ilə yoxlanması üçün saxlanır. Başqa tətbiqlərin eyni açardan istifadəsi bu hesablamaya daxil deyil.
- Əlavə profillər/axtarış üçün büdcənin ən çox 60 sorğusu ayrılır; qalan 35 sorğu əsas oyun sorğuları üçün qorunur. Əsas sorğular ümumi 95-ə qədər istifadə edə bilər.
- Gün UTC ilə dəyişir. Provayderin öz limiti həmişə əlavə sərhəddir.
- Büdcə çatmasa əvvəlki cavab tarixi ilə qaytarılır; heç bir əvvəlki cavab yoxdursa limit mesajı çıxır.
- 30 dəqiqədən bir **bir** feed gündə 48 sorğu, həm “Bu gün”, həm “Canlı” fasiləsiz istifadə edilərsə 96 sorğu tələb edə bilər. Axtarışlar da kvotadan istifadə edir. Buna görə pulsuz rejimdə belə fasiləsiz əlçatanlıq zəmanəti yoxdur.
- 30 saniyəlik bir feed gündə **2 880** sorğu tələb edir. Keş bu fiziki məhdudiyyəti aradan qaldırmır.
- Ziyarətçilərə login və ödəniş tələb edilmir.

## 3. Fayl quruluşu

```text
football/
  index.html
  css/football.css
  assets/team.svg
  assets/player.svg
  js/config.js       # yalnız public Worker URL və UI parametrləri
  js/theme.js        # flix-theme ilkin tətbiqi
  js/api.js          # timeout, abort, lokal keş, xəta mesajları
  js/provider.js     # UI-nin istifadə etdiyi FootballProvider interfeysi
  js/utils.js        # Bakı tarixi, yaş, statuslar, təhlükəsiz DOM
  js/ui.js           # kartlar, cədvəllər, skeleton, fallback
  js/search.js       # debounce, səhifələmə, tarixçə
  js/favorites.js    # localStorage
  js/details.js      # matç, oyunçu, komanda, liqa profilləri
  js/polling.js      # bir mərkəzi timer
  js/app.js          # səhifə vəziyyəti və naviqasiya
  README.md
worker/
  worker.js          # CORS, ortaq SQLite keş, büdcə, rate limit
  provider.js        # API-Football adapteri və normalization
  routes.js          # endpoint allowlist və input validation
  wrangler.toml.example
  README.md
docs/
  SOURCES.md
  API.md
  TEST_REPORT.md
  PRODUCTION_CHECKLIST.md
tests/
  core.test.js
  ui.test.js
package.json
package-lock.json
README.md
```

## 4. API hesabı və açarı

1. [API-Football qeydiyyatını](https://dashboard.api-football.com/register) açın.
2. Pulsuz hesab yaradın, e-poçtu təsdiqləyin. **Free** paketini saxlayın; kod heç bir abunə almır.
3. Dashboard → **Account → My Access** bölməsində API key-i əldə edin.
4. Dashboard Live Tester-də əvvəlcə `fixtures` üçün bugünkü tarixi və `timezone=Asia/Baku` seçin.
5. `leagues` ilə istədiyiniz liqanın mövsümlərini/coverage məlumatını yoxlayın. 2026 mövsümünə pulsuz çıxış olduğunu fərz etməyin; hesabınızın faktiki cavabı həlledicidir.
6. Açarı HTML, frontend JS, GitHub secret-dən build olunan public config və ya söhbətə yazmayın. Aşağıdakı secret əmri ilə yalnız Cloudflare-ə daxil edin.

Bu adapter birbaşa API-Sports hesabı üçündür; RapidAPI açarı fərqli host/header tələb edir və dəyişmədən burada işləməz.

## 5. Cloudflare Worker — addım-addım

Kompüterdə **Node.js 24 LTS** və terminal istifadə edin. Paketdəki `package-lock.json` test edilmiş alət versiyalarını kilidləyir. Köhnə Windows 7/Chrome gündəlik istifadə və müasir Node alətləri üçün hədəf deyil; aktual sistem/brauzer istifadə edin.

1. [Cloudflare](https://dash.cloudflare.com/) hesabınızda Workers Free planını saxlayın. SQLite Durable Objects pulsuz limit daxilində işləyir; limit aşılarsa xidmət dayana bilər. Ödənişli plana keçmək tələb olunmur.
2. ZIP-i açın. Terminalı **paketin əsas qovluğunda** açın (`package.json` görünməlidir).
3. Asılılıqları quraşdırın:

```sh
npm ci
```

4. `worker/wrangler.toml.example` faylının surətini `worker/wrangler.toml` adı ilə yaradın. Windows Explorer ilə də edə bilərsiniz. Terminal variantı:

```sh
# macOS / Linux
cp worker/wrangler.toml.example worker/wrangler.toml
```

```powershell
# Windows PowerShell
Copy-Item worker/wrangler.toml.example worker/wrangler.toml
```

5. Cloudflare hesabınıza daxil olun:

```sh
npx wrangler login
```

6. `worker/wrangler.toml` içində `name` sizin hesabınızda başqa Worker-lə toqquşursa dəyişin. `FOOTBALL_HUB` binding və `new_sqlite_classes` migration hissəsini saxlayın. KV namespace və ya ayrıca database ID yaratmağa ehtiyac yoxdur.
7. Worker-i yaradıb yerləşdirin:

```sh
npm run worker:deploy
```

Bu ilk deploy zamanı secret hələ yoxdur; Worker `NOT_CONFIGURED` qaytarır və API-yə sorğu etmir.

8. Secret-i əlavə edin:

```sh
npx wrangler secret put FOOTBALL_API_KEY --config worker/wrangler.toml
```

Terminal soruşanda API key-i yapışdırıb Enter basın. Secret əmri işlək Worker-ə sirri bağlayır. Secret-i `wrangler.toml` və ya `config.js` faylına yazmayın.

9. Deploy nəticəsində göstərilən `https://kinoflix-football.<sizin-subdomain>.workers.dev` ünvanını götürün. Ünvanı təxmin etməyin; terminalın qaytardığını istifadə edin.

10. Worker-ə birbaşa ünvan sətrindən baxışda `Origin` olmadığı üçün 403 görünə bilər. Bu normaldır. Testi səhifədən və ya aşağıdakı Origin header-i ilə edin.

## 6. Frontend bağlantısı və GitHub Pages

`football/js/config.js`:

```js
WORKER_BASE_URL: "https://kinoflix-football.SIZIN-AD.workers.dev",
```

Burada real Worker URL-nizi yazın; `/api` sonluğu əlavə etməyin. API key yazmayın.

GitHub Desktop ilə:

1. `kinoflix.github.io` repository-ni **Show in Explorer** ilə açın.
2. Hazır `football/` qovluğunu mövcud `index.html` ilə eyni səviyyəyə köçürün.
3. Mövcud `index.html`, `CSS/`, `JS/`, video/chat fayllarını əvəz etməyin.
4. Dəyişiklikləri commit edib **Push origin** edin.
5. GitHub Pages build/deploy-u bitdikdən sonra `/football/` ünvanını açın.

Worker mənbəyini repository-də saxlamaq olar, lakin `.dev.vars`, açarlar, `node_modules/`, `.wrangler/` qovluqlarını yükləməyin. Saytın işləməsi üçün yalnız `football/` lazımdır.

Ana menyuya keçid əlavə etmək istəsəniz uyğun yerə bu element yetərlidir (paket ana səhifəni avtomatik dəyişdirmir):

```html
<a href="/football/">Futbol Mərkəzi</a>
```

## 7. Lokal test

### Frontend + yerləşdirilmiş Worker

Lokal origin-i Worker-in `ALLOWED_ORIGINS` siyahısına yalnız test müddətində əlavə edib deploy edin:

```toml
ALLOWED_ORIGINS = "https://kinoflix.github.io,http://localhost:8080,http://127.0.0.1:8080"
```

Paket qovluğunda:

```sh
python3 -m http.server 8080
```

Windows-da Python launcher varsa:

```powershell
py -m http.server 8080
```

Brauzerdə `http://localhost:8080/football/` açın. `file://` ilə açmayın: ES modulları və CORS üçün HTTP lazımdır.

### Tam lokal Worker

1. `worker/.dev.vars` yaradın və **yalnız lokal** açarı daxil edin:

```text
FOOTBALL_API_KEY=YOUR_REAL_KEY
```

2. Lokal origin-ləri `wrangler.toml`-a əlavə edin.
3. Bir terminalda `npm run worker:dev`, digərində Python serveri başladın.
4. Frontend `WORKER_BASE_URL` müvəqqəti `http://127.0.0.1:8787` olsun.
5. Bu lokal Worker də **real API kvotasından istifadə edir**. Lokal test öz-özünə mock rejimə keçmir.
6. Production-dan əvvəl frontend URL-ni HTTPS Worker URL-yə, `ALLOWED_ORIGINS`-i yalnız `https://kinoflix.github.io` dəyərinə qaytarın.

## 8. Avtomatik test və deployment yoxlaması

```sh
npm test
npx wrangler deploy --dry-run --config worker/wrangler.toml
```

Testlərdəki `TEST` məlumatları yalnız test prosesində yaranır. Production kodunda mock/demo data və ya gizli demo flag yoxdur.

Yerləşdirilmiş Worker üçün, real URL-nizi istifadə edərək:

```sh
curl -H "Origin: https://kinoflix.github.io" \
  "https://SIZIN-WORKER.workers.dev/api/matches?date=2026-09-22"
```

Tarixi cari Bakı tarixi ilə dəyişin. İki eyni sorğunu ardıcıl göndərdikdə `meta.fetchedAt` eyni qalmalıdır: bu, ortaq keşin istifadə olunduğunu göstərir. API key response-da olmamalıdır. `Origin: https://example.com` ilə sorğu 403 qaytarmalıdır.

Tam canlı hesabla qəbul sınaqları: `docs/PRODUCTION_CHECKLIST.md`. Bu paketdə **real API açarı ilə end-to-end yoxlama aparılmayıb**, **Cloudflare/GitHub-a deploy edilməyib**, **real brauzerdə mobil vizual QA tamamlanmayıb**. Nəticələr `docs/TEST_REPORT.md`-də ayrılıb.

## 9. Gündəlik istifadə və məlumatın mənası

- İlk səhifə “Bu gün”dür; tarix Bakı timezone-una görə seçilir.
- “Canlı” provider-in əhatə etdiyi oyunları qaytarır, dünyadakı bütün oyunlara zəmanət vermir.
- Futbolçu axtarışı soyad və seçilmiş mövsüm üzrədir. Tam addan son söz provayderə ötürülür. Mürəkkəb soyad və diakritik variantlarda başqa yazılışı sınamaq lazım gələ bilər.
- Futbolçunun yaşı doğum tarixindən hesablanır. Doğum tarixi yoxdursa yaş uydurulmur.
- “Cari komanda qeydiyyatını göstər” düyməsi squads endpointindən oyunçuya bağlı komandaları ayrıca yükləyir.
- Futbolçu statistikası turnir/komanda üzrə ayrı göstərilir. Mövsümdə çıxış etdiyi komanda avtomatik “hazırkı klubu” kimi təqdim olunmur.
- Provider-in season statistikası içindəki `passes.accuracy` dəyərinə kod özündən `%` əlavə etmir.
- Dominant ayaq, bayraq, heyət milliyyəti kimi alınmayan sahələr gizlənir. API-nin təmin etmədiyi məlumat başqa yerdən təxmin edilmir.
- Matç statistikası/heyət/hadisələr coverage dəstəkləyirsə lazy yüklənir. Dəstəklənmədiyi məlumdursa tab gizlənir; hələ açıqlanmayıbsa aydın mesaj göstərilir.
- H2H son 5 qarşılaşmanı, komanda səhifəsi növbəti 10 və son 10 oyunu göstərir.
- “Mənim komandalarım” feed-i ilk 10 favorit komanda üçün istifadəçinin düymə ilə istəyi əsasında yüklənir. Hər komandanın ayrıca profilində əlavə oyunlar görünür. Canlı favorit oyunu artıq alınmış əsas siyahıda varsa göstərilir.
- Tarixçə son 8 profil; favoritlər hər kateqoriyada maksimum 100. Login yoxdur.
- Offline fallback yalnız əvvəldən açılmış və saxlanmış məlumat üçün işləyir. Tam offline ilk açılış/PWA service worker bu paketə daxil deyil.
- Font Awesome yüklənməsə əsas mətn və funksiyalar qalır. Şəkillər yüklənməsə yerli SVG görünür.
- Share HTTPS/localhost-da Web Share və ya Clipboard ilə işləyir; bunlar yoxdursa kopyalamaq üçün seçilmiş URL sahəsi göstərilir.

## 10. Texniki arxitektura və əməliyyat qeydləri

```text
GitHub Pages /football/
  → public Worker URL (açar yoxdur)
  → exact-origin CORS + whitelist + validation
  → singleton SQLite Durable Object (cache + quotas + in-flight dedup)
  → API-Football HTTPS (secret header)
  → normalized DTO → təhlükəsiz DOM
```

- Keş brauzer refresh-indən və Worker-in yenidən başladılmasından asılı deyil. Bütün edge nöqtələri bir named Durable Object-ə yönəlir. Bu dizayn public trafiki ayrıca edge keşindən daha sərt qlobal kvota ilə idarə edir, lakin Cloudflare request limitləri yenə qüvvədədir.
- Keş 256 müxtəlif cavabla və 7 günlük saxlanma müddəti ilə məhdudlaşır. Bu səbəbdən sonsuz offline arxiv deyil.
- CORS autentifikasiya deyil; browser xaricində Origin saxtalaşdırıla bilər. Açarı qlobal kvota, IP üzrə dəqiqə limiti, upstream limiti və endpoint allowlist qoruyur. Böyük bot trafiki üçün əlavə Cloudflare qaydaları lazım ola bilər.
- Statistik məlumat hər yenilənmədə yenidən parse/rebuild edilmir; əsas siyahı yalnız data dəyişdikdə yenilənir. Şəkillər lazy, liqa qrupları `content-visibility:auto` istifadə edir.
- Tək polling manager; gizli tabda sorğu dayandırılır, yenidən aktivləşəndə davam edir. State dəyişikliklərində AbortController köhnə işi ləğv edir.
- Serverin `refreshAfter` göstərişi əsasdır. Frontend-də interval azaltmaq provider keşini keçmir.
- `DATA_MODE="realtime"` kodda dəstəklənir, lakin bu setting planı yüksəltmir və pulsuz 100/gün limitini aradan qaldırmır. Bütün istifadəçilərin pulsuz qalması tələbinə görə default dəyişdirilməyib.
- `DATA_MODE` dəyişdiriləndə əvvəlki keş qüvvədə qalır, müddəti bitəndə yeni TTL tətbiq olunur.
- Uyğun brauzer: müasir Chromium, Firefox, Safari. Köhnə Chrome/WebView-də native `<dialog>`, ES modules və Intl timezone dəstəyini ayrıca yoxlayın.

Əvvəlki əsas sayt fayllarında dəyişiklik: **yoxdur**. Bütün yeni fayllar bu paketdədir.
