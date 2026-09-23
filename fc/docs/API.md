# Daxili API müqaviləsi

Frontend yalnız normalizə edilmiş `data`, `paging`, `meta` envelope-u alır.
API-Sports `response`, `errors` və xam statistika formatı UI-yə ötürülmür.

```json
{
  "data": [],
  "paging": {"current": 1, "total": 1},
  "meta": {
    "provider": "API-Football",
    "mode": "economy",
    "fetchedAt": "ISO-8601",
    "expiresAt": "ISO-8601",
    "stale": false,
    "warning": null,
    "refreshAfter": 1800
  }
}
```

`fetchedAt` upstream cavabının alındığı vaxtdır; istifadəçinin refresh vaxtı deyil.
`stale=true` olanda əvvəlki saxlanmış cavab göstərilir. `warning` yalnız təhlükəsiz
xəta kodudur. Provider-in raw xəta mətni və secret cavaba daxil edilmir.

## Marşrutlar

| Public route | Provider endpoint | Parametrlər | Normal model |
| --- | --- | --- | --- |
| `/api/live` | `/fixtures` | live=all, timezone=Asia/Baku | Match[] |
| `/api/matches?date=YYYY-MM-DD` | `/fixtures` | date, timezone=Asia/Baku | Match[] |
| `/api/match/:id` | `/fixtures` | id | Match[] |
| `/api/match/:id/events` | `/fixtures/events` | fixture | Event[] |
| `/api/match/:id/statistics` | `/fixtures/statistics` | fixture | TeamStatistics[] |
| `/api/match/:id/lineups` | `/fixtures/lineups` | fixture | Lineup[] |
| `/api/h2h?home=ID&away=ID` | `/fixtures/headtohead` | h2h, last=5 | Match[] |
| `/api/player/search?q=TEXT&season=YEAR&page=1` | `/players` | search, season, page | Player[] |
| `/api/player/:id?season=YEAR` | `/players` | id, season | Player[] |
| `/api/player/:id/teams` | `/players/squads` | player | Team[] |
| `/api/player/:id/stats?season=YEAR` | `/players` | id, season | Player[] |
| `/api/team/search?q=TEXT` | `/teams` | search | Team[] |
| `/api/team/:id` | `/teams` | id | Team[] |
| `/api/team/:id/squad` | `/players/squads` | team | Player[] |
| `/api/team/:id/matches?mode=next` | `/fixtures` | team, next=10, timezone | Match[] |
| `/api/team/:id/matches?mode=last` | `/fixtures` | team, last=10, timezone | Match[] |
| `/api/team/:id/competitions` | `/leagues` | team, current=true | Competition[] |
| `/api/team/:id/coaches` | `/coachs` | team | Coach[] |
| `/api/competitions` | `/leagues` | current=true | Competition[] |
| `/api/competition/:id` | `/leagues` | id | Competition[] |
| `/api/standings/:id?season=YEAR` | `/standings` | league, season | StandingGroup[] |
| `/api/scorers/:id?season=YEAR` | `/players/topscorers` | league, season | Player[] |

Naməlum route və naməlum/təkrarlanan query açarları rədd edilir.
ID-lər müsbət rəqəmlərdir. Mövsüm 2000-dən cari il+1-ə qədərdir.
Tarix həqiqi təqvim tarixi olmalıdır. Search 3–60 simvol, Unicode hərf/rəqəm,
boşluq, nöqtə, apostrof və defis qəbul edir. Sorğu URLSearchParams ilə encode edilir.

`/players/profiles` və ya başqa təsdiqlənməmiş parametr kombinasiyaları tətbiq edilməyib.
İstifadə edilən oyunçu axtarışı rəsmi başlanğıc təlimatındakı `/players?search=...&season=...` nümunəsinə əsaslanır.
Tam reference səhifəsi giriş yoxlaması ilə bloklandığından, hesab Live Tester-ində
bu kombinasiyanı production qəbulunun bir hissəsi kimi təsdiqləyin.

## Əsas modellər

```ts
type Team = {
  id: number; name: string; logo: string | null;
  country?: string; founded?: number; venue?: string;
};
type Competition = {
  id: number; name: string; logo: string | null; country: string | null;
  season?: number; round?: string;
  seasons?: Array<{year: number; current: boolean; coverage: {
    standings: boolean; scorers: boolean; events: boolean;
    statistics: boolean; lineups: boolean;
  }}>;
};
type Match = {
  id: number; competition: Competition;
  homeTeam: Team; awayTeam: Team; kickoff: string | null;
  status: string; minute: number | null; extra: number | null;
  score: {home: number | null; away: number | null};
  redCards: {home: number | null; away: number | null};
  venue: string | null; referee: string | null;
};
type Player = {
  id: number; name: string; fullName: string;
  photo: string | null; birthDate: string | null;
  nationality: string | null; height: string | null; weight: string | null;
  number: number | null; position: string | null; stats: PlayerSeasonStats[];
};
```

Ətraflı sahələr: `worker/provider.js`. `null` məlumatsızlıqdır; 0 əvəzinə yazılmır.
Provider dəyişəndə eyni route və modelləri qaytaran adapter yazın.
Bu versiyada daxili ID müqaviləsi rəqəmlidir; başqa provayderdə ID uyğunlaşdırması
server adapterinin işidir. UI-də provider-dən asılı raw JSON oxunmur.

## Keş və interval

| Məlumat | economy TTL | realtime TTL |
| --- | --- | --- |
| Canlı, oyun varsa | 1800 s | 30 s |
| Canlı, oyun yoxdursa | 1800 s | 180 s |
| Bugünkü oyunlar | 1800 s | 90 s |
| Digər tarix oyunları | 1800 s | 1800 s |
| Matç / hadisələr | 1800 / 3600 s | 60 s |
| Statistika | 3600 s | 60 s |
| Heyətlər | 3600 s | 600 s |
| Komanda oyunları | 1800 s | 900 s |
| Profil / search / H2H | 21600 s | 21600 s |
| Turnir cədvəli / bombardirlər | 3600 s | 1800 s |
| Liqa kataloqu | 86400 s | 86400 s |

Qənaət rejimində əlavə matç endpointləri əsas feed-dən daha çox gecikə bilər.
Sorğu yalnız görünən tabda və istifadəçinin açdığı məlumat üçün göndərilir.
Backend nəticə boş olduqda da onu keşləyir. Provider xətaları yeni uğurlu məlumat
kimi keşlənmir. Köhnə uğurlu cavablar 7 günə qədər fallback ola bilər.

## Xətalar

| Kod | Mənası |
| --- | --- |
| NOT_CONFIGURED | Worker URL/key/binding yoxdur |
| RATE_LIMIT | Dəqiqə limiti və ya provider quota xətası |
| DAILY_LIMIT | Bu layihə üçün ayrılmış günlük büdcə bitib |
| PLAN_OR_KEY | Açar və ya paket/mövsüm əlçatanlığı problemi |
| UNAVAILABLE / UPSTREAM | Məlumat xidməti müvəqqəti əlçatan deyil |
| INVALID_INPUT | Tarix, ID və ya search düzgün deyil |
| ORIGIN | İcazəsiz və ya olmayan Origin |

429 və provider 200 içində gələn quota xətaları da ayrılıqda tutulur.
Frontend xəta kodlarını Azərbaycan dilində mesajlara çevirir.
