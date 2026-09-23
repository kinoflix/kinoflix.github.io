# Yoxlama hesabatı

Tarix: 22 sentyabr 2026. Node.js 24.19.0.

## Avtomatik nəticə

`npm test`: **25 test keçdi, 0 uğursuz** (Node test runner-in göstərdiyi say,
DOM suite və onun alt testləri daxil olmaqla).

| Ssenari | Yoxlama üsulu | Nəticə |
| --- | --- | --- |
| Bakı gecəyarısı, sabah, il keçidi, sıçrayış ili | Intl + calendar unit test | Keçdi |
| Doğum tarixindən yaş; səhv tarix | Unit test | Keçdi |
| 90+4 dəqiqəsi | Unit test | Keçdi |
| 0, 1 və 1200 canlı oyun | Normalization test | Keçdi |
| Loqo/photo/score null, hesabda 0 | Unit + DOM | Keçdi |
| Təxirə salınmış/ləğv edilmiş oyun | Unit | Keçdi |
| Canlı → başlamamış → bitmiş sıralama | Unit | Keçdi |
| HTTP 429, 500 və HTTP 200 daxilində provider errors | Stub fetch test | Keçdi |
| Whitelist, yanlış tarix/ID, təkrar parametr, injection query | Route test | Keçdi |
| API secret-in yalnız upstream header-də qalması | Adapter test | Keçdi |
| CORS icazəli/icazəsiz origin | Worker entrypoint unit test | Keçdi |
| Eyni vaxtda 10 eyni sorğunun 1 upstream sorğuya çevrilməsi | Node SQLite ilə DO məntiq testi | Keçdi |
| Object yenidən yarananda keşi oxuması | Node SQLite ilə DO məntiq testi | Keçdi |
| Paralel sorğularda günlük limit və əsas feed ehtiyatı | Node SQLite ilə DO məntiq testi | Keçdi |
| Stale fallback və ilkin fetchedAt-ın saxlanması | Unit + DOM | Keçdi |
| Canlı oyun olmayanda realtime intervalın uzanması | DO məntiq testi | Keçdi |
| Profil keçidləri: match/team/player | JSDOM inteqrasiya | Keçdi |
| Geri düyməsi/bağlama üzrə URL dəyişməsi | JSDOM history | Keçdi |
| Favoritlər, son baxılanlar, dark/light | JSDOM + localStorage | Keçdi |
| Debounce və boş axtarış | JSDOM | Keçdi |
| Azərbaycan simvolları və Qarabağ transliterasiyası | Unit + DOM | Keçdi |
| XSS: HTML kimi görünən komanda adının mətn kimi göstərilməsi | JSDOM | Keçdi |
| Offline cached response | Stub network + DOM | Keçdi |

Test fixture-ləri yalnız `tests/` daxilindədir. UI inteqrasiya testi modulları
müvəqqəti qovluğa köçürüb yalnız orada test endpoint-i qurur; production config
və production məlumat axını mock nəticələrlə dəyişdirilmir.

## Worker paketlənməsi

`wrangler 4.136.3 deploy --dry-run` uğurla keçdi. JavaScript bundle və
`FOOTBALL_HUB` binding/migration konfiqurasiyası Wrangler tərəfindən qəbul edildi.
Bu əməliyyat Cloudflare-ə heç nə deploy etməyib.

## Bu mühitdə tamamlanmayan yoxlamalar

- **Real API inteqrasiyası:** açar/hesab olmadığından provider-ə autentifikasiyalı sorğu edilmədi. Cari liqa və mövsüm əhatəsi təsdiqlənməyib.
- **OpenAPI contract validation:** provider reference səhifəsi təhlükəsizlik yoxlamasında bloklandı; açıq rəsmi təlimat əsasında implementasiya edildi.
- **Cloudflare lokal workerd runtime smoke:** `wrangler dev` bu mühitdə `uv_interface_addresses` sistem xətası ilə başlaya bilmədi. Bu, dry-run və Node SQLite məntiq testlərindən ayrıdır; real Durable Object runtime-da işləmə hələ təsdiqlənməyib.
- **Real brauzer / mobil vizual QA:** bulud brauzeri lokal ünvanı `ERR_BLOCKED_BY_CLIENT` ilə açmadı. 320/360/390/768/1920px ölçülər üçün CSS yazılıb, lakin həmin ölçülərdə render və screenshot təsdiqi yoxdur.
- **Native modal fokus tələsi, layout overflow, touch, Web Share və clipboard icazələri:** JSDOM real layout/native brauzer davranışını təsdiqləmir. Modal testində sadələşdirilmiş dialog üsulları istifadə edilir.
- **Production console və şəbəkə:** sayt/Worker deploy edilmədiyindən real istifadə sessiyası ölçülməyib.

Bu paket “production-da artıq işləyir” və ya “bütün mobil ekranlarda yoxlanıb”
iddiası ilə təhvil verilmir. Son mərhələ: `PRODUCTION_CHECKLIST.md`.
