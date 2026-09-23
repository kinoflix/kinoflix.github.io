# Mənbələr və yoxlama sərhədi

Araşdırma tarixi: **22 sentyabr 2026**. Yalnız aşağıdakı rəsmi mənbələr
implementasiya və provider seçimi üçün istifadə edilib.

## Mövcud KINOFLIX

- https://kinoflix.github.io/
- https://kinoflix.github.io/CSS/styles.css
- https://kinoflix.github.io/JS/javascripts.js

Bu üç fayl açıq saytdan faktiki endirilib və mətn olaraq analiz edilib.
GitHub repository-nin bütün qovluqları və unpublished dəyişiklikləri görülməyib.
Saytın cari ana səhifəsinə heç bir yazma əməliyyatı edilməyib.

## API-Football

- https://www.api-football.com/pricing — pulsuz kvota, mövsüm məhdudiyyəti, endpoint əhatəsi.
- https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide — rəsmi mart 2026 təlimatı; host/auth, error envelope, fixtures, search, standings, players, squad, events və statistikalar.
- https://www.api-football.com/news/post/football-players-squads — rəsmi squad endpointinin izahı.
- https://www.api-football.com/news/post/api-football-new-release-available — yeni player endpointlərinin elan edilməsi; bu paket həmin endpointləri sənədsiz tətbiq etmir.
- https://www.api-football.com/documentation-v3 — rəsmi reference ünvanı.

**Giriş məhdudiyyəti:** interaktiv reference səhifəsi və onun OpenAPI faylı
bu icra mühitində Cloudflare təhlükəsizlik yoxlaması ilə bloklandı. Təhlükəsizlik
yoxlaması keçilmədi. Oxuna bilən rəsmi təlimat endpoint və parametr seçiminin əsasını
təşkil edir. OpenAPI-yə qarşı avtomatik contract validation aparıldığı iddia edilmir.
Açar olmadığı üçün real hesab cavabları və cari mövsüm çıxışı təsdiqlənməyib.

## Alternativlər

- https://www.football-data.org/pricing — pulsuz paketin gecikmiş nəticələri.
- https://www.sportmonks.com/football-api/ — pulsuz planın iki liqa ilə əhatəsi.
- https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/livescores — pulsuz canlı feed əhatəsi.

## Cloudflare

- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/workers/wrangler/commands/
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/

Əməliyyat qaydaları: exact-origin CORS, sabit upstream, gizli API header,
SQLite Durable Object ilə ortaq keş və büdcə. Free xidmətlərin istifadəsi
öz resurs limitlərinə tabedir; “sonsuz pulsuz” vədi verilmir.
