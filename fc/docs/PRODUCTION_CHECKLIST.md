# Production qəbul yoxlaması

Bu siyahı deploy-dan sonra **real hesabla** icra edilməlidir.
Paketin avtomatik testləri bunu əvəz etmir.

## Bağlantı və məlumat

- [ ] API Live Tester cari Bakı tarixi üçün `fixtures` qaytarır.
- [ ] Free hesabınızda istədiyiniz mövsüm/liqalar əlçatandır.
- [ ] Worker yalnız production origin-i qəbul edir; açar DevTools-da yoxdur.
- [ ] Eyni URL-ni iki dəfə açanda `meta.fetchedAt` dəyişmir (keş).
- [ ] “Bu gün” və “Sabah” Bakı gecəyarısı ətrafında düzgün tarix göstərir.
- [ ] Bir məlum matçın saatı və hesabı provider dashboard-u ilə müqayisə edilib.
- [ ] “Canlı”da oyun olmadıqda boş vəziyyət; olduqda status/dəqiqə görünür.
- [ ] Limit dolanda və offline olduqda köhnə data açıq xəbərdarlıqla görünür.
- [ ] Futbolçu axtarışı seçilmiş mövsümdə nəticə verir; səhifələmə işləyir.
- [ ] Qarabağ/Qarabag, Mbappé və ad-soyad variantları yoxlanıb.
- [ ] Qrup cədvəlləri, bombardirlər, heyətlər və timeline real cavabla yoxlanıb.

## Brauzer və ekran

- [ ] 320, 360, 390, 768 və 1920px enlərdə horizontal səhifə overflow yoxdur.
- [ ] Yalnız cədvəl və naviqasiya bloku lazım olduqda horizontal scroll edir.
- [ ] Dark/light həm futbol, həm əsas KINOFLIX səhifəsində eyni `flix-theme` dəyərini oxuyur.
- [ ] Tab/Shift+Tab ilə bütün düymələrə çatmaq olur, fokus görünür.
- [ ] Modalın native fokus tələsi, Esc, bağla düyməsi və scroll kilidi işləyir.
- [ ] Search ArrowDown/ArrowUp/Enter/Escape davranışı yoxlanıb.
- [ ] Oyun → komanda → geri naviqasiyası əvvəlki pəncərəni qaytarır.
- [ ] `?match=...`, `?team=...`, `?player=...&season=...`, `?league=...` yeni tabda açılır.
- [ ] Mobil Share və desktop Clipboard HTTPS-də yoxlanıb.
- [ ] Loqo/foto yüklənmədikdə SVG fallback görünür; error loop yoxdur.
- [ ] Background tabda Network sorğuları dayanır, geri qayıdanda yenilənir.
- [ ] Normal istifadədə konsolda tutulmamış JavaScript exception yoxdur.

## Yayıma buraxmazdan əvvəl

- [ ] `WORKER_BASE_URL` real HTTPS ünvanıdır.
- [ ] `.dev.vars`, `node_modules`, `.wrangler` GitHub-a daxil edilməyib.
- [ ] Default `economy` və 95 günlük büdcə saxlanılıb.
- [ ] Lokal origin-lər production Worker config-dən çıxarılıb.
- [ ] “30 dəqiqəyədək gecikmə” qeydini istifadəçidən gizlətməmisiniz.
- [ ] Cari API/Cloudflare qiymət və limitlərini hesabınızda yenidən yoxlamısınız.
