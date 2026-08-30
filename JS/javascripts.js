/* ===========================
   MOVIES data
   =========================== */
const MOVIES = [
  { title: "MARVEL", cover:"https://kinoflix.github.io/FILES/IMG/logos/marvel.jpg", src:"../marvel", year:2026, genre:"Fantastik", id:"marvel", special:"yes", trend:"yes" },
  { title: "Spider-Noir", cover:"https://m.media-amazon.com/images/M/MV5BYjU3NjEwNTItMzc1Mi00Y2QyLTljNDItOTQ4YjU4NjZjN2EyXkEyXkFqcGc@._V1_.jpg", src:"../spider-noir", year:2026, genre:"Fantastik", id:"spidernoir", special:"yes" },
  { title: "Beyblade: Bakuten Shoot", cover:"../beyblade/beyblade.jpg", src:"../beyblade", year:2000, genre:"Cizgi serial", id:"beyblade", special:"yes" },
  { title: "Öngörü", cover:"https://m.media-amazon.com/images/M/MV5BOTBlNmM1Y2ItN2E4YS00ZGUwLTg5NzMtMzQyMDEzNjU2NDdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15762769316457", year:2026, genre:"Dram", id: "ongoru" },
  { title: "Satranç / Schachnovelle (The Royal Game - Chess Story/", cover:"https://m.media-amazon.com/images/M/MV5BZGQwOWFiZWYtNzZkYi00MjA0LWJiYTYtYmNlYmE5ZjJlMTIzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmoly.me/dl/25tebpver3eh", year:2021, genre:"Dram", id: "schachnovelle" },
  { title: "Mother/Android", cover:"https://m.media-amazon.com/images/M/MV5BM2JjOWVlMjMtNzQ3MC00MjUwLTkyMDYtNDZiNmE4YzBjOGVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vkC6ccUZ8Rxc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Elmi fantastik", id: "motherandroid" },
  { title: "Yırtıcı kuşlar (Ve muhteşem Harley Quinn) / Birds of Prey: And the Fantabulous Emancipation of One Harley Quinn", cover:"https://m.media-amazon.com/images/M/MV5BZmFhYjdmOWMtOTIzNS00ZDZmLWEzMGQtYTI1YzExZjQ1OGFkXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vdvuE_sp7Kwc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2020, genre:"Aksiyon", id: "harleyquinn" },
  { title: "Bas gaza / Overdrive", cover:"https://m.media-amazon.com/images/M/MV5BODk5MTg4OWUtY2FkYy00MzgwLWI2OWYtZmZhZGVjZTNjODQyXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/v6RYz6jTWkSg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2017, genre:"Aksiyon", id: "overdrive" },
  { title: "Wasp Network", cover:"https://m.media-amazon.com/images/M/MV5BYWQ2ZTkxZGEtMzliMC00OGQ2LWFjZTctNmRlMmViYjYxNmJkXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/2488515824209", year:2019, genre:"Triller", id: "waspnetwork" },
  { title: "Kıyafet / The Outfit", cover:"https://m.media-amazon.com/images/M/MV5BZTY2M2U5OTEtNDljYS00MGQwLWI4YzQtOGJiMzUxM2IyYjRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/4986437569105", year:2022, genre:"Triller", id: "theoutfit" },
  { title: "Nando iki dünya arasında - Bir Sintonia Filmi / Nando Between Two Worlds – A Sintonia Film", cover:"https://m.media-amazon.com/images/M/MV5BZDE5Y2QxMDYtNzVlYi00NDEyLWIxMzgtNDc3MjI5MDM1ZGEzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15571591957097", year:2026, genre:"Aksiyon", id: "nando" },
  { title: "En yakın arkadaşım, sevgilisi ve ben / My Best Friend, His Girlfriend and Me", cover:"https://m.media-amazon.com/images/M/MV5BOTMwZWU2MWUtNTM3Ni00NjY1LTg0MGQtNTEzNjlkMmU4NzJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15594972056169", year:2025, genre:"Komediya", id: "mybestfriendhisgirlfriendandme" },
  { title: "Bana şans dileme / Don't Say Good Luck", cover:"https://m.media-amazon.com/images/M/MV5BN2RiYWI1M2QtZmMzMy00MGNlLWFmNDItMWE0M2RiMDAyNjc0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15594446260841", year:2026, genre:"Dram", id: "dontsaygoodluck" },
  { title: "Tom ve Jerry: Kayıp pusula / Tom and Jerry: Forbidden Compass", cover:"https://m.media-amazon.com/images/M/MV5BMWQ3OTU0ZWYtYWE5OS00Zjc4LTg4ZTctMzcyZDQ2YjU1Yjk4XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/15650595605097", year:2025, genre:"Animasiya", id: "tomandjerryforbiddencompass" },
  { title: "İfşa günü / Disclosure Day", cover:"https://m.media-amazon.com/images/M/MV5BM2VhOWNiMGItYjIwZi00MzNiLTk1MDEtNGMyYjFmYmU3ZTVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15616263326313", year:2026, genre:"Triller", id: "disclosureday" },
  { title: "Uçlarda yaşamak / La Fiera", cover:"https://m.media-amazon.com/images/M/MV5BOTBlZWI5MWItNTA5OC00MGU4LTk3OTQtNjAxNzc0YzhkOTk3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15595748199017", year:2026, genre:"Macəra", id: "lafiera" },
  { title: "Beast", cover:"https://m.media-amazon.com/images/M/MV5BYjQ0OTgwZGUtNDhlYi00ZTM5LWI2NmYtNGYwYWJhNzVlYTc5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/15617179978345", year:2026, genre:"Aksiyon", id: "beast" },
  { title: "Büyü de gel / No Hard Feelings", cover:"https://m.media-amazon.com/images/M/MV5BZjk1NmZiNzYtZGUyYi00YzEwLTgwNWQtM2VmOWFmMGIwZDM2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v6_kawiGGnzc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2023, genre:"Komediya", id: "nohardfeelings" },
  { title: "Yeni mutantlar / The New Mutants", cover:"https://m.media-amazon.com/images/M/MV5BZGVlMjBkYmMtZDhmYS00N2QyLWI2YTgtMDU2N2UwOWYzM2MxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vkvideo.ru/video359109645_456239500", year:2020, genre:"Fantastik", id: "thenewmutants" },
  { title: "Son ev / The Last House", cover:"https://m.media-amazon.com/images/M/MV5BYzk2ZDZkMWQtNGYyNC00NmQ5LWFiZGMtYTM4MGNlNmVmOWRiXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/15511247522409", year:2026, genre:"Triller", id: "thelasthouse" },
  { title: "Supergirl", cover:"https://m.media-amazon.com/images/M/MV5BZmYzN2VhNTAtYWUxZi00OTNiLWIyZDgtMGMxZTNlYzM3ZmE1XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/15535224982121", year:2026, genre:"Fantastik", id: "supergirl" },
  { title: "Ben, Robot / I, Robot", cover:"https://m.media-amazon.com/images/M/MV5BZjM0ZDAxMTMtNGM0ZC00MWU3LTk4OGMtNmM0YTdjYzY4MzJhXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vxIbzTkM1qXA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2004, genre:"Elmi fantastik", id: "irobot" },
  { title: "Zaman makinesi / The Time Machine", cover:"https://m.media-amazon.com/images/M/MV5BZjRiMTdjNmEtOGJjNy00ZjA1LTlkNzktNzc0NzMxNTY0OGE5XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vTh3T0qQ86Vk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2002, genre:"Elmi fantastik", id: "thetimemachine" },
  { title: "The Gorge", cover:"https://m.media-amazon.com/images/M/MV5BOTQ5Y2QyYTktYmFmZi00NWJlLWE0MzgtYTA4M2I0ZjQwZjcxXkEyXkFqcGc@._V1_.jpg", src:"https://vidmoly.me/dl/fb17hxrc8yd5", year:2025, genre:"Fantastik", id: "thegorge" },
  { title: "Gerçek kahraman / Free Guy", cover:"https://m.media-amazon.com/images/M/MV5BN2I0MGMxYjUtZTZiMS00MzMxLTkzNWYtMDUyZmUwY2ViYTljXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vUAuDHapxyys?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Elmi fantastik", id: "freeguy" },
  { title: "En süper kahraman / Superhero Movie", cover:"https://m.media-amazon.com/images/M/MV5BMTc0Njc1MTU5Nl5BMl5BanBnXkFtZTcwMjA4NDE2MQ@@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vvnl92WTcjkY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2008, genre:"Komediya", id: "superheromovie" },
  { title: "Benjamin Button'ın tuhaf hikayesi / The Curious Case of Benjamin Button", cover:"https://m.media-amazon.com/images/M/MV5BYjIyNDExOWItM2Y4ZC00NmY3LWFlN2ItYTJlZDQ1NTJlZTUwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v1tYmBoD7lgA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2008, genre:"Fantastik", id: "benjaminbutton" },
  { title: "Bir kurt çocuğun gerçek hikayesi / The True Adventures of Wolfboy", cover:"https://m.media-amazon.com/images/M/MV5BYmY1ODc0YjctY2U3Yi00MzE1LWJmMzQtMWEzYTY5YjlkZmU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vC_znqNoRNQE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2019, genre:"Fantastik", id: "wolfboy" },
  { title: "Ayağa kalkmak ve düşmek / Standing Up, Falling Down", cover:"https://m.media-amazon.com/images/M/MV5BZmJkYjJkOWUtZDhkOS00MmJlLTgxNjgtMjRlN2FmNDQ5MTZhXkEyXkFqcGc@._V1_.jpg", src:"https://my.mail.ru/video/embed/2812081686177648492", year:2019, genre:"Komediya", id: "standingupfallingdown" },
  { title: "51. Bölge / Area 51", cover:"https://kinoflix.github.io/FILES/IMG/movies/51.jpeg", src:"https://dzen.ru/embed/vxf0WgkQ2zlk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2015, genre:"Elmi fantastik", id: "area51" },
  { title: "Thunderbolts*", cover:"https://m.media-amazon.com/images/M/MV5BNDIzNGUwZmYtODM0Yy00NjA3LTgxOGUtOTY0ZGM5MjBkM2I3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmoly.me/dl/t75k3g9pssba", year:2026, genre:"Fantastik", id: "thunderbolts" },
  { title: "Paralel evren / Coherence", cover:"https://m.media-amazon.com/images/M/MV5BNzQ3ODUzNDY2M15BMl5BanBnXkFtZTgwNzg0ODY2MTE@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vpbKEujXjY3E?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2013, genre:"Elmi fantastik", id: "coherence" },
  { title: "Ters yüz 2 / Inside Out 2", cover:"https://m.media-amazon.com/images/M/MV5BYWY3MDE2Y2UtOTE3Zi00MGUzLTg2MTItZjE1ZWVkMGVlODRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vgDFE5TQ7BT0?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2024, genre:"Animasiya", id: "insideout2" },
  { title: "Ters yüz / Inside Out", cover:"https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_.jpg", src:"https://vidmoly.me/dl/w3b6s99vshnr", year:2015, genre:"Animasiya", id: "insideout" },
  { title: "Titanik / Titanic", cover: "https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v9pK17ElgtD0?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1997, genre: "Dram", id: "titanic" },
  { title: "Yıldızlararası / Interstellar", cover: "https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/92ul8s2jkd6y", year: 2014, genre: "Elmi fantastik", id: "interstellar" },
  { title: "The Marvels", cover:"https://lumiere-a.akamaihd.net/v1/images/56245l11a_goat_philippines_apac_poster_1sht_e357e03a.jpeg", src:"https://vidmoly.me/dl/c6lmbw8t70rd", year:2023, genre:"Fantastik", id: "themarvels" },
  { title: "Şeytanın ağzı / The Devil's Mouth ", cover: "https://m.media-amazon.com/images/M/MV5BYjZkY2M1NmEtMjdkMS00NDliLTlmZWQtNjM0ODMyYmU3MTg4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15404121328233", year: 2026, genre: "Triller", id: "thedevilsmouth" },
  { title: "Kurtuluş Projesi / Project Hail Mary", cover: "https://m.media-amazon.com/images/M/MV5BNTkwNzJiYTctNzI3NC00NjE1LTlhYjktY2Q5MTdmMWFmNzcxXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/uadm0gh73s57", year: 2026, genre: "Elmi fantastik", id: "projecthailmary" },
  { title: "Whiplash", cover: "https://m.media-amazon.com/images/S/pv-target-images/3a0929de733358622b61c874142900f22158f217026b8e86b858a23713accef0.jpg", src: "https://dzen.ru/embed/veseUjkqphGE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2014, genre: "Dram", id: "whiplash" },
  { title: "Şüphe sarmalı / The Truthers", cover: "https://m.media-amazon.com/images/M/MV5BZDc3ODE0NTUtNTFlZS00NGJiLTg1MmEtN2NmOWU4ZmY5OWQ4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15343129397865", year: 2026, genre: "Triller", id: "thetruthers" },
  { title: "72 saat / 72 Hours", cover: "https://m.media-amazon.com/images/M/MV5BODQ1YWVlOTctMzNjMy00YzlmLTgxNjItNzVhOGYwMDVhZDllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15341682494057", year: 2026, genre: "Komediya", id: "72hours" },
  { title: "Kâinatın hâkimleri / Masters Of The Universe", cover: "https://m.media-amazon.com/images/M/MV5BMTJjYTFkM2EtZjBmNy00OTk2LTg0NTAtNzYxYzlmNjhkMzQ5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15318657141353", year: 2026, genre: "Fantastik", id: "mastersoftheuniverse" },
  { title: "Elize: Bir kadının gölgeleri / Elize: Shadows of a Woman", cover: "https://m.media-amazon.com/images/M/MV5BNmM1ZmUyM2UtMDdiMy00YzI2LTg0NzUtMjEwODZmZWZmM2Q3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15320380541545", year: 2026, genre: "Triller", id: "elizeshadowsofawoman" },
  { title: "Ödeşme zamanı / The Debt Collector izle", cover: "https://m.media-amazon.com/images/M/MV5BNzBhYWE3ZWEtMTExNi00MDYxLTg2MzMtOTA5MjcwYmFmM2VhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15332687153769", year: 2026, genre: "Triller", id: "thedebtcollector" },
  { title: "In Cold Light", cover: "https://m.media-amazon.com/images/M/MV5BZjQxMTVhMzktZmI4MC00MWI5LTg0YWEtN2E4MjMwMTU0ZTBkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15341454625385", year: 2025, genre: "Aksiyon", id: "incoldlight" },
  { title: "Rüyanda görürsün", cover: "https://m.media-amazon.com/images/M/MV5BZjYzYjY4OTQtODA2Yi00MzA3LTk3MmEtZjA4NDcwZWFlZWVkXkEyXkFqcGc@._V1_.jpg", src: "https://m.vkvideo.ru/video494883578_456241101", year: 2023, genre: "Romantik", id: "ruyandagorursun" },
  { title: "Benden önceki ben / Me Before Me", cover: "https://m.media-amazon.com/images/M/MV5BYjYyYWQ4ZmItMDY4MS00Njc2LWFhNGQtN2QzNTliY2IwMmVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15243602233961", year: 2026, genre: "Dram", id: "mebeforeme" },
  { title: "Shelter", cover: "https://m.media-amazon.com/images/M/MV5BMzI2ODY3MzQtYzllNy00YWM1LWExZTgtOGIwNjk2MmE2MmY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/qxdqwuaqtkyr", year: 2026, genre: "Aksiyon", id: "shelter" },
  { title: "Saplantı / Obsession", cover: "https://m.media-amazon.com/images/M/MV5BYzc1NWUwMDgtNGZlMS00ZmYzLWIzMzktNmMxMmY1MTUzNWExXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/7wmn5f0lpv7s", year: 2025, genre: "Triller", id: "obsession" },
  { title: "Is God Is", cover: "https://m.media-amazon.com/images/M/MV5BOTExYjBlMjUtYTAxMS00ZTU2LWJlYzgtMjIxNzUwODMwMDdkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15270205065833", year: 2026, genre: "Dram", id: "isgodis" },
  { title: "Kusursuz arkadaş / Companion", cover: "https://m.media-amazon.com/images/M/MV5BYjkyZTA5NzAtYWU3Zi00MWM4LTgxNzAtNDQxY2JmNjMwYjk4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/x9i3q58bakpb", year: 2025, genre: "Elmi fantastik", id: "companion" },
  { title: "Ölümsüzlük 2 / The Old Guard 2", cover: "https://m.media-amazon.com/images/M/MV5BOTVjMGQ0ZjgtM2RiNi00YTM2LTgzODgtNDEzMjUxNmQ1ZWZhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9441783712361", year: 2025, genre: "Aksiyon", id: "theoldguard2" },
  { title: "Ölümsüzlük / The Old Guard", cover: "https://m.media-amazon.com/images/M/MV5BNjcwN2Y0MGEtMjkyYy00YTYxLWFjMWItZTEyZjA1MTJhMjE2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/2524567898705", year: 2020, genre: "Aksiyon", id: "theoldguard" },
  { title: "23 000 hayat / 23 000 Lives", cover: "https://m.media-amazon.com/images/M/MV5BYTEwNDFmMGQtYTdkYS00NWQ4LWExODAtYWYyZThkNjM4NDZhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15255780264553", year: 2026, genre: "Dram", id: "23000lives" },
  { title: "Arzular / Desire", cover: "https://m.media-amazon.com/images/M/MV5BN2UwYjQ5NTQtZjdjOC00ZDA1LWIxY2EtNDQ4M2FjZDE5YjJiXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15254914337385", year: 2026, genre: "Dram", id: "desire" },
  { title: "Gelin! / Bride!", cover: "https://m.media-amazon.com/images/M/MV5BM2VmMDVlNzgtNThhZC00ZGMwLTg4MmEtZTUzNmRiYTkxYzUyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/3f81ct9q9m4n", year: 2026, genre: "Fantastik", id: "bride" },
  { title: "Bir mil: İkinci bölüm / One Mile: Chapter Two", cover: "https://m.media-amazon.com/images/M/MV5BYTRhYzA0N2MtOWIzYS00Y2NiLTkwODQtYzMxZDA2NDQ0MmNkXkEyXkFqcGc@._V1_.jpg", src: "https://m.vkvideo.ru/video-230451560_456239927", year: 2026, genre: "Aksiyon", id: "onemilechaptertwo" },
  { title: "Bir mil: Birinci bölüm / One Mile: Chapter One", cover: "https://m.media-amazon.com/images/M/MV5BNWU3MjE5MDItNjFlYi00NGY4LWFkM2UtMTcxNWE3M2U3MGM1XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15182696352361", year: 2026, genre: "Aksiyon", id: "onemilechapterone" },
  { title: "Of pof balık / The Pout-Pout Fish", cover: "https://m.media-amazon.com/images/M/MV5BN2FmNDE3ZmItNDE0MC00NTFhLWIxN2QtOTY3MTc3Yjk0YzM5XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video-230451560_456239935", year: 2026, genre: "Animasiya", id: "thepoutpoutfish" },
  { title: "Kara dul / Black Widow", cover:"https://m.media-amazon.com/images/M/MV5BZTMyZTA0ZTItYjY3Yi00ODNjLWExYTgtYzgxZTk0NTg0Y2FlXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vJqSHFj283TY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Fantastik", id: "blackwidow" },
  { title: "İçindeki yabancı / The Brave One", cover: "https://m.media-amazon.com/images/M/MV5BMTA4OTA4Njk4MDdeQTJeQWpwZ15BbWU3MDc0NDY1MzM@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/3210678831697", year: 2007, genre: "Triller", id: "thebraveone" },
  { title: "Ceset / The Body", cover: "https://m.media-amazon.com/images/M/MV5BZTdlOTRmYWYtZjE4NS00NmFhLWJkZmMtNGZhNmY4NmQ0ZWEwXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video-230451560_456239839", year: 2024, genre: "Triller", id: "thebody" },
  { title: "Aşk mı para mı?", cover: "https://cdn.sinemalar.com/images/movie/299419/poster/ask-mi-para-mi-1783347261.jpg", src: "https://vkvideo.ru/video-230451560_456239864", year: 2025, genre: "Romantik", id: "askmiparami" },
  { title: "The Protector", cover: "https://m.media-amazon.com/images/M/MV5BYmFjYjcyZjktNzdkNi00YjQ5LWEzODctZmYwZWUwNzc0Y2Y5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video-230451560_456239866", year: 2025, genre: "Aksiyon", id: "theprotector" },
  { title: "Trans / Trance", cover: "https://m.media-amazon.com/images/S/pv-target-images/dd3759b67ada1290e121c0782c86d9fcc6ce02fc88880ca4dcf183b456fc7627.jpg", src: "https://ok.ru/video/4317372549713", year: 2013, genre: "Triller", id: "trance" },
  { title: "Gran Turismo", cover: "https://m.media-amazon.com/images/M/MV5BMjA0N2YyNmYtZDk4Ny00ODE2LThmZWQtNGJiMDk0YzhiNzE5XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v5w3t2IODkDM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Aksiyon", id: "granturismo" },
  { title: "Boulevard", cover: "https://m.media-amazon.com/images/M/MV5BY2M5NTJmNGUtNmQyYS00NWEwLTlhNzktNWM5ZDgyY2JmMDI1XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15165466020457", year: 2026, genre: "Romantik", id: "boulevard" },
  { title: "Buluttaki gölge / Shadow in the Cloud", cover:"https://m.media-amazon.com/images/M/MV5BODYyMzM4ODQtNTc3NS00ODllLWIzMDMtYjBmM2UyZTBlODJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vPCVYGCSTWCY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2020, genre:"Aksiyon", id: "shadowinthecloud" },
  { title: "Kök / I Origins", cover: "https://m.media-amazon.com/images/M/MV5BMTQ0MTAwMDI1OF5BMl5BanBnXkFtZTgwNjUwMTA2MTE@._V1_.jpg", src: "https://ok.ru/video/24130751057", year: 2014, genre: "Elmi fantastik", id: "iorigins" },
  { title: "Gri kurt / The Gray", cover: "https://m.media-amazon.com/images/M/MV5BNDY4MTQwMzc1MV5BMl5BanBnXkFtZTcwNzcwNTM5Ng@@._V1_.jpg", src: "https://my.mail.ru/video/embed/5961367452402057568", year: 2011, genre: "Triller", id: "thegray" },
  { title: "Kiralık aile / Rental Family", cover: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/192/2025/09/02160435/6b4fm9k37m-scaled.jpeg", src: "https://ok.ru/video/15166936058473", year: 2025, genre: "Komediya", id: "rentalfamily" },
  { title: "Sihirli yollarda / Upon the Magic Roads", cover: "https://m.media-amazon.com/images/M/MV5BNmM1MDg2ZjktYjM1MC00MDg2LTg0NGMtMzQxZDg1OTU2NDhhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vfQI_Cb2bpxg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Macəra", id: "uponthemagicroads" },
  { title: "Pek yakında", cover: "https://m.media-amazon.com/images/M/MV5BMTg0ODQ4OTE0OF5BMl5BanBnXkFtZTgwNzQwMTk3MjE@._V1_.jpg", src: "https://ok.ru/video/14307018476137", year: 2014, genre: "Komediya", id: "pekyakinda" },
  { title: "Aaahh Belinda", cover: "https://m.media-amazon.com/images/M/MV5BMDI3NmU0MTAtMWVkYS00OWYxLWIyOTItM2FhNmE4OThiMzE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vXAyyniyxdSA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Romantik", id: "aaahhbelinda" },
  { title: "Evet, hayır, belki", cover: "https://m.media-amazon.com/images/M/MV5BZWI3OWFjMTctZDJlZi00ZDM0LTgxYTUtN2VhZDBjYjExMzI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/zpw64k1c458m", year: 2025, genre: "Romantik", id: "evetbelkihayir" },
  { title: "Aşk tesadüfleri sever", cover: "https://m.media-amazon.com/images/M/MV5BMjAwMjMyMzQzMV5BMl5BanBnXkFtZTcwNDE4MTc1NQ@@._V1_.jpg", src: "https://ok.ru/video/15125742094953", year: 2011, genre: "Romantik", id: "asktesaduflerisever" },
  { title: "Fetih: 1453", cover: "https://m.media-amazon.com/images/M/MV5BMTM2MDk3MDkwMF5BMl5BanBnXkFtZTcwMjMxODYyNw@@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/15154596022889", year: 2012, genre: "Bioqrafiya", id: "fetih1453" },
  { title: "Zaferin rengi", cover: "https://m.media-amazon.com/images/M/MV5BYTBiYzdlZjUtNmZiMy00Yjc3LTkzNjAtZTRmMDkxZTA0YjA1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9845559986796", year: 2024, genre: "Dram", id: "zaferinrengi" },
  { title: "Aşkın saati: 1903", cover: "https://m.media-amazon.com/images/M/MV5BNDIxZjlmN2UtZTYyMi00NWM0LTk3N2MtZTY1NGYxYTI5MGQ5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/8663144466945", year: 2019, genre: "Komediya", id: "askinsaati1903" },
  { title: "Yolcu / Passenger", cover: "https://m.media-amazon.com/images/M/MV5BMThhNTE5NGQtMWFmNC00ODlmLTk1YTUtNzVmMGVhZjliNDU2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/15101586639465", year: 2026, genre: "Qorxu", id: "passenger" },
  { title: "7. koğuştaki mucize", cover: "https://m.media-amazon.com/images/M/MV5BY2UyZThlZjMtMGQyYS00NGYxLThjMDMtMzg2NGM2MjIzZGZkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/11998852287081", year: 2019, genre: "Dram", id: "7kogustakimucize" },
  { title: "Delibal", cover: "https://m.media-amazon.com/images/M/MV5BMTU4MDk5NzcxMV5BMl5BanBnXkFtZTgwMTYyNTc1NzE@._V1_.jpg", src: "https://ok.ru/video/1951962302977", year: 2015, genre: "Dram", id: "delibal" },
  { title: "Avcı Kraven / Kraven The Hunter", cover:"https://m.media-amazon.com/images/M/MV5BZDU0YTI5ODAtN2NmMS00YTg3LTgyNDItN2RmOWEzOTkzZjcyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vvjs_VV2PZkQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2024, genre:"Fantastik", id: "kraventhehunter" },
  { title: "Ormanın kitabı / The Jungle Book", cover: "https://m.media-amazon.com/images/M/MV5BNTk3M2NmNTItNDYwNy00MzRlLWI5M2UtZmYwODA2NTExZDRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vWEUn7fUkQ3U?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1994, genre: "Macəra", id: "thejunglebook" },
  { title: "Truva / Troy", cover: "https://m.media-amazon.com/images/M/MV5BMTk5MzU1MDMwMF5BMl5BanBnXkFtZTcwNjczODMzMw@@._V1_.jpg", src: "https://vidmoly.me/dl/1jekl83xhmkk", year: 2004, genre: "Dram", id: "troy" },
  { title: "Eternals", cover: "https://m.media-amazon.com/images/I/81TNKv3ZUnL.jpg", src: "https://dzen.ru/embed/v7HPZOjOEiUI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Fantastik", id: "eternals" },
  { title: "Bir koyun polisiyesi / The Sheep Dedectives", cover: "https://m.media-amazon.com/images/M/MV5BNTFmZWI4YmMtNmQ0ZC00ZGQwLTk1OWEtZjAyZmIzOGY0MGFiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14947931589225", year: 2026, genre: "Komediya", id: "thesheepdedectives" },
  { title: "Kimin kardeşi? / Little Brother", cover: "https://m.media-amazon.com/images/M/MV5BNDVmOWNhNWYtM2Y1MS00MWFjLTlkNTctMTRkNmMxM2UwODZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14959745174121", year: 2026, genre: "Komediya", id: "littlebrother" },
  { title: "Acemi sürücüler / Driver's Ed", cover: "https://m.media-amazon.com/images/M/MV5BMmQyM2UwMTItNzBmMi00OTEzLWFmYmEtZTI1NzJhMzBlN2EzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14977848642153", year: 2025, genre: "Komediya", id: "driversed" }, 
  { title: "Kaçak fil / Hitpig!", cover: "https://m.media-amazon.com/images/M/MV5BYjdlYTJjNWEtYjdkOS00ODUzLWEwMGItYjY3OWNkNWM2ZDc1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14970522962537", year: 2024, genre: "Animasiya", id: "hitpig" },
  { title: "Uykusuz / Sleepless", cover: "https://m.media-amazon.com/images/M/MV5BNjEwMDAyOTM4OV5BMl5BanBnXkFtZTgwMzc4MjMyMDI@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/4207354710609", year: 2017, genre: "Aksiyon", id: "sleepless" },
  { title: "Kolonya Cumhuriyeti", cover: "https://m.media-amazon.com/images/M/MV5BYzRkYmU5NDMtMzFhMi00YTQ4LTllOTMtZDc1ZmFjZWYwNTkxXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7765646641871", year: 2017, genre: "Komediya", id: "kolonyacumhuriyeti" },
  { title: "Yakın tehdit / The Trespass", cover: "https://m.media-amazon.com/images/M/MV5BMTM4NTc0Mzk5N15BMl5BanBnXkFtZTcwNDA4NDUyNg@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vCGGDbs6-YA4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Aksiyon", id: "trespass" },
  { title: "Bilgisayar korsanı / Hacker", cover: "https://m.media-amazon.com/images/M/MV5BOTJhMWVmM2QtNzg4NS00Y2Q5LTk0YmYtODg2N2ViZTYwYzA5XkEyXkFqcGc@._V1_.jpg", src: "https://m.ok.ru/video/7488607226369", year: 2016, genre: "Aksiyon", id: "hacker" },
  { title: "Hacker / Blackhat", cover: "https://m.media-amazon.com/images/M/MV5BYzRiNDBjZmUtOGFkYS00OGZkLWJlZjctZDVmMmZkMGQ3ZDliXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/4428129897041", year: 2015, genre: "Aksiyon", id: "blackhat" },
  { title: "Ölümcül takip / I.T.", cover: "https://m.media-amazon.com/images/M/MV5BMTkzMzY3MzYzNF5BMl5BanBnXkFtZTgwNzgzMTA3OTE@._V1_.jpg", src: "https://ok.ru/video/2610321623633", year: 2017, genre: "Aksiyon", id: "it" },
  { title: "Öteki / The Double", cover: "https://m.media-amazon.com/images/M/MV5BYTY1ZjQyZWQtN2Q0MC00YThmLWI4MTMtODlmYmU0YTczNmY4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/21334919761", year: 2013, genre: "Triller", id: "thedouble" },
  { title: "Geride kalanlar / Left Behind", cover: "https://m.media-amazon.com/images/M/MV5BMjI4MjA2OTQxMF5BMl5BanBnXkFtZTgwMjcyMTI2MjE@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14912909806185", year: 2014, genre: "Aksiyon", id: "leftbehind" },
  { title: "Kaybedenler kulübü: Yolda", cover: "https://m.media-amazon.com/images/M/MV5BZmJjMDAwOWItOWRmNy00YmFiLTk4NmUtODdhYjA3ZTA3ZDYzXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/5256270973621", year: 2018, genre: "Dram", id: "kaybedenlerkulubu2" },
  { title: "Kaybedenler kulübü", cover: "https://m.media-amazon.com/images/M/MV5BZGQ5Y2ViZmUtNDZkNC00ZWJhLWIwOWEtZDNjMjIzZDIzYzIyXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14921389640297", year: 2011, genre: "Dram", id: "kaybedenlerkulubu" },
  { title: "Kocalar iş başında / Husbands in Action", cover: "https://m.media-amazon.com/images/M/MV5BOTUyMjUwNzctNzk3Yi00YTIwLTlhN2QtMTU4MTIzN2Q4OTkzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14851169192553", year: 2026, genre: "Komediya", id: "husbandsinaction" },
  { title: "Isabelle'e sesli mesaj / Voicemails for Isabelle", cover: "https://m.media-amazon.com/images/M/MV5BMTE3MmE2MTYtMjA4OC00ZTIxLWFlNWYtZjk4ZTBkZDdiYzU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14849178143337", year: 2026, genre: "Romantik", id: "voicemailsforisabelle" },
  { title: "Ölümcül uçuş / Flight Risk", cover: "https://m.media-amazon.com/images/M/MV5BOGZlZjAyYTItMDdjYy00OGZlLWI3NDAtYzM5ZjAwNjg0NWUxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/x54agxqmnbfo", year: 2025, genre: "Aksiyon", id: "flightrisk" }, 
  { title: "Bugün güzel", cover: "https://m.media-amazon.com/images/M/MV5BNzI0ODQxYTItMzc4MS00Y2FlLWIwNzQtMDMyZTRiODYyOTI3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.vkvideo.ru/video359563763_456242091", year: 2025, genre: "Komediya", id: "bugunguzel" },
  { title: "Undertone", cover: "https://m.media-amazon.com/images/M/MV5BZDY1YzI5NWUtYTdmYi00N2YyLWJmOWMtYWZiZTY5NTE0MjIxXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/88fc520e8zut", year: 2025, genre: "Qorxu", id: "undertone" },
  { title: "Kaptan Marvel / Captain Marvel", cover:"https://m.media-amazon.com/images/M/MV5BZDI1NGU2ODAtNzBiNy00MWY5LWIyMGEtZjUxZjUwZmZiNjBlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmoly.me/dl/9lyyosm3kbhz", year:2019, genre:"Fantastik", id: "captainmarvel" },
  { title: "Alaska", cover: "https://m.media-amazon.com/images/M/MV5BMTcyMjI1MTUzOV5BMl5BanBnXkFtZTgwMTgxOTEyNzE@._V1_.jpg", src: "https://my.mail.ru/video/embed/5961367452402057769", year: 2015, genre: "Dram", id: "alaska" },
  { title: "Sosyal ağ / The Social Network", cover: "https://m.media-amazon.com/images/M/MV5BM2JlMGNmYjktNTYxMi00M2I0LThjMWQtYzU1MjcyYmFlN2U1XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vLRQPlWSshxg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2010, genre: "Bioqrafiya", id: "thesocialnetwork" },
  { title: "Göz göze / Eye for an Eye", cover: "https://m.media-amazon.com/images/M/MV5BODg0ZjgyODYtZjJmYi00MTU4LTgyYTEtYmJiOGRhMjg4NTliXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456242067", year: 2025, genre: "Qorxu", id: "eyeforaneye" },
  { title: "Adam'ın iyiliği için / Adam's Sake", cover: "https://m.media-amazon.com/images/M/MV5BZDhmNmIxMmEtZTkzNy00OGZiLThkNTEtMGU5NmNjZjc2YmY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456242059", year: 2025, genre: "Dram", id: "adamssake" },
  { title: "Seni öldürecekler / They Will Kill You", cover: "https://m.media-amazon.com/images/M/MV5BYjg5ZjQ0ZGQtMmY1NS00NTgyLTlkZWYtMDhlNzE3ZGY5ZDdmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14740264585833", year: 2026, genre: "Qorxu", id: "theywillkillyou" },
  { title: "Yuvadan uzakta / Out of the Nest", cover: "https://m.media-amazon.com/images/M/MV5BNThlZDFkYTAtZWE0Yi00NTgzLTgxMTEtMTVkYzViZDNiOGIwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241031", year: 2024, genre: "Animasiya", id: "outofthenest" },
  { title: "Michael", cover: "https://m.media-amazon.com/images/M/MV5BNzllNmRlN2EtMDQyOC00ODJjLTg4OWQtZDNmNGU3YzlkNjc1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/r5aob60gvnah", year: 2026, genre: "Bioqrafiya", id: "michael" },
  { title: "Panda planı 2:  Büyülü kabile / Panda plan 2: The Magical Tribe", cover: "https://m.media-amazon.com/images/M/MV5BNTdhNDcwNWQtN2E4OS00MTg1LWIxNzctNGZhZTZhZmMzZTAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14721868827241", year: 2026, genre: "Aksiyon", id: "pandaplan2" },
  { title: "Panda planı  / Panda plan", cover: "https://m.media-amazon.com/images/M/MV5BNjUwM2YxNDQtZjAwMi00ZGI5LWJjZGEtZTczZThmYTQ4YTIwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/yaxulh9f6rx1", year: 2024, genre: "Aksiyon", id: "pandaplan" },
  { title: "Kötülüğün rengi: Siyah  / Colors of Evil: Black", cover: "https://m.media-amazon.com/images/M/MV5BMjQ0YzU1NTktYjYzMS00ZTUyLWFlYjQtNTRiOWJiZDVkZTFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14699097098857", year: 2026, genre: "Triller", id: "colorsofevilblack" },
  { title: "Kötülüğün rengi: Kırmızı  / Colors of Evil: Red", cover: "https://dnm.nflximg.net/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABe5_RjLw0h0sglmRVw8THY78_i6SwHuFXf4GaVybevCT50NoKJSjEBTwwIJrxAQkMWhZEutlOWuWAvMbT9EcJiyJyc02M8BE5u8c.jpg", src: "https://ok.ru/video/8281381276241", year: 2024, genre: "Triller", id: "colorsofevilred" },
  { title: "Ölünü göreyim / Over Your Dead Body", cover: "https://m.media-amazon.com/images/M/MV5BNzgzMzUzZmMtZTM4MS00YzM2LWJmZjgtY2EwNjUyNTlkNDUxXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14699097295465", year: 2026, genre: "Triller", id: "overyourdeadbody" },
  { title: "Kağıttan hayatlar", cover: "https://m.media-amazon.com/images/M/MV5BZTQ4NjZmMzctZDUxZC00YzczLWJkYTItMDM4ZTM0OThmMjM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/3121591618129", year: 2022, genre: "Dram", id: "kagittanhayatlar" },
  { title: "Kırmızı bülten / Red Notice", cover: "https://m.media-amazon.com/images/M/MV5BODllNDM2Y2ItYjc0Yi00MzZjLWFlYTYtYTFkYzUyMzk4MGYxXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/qba2vsbep6qd", year: 2021, genre: "Aksiyon", id: "rednotice" },
  { title: "Next", cover: "https://m.media-amazon.com/images/M/MV5BMzQ5ZGYwYmMtOTZmOS00MmUwLWIxYjAtNGM3NWFmMTdjMmY0XkEyXkFqcGc@._V1_.jpg", src: "https://my.mail.ru/video/embed/2812081686177648266", year: 2007, genre: "Elmi fantastik", id: "next" },
  { title: "Yılın gelini / Bride of the Year", cover: "https://statichdrezka.ac/i/2026/5/15/d5a89ac5787d2kq97h57y.jpg", src: "https://vkvideo.ru/video359563763_456241950", year: 2026, genre: "Komediya", id: "brideoftheyear" },
  { title: "Olağanüstü akıllı yaratıklar / Remarkably Bright Creatures", cover: "https://m.media-amazon.com/images/M/MV5BNzM3OTRlZDktYTk0OS00OTlmLWFhMjctMTZiODU4N2RiYzhhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14101251164777", year: 2026, genre: "Dram", id: "remarkablybrightcreatures" },
  { title: "Bahçedeki kadın / The Woman in the Yard", cover: "https://m.media-amazon.com/images/M/MV5BNmZjZTA2ZmQtMDhiYS00NTlmLTk2NTctNTZlMzVhZmVjYTYyXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/10245770709674", year: 2025, genre: "Qorxu", id: "thewomanintheyard" },
  { title: "V for Vendetta", cover: "https://m.media-amazon.com/images/M/MV5BMGU1MmMwNzctOTM2OS00ZTljLTg3NzUtYzRkN2QxN2Y3ZmU0XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vv026bW7XRU4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2005, genre: "Aksiyon", id: "vforvendetta" },
  { title: "Av / Rogue", cover: "https://m.media-amazon.com/images/M/MV5BZmZkZWY5ZjItYjJjYi00MjA3LTk3ZGMtMmFiYzMzYTJlZDNhXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vY8n4j10jrAI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2020, genre: "Aksiyon", id: "rogue" },
  { title: "Sihirli plan / Klaus", cover: "https://m.media-amazon.com/images/M/MV5BNmI4YzU4NWEtNTMwNi00MzIzLTgzYmUtNzlmOWRiNDgzZWRlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vEZwoJAUP4R0?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Animasiya", id: "klaus" },
  { title: "Yerime geç / Swapped", cover: "https://m.media-amazon.com/images/M/MV5BNWFlNWM2Y2YtY2VhOC00MWFiLWExNWYtYWViYzJhMDQyMTJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/13970951309929", year: 2026, genre: "Animasiya", id: "swapped" },
  { title: "Raya ve Son Ejderha / Raya and the Last Dragon", cover: "https://m.media-amazon.com/images/M/MV5BYmViOTM3MjMtNTM0OS00OGFlLWE5ZGEtZDlkMmU4MTgwYmE5XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vTfQ-bADzcCg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Animasiya", id: "rayaandthelastdragon" },
  { title: "Bizim mutlu noelimiz / A Merry Little Ex-Mas", cover: "https://m.media-amazon.com/images/M/MV5BNjBlMTdiN2EtNzQ5MS00ODQ0LWI3NWUtYjdmMDU2N2Y4YWQ2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9988897966697", year: 2025, genre: "Romantik", id: "amerrylittleexmas" },
  { title: "Merv", cover: "https://m.media-amazon.com/images/M/MV5BNmExNjYzNzMtOTJiYS00MmY2LThlN2UtODk5MjhkMmQwN2NjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/sj7p98ww316e", year: 2025, genre: "Romantik", id: "merv" },
  { title: "Nakavt / K.O.", cover: "https://m.media-amazon.com/images/M/MV5BZTExNjM4NzAtY2FiZS00M2VmLWE1MjUtNWM1MTk3YTg1ZjQwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9367826991721", year: 2025, genre: "Aksiyon", id: "ko" },
  { title: "Gerçek masallar / Bedtime Stories", cover: "https://m.media-amazon.com/images/M/MV5BNmM0NTkxOWEtNWM2Yy00NDZhLTk2MTgtNjJlNDMxMzUzMjhiXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vWRkmPzaNox0?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Komediya", id: "bedtimestories" },
  { title: "Katil makine / War Machine", cover: "https://m.media-amazon.com/images/M/MV5BMmM1ZTc5ZTYtOTM2My00MjBmLWE5NzktYzkyYzdlYWE3ZDAzXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241333", year: 2026, genre: "Elmi fantastik", id: "warmachine" },
  { title: "Derin kargaşa / Havoc", cover: "https://m.media-amazon.com/images/I/81jqLmsOMpL.jpg", src: "https://ok.ru/video/9245286468201", year: 2025, genre: "Aksiyon", id: "havoc" },
  { title: "Shang-Chi ve on halka efsanesi / Shang-Chi and the Legend of the Ten Rings", cover: "https://m.media-amazon.com/images/M/MV5BNTM3YmVkZmYtY2MxOS00MjliLTk1MDEtYzE0OTU4MWI4ZmIxXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/xuwbitekhb4j", year: 2021, genre: "Fantastik", id: "shangchi" },
  { title: "Robot köpek A-X-L / A-X-L", cover: "https://m.media-amazon.com/images/M/MV5BYTRkMzFlZjItYWM0Ni00NWQwLTk3MWEtYjg5ZjQ0MDE2ZDFhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/1164660836998", year: 2018, genre: "Elmi fantastik", id: "axl" },
  { title: "İntikam / Revenge", cover: "https://m.media-amazon.com/images/M/MV5BNWVjZTNmYWItYzdkNy00YWViLWFhNjktZDk4YTFkZWJlOTcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/iiykba7ztd6t", year: 2026, genre: "Aksiyon", id: "revenge" },
  { title: "Mulan", cover: "https://m.media-amazon.com/images/M/MV5BYWJiZDg3ZWEtYWZkMC00Zjc1LTkzYTctZWFkODk2MDlmOGNiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v9bhoMv5SZls?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2020, genre: "Aksiyon", id: "mulan2020" },
  { title: "High Rollers", cover: "https://m.media-amazon.com/images/S/pv-target-images/c5c0ac86cef2ebfbafa5217972be8884ff3e1ed494652e4b1a21ad6fadcfb44e.jpg", src: "https://ok.ru/video/9492997081705", year: 2025, genre: "Aksiyon", id: "highrollers" },
  { title: "İsimsiz kadın / The Marked Woman", cover: "https://m.media-amazon.com/images/M/MV5BMmVkYmE0YTktNGQxZS00MjQ1LTgzZjUtNmQyNWU3ZDY1MmFlXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14614546483817", year: 2026, genre: "Triller", id: "themarkedwoman" },
  { title: "Konuş, havla, değiş / Eat Pray Bark", cover: "https://m.media-amazon.com/images/M/MV5BYTFjMTgyMzItZDMwMC00NzEzLThmOWItYjg2YjU2MTU5NjgyXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241600", year: 2026, genre: "Komediya", id: "eatpraybark" },
  { title: "İyi çocuk / Good Boy", cover: "https://m.media-amazon.com/images/M/MV5BOWJlOGU1NDctMWMwNS00MjQzLTk4MDMtYTEwZDlmZGJmMGZkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14159661173353", year: 2026, genre: "Triller", id: "heel" },
  { title: "Tom ve Jerry / Tom and Jerry", cover:"https://m.media-amazon.com/images/M/MV5BNDZmYzhhODktM2UyZC00MzNmLWIwMmEtYTUxZWRhOTViMTViXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/v8LX_RIzdWGg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Macəra", id: "tomandjerry" },
  { title: "Christy", cover: "https://m.media-amazon.com/images/M/MV5BM2E5MjhjODgtYzg0MS00NTlhLWIyZTktYjRjOTM1MDJlZWI4XkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video359563763_456241291", year: 2025, genre: "Bioqrafiya", id: "christy" },
  { title: "Her gün / Every Day", cover: "https://m.media-amazon.com/images/S/pv-target-images/ab9796f5979f14d4a6f4934b33340349fc12dd5b62cadcabb78cb453ccfa8de0.jpg", src: "https://dzen.ru/embed/vwWfanhs2gns?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Romantik", id: "everyday" },
  { title: "Sessiz bir yer: Birinci gün / A Quiet Place: Giorno 1", cover: "https://m.media-amazon.com/images/M/MV5BMDdjZTljZWMtMDIwNi00MTA5LTkxZmItNmY0NDA3ZDM0N2M2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/8838271142570", year: 2024, genre: "Triller", id: "aquietplace" },
  { title: "Accused", cover: "https://m.media-amazon.com/images/M/MV5BNzhmM2U5ZTktY2U1Yy00NjU3LTllYjktNzJhM2VlMjJhYjY4XkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video359563763_456241277", year: 2026, genre: "Dram", id: "accused" },
  { title: "Peaky Blinders: Ölümsüz adam / Peaky Blinders: The Immortal Man", cover: "https://m.media-amazon.com/images/M/MV5BNTdlNTNjNjctYTg2MC00NTFlLTliNTctODFiZjZmNWRkYTVlXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/12445598354025", year: 2026, genre: "Dram", id: "peakyblinders" },
  { title: "Merhamet yok / Mercy", cover: "https://m.media-amazon.com/images/M/MV5BMWJmYjcwMTMtMDU1ZC00ZGI5LTlmZDAtODI3NDA2ZTE5ZGVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/11581091416681", year: 2026, genre: "Elmi fantastik", id: "mercy" },
  { title: "Göz açıp kapayıncaya kadar / In the Blink of an Eye", cover: "https://m.media-amazon.com/images/M/MV5BYjNhNjQ2Y2ItMGM5ZC00OWE4LWEwZjItOWM5ZTdkYmYyZjE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456241275", year: 2026, genre: "Dram", id: "intheblinkofaneye" },
  { title: "Bizim için Şampiyon (Bold Pilot)", cover: "https://m.media-amazon.com/images/S/pv-target-images/444184fdfb75d763999a2499c801cd8aaf0a50583937d8f47fc2783b092e0c21.jpg", src: "https://m.ok.ru/video/8948822313658", year: 2018, genre: "Bioqrafiya", id: "boldpilot" },
  { title: "Cebimdeki yabancı", cover: "https://m.media-amazon.com/images/M/MV5BNDJlZTFjZDQtMjI4NS00YTQ3LWE5NzEtYWQzOTkyM2NlZDJiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.vkvideo.ru/video1019390595_456239034", year: 2018, genre: "Dram", id: "cebimdekiyabanci" },
  { title: "Kanlı sular / Thrash", cover: "https://m.media-amazon.com/images/M/MV5BNWY2ZGFkNjktOWQ1NC00YjYzLTgzY2EtYzg3NTc1MDFkOWM3XkEyXkFqcGc@._V1_.jpg", src: "https://m.vkvideo.ru/video359563763_456241735", year: 2026, genre: "Triller", id: "thrash" },
  { title: "Korku seansı: Son Ayin / The Conjuring: Last Rites", cover: "https://m.media-amazon.com/images/M/MV5BMmNmNTg3ZjctYjZlZS00MDBlLThmNmUtNzFhZGQ4OTVjMjM5XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/o8EYqhocJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2025, genre: "Qorxu", id: "lastrites" },
  { title: "Hız tuzağı / Speed", cover: "https://m.media-amazon.com/images/M/MV5BMDc2ODI5YWQtMmM2ZS00MTdmLWEyNWEtNmRmOGE5NGZlYWMzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vwncAk2TRfWA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1994, genre: "Aksiyon", id: "speed" },
  { title: "Geliş / Arrival", cover: "https://m.media-amazon.com/images/M/MV5BMTExMzU0ODcxNDheQTJeQWpwZ15BbWU4MDE1OTI4MzAy._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/c7jto9jqknk4", year: 2016, genre: "Elmi fantastik", id: "arrival" },
  { title: "The Punisher: One Last Kill", cover: "https://m.media-amazon.com/images/M/MV5BYzdhZTI5YWQtOTE5ZS00YmE1LTgxOWUtN2ZiMzYwOGU5OWNhXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241940", year: 2026, genre: "Aksiyon", id: "thepunisher" },
  { title: "Roommates", cover: "https://m.media-amazon.com/images/M/MV5BYjk2YmRhNTItOGY5Ni00MjgwLTk4ZGMtMzE0MTQzMmMxYWRlXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/13461637433961", year: 2026, genre: "Komediya", id: "roommates" },
  { title: "Ofis aşkı / Office Romance", cover: "https://m.media-amazon.com/images/M/MV5BZmM0MDlhOTMtNjYxYy00MGI4LWEwODQtZTEyOTFhZTUyMTllXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14614066170473", year: 2026, genre: "Romantik", id: "officeromance" },
  { title: "Kır zincirlerini / Unleashed", cover: "https://m.media-amazon.com/images/M/MV5BMTgwNjIyNTczMF5BMl5BanBnXkFtZTcwODI5MDkyMQ@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vAsdgIhbtLUo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2005, genre: "Aksiyon", id: "unleashed" },
  { title: "On saniye", cover: "https://m.media-amazon.com/images/M/MV5BMDdjMjAzNTktZDUxNS00MzYxLTk2M2YtNTk4NDljNGE4NmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456240051", year: 2024, genre: "Dram", id: "onsaniye" },
  { title: "Hoplayanlar / Hoppers", cover: "https://m.media-amazon.com/images/M/MV5BZTI4YzAxNjUtM2ZhZS00MmFkLWI1YTYtZGViNWM5MzA1NDQxXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/p2y4zv7my4tk", year: 2026, genre: "Animasiya", id: "hoppers" },
  { title: "Dünyanın merkezine yolculuk / Journey to the Center of the Earth", cover: "https://m.media-amazon.com/images/M/MV5BNTMyMGQ4MWYtZmMyYi00M2JhLWFhZmQtNWM5MTVjYjk1MTYxXkEyXkFqcGc@._V1_.jpg", src: "https://m.ok.ru/video/27941014237", year: 2008, genre: "Macəra", id: "journeytothecenteroftheearth" },
  { title: "Lamborghini: Efsanenin arkasındaki adam / Lamborghini: The Man Behind the Legend", cover: "https://m.media-amazon.com/images/M/MV5BMmY3MDAyNDQtYmE2ZS00ZTBiLTgxZjctYTUwOGFjOThmMGU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/6391565585066", year: 2022, genre: "Bioqrafiya", id: "lamborghini" },
  { title: "Vicious", cover: "https://m.media-amazon.com/images/M/MV5BMzNiMjhmNWQtNjJhZS00MGFkLTk3MDEtOWRmMjBjYTUwZTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9958881233513", year: 2025, genre: "Qorxu", id: "vicious" },
  { title: "Kızıl Hare / Ride On", cover: "https://m.media-amazon.com/images/M/MV5BMjVmNzIyNDMtNWIyZi00ZGYxLThlZjYtMWQ2MDVkNTNhMDM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/7698129881770", year: 2023, genre: "Macəra", id: "rideon" },
  { title: "Sevgili suikastçım / My Dearest Assassin", cover: "https://m.media-amazon.com/images/M/MV5BZTMyMDM1ZjMtZjIyZS00MGMwLThiOTItZDk0MWE4MzNlZjExXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14081963788905", year: 2026, genre: "Aksiyon", id: "mydearestassassin" },
  { title: "Uncharted", cover: "https://m.media-amazon.com/images/M/MV5BYjQxYWNiNzgtOTc2Yi00OGEwLTk5MjAtODdiZTk0ZDJlZGY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vNE4MmN0CDG4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2022, genre: "Macəra", id: "uncharted" },
  { title: "Atatürk 1", cover: "https://m.media-amazon.com/images/M/MV5BYTEwZjUzMDQtY2YwNi00OTY4LTg0ZDYtNWZmYzIxYjM0YTU1XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9190331255377", year: 2024, genre: "Bioqrafiya", id: "ataturk1" },
  { title: "Anka", cover: "https://m.media-amazon.com/images/M/MV5BNDUwN2ZlNzQtYWM1ZS00Mjk0LTgwMzktNjJkZThjZTM5MTJjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/3541046200966", year: 2022, genre: "Dram", id: "anka" },
  { title: "Oxford aşkım / My Oxford Year", cover: "https://m.media-amazon.com/images/M/MV5BMWU0YTc0OWYtOWJjNy00ZDYzLWFlMTItMGZkNzM4YjQ5OWQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9528533060201", year: 2025, genre: "Romantik", id: "myoxfordyear" },
  { title: "Kana susadım / Jennifer's Body", cover: "https://m.media-amazon.com/images/M/MV5BMTMxNzYwMjc1Ml5BMl5BanBnXkFtZTcwNDI3MDE3Mg@@._V1_.jpg", src: "https://ok.ru/video/739458878139", year: 2009, genre: "Qorxu", id: "jennifersbody" },
  { title: "Adalet / The Equalizer", cover: "https://m.media-amazon.com/images/M/MV5BMTQ2MzE2NTk0NF5BMl5BanBnXkFtZTgwOTM3NTk1MjE@._V1_.jpg", src: "https://ok.ru/video/9903725611625", year: 2014, genre: "Aksiyon", id: "theequalizer" },
  { title: "Lefter: Bir Ordinaryüs Hikayesi", cover: "https://m.media-amazon.com/images/M/MV5BZThkNDM1MGItYjYxZC00ZjJlLTk2YjMtYWJkZGU2MGFmYWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://drive.google.com/file/d/1fiil2V-_1kxy_Y0SSYoNngBoi2Lha-2i/view?usp=drive_link", year: 2025, genre: "Bioqrafiya", id: "lefter" },
  { title: "Atlayıcı / Jumper", cover: "https://m.media-amazon.com/images/M/MV5BMWQ3NjA3NTYtNDJiYi00ZTE0LWFmNzMtZjc0NTUxNjk2YTFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/28983560785", year: 2008, genre: "Aksiyon", id: "jumper" },
  { title: "Şaman ayini / Shaman", cover: "https://m.media-amazon.com/images/M/MV5BMTM5YzZjNDAtYTc5My00NWE5LWFiYTEtODkzODViZTU2MTg1XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241394", year: 2025, genre: "Qorxu", id: "shaman" },
  { title: "Çilek", cover: "https://m.media-amazon.com/images/M/MV5BMDdmYmMyYTQtYjgyZS00NjczLTk2ZmUtZGE0NGMwNzFkMDU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.ok.ru/video/33652935279", year: 2014, genre: "Macəra", id: "cilek" },
  { title: "Gezegen 51 / Planet 51", cover: "https://m.media-amazon.com/images/M/MV5BOGJkZGRhOWItOTM2Ni00ZmFhLThlNDItMDA4YTI4YTc5NTI4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/3523652487761", year: 2009, genre: "Animasiya", id: "planet51" },
  { title: "Geri sayım", cover: "https://m.media-amazon.com/images/M/MV5BZDQ2YTViODQtZjBhNi00ZmQ5LWE1N2YtOWYxOTQxNjkyOGE3XkEyXkFqcGc@._V1_.jpg", src: "https://www.dailymotion.com/video/x9tkbk6", year: 2023, genre: "Aksiyon", id: "gerisayim" },
  { title: "Ruth & Boaz", cover: "https://m.media-amazon.com/images/M/MV5BMzU0Mjc1YzktYTc5ZC00OTk2LWExODAtN2UwOGNiN2Q0Y2E4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9719808658025", year: 2025, genre: "Romantik", id: "ruthandboaz" },
  { title: "Unbreakable / Split / Glass", cover: "https://images.theposterdb.com/prod/public/images/meta/collections/optimized/43491/poster.webp", src: "https://m.ok.ru/video/2586038831803", year: "2000, 2016, 2019", genre: "Trilogy", id: "trilogy" },
  { title: "Noel soygunu / Jingle Bell Heist", cover: "https://m.media-amazon.com/images/M/MV5BM2JiNjdiN2QtNjlmMS00NzExLTlmZTEtOTVmNzNmYzhmZTc3XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/10088770570857", year: 2025, genre: "Komediya", id: "jinglebellheist" },
  { title: "Gözcüler / The Watchers", cover: "https://m.media-amazon.com/images/M/MV5BN2I3MjIzYzMtNDkxNS00ZDIzLWEzZjktNDJlZDZlOGZlMTMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456240901", year: 2024, genre: "Triller", id: "thewatchers" },
  { title: "Arıcı: Ölüm kovanı / The Beekeeper", cover: "https://m.media-amazon.com/images/M/MV5BNzg3YjVmZGYtOTc5MC00MDdiLTllOTYtZWQ0ODQ1MmMyNTExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://s16.imgmania.org/mr/ITuyYxWyMJgyMKOypv4lZQV0YxWfqKWurF4kZQtjpP5RIHSZd0zxnJ1aoJShnJRho3Was0xi16vr1.m3u8", year: 2024, genre: "Aksiyon", id: "thebeekeeper" },
  { title: "Sıkıysa yakala / Catch Me If You Can", cover: "https://m.media-amazon.com/images/M/MV5BM2FjZTU2ZTYtNTgzNi00MTlmLWE3N2UtZGRiYmE5ZDVmMmVlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vhMuHZjHxkCM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2002, genre: "Macəra", id: "catchmeifyoucan" },
  { title: "Ördeklerin göçü / Migration", cover: "https://m.media-amazon.com/images/M/MV5BNjYwNjhhN2UtYTM3My00Yzk3LWIwMTMtNmE4ZWQ1ZTVjYzQwXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7642400295594", year: 2023, genre: "Animasiya", id: "migration" },
  { title: "Yaban arısı / The Wasp", cover: "https://m.media-amazon.com/images/M/MV5BNzE1YTljYTgtNzczZi00NTAyLThkYjUtYWExZDU4ZTY5YTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9709873728170", year: 2024, genre: "Triller", id: "thewasp" },
  { title: "Superman", cover:"https://m.media-amazon.com/images/M/MV5BOWRiOTg1YTctNDk4Yi00ZjlhLThhNzEtZTVlMThkN2JkYTE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmoly.me/dl/bq8wsb100tdm", year:2025, genre:"Fantastik", id: "superman" },
  { title: "Sihir Gizli Servisi / Secret Magic Control Agency", cover: "https://m.media-amazon.com/images/I/71hRh90EEeL._AC_UF894,1000_QL80_FMwebp_.jpg", src: "https://my.mail.ru/video/embed/2812081686177647812", year: 2021, genre: "Animasiya", id: "secretmagiccontrolagency" },
  { title: "Kayara", cover: "https://m.media-amazon.com/images/M/MV5BY2YxNzg4ZmEtNTdjNy00MTQ0LTgyYTQtNDY4NTQ2YjUwNmQ2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9962068052650", year: 2025, genre: "Animasiya", id: "kayara" },
  { title: "Ben kimim / Who Am I", cover: "https://m.media-amazon.com/images/M/MV5BZDFmNDY0NWUtMzZhYS00ZDk4LTg0MWItMTg5MDliZWExNmI4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/3620082158161", year: 2014, genre: "Triller", id: "whoami" },
  { title: "Ölümcül zerafet / Pretty Lethal", cover: "https://m.media-amazon.com/images/M/MV5BMTRmMTE4MmYtOWRmNi00ZDJjLWFmY2UtNTliMzlkNTUzNDRjXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/12617144994409", year: 2026, genre: "Triller", id: "prettylethal" },
  { title: "Frankenstein", cover: "https://m.media-amazon.com/images/M/MV5BOGI1ZGY4ODUtMDJlNy00YTdhLWEwNTctMTQ3ZWYwMGUwNTc1XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9951088806505", year: 2025, genre: "Fantastik", id: "frankenstein" },
  { title: "Alfa kurt / Alpha", cover: "https://m.media-amazon.com/images/M/MV5BODI4OTk1ODY3N15BMl5BanBnXkFtZTgwMDI1MTcwNjM@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456239083", year: 2018, genre: "Macəra", id: "alpha" },
  { title: "Başlangıç / Inception", cover: "https://m.media-amazon.com/images/M/MV5BZjhkNjM0ZTMtNGM5MC00ZTQ3LTk3YmYtZTkzYzdiNWE0ZTA2XkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/d/6nipillcfz3v", year: 2010, genre: "Elmi fantastik", id: "inception" },
  { title: "Oda / The Room", cover: "https://m.media-amazon.com/images/S/pv-target-images/ee3aff934c28a9cf68a54a36507e3ea93c9c9113b08d7a8f9797765656c25ca5.jpg", src: "https://dzen.ru/embed/vj-OdUVC37Vo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Qorxu", id: "theroom" },
  { title: "Kayıp balık Dori / Finding Dory", cover: "https://m.media-amazon.com/images/M/MV5BOWI1NTQ3NjMtMjk5OC00MjRlLTg0MTgtMDMyZTJhNzYxZDMwXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vGhPIvItdEkI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2016, genre: "Animasiya", id: "findingdory" },
  { title: "Gölgenin kenarı / The Shadow's Edge", cover: "https://m.media-amazon.com/images/M/MV5BODM1MTNhMjMtMDYxNS00M2ZkLTkwODMtYzEwNzQ1YTFmYzJkXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241716", year: 2025, genre: "Aksiyon", id: "theshadowesedge" },
  { title: "Biker", cover: "https://m.media-amazon.com/images/M/MV5BMDRjOGQ1MGQtZjAzNS00NzliLWIxZGUtY2U1ODgzYTQ3MmU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241985", year: 2026, genre: "Dram", id: "biker" },
  { title: "Avın ardından / After the Hunt", cover: "https://m.media-amazon.com/images/M/MV5BMzYyOTAwODEtZTY4My00MjVkLWJjYjUtMjE2N2UzYTE3MTY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/rcbu9dxn46yr", year: 2025, genre: "Triller", id: "afterthehunt" },
  { title: "39. Dosya / Case 39", cover: "https://m.media-amazon.com/images/M/MV5BNTA4NDUyOTE5NV5BMl5BanBnXkFtZTcwOTQ3NzY3Mw@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vPv9PS3YoqTg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2009, genre: "Triller", id: "case39" },
  { title: "UFO", cover: "https://m.media-amazon.com/images/M/MV5BNmI1YmEzMTAtMDk4ZS00ZWZmLWFiMWYtYjk0MjcxZGU1MTgxXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/4275651086929", year: 2022, genre: "Dram", id: "ufo" },
  { title: "Kusursuz / Flawless", cover: "https://m.media-amazon.com/images/M/MV5BMjA1NTQ2NDU5MF5BMl5BanBnXkFtZTcwODI1MzI2MQ@@._V1_FMjpg_UX1000_.jpg", src: "https://www.ok.ru/video/184715577870", year: 2007, genre: "Triller", id: "flawless" },
  { title: "Bir şans daha / Last Christmas", cover: "https://m.media-amazon.com/images/M/MV5BY2NlNTMwYzgtZjI2Ny00ZWExLWE2NDUtNzFlYTQyMmY1NjkwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vm-MrandBzks?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Romantik", id: "lastchristmas" },
  { title: "Sevimli tehlikeli", cover: "https://m.media-amazon.com/images/M/MV5BNTg2MzU5ODA1Nl5BMl5BanBnXkFtZTgwMTk2NzA0NDE@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9007400329", year: 2015, genre: "Romantik", id: "sevimlitehlikeli" },
  { title: "Şampanya yüzünden / Champagne Problems", cover: "https://m.media-amazon.com/images/M/MV5BYmZiMTZlMzktOGMxYi00MGJhLWI4YTUtYTAwNTU5Y2UyMGNlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10041178917481", year: 2025, genre: "Romantik", id: "champagneproblems" },
  { title: "Sev beni sev beni / Love me Love me", cover: "https://m.media-amazon.com/images/M/MV5BMjRlN2RkMWUtMjJjNi00ZTM5LTkxYjItYzE3Yjg5YjIwOTEyXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/11482639633001", year: 2026, genre: "Romantik", id: "lovemeloveme" },
  { title: "10 numaralı kabin / The Woman in Cabin 10", cover: "https://m.media-amazon.com/images/M/MV5BNDY0YmEyNDMtNTQ0Yi00MWVmLWFiYjMtODM5NmUzZWQ5MDMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10297584061098", year: 2025, genre: "Dram", id: "thewomanincabin10" },
  { title: "Meksika 1986 / México 86", cover: "https://m.media-amazon.com/images/M/MV5BOTRkZjY3NmYtOWUzZC00YmU2LWE2ZWMtYTEwZDYxY2ZlOWQyXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14614923577961", year: 2026, genre: "Komediya", id: "mexico86" },
  { title: "Fırtına anı / Mirage", cover: "https://m.media-amazon.com/images/M/MV5BOTY2MzYyN2MtNjE0NC00YmE5LThiYzItMGViYTlhOWE4MTg5XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v1tpv5nxrSHE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Triller", id: "mirage" },
  { title: "Ayrılış / Tuesday", cover: "https://m.media-amazon.com/images/M/MV5BMThlN2FhYTctYWU1Ni00MDI1LWE4YmYtNjU3ZmRkMDc1N2I5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9536488671849", year: 2023, genre: "Fantastik", id: "tuesday" },
  { title: "47 Ronin", cover: "https://m.media-amazon.com/images/M/MV5BMTc0MjE2NzE0OV5BMl5BanBnXkFtZTgwNTU5MjE1MDE@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vQ6vZWwJ2DRU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2013, genre: "Fantastik", id: "47ronin" },
  { title: "Penguen arkadaşım / My Penguin Friend", cover: "https://m.media-amazon.com/images/M/MV5BMWFkNWFlNTItNTkxNC00MmNiLWEwZDktNmUwMDA1NTBjNGZkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9465480546897", year: 2024, genre: "Macəra", id: "mypenguinfriend" },
  { title: "Bay Evet / Yes Man", cover: "https://m.media-amazon.com/images/M/MV5BZWQ4YzBiMzgtM2ZhZC00ZDQ5LWFiZjgtNmFlNzZlMTBkZTJhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/2287475493457", year: 2008, genre: "Komediya", id: "yesman" },
  { title: "Dilek / Wish", cover: "https://m.media-amazon.com/images/M/MV5BN2UyZTAxZDctODI5Mi00MDczLWI4OWMtNTliZjEyMmEyN2FkXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vE1ll_LEovQQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Animasiya", id: "wish" },
  { title: "Alevlerin ortasında / Firebreak", cover: "https://m.media-amazon.com/images/M/MV5BZmMyMWFmYjMtY2Y3ZS00MTBmLWI1NWQtZTMxMzdmN2Y4ZDYzXkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video359563763_456241213", year: 2026, genre: "Dram", id: "firebreak" },
  { title: "Dokunulmazlık / Exterritorial", cover: "https://m.media-amazon.com/images/M/MV5BYjVkMzI2MjAtYzA3NC00OGE1LWEyZDMtODc0YTc5NTZjYzFiXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9778315201194", year: 2025, genre: "Aksiyon", id: "exterritorial" },
  { title: "Hayalet hikayesi / Personal Shopper", cover: "https://m.media-amazon.com/images/I/71Pkl6R4jVL._AC_UF1000,1000_QL80_.jpg", src: "https://ok.ru/video/9903725349481", year: 2016, genre: "Triller", id: "personalshopper" },
  { title: "Damat / So-in-Law", cover: "https://m.media-amazon.com/images/M/MV5BZDhmMTc5NjMtY2EyZi00ZjZmLTlkMTYtODdhOGRhMDZmZDY3XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241868", year: 2026, genre: "Komediya", id: "elyerno" },
  { title: "Aşkın çekimi / Upside Down", cover: "https://m.media-amazon.com/images/I/91WnNPFs26L.jpg", src: "https://dzen.ru/embed/vPf4X162EXkw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2012, genre: "Romantik", id: "upsidedown" },
  { title: "Lucy", cover: "https://m.media-amazon.com/images/M/MV5BODcxMzY3ODY1NF5BMl5BanBnXkFtZTgwNzg1NDY4MTE@._V1_.jpg", src: "https://ok.ru/video/4466370349649", year: 2014, genre: "Elmi fantastik", id: "lucy" },
  { title: "Satranç oyuncusu / The Chess Player", cover:"https://m.media-amazon.com/images/M/MV5BYjU4ZWY5YmItZWMxMi00MTE2LTk4ZWQtYjk2ODEzZDVmMzZkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/2092839995985", year:2017, genre:"Dram", id: "thechessplayer" },
  { title: "Altıncı his / The Sixth Sense", cover: "https://m.media-amazon.com/images/I/61heMaZlMEL._AC_UF894,1000_QL80_.jpg", src: "https://my.mail.ru/video/embed/7537570220391530724", year: 1999, genre: "Triller", id: "thesixthsense" },
  { title: "Kara torba operasyonu / Black Bag", cover: "https://m.media-amazon.com/images/M/MV5BNzA1OWU4NDMtMDUxMC00NWI4LWJhYjUtYWQ0OGQ5MTc2NDRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9595540540009", year: 2025, genre: "Triller", id: "blackbag" },
  { title: "Mavka: Ormanın şarkısı / Mavka: The Forest Song", cover: "https://m.media-amazon.com/images/M/MV5BMzA5NzQ0YzktZjJiYS00OWE0LWE5MWYtMjU4YzA2Y2RmNWYxXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/8233692760657", year: 2023, genre: "Animasiya", id: "mavka" },
  { title: "Man of Tai Chi", cover: "https://m.media-amazon.com/images/M/MV5BMGQ5YzFmNTYtMzkyZi00OTFkLTk3MjYtMDg5Zjg5M2QxMmYxXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/367833778822", year: 2013, genre: "Aksiyon", id: "manoftaichi" },
  { title: "Ballerina", cover: "https://m.media-amazon.com/images/M/MV5BNzdhZmY2OTQtYWI4OC00ZThkLTlhZjAtNzE2YzRjM2Q5YjJlXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/rcz7f97u7k1f", year: 2025, genre: "Aksiyon", id: "ballerina" },
  { title: "Savaş atı / War Horse", cover: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p8618532_p_v8_ae.jpg", src: "https://m.ok.ru/video/7195803454077", year: 2011, genre: "Dram", id: "warhorse" },
  { title: "Süper Mario galaksi filmi / The Super Mario Galaxy Movie", cover: "https://m.media-amazon.com/images/M/MV5BYWYxYWRkMTUtMGMwZC00MzYyLThlNjEtNDcwMDYyMTQ4ZjJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14421963246185", year: 2026, genre: "Animasiya", id: "supermario" },
  { title: "Yaşam şifresi / Source Code", cover: "https://m.media-amazon.com/images/M/MV5BMTYxOWU2NzQtZGFmMC00MDFmLTg4ODMtNThjMjY3MzM3OTA2XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vKzeIDDeYZhs?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Elmi fantastik", id: "sourcecode" },
  { title: "Devlet sırrı / Secret Defense", cover: "https://m.media-amazon.com/images/M/MV5BOTA1N2ZlZTUtODUzMy00ODNhLWE0ZDQtMjM0MTY1NjNkYThjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vgnNmoP7KjwY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Triller", id: "secretdefense" },
  { title: "Atlas", cover: "https://m.media-amazon.com/images/M/MV5BNDUwNTFkNzYtMGM5NS00NTc4LWEwMDUtMmE5MzgyMjcwOWM4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/7598597212842", year: 2024, genre: "Elmi fantastik", id: "atlas" },
  { title: "Öldüren oyun / The Friendship Game", cover: "https://m.media-amazon.com/images/M/MV5BMGQ5NDY0ZmEtYjUyYi00ZDQ5LWJiMDMtMGY1NDRhNmI2NDZkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/7466741729962", year: 2022, genre: "Elmi fantastik", id: "thefriendshipgame" },
  { title: "Limit yok / Limitless", cover: "https://m.media-amazon.com/images/M/MV5BMWQ4OTQ4YzYtODlmMi00ZjA0LTg5M2QtZWUzNjA5N2NmODE5XkEyXkFqcGc@._V1_.jpg", src: "https://m.ok.ru/video/7502382172859", year: 2011, genre: "Triller", id: "limitless" },
  { title: "Yedi / Seven", cover: "https://m.media-amazon.com/images/M/MV5BY2IzNzMxZjctZjUxZi00YzAxLTk3ZjMtODFjODdhMDU5NDM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/8307450907217", year: 1995, genre: "Triller", id: "seven" },
  { title: "Senden geriye kalan / Reminders of Him", cover: "https://m.media-amazon.com/images/M/MV5BNjI4OGM1NDEtYzA1NS00ZDg3LWFmZjUtMjg1MGQ4MTk3NjQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241793", year: 2026, genre: "Romantik", id: "remindersofhim" },
  { title: "Milky Subway: Galaktik ekspres / Milky Subway: The Galactic Limited Express", cover: "https://m.media-amazon.com/images/M/MV5BMTZjMzJkYzAtN2JlNS00MDdmLWFkZTktZjYxYzJjNWMwOGI5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14599873628777", year: 2026, genre: "Animasiya", id: "milkysubway" },
  { title: "Blackjack / 21", cover: "https://xl.movieposterdb.com/12_03/2008/478087/xl_478087_a403b61c.jpg", src: "https://ok.ru/video/337027205819", year: 2008, genre: "Aksiyon", id: "21" },
  { title: "Steve", cover: "https://m.media-amazon.com/images/M/MV5BYmE4N2ZlNWQtMDRhNC00ZmYzLWI5ODMtODAzZjRiOTkxZGZhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10273451674282", year: 2025, genre: "Dram", id: "steve" },
  { title: "Zamana karşı / In Time", cover: "https://m.media-amazon.com/images/M/MV5BMjA3NzI1ODc1MV5BMl5BanBnXkFtZTcwMzI5NjQwNg@@._V1_.jpg", src: "https://m.ok.ru/video/9445578902203", year: 2011, genre: "Triller", id: "intime" },
  { title: "Chupa", cover: "https://m.media-amazon.com/images/M/MV5BY2QzYmU5ZGMtNTI1ZS00ODk2LWFlNWItOTA4NjFlNGU5MDI4XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vOI-pdid1oxM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Fantastik", id: "chupa" },
  { title: "Balls Up", cover: "https://m.media-amazon.com/images/M/MV5BZjJlMDFmOWMtY2NhZS00MzAwLWFiOWQtNzBiZDNiOWRiMDA4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/13384075512425", year: 2026, genre: "Komediya", id: "ballsup" },
  { title: "Tetris", cover: "https://m.media-amazon.com/images/M/MV5BMDZhY2Y4ZGQtODk4MC00NGQwLWFiMWItNzU2M2Q3Nzk2MmVlXkEyXkFqcGc@._V1_.jpg", src: "https://kinoflix.onrender.com/stream/6?hash=01426b&file=.mp4", year: 2023, genre: "Bioqrafiya", id: "tetris" },
  { title: "Yasak krallık / The Forbidden Kingdom", cover: "https://m.media-amazon.com/images/M/MV5BMTUwNTExMTg3NF5BMl5BanBnXkFtZTcwNDYyMTM2MQ@@._V1_.jpg", src: "https://m.ok.ru/video/7052021729980", year: 2008, genre: "Macəra", id: "theforbiddenkingdom" },
  { title: "Dünya varmış", cover: "https://m.media-amazon.com/images/M/MV5BMWJmZTZkMmItMWZlOC00YzE3LTlkYWYtODUyN2JkNjdiYmE2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241772", year: 2024, genre: "Macəra", id: "dunyavarmis" },
  { title: "Hugo", cover: "https://m.media-amazon.com/images/M/MV5BMjAzNzk5MzgyNF5BMl5BanBnXkFtZTcwOTE4NDU5Ng@@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/773317855931", year: 2011, genre: "Macəra", id: "hugo" },
  { title: "Kırmızı hat / The Red Line", cover: "https://images.justwatch.com/poster/342125576/s718/the-red-line.jpg", src: "https://ok.ru/video/12663912335977", year: 2026, genre: "Triller", id: "theredline" },
  { title: "Adım adım komplo / Echelon Conspiracy", cover: "https://m.media-amazon.com/images/M/MV5BMTg2NzQzNzQ2NF5BMl5BanBnXkFtZTcwOTE5MTMyMg@@._V1_.jpg", src: "https://ok.ru/video/3244592335441", year: 2009, genre: "Elmi fantastik", id: "echelonconspiracy" },
  { title: "Tarikat / A Sacrifice", cover: "https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/9/2/0/8375029/799959748937.jpg", src: "https://ok.ru/video/9305428986538", year: 2024, genre: "Triller", id: "asacrifice" },
  { title: "Gölgedeki yıldız / HIM", cover: "https://m.media-amazon.com/images/M/MV5BZjE1OGY1OGItZWIxZi00ZDc0LTg0OTgtMzMwNTdiNzNhZDhhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456241243", year: 2025, genre: "Qorxu", id: "him" },
  { title: "ArifV216", cover: "https://m.media-amazon.com/images/M/MV5BNGFkMmRkMzktNTkwYy00ZTA2LWJmYmItNzZlNWQxOWMwZmE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10388208159337", year: 2018, genre: "Komediya", id: "arifv216" },
  { title: "Aşkın yüzü", cover: "https://m.media-amazon.com/images/M/MV5BMzBlNzgzMGUtYThhZC00NGNkLTg3NGItOTgxMjM1MzIyZWI5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456241100", year: 2025, genre: "Romantik", id: "askinyuzu" },
  { title: "Cep Herkülü: Naim Süleymanoğlu", cover: "https://m.media-amazon.com/images/M/MV5BOTUzZDY2MWYtMmYwMS00ODdlLWJkNDgtOTY0M2JmMGEyZmI5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/13423998339689", year: 2019, genre: "Bioqrafiya", id: "cepherkulu" },
  { title: "Aman Tanrım / Bruce Almighty", cover: "https://m.media-amazon.com/images/S/pv-target-images/44b01b4e509dd3eb88531024dfaaac8dbc8c111dbee3febe2a7fc5f2280e79c4.jpg", src: "https://dzen.ru/embed/vVy4ufY-GARY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2003, genre: "Komediya", id: "brucealmighty" },
  { title: "Atatürk 2", cover: "https://m.media-amazon.com/images/M/MV5BZGFjM2RjODgtMTFlMy00YjYxLWFkNDAtOTYxZDk0NDZhODkxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9191639747153", year: 2024, genre: "Bioqrafiya", id: "ataturk2" },
  { title: "Gerçek sahtekar / The Big Fake", cover: "https://m.media-amazon.com/images/M/MV5BYzk1MmRiODctMGFkMy00MTlmLTgyZjQtYTc1MWUyZjU5MTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/11018481830505", year: 2026, genre: "Dram", id: "thebigfake" },
  { title: "Yahşi Batı", cover: "https://m.media-amazon.com/images/M/MV5BMTMyMWY0NzQtZmNkNS00ZGQ3LWIzNTEtNzY1ODEyYmIwNWMzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10397782116969", year: 2009, genre: "Komediya", id: "yahsibati" },
  { title: "Spiderwick Günceleri / The Spiderwick Chronicles", cover: "https://m.media-amazon.com/images/M/MV5BOWRiMmUzZTctYWUxNy00ZjkyLWE4NTctMzFlMTFkYmI5NmFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vlQ8QkBXesxA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Macəra", id: "thespiderwickchronicles" },
  { title: "Rebel Ridge", cover: "https://m.media-amazon.com/images/M/MV5BYTE4ZDE5ZTktZWZkMC00MGY4LWFkZDUtZTc5YWU3NzM2YmM3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/7913537079978", year: 2024, genre: "Aksiyon", id: "rebelridge" },
  { title: "Kara dul Maje / A Widow's Game", cover: "https://m.media-amazon.com/images/M/MV5BYTNkYWE0MjQtZTFlMi00ZTRjLThiMGEtY2JiY2U1NGYyN2Y3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9350185486953", year: 2025, genre: "Triller", id: "awidowsgame" },
  { title: "Geçiş kapısı / The Portable Door", cover: "https://m.media-amazon.com/images/M/MV5BZGJiZGFkZWUtMWU3NS00MzMwLWJmMDQtNTliMzhjMDhiOGFiXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vL4fobvQj7jQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Macəra", id: "theportabledoor" },
  { title: "Madame Web", cover: "https://m.media-amazon.com/images/M/MV5BODViOTZiOTQtOTc4ZC00ZjUxLWEzMjItY2ExMmNlNDliNjE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video784107073_456240757?ref_domain=d2rs.com", year: 2024, genre: "Aksiyon", id: "madameweb" },
  { title: "Kötü kedi Şerafettin", cover: "https://m.media-amazon.com/images/M/MV5BZDRkYThmNTktMmI4Ny00NGY3LTk5M2EtMTgyNGVjM2U4ODgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/11477506853481", year: 2016, genre: "Animasiya", id: "kotukediserafettin" },
  { title: "Mumya / The Mummy", cover: "https://m.media-amazon.com/images/M/MV5BMGNhYWEwOTQtNjFhNC00ZTY2LWExNmQtMTAxNjNjYzEwMjA5XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vYuvqKfJ7uks?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2017, genre: "Macəra", id: "themummy" },
  { title: "Tatilde tanıştığımız insanlar / People We Meet on Vacation", cover: "https://m.media-amazon.com/images/M/MV5BM2ZmZWEyOGItYzVjYi00N2Q3LTlmNDItYmUwZjFhMTJmMzgzXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/10745464162921", year: 2026, genre: "Romantik", id: "peoplewemeetonvacation" },
  { title: "Zeta", cover: "https://m.media-amazon.com/images/M/MV5BZjg5OWI2MTgtZjcyMS00MTcwLTk2ZDQtZDcwMmI4NjI4MWVhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/12445624502889", year: 2026, genre: "Triller", id: "zeta" },
  { title: "Yapay zeka / Dalloway", cover: "https://m.media-amazon.com/images/M/MV5BZDRmOWMzMjYtMDg3MC00NDMzLWE0YjUtMWUwZDgyYWEzYjI0XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241466", year: 2025, genre: "Elmi fantastik", id: "dalloway" },
  { title: "Ejderhanı nasıl eğitirsin / How to Train Dragon", cover: "https://m.media-amazon.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/7470750370549", year: 2010, genre: "Fantastik", id: "howtotraindragon" },
  { title: "Kehanet / Knowing", cover: "https://m.media-amazon.com/images/M/MV5BYWEzZGEzYzktNjVlMy00OTBjLTgyN2MtZWM5MDcwZjdjMzdhXkEyXkFqcGc@._V1_.jpg", src: "https://m.ok.ru/video/7032114776577", year: 2009, genre: "Triller", id: "knowing" },
  { title: "Chuck'ın Hayatı / The Life of Chuck", cover: "https://tr.web.img4.acsta.net/img/f3/f0/f3f033e9e8aaab784c9a1fb6a2601cb2.jpg", src: "https://vk.com/video359563763_456241204", year: 2024, genre: "Dram", id: "thelifeofchuck" },
  { title: "Uykucu", cover: "https://m.media-amazon.com/images/M/MV5BNzFhNmMxYzQtZDkyMi00YWYxLWFlYmYtNTUwNWQ4ZDNjODA2XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241947", year: 2025, genre: "Dram", id: "uykucu" },
  { title: "Gececi / The Night Clerk", cover: "https://m.media-amazon.com/images/M/MV5BODUyOWNkYmItNDk5NS00YmZmLWI2YzctNDg4MjkzODZjZGE2XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v-HN6PF7O3wo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2020, genre: "Triller", id: "thenightclerk" },
  { title: "Cinayet süsü", cover: "https://m.media-amazon.com/images/M/MV5BNjA1YjQxM2YtNjBmZi00ZDQ0LTlhZGMtNTVhYjRiNjRhM2VkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/11663345912425", year: 2019, genre: "Komediya", id: "cinayetsusu" },
  { title: "Kartal göz / Eagle Eye", cover: "https://m.media-amazon.com/images/M/MV5BMjA5MTMzMDMzNl5BMl5BanBnXkFtZTcwMzUwNDUzMw@@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/h0emt1xr0t9e", year: 2008, genre: "Aksiyon", id: "eagleeye" },
  { title: "Mulan", cover: "https://m.media-amazon.com/images/M/MV5BMWI4ZjcxMjMtZmJiYi00MDhlLTgxMzQtNTE2ZjM0YzAyYzM1XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vSKjLnnuwaXk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1998, genre: "Animasiya", id: "mulan" },
  { title: "Başlat / Ready Player One", cover: "https://m.media-amazon.com/images/M/MV5BNzVkMTgzODQtMWIwZC00NzE4LTgzZjYtMzAwM2I5OGZhNjE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v0xPfqe__MR8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Elmi fantastik", id: "readyplayerone" },
  { title: "Önce kadınlar / Ladies First", cover: "https://m.media-amazon.com/images/M/MV5BNjBhMjk2NmQtY2JhOC00OTIzLTkzZjItNjA2NWM3OTkzNzA5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/14357815495273", year: 2026, genre: "Komediya", id: "ladiesfirst" },
  { title: "Tom Clancy'den Jack Ryan: Hayalet Savaş / Tom Clancy's Jack Ryan: Ghost War", cover: "https://m.media-amazon.com/images/M/MV5BZGVkZjAxMzYtNGE5YS00ZWEwLTk0NGMtY2Q4MWJiN2YyZDA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14323371805289", year: 2026, genre: "Aksiyon", id: "ghostwar" },
  { title: "Mürekkep yürek / Inkheart", cover: "https://image.tmdb.org/t/p/original/pNTJVwXZZzXv5C2YXux7F2Z3jsV.jpg", src: "https://m.ok.ru/video/40711686843", year: 2008, genre: "Macəra", id: "inkheart" },
  { title: "Labirent: Ölümcül kaçış / The Maze Runner", cover: "https://m.media-amazon.com/images/I/713QOFbO54L.jpg", src: "https://my.mail.ru/video/embed/2812081686177647400", year: 2014, genre: "Elmi fantastik", id: "themazerunner" },
  { title: "Predator: Vahşi topraklar / Predator: Badlands", cover: "https://m.media-amazon.com/images/M/MV5BMmMzNzdiZDgtZGVjOC00ZTg2LTg1ZDktMDU2ZDc2YjBiNDJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241172", year: 2025, genre: "Elmi fantastik", id: "predator" },
  { title: "The Rip", cover: "https://m.media-amazon.com/images/M/MV5BNjIzMGY3MzMtNDVlMS00MGU1LTkyNTItMmI4Mzk0Mjg3OTBkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/10869573814889", year: 2026, genre: "Aksiyon", id: "therip" },
  { title: "Morbius", cover: "https://m.media-amazon.com/images/M/MV5BY2UzYzFiZWUtOGU5ZC00YTIxLWFlNGUtMGU1YmI4OWUzN2FmXkEyXkFqcGc@._V1_.jpg", src: "https://m.ok.ru/video/7211205135036", year: 2022, genre: "Fantastik", id: "morbius" },
  { title: "Taş kalpli / Heart of Stone", cover: "https://m.media-amazon.com/images/M/MV5BOTM5OTQ2ZTYtY2EzMC00Zjc3LTg3NWEtZWI4OTdlMjcwMGFlXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/6673580100266", year: 2023, genre: "Aksiyon", id: "heartofstone" },
  { title: "İyi oyun", cover: "https://m.media-amazon.com/images/M/MV5BZjE2ZmZjMzAtYjAwOC00NDFkLTkxZWItMjg0NDc5OTZkMDcyXkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video366596896_456239399", year: 2018, genre: "Elmi fantastik", id: "iyioyun" },
  { title: "Ölümsüz Aşk / The Age of Adaline", cover: "https://m.media-amazon.com/images/M/MV5BMTAzMTQzMTA2MjheQTJeQWpwZ15BbWU4MDk2MTg2MzUx._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vXOg4sNmZY2k?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2015, genre: "Dram", id: "theageofadaline" },
  { title: "Ne dilersen / Absolutely Anything", cover: "https://m.media-amazon.com/images/M/MV5BMjMxNTQ1NDgyOF5BMl5BanBnXkFtZTgwMjMxNjU0NjE@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/2978718681681", year: 2015, genre: "Komediya", id: "absolutelyanything" },
  { title: "Cloverfield paradoksu / The Cloverfield Paradox", cover: "https://m.media-amazon.com/images/M/MV5BMTAwOTIxMDA0MjZeQTJeQWpwZ15BbWU4MDg1MjgzNzQz._V1_.jpg", src: "https://dzen.ru/embed/vK6LbRYW64no?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Elmi fantastik", id: "thecloverfieldparadox" },
  { title: "Toaster", cover: "https://m.media-amazon.com/images/M/MV5BZDk0YzdmOTAtNTFmMi00NTQ0LThhMTAtNGY1NDRkNmIyODdmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241765", year: 2026, genre: "Komediya", id: "toaster" },
  { title: "Tuğla / Brick", cover: "https://m.media-amazon.com/images/M/MV5BMGRjZTI5NmEtNWQzNi00ZDUxLWFmZmQtOGFiZmNkZGY1MDc5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9986252147370", year: 2025, genre: "Elmi fantastik", id: "brick" },
  { title: "Masal", cover: "https://cekicmagazin.com/wp-content/uploads/2025/01/1-20250127.jpg", src: "https://vk.com/video359563763_456241117", year: 2026, genre: "Dram", id: "masal" },
  { title: "Çelik adam / Man of Steel", cover:"https://m.media-amazon.com/images/M/MV5BMDdhY2M5NjItMWUwZi00MGRhLTgyMWItZTViMzNkYjkxOGI2XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vi1vEOBWtxjU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2013, genre:"Fantastik", id: "manofsteel" },
  { title: "Sanal ülke / The Electric State", cover: "https://m.media-amazon.com/images/M/MV5BZDU5YWE3MmItMGI0Ny00MWQ4LWE3NDktMjRkNDk5YmFjYTk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9114490112617", year: 2025, genre: "Elmi fantastik", id: "theelectricstate" },
  { title: "Apex", cover: "https://m.media-amazon.com/images/M/MV5BNjUzODE2ZWYtMDdiMS00ZTA0LWI4MzEtNDkyODNiNmIwMWY1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/13749011548777", year: 2026, genre: "Triller", id: "apex" },
  { title: "Küçük köyün büyük gücü / It Takes a Village", cover: "https://m.media-amazon.com/images/M/MV5BMDRhZjAyZDItZjRkNS00NzgwLTk5YTAtM2E4YWQ3NzIyNjdjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/y1br798si2io", year: 2026, genre: "Komediya", id: "podlasie" },
  { title: "Son dev / The Giant Falls", cover: "https://m.media-amazon.com/images/M/MV5BZTI0NWRkZjgtZTIwZi00MzlmLWI1ZjEtOWRhZjE5OWRjMjg4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241602", year: 2026, genre: "Dram", id: "thegiantfalls" },
  { title: "Miras / Inheritance", cover: "https://m.media-amazon.com/images/M/MV5BNmRiNWY3ZjYtNDhhMy00NDNjLWIzMTktMTViZDRiYWJjODY1XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9475470854761", year: 2025, genre: "Triller", id: "inheritance" },
  { title: "Kül", cover: "https://m.media-amazon.com/images/M/MV5BODE0ZWVlZTEtMTZiMC00ZWZlLWIxYWQtNWI2MDg1YzYyODlhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7940212197969", year: 2024, genre: "Dram", id: "kul" },
  { title: "Uğultulu tepeler / Wuthering Heights", cover: "https://m.media-amazon.com/images/M/MV5BMGFlMTVkMDktZGMzMC00Yjk4LWFmNzEtNTFmMzM2YzM3MWFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/jv2riuhgtgcv", year: 2026, genre: "Romantik", id: "wutheringheights" },
  { title: "Sofra sırları", cover: "https://m.media-amazon.com/images/M/MV5BOTJkN2VhNzEtOGI0Ny00OGFmLWJlM2ItOWEyNDlhMWUwYTkwXkEyXkFqcGc@._V1_.jpg", src: "https://m.vkvideo.ru/video441129431_456239096", year: 2017, genre: "Dram", id: "sofrasirlari" },
  { title: "Sesimi hisset / Feel My Voice", cover: "https://m.media-amazon.com/images/M/MV5BZWZlNDE5ZTgtMGRmNi00ZmY1LTk3ZTQtNDdhYzM1OGQ2M2VlXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/12919680273001", year: 2026, genre: "Dram", id: "feelmyvoice" },
  { title: "Paranormal Cuma", cover: "https://m.media-amazon.com/images/M/MV5BNGYwN2JkMjMtYjRkZi00NjMxLTk0ZmQtN2VkMTEwM2MyNDg5XkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video359563763_456240121", year: 2024, genre: "Komediya", id: "paranormalcuma" },
  { title: "Man-Thing (Altyazı)", cover: "https://m.media-amazon.com/images/M/MV5BMDI0YTYxMDMtYmFjOS00ZmQ1LTgwZDUtOGQwMGIzMDhkNTVkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/8151527328337", year: 2005, genre: "Fantastik", id: "manthing" },
  { title: "In the Tall Grass", cover: "https://m.media-amazon.com/images/M/MV5BYTE0ZDgwNDUtNjBmMy00MjA2LWFlMWItNGNiOGE2YTZiMjM2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/2158645086801", year: 2019, genre: "Qorxu", id: "inthetallgrass" },
  { title: "Suçlu / The Guilty", cover: "https://m.media-amazon.com/images/M/MV5BZWI3NmEyYzAtNWY4OC00YWY4LTk2MjgtM2Y1NDdlZWE4ODgzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v0wNPXPft5CY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Triller", id: "theguilty" },
  { title: "Noel annem / My Secret Santa", cover: "https://m.media-amazon.com/images/M/MV5BNDhiZDFhNzItY2FlYS00NTg4LThhOTAtYWIyMzNkNjZmYmQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10162002332265", year: 2025, genre: "Komediya", id: "mysecretsanta" },
  { title: "Tam gaz / Baby Driver", cover: "https://m.media-amazon.com/images/M/MV5BMjM3MjQ1MzkxNl5BMl5BanBnXkFtZTgwODk1ODgyMjI@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vYdqpfRTBp18?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2017, genre: "Aksiyon", id: "babydriver" },
  { title: "Irmandade: Kardeşlik isyaı / Salve Geral: Irmandade", cover: "https://m.media-amazon.com/images/M/MV5BMTJkZGRkYzYtNzdiYS00Y2IwLWE0OGQtMWYyZDdjODg1ZTgxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vk.com/video359563763_456241168", year: 2026, genre: "Aksiyon", id: "irmandade" },
  { title: "Ferrari", cover: "https://m.media-amazon.com/images/M/MV5BYmUzYmJiMDMtZjIxNy00ZjBlLThjZDMtMDA1ZDM4MWMwNmI0XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7596646206122", year: 2023, genre: "Bioqrafiya", id: "ferrari" },
  { title: "Neşeli kanatlar: Büyük göç / Duck Duck Goose", cover: "https://m.media-amazon.com/images/M/MV5BMDU1YjUxZjktMmQxZC00YTAxLTlhYzUtMWQ5NzU3MGZkNmM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video784107073_456240993?ref_domain=d2rs.com", year: 2018, genre: "Animasiya", id: "duckduckgoose" },
  { title: "Malena", cover: "https://xl.movieposterdb.com/12_06/2000/213847/xl_213847_aa6c3d38.jpg", src: "https://dzen.ru/embed/vurIqx4USh0s?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2000, genre: "Dram", id: "malena" },
  { title: "İki dünya bir dilek", cover: "https://m.media-amazon.com/images/S/pv-target-images/844d63aac37c44edccc943a7060e031918f5d861f3815a090e5e5bf379d94b8b.jpg", src: "https://m.vk.com/video-233305174_456243014", year: 2025, genre: "Romantik", id: "ikidunyabirdilek" },
  { title: "Humint", cover: "https://m.media-amazon.com/images/M/MV5BZjliZDRkZTYtYTBkNi00NzAxLTg0YmQtODE0YjVmNWNjNjhiXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241590", year: 2026, genre: "Aksiyon", id: "humint" },
  { title: "Sihirli annem: Hepimiz biriz", cover: "https://m.media-amazon.com/images/M/MV5BZGY2ZTZkZGUtZDZiNS00MjZkLThhYzQtZTZiNGE3MjY4NzU5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456240873", year: 2025, genre: "Macəra", id: "sihirliannemhepimizbiriz" },
  { title: "Kral Arthur / Arthur The King", cover: "https://m.media-amazon.com/images/S/pv-target-images/a6716cc236e16061e78305f230192d1b94d327c5ba24743981459e1cd24af4c1.jpg", src: "https://ok.ru/video/8663731997265", year: 2024, genre: "Dram", id: "arthurtheking" },
  { title: "Anadolu Kartalları", cover: "https://m.media-amazon.com/images/M/MV5BYWY0YTJkYWYtMTA3Ni00NGRiLTk1ZTAtMjQ0NmExMmVhMjBlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/86842608282", year: 2011, genre: "Dram", id: "anadolukartallari" },
  { title: "Primate", cover: "https://m.media-amazon.com/images/M/MV5BMTA5MDI3MjctMGQ1My00ODI1LWFmNjctMjdlNDdiYzcyMWMwXkEyXkFqcGc@._V1_.jpg", src: "https://vk.com/video359563763_456241162", year: 2025, genre: "Dram", id: "primate" },
  { title: "Zaman makinesi 1973", cover: "https://m.media-amazon.com/images/M/MV5BMTYxOTUxNDc2N15BMl5BanBnXkFtZTgwNTIxMDczMTE@._V1_FMjpg_UX1000_.jpg", src: "https://m.ok.ru/video/7052021926588", year: 2014, genre: "Macəra", id: "zamanmakinesi1973" },
  { title: "Gösteri köpekleri / Show Dogs", cover: "https://m.media-amazon.com/images/M/MV5BYmM3ZDcwYTMtNGQ0MS00MTBjLWJhMDctOTk1YjMzZGI2ODU3XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/11228344683113", year: 2018, genre: "Komediya", id: "showdogs" },
  { title: "Hız tutkusu / Redline", cover: "https://m.media-amazon.com/images/I/71tf2guXENL._AC_UF1000,1000_QL80_.jpg", src: "https://ok.ru/video/10135492758097", year: 2008, genre: "Aksiyon", id: "redline" },
  { title: "Suikast treni / Bullet Train", cover: "https://m.media-amazon.com/images/M/MV5BODUyZjkxZDMtZGI3ZC00ZmEwLTgwMTUtYTU4OTQ5YjU4ZjRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vPRzi75j7WAY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2022, genre: "Aksiyon", id: "bullettrain" },
  { title: "Özgür dünya", cover: "https://m.media-amazon.com/images/S/pv-target-images/80fd33faa1bec65d1c42b7c5a2e517958f7ff649f71e384d5e5ac8ee3af0987f.jpg", src: "https://m.ok.ru/video/1754350750209", year: 2019, genre: "Elmi fantastik", id: "ozgurdunya" },
  { title: "Sen inandır", cover: "https://ortakoltuk.com/wp-content/uploads/2023/07/sen-inandir-7.jpg", src: "https://ok.ru/video/6569448639057", year: 2023, genre: "Romantik", id: "seninandir" },
  { title: "Bu mutlu günümüzde", cover: "https://pbs.twimg.com/media/HGa9W60W4AIPwAw?format=jpg&name=large", src: "https://vkvideo.ru/video359563763_456241840", year: 2026, genre: "Komediya", id: "bumutlugunumuzde" },
  { title: "iRehine / iHostage", cover: "https://m.media-amazon.com/images/M/MV5BMGEyNWI4NjctY2NkYS00ZDY0LTkyNTUtOGRhM2UzNWYxOTc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9223073434217", year: 2025, genre: "Triller", id: "ihostage" },
  { title: "Ghost Project", cover: "https://m.media-amazon.com/images/M/MV5BODZkYWU0YmQtZTEyMi00MTc1LWE2NTctMjk5ZGYzNzQ1MmQwXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video359563763_456241450", year: 2023, genre: "Elmi fantastik", id: "ghostproject" },
  { title: "180", cover: "https://m.media-amazon.com/images/M/MV5BN2NhYzE1YTUtNDA0Yi00ZjhlLWEyMzUtN2UxMzkzZTdkMDRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/13469418195561", year: 2026, genre: "Triller", id: "180" },
  { title: "Wildcat", cover: "https://m.media-amazon.com/images/M/MV5BYTc4NGFlYjMtOWZmZC00NzJiLTk2NDUtNWJmMjgyNDIwMWYwXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/5vx8yc6pl52b", year: 2025, genre: "Aksiyon", id: "wildcat" },
  { title: "Paris'in altında / Under Paris", cover: "https://m.media-amazon.com/images/M/MV5BMDM5ODBiN2ItOTk4Yi00NzgyLWE2YTktYzhjYTc2ODE4ZTE4XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7638122957482", year: 2024, genre: "Triller", id: "underparis" },
  { title: "Mike & Nike & Nike & Alice", cover: "https://m.media-amazon.com/images/M/MV5BZDBiNjIyNjUtNWZlYy00MGU4LWFjNDUtMGExYTZlNmNhZTY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/n5f01rg13y2v", year: 2026, genre: "Komediya", id: "mikeandnikeandnikeandalice" },
  { title: "Bionic", cover: "https://m.media-amazon.com/images/M/MV5BN2ZmMjdlMWUtODg3Ni00ZTM2LThiMTAtMDgyMWViNDI3OGFjXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/7614502210218", year: 2024, genre: "Elmi fantastik", id: "bionic" },
  { title: "Bekarlara yer yok / No Place to Be Single", cover: "https://m.media-amazon.com/images/M/MV5BMWJmNjFiMDQtNjU1MS00MjJjLWFlOWMtYjljYmMxMjA4ZWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/14099735513705", year: 2026, genre: "Komediya", id: "noplacetobesingle" },
  { title: "Ördek Howard / Howard the Duck", cover:"https://m.media-amazon.com/images/M/MV5BZTA4ZjJkZjQtNzMwMy00YjJjLTkwYzgtZDY0YmNhZjYzMGExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/786551605947", year:1986, genre:"Fantastik", id: "howardtheduck" },
  { title: "Moana 2", cover: "https://m.media-amazon.com/images/M/MV5BZDUxNThhYTUtYjgxNy00MGQ4LTgzOTEtZjg1YTU5NTcwNThlXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/xgpt0fd2zbsy", year: 2024, genre: "Animasiya", id: "moana2" },
  { title: "Moana", cover: "https://m.media-amazon.com/images/M/MV5BMjI4MzU5NTExNF5BMl5BanBnXkFtZTgwNzY1MTEwMDI@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/tefnawp5lhkv", year: 2016, genre: "Animasiya", id: "moana" },
  { title: "Megan 2 / M3GAN 2.0", cover: "https://montroseplayhouse.co.uk/wp-content/uploads/2025/07/lHChxm7sv3gWR2qz5PwjdxcXQf7-scaled.webp", src: "https://vidmoly.me/d/jbj3ukxizln2", year: 2025, genre: "Elmi fantastik", id: "megan2" },
  { title: "Megan / M3GAN", cover: "https://m.media-amazon.com/images/M/MV5BYjU1ZWMxYTUtNzQ1ZC00ZTcxLTg0NTMtMzY1ZmQyZjhmYjMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/6398582196817", year: 2022, genre: "Elmi fantastik", id: "megan" },
  { title: "Alacakaranlık Efsanesi: Şafak Vakti - Bölüm 2 / The Twilight Saga: Breaking Dawn - Part 2", cover: "https://m.media-amazon.com/images/M/MV5BMTcyMzUyMzY1OF5BMl5BanBnXkFtZTcwNDQ4ODk1OA@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vhbYkB65xs3k?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2012, genre: "Fantastik", id: "twilight5" },
  { title: "Alacakaranlık Efsanesi: Şafak Vakti - Bölüm 1 / The Twilight Saga: Breaking Dawn - Part 1", cover: "https://m.media-amazon.com/images/M/MV5BNjBlY2M2MTctMzU3Yi00MTY3LTlkMTAtMzhlMzY1YjZlYTA2XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vJpUvXPbyCS8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Fantastik", id: "twilight4" },
  { title: "Alacakaranlık Efsanesi: Tutulma / The Twilight Saga: Eclipse", cover: "https://m.media-amazon.com/images/M/MV5BNDMwNjAzNzYwOF5BMl5BanBnXkFtZTcwMDY5NzcyMw@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vftAAuopicRk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2010, genre: "Fantastik", id: "twilight3" },
  { title: "Alacakaranlık Efsanesi: Yeni Ay / The Twilight Saga: New Moon", cover: "https://m.media-amazon.com/images/M/MV5BMTI3MjE3NDIxNF5BMl5BanBnXkFtZTcwODM3NTY5Mg@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vAjCH3eYxtBs?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2009, genre: "Fantastik", id: "twilight2" },
  { title: "Alacakaranlık / Twilight", cover: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/mjg5zd72tc5c", year: 2008, genre: "Fantastik", id: "twilight" },
  { title: "Recep İvedik 7", cover: "https://m.media-amazon.com/images/M/MV5BYjg2NzkyYjgtZWJjOS00NDdkLWE1NWQtMTY4ZDc3MTkxYWVhXkEyXkFqcGc@._V1_.jpg", src: "https://m.vkvideo.ru/video-229916382_456239109", year: 2022, genre: "Komediya", id: "recepivedik7" },
  { title: "Recep İvedik 6", cover: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/94b7c287820105.5dc38dcdecd39.jpg", src: "https://m.ok.ru/video/3138861271683", year: 2019, genre: "Komediya", id: "recepivedik6" },
  { title: "Recep İvedik 5", cover: "https://images.kinorium.com/movie/poster/1607084/w1500_2553330.jpg", src: "https://vkvideo.ru/video-229916382_456239078", year: 2017, genre: "Komediya", id: "recepivedik5" },
  { title: "Recep İvedik 4", cover: "https://m.media-amazon.com/images/M/MV5BMTk1NTA1MjAyN15BMl5BanBnXkFtZTgwMjM2MDkzMTE@._V1_.jpg", src: "https://ok.ru/video/13396415416937", year: 2014, genre: "Komediya", id: "recepivedik4" },
  { title: "Recep İvedik 3", cover: "https://m.media-amazon.com/images/M/MV5BNDcxNzAyZjMtMDZiMS00NmNiLTkxNmQtYzFhNjUxYmQzNDdjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/12411931724393", year: 2010, genre: "Komediya", id: "recepivedik3" },
  { title: "Recep İvedik 2", cover: "https://m.media-amazon.com/images/M/MV5BMzY0MzkzNjgtNDliYi00NWIzLWJhZDItNjdiMzc2OGY2MTFhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/12411931789929", year: 2009, genre: "Komediya", id: "recepivedik2" },
  { title: "Recep İvedik", cover: "https://m.media-amazon.com/images/M/MV5BYzU0M2JkZTItNWEwYy00Y2ViLTg4YjMtNTEzMTcxYzA3NWU3XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/11554755906153", year: 2008, genre: "Komediya", id: "recepivedik" },
  { title: "Dağ 2", cover: "https://m.media-amazon.com/images/M/MV5BMWE3ODFkZjEtMGI3OS00MTdmLWE0YTAtNjIzMWJjZDc2MTRkXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/12214453406313", year: 2016, genre: "Dram", id: "dag2" },
  { title: "Dağ", cover: "https://m.media-amazon.com/images/M/MV5BMTc0MjMyMzI1OF5BMl5BanBnXkFtZTcwMzc2NjM4OA@@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/12214453537385", year: 2012, genre: "Dram", id: "dag" },
  { title: "Siyah telefon 2/ The Black Phone 2", cover: "https://m.media-amazon.com/images/M/MV5BMWIyYmM5OWYtZWE4Ni00YjYzLTkzMDItYzY2MGVkODk3ZjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/10358825486953", year: 2025, genre: "Qorxu", id: "theblackphone2" },
  { title: "Siyah telefon / The Black Phone", cover: "https://m.media-amazon.com/images/M/MV5BMjFhZTcxOTktMzllMS00MzIzLWJhODEtZDU5YTFkNzRjZWQyXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/3977190509190", year: 2021, genre: "Qorxu", id: "theblackphone" },
  { title: "Mumya: Ejder İmparatoru'nun Mezarı / The Mummy: Tomb of the Dragon Emperor", cover: "https://m.media-amazon.com/images/M/MV5BMTU4NDIzMDY1OV5BMl5BanBnXkFtZTcwNjQxMzk3MQ@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vnp24W1CjO0s?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Macəra", id: "themummy3" },
  { title: "Mumya dönüyor / The Mummy Returns", cover: "https://m.media-amazon.com/images/M/MV5BMjdiYzVlNjUtNGI5MC00MDE5LTk0MmQtNDc0YzIzOGRmMDNkXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vLO-xnTABNyg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2001, genre: "Macəra", id: "themummy2" },
  { title: "Mumya / The Mummy", cover: "https://m.media-amazon.com/images/M/MV5BMTY4YWE0OGMtNjU0Yi00YzIwLTk3NTktM2ZiYWQwNjM4MmMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vB2MNBXEIexs?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1999, genre: "Macəra", id: "themummy1" },
  { title: "Evdə tək 2 (Azərbaycan dilində-2) / Home Alone 2: Lost in New York", cover: "https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src: "https://drive.google.com/file/d/19zNpaPuAVeUEqfSAHgOzvRB1XbADxXQH/view?usp=drive_link", year: 1992, genre: "Komediya", id: "homealone2az2" },
  { title: "Evdə tək 2 (Azərbaycan dilində-1) / Home Alone 2: Lost in New York", cover: "https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src: "https://drive.google.com/file/d/1sKrdkMrSmMMKojtNcMt7JqF14DibGlKm/view?usp=drive_link", year: 1992, genre: "Komediya", id: "homealone2az" },
  { title: "Evde tek başına 2 / Home Alone 2: Lost in New York", cover: "https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src: "https://dzen.ru/embed/vh-9MCbZULEo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1992, genre: "Komediya", id: "homealone2" },
  { title: "Evdə tək (Azərbaycan dilində-2) / Home Alone", cover: "https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src: "https://drive.google.com/file/d/19-WPu3Zw4Mo-hAXdkpEPzxxvFLoRlYSz/view?usp=drive_link", year: 1990, genre: "Komediya", id: "homealoneaz2" },
  { title: "Evdə tək (Azərbaycan dilində-1) / Home Alone", cover: "https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src: "https://drive.google.com/file/d/1UEZvCQB8M75Ex4oip6aREi9QfPergjRp/view?usp=drive_link", year: 1990, genre: "Komediya", id: "homealoneaz" },
  { title: "Evde tek başına / Home Alone", cover: "https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src: "https://dzen.ru/embed/vkE8Hl1epfXM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1990, genre: "Komediya", id: "homealone" },
  { title: "Mufasa: Aslan Kral / Mufasa: The Lion King", cover: "https://m.media-amazon.com/images/M/MV5BNjg1YzI5ZmQtZjZkOC00ZDMzLWI4YjYtMmY5MzZjYWE3YzhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/w/rh5vqdd6dzai", year: 2024, genre: "Animasiya", id: "mufasa" },
  { title: "Aslan Kral / The Lion King", cover: "https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vBjSgKwDTcQw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Animasiya", id: "thelionking" },
  { title: "Rio 2", cover: "https://m.media-amazon.com/images/M/MV5BMTgzMDczMDYzNl5BMl5BanBnXkFtZTgwMzk2MDIwMTE@._V1_.jpg", src: "https://vkvideo.ru/video784107073_456239646?ref_domain=d2rs.com", year: 2014, genre: "Animasiya", id: "rio2" },
  { title: "Rio", cover: "https://m.media-amazon.com/images/M/MV5BMTU2MDY3MzAzMl5BMl5BanBnXkFtZTcwMTg0NjM5NA@@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video784107073_456239647", year: 2011, genre: "Animasiya", id: "rio" },
  { title: "Malefiz: Kötülüğün gücü / Malefisent: Mistress of Evil", cover: "https://m.media-amazon.com/images/M/MV5BNTY4YjYwYzMtYTg1NC00ZmJiLTk0OTYtMWMzM2Y4Yzc5MDc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vOpJWxz212HU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Fantastik", id: "malefisent2" },
  { title: "Malefiz / Malefisent", cover: "https://m.media-amazon.com/images/M/MV5BMjAwMzAzMzExOF5BMl5BanBnXkFtZTgwOTcwMDA5MTE@._V1_.jpg", src: "https://dzen.ru/embed/vtRZcBxJSrGA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2014, genre: "Fantastik", id: "malefisent" },
  { title: "Sihirbazlar çetesi 2 / Now You See Me 2", cover: "https://m.media-amazon.com/images/M/MV5BOTVjNTA0ZWEtNzU2Ny00Njg1LWE1MmEtZTUyZGQzYTVlY2Q5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/9qii1iqp89v1", year: 2016, genre: "Macəra", id: "nowyouseeme2" },
  { title: "Sihirbazlar çetesi / Now You See Me", cover: "https://m.media-amazon.com/images/M/MV5BMTY0NDY3MDMxN15BMl5BanBnXkFtZTcwOTM5NzMzOQ@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vfXt5DGIcmAc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2013, genre: "Macəra", id: "nowyouseeme" },
  { title: "Karateci çocuk: Efsane dövüşçüler / Karate Kid: Legends", cover: "https://m.media-amazon.com/images/M/MV5BM2MwYTlkY2MtNmUzNy00MTljLThjNDAtZGUzNzMxMzcxNzM5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9885577644649", year: 2025, genre: "Aksiyon", id: "thekaratekid2" },
  { title: "Karateci çocuk / The Karate kid", cover: "https://m.media-amazon.com/images/M/MV5BODQ2MDJiMDItN2QwMS00Yzg1LWJlZDEtN2Y3M2UyYWEzZDk3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.ok.ru/video/581747149537", year: 2010, genre: "Aksiyon", id: "thekaratekid" },
  { title: "Maymunlar cehennemi: Yeni krallık / Kingdom of the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/945441437c34ba93d21a08a69f511a52bd0b1c749ad2cada5de1e8135c3700ca.jpg", src: "https://dzen.ru/embed/vGwpBFwBbikE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2024, genre: "Fantastik", id: "planetoftheapes10" },
  { title: "Maymunlar cehennemi: Savaş / War for the Planet of the Apes", cover: "https://m.media-amazon.com/images/M/MV5BMzNhMzNiZDYtMzYxYy00YTYwLTkxNmYtNTJhOGU1Yjg5ODI5XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/345206360763", year: 2017, genre: "Fantastik", id: "planetoftheapes9" },
  { title: "Maymunlar cehennemi: Şafak vakti / Dawn of the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/4882c4f274171641f91d719ee98f1acecd36b4a1f839c89fd31f5e07dbe2b265.jpg", src: "https://dzen.ru/embed/vM9fD1b2fwmM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2014, genre: "Fantastik", id: "planetoftheapes8" },
  { title: "Maymunlar cehennemi: Başlangıç / Rise of the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/87e98625688a14a4e649ae5f5d4fc398705afa014c93fa35afbb61bb38759532.jpg", src: "https://dzen.ru/embed/vyQA42Ha4bio?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Fantastik", id: "planetoftheapes7" },
  { title: "Maymunlar cehennemi / Planet of the Apes", cover: "https://m.media-amazon.com/images/M/MV5BYjczODRhOTQtZjdkYi00MmM2LTg1ZmEtZDQ3YjA5MDJhODNhXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/2153203960401", year: 2001, genre: "Fantastik", id: "planetoftheapes6" },
  { title: "Maymunlar gezegeninde savaş / Battle for the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/d0c284e9c796a31f65b6a3d4bb702c6b12ddc20ae2d4f2577ef381ef630c1326.jpg", src: "https://ok.ru/video/2152739310161", year: 1973, genre: "Fantastik", id: "planetoftheapes5" },
  { title: "Maymunlar gezegeninde isyan / Conquest of the Planet of the Apes", cover: "https://m.media-amazon.com/images/I/A1A8MUWUPVL._AC_UF894,1000_QL80_.jpg", src: "https://ok.ru/video/2152636811857", year: 1972, genre: "Fantastik", id: "planetoftheapes4" },
  { title: "Maymunlar cehenneminden kaçış / Escape from the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/2069d1aa883a7d0cc5a9d7532959ac2c593ea7af1e32b8498da8f37a01d26172.jpg", src: "https://ok.ru/video/2152343669329", year: 1971, genre: "Fantastik", id: "planetoftheapes3" },
  { title: "Maymunlar cehennemine dönüş / Beneath the Planet of the Apes", cover: "https://m.media-amazon.com/images/S/pv-target-images/491405e116872424c6a5fda14e99a25cb746dd7f150f02582e8216a96216b416.jpg", src: "https://ok.ru/video/2152343472721", year: 1970, genre: "Fantastik", id: "planetoftheapes2" },
  { title: "Maymunlar cehennemi / Planet of the Apes", cover: "https://m.media-amazon.com/images/M/MV5BZWU0ZTM1NWEtN2MzOS00ZDk4LTgyNmQtZDhkNzBjNmIxNzA3XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/2152343734865", year: 1968, genre: "Fantastik", id: "planetoftheapes" },
  { title: "Hızlı ve öfkeli 10 / Fast X", cover: "https://m.media-amazon.com/images/M/MV5BYzEwZjczOTktYzU1OS00YjJlLTgyY2UtNWEzODBlN2RjZDEwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/11792629959356", year: 2023, genre: "Aksiyon", id: "fastx" },
  { title: "Hızlı ve öfkeli 9 / F9: The Fast Saga", cover: "https://m.media-amazon.com/images/M/MV5BODJkMTQ5ZmQtNzQxYy00ZWNlLWI0ZGYtYjU1NzdiMjcyNDRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vgsbQ-E4Tzlw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Aksiyon", id: "f9thefastsaga" },
  { title: "Hızlı ve öfkeli: Hobbs ve Shaw / Fast and Furious Presents: Hobbs and Shaw", cover: "https://m.media-amazon.com/images/M/MV5BNmU4OTA5NGYtMTFjMS00MzgxLWFjNTMtYjdlMThlYzc4M2M4XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vGVXP2su1RmA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2019, genre: "Aksiyon", id: "fastandfuriouspresentshobbsandshaw" },
  { title: "Hızlı ve öfkeli 8 / The Fate of the Furious", cover: "https://m.media-amazon.com/images/M/MV5BMjMxODI2NDM5Nl5BMl5BanBnXkFtZTgwNjgzOTk1MTI@._V1_.jpg", src: "https://dzen.ru/embed/vxvSLhYQn4jY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2017, genre: "Aksiyon", id: "thefateofthefurious" },
  { title: "Hızlı ve öfkeli 7 / Furious 7", cover: "https://m.media-amazon.com/images/M/MV5BODZhNDA1NGItNTVmMC00MzU2LTg4ZGMtYTE1YjQzMGI4NWUyXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v8k3_25PO2W4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2015, genre: "Aksiyon", id: "furious7" },
  { title: "Hızlı ve öfkeli 6 / Fast and Furious 6", cover: "https://m.media-amazon.com/images/M/MV5BMTM3NTg2NDQzOF5BMl5BanBnXkFtZTcwNjc2NzQzOQ@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vn_hYh80VrjY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2013, genre: "Aksiyon", id: "fastandfurious6" },
  { title: "Hızlı ve öfkeli 5 / Fast Five", cover: "https://m.media-amazon.com/images/M/MV5BMTUxNTk5MTE0OF5BMl5BanBnXkFtZTcwMjA2NzY3NA@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vehtnFAV3qgE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Aksiyon", id: "fastfive" },
  { title: "Hızlı ve öfkeli 4 / Fast and Furious", cover: "https://m.media-amazon.com/images/M/MV5BM2Y1YzhkNzUtMzhmZC00OTFkLWJjZDktMWYzZmQ0Y2Y5ODcwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v6BrTl-JSIUw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2009, genre: "Aksiyon", id: "fastandfurious" },
  { title: "Hızlı ve öfkeli: Tokyo yarışı / The Fast and the Furious: Tokyo Drift", cover: "https://m.media-amazon.com/images/M/MV5BMTQ2NTMxODEyNV5BMl5BanBnXkFtZTcwMDgxMjA0MQ@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vtHqfrsohlAQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2006, genre: "Aksiyon", id: "thefastandthefurioustokyodrift" },
  { title: "Daha hızlı daha öfkeli / 2 Fast 2 Furious", cover: "https://m.media-amazon.com/images/M/MV5BOTQzYzEwNWMtOTAwYy00YWYwLWE1NTEtZTkxOGQxZTM0M2VhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v6LDlOCAZjQc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2003, genre: "Aksiyon", id: "2fast2furious" },
  { title: "Hızlı ve öfkeli / The Fast and the Furious", cover: "https://m.media-amazon.com/images/M/MV5BMzFiZTY2OGUtNzZmMC00MTk2LTgyNzMtZmM5YzMzNjIyYTljXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vrH10eEPvFXQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2001, genre: "Aksiyon", id: "thefastandthefurious" },
  { title: "Taksi 5 / Taxi 5", cover: "https://m.media-amazon.com/images/M/MV5BYmVmYzBiMWMtZWM1NC00NWI0LWEyNDQtOGQ0NmQxNDE1NGYzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video777288366_456239066", year: 2018, genre: "Aksiyon", id: "taxi5" },
  { title: "Taksi 4 / Taxi 4", cover: "https://m.media-amazon.com/images/M/MV5BYTJhY2RmNzUtMDk3ZS00ZDI4LWI3M2YtOTVmOGE5MDg5YjIxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/3340728404561", year: 2007, genre: "Aksiyon", id: "taxi4" },
  { title: "Taksi 3 / Taxi 3", cover: "https://m.media-amazon.com/images/M/MV5BNzdjODU5ODQtZjkzOC00MTNiLWFhZjQtNDcyZmI1MmM2Yzg2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/3340728339025", year: 2003, genre: "Aksiyon", id: "taxi3" },
  { title: "Taksi 2 / Taxi 2", cover: "https://m.media-amazon.com/images/M/MV5BYzBjNDE0YmUtZTIxZS00YzJkLTlhMzAtNjQ4OTExNDQ4YzhlXkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video778742622_456239233", year: 2000, genre: "Aksiyon", id: "taxi2" },
  { title: "Taksi / Taxi", cover: "https://m.media-amazon.com/images/M/MV5BZTlkM2EzOTAtMTgzZi00NDEyLWJjOGItYWJiYTE2NmRlODMwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/3340734958161", year: 1998, genre: "Aksiyon", id: "taxi" },
  { title: "Zor ölüm 5: Ölmek için güzel bir gün / Die Hard 5: A Good Day to Die Hard", cover: "https://m.media-amazon.com/images/M/MV5BMTcwNzgyNzUzOV5BMl5BanBnXkFtZTcwMzAwOTA5OA@@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video777290795_456239323", year: 2013, genre: "Aksiyon", id: "diehard5" },
  { title: "Zor ölüm 4: Özgür yaşa veya zor öl / Die Hard 4: Live Free or Die Hard", cover: "https://m.media-amazon.com/images/M/MV5BNDQxMDE1OTg4NV5BMl5BanBnXkFtZTcwMTMzOTQzMw@@._V1_.jpg", src: "https://dzen.ru/embed/vnIqlwxGONCc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2007, genre: "Aksiyon", id: "diehard4" },
  { title: "Zor ölüm 3: Zeka öcünü alıyor / Die Hard 3: With a Vengeance", cover: "https://m.media-amazon.com/images/M/MV5BYTBjOTU4MjktMWY5My00N2E1LTllMTUtMjExNWNjNmE4MWVmXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vc6TAT0o8ijY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 1995, genre: "Aksiyon", id: "diehard3" },
  { title: "Zor ölüm 2 / Die Hard 2", cover: "https://m.media-amazon.com/images/M/MV5BN2VmOTFlM2YtOTYzMi00NjFhLTk0MjAtY2ZlN2RkZjA5NzA5XkEyXkFqcGc@._V1_.jpg", src: "https://vkvideo.ru/video777290795_456239325", year: 1990, genre: "Aksiyon", id: "diehard2" },
  { title: "Zor ölüm / Die Hard", cover: "https://m.media-amazon.com/images/M/MV5BMGNlYmM1NmQtYWExMS00NmRjLTg5ZmEtMmYyYzJkMzljYWMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video359563763_456241359", year: 1988, genre: "Aksiyon", id: "diehard" },
  { title: "Kaçış planı 3 / Escape Plan 3: The Extractors", cover: "https://m.media-amazon.com/images/M/MV5BYTcyMmFmYzMtZmYwMi00ZGNhLTg1ZjctODNiNTAzOWY3NjBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/mqz3ott8g6pa", year: 2019, genre: "Aksiyon", id: "escapeplan3" },
  { title: "Kaçış planı 2 / Escape Plan 2: Hades", cover: "https://m.media-amazon.com/images/M/MV5BMWVlYzlmZGItODJiOS00ZDRjLTlmOTgtNTUyZDFmNGUxNDNmXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/6gfy76eyinnt", year: 2018, genre: "Aksiyon", id: "escapeplan2" },
  { title: "Kaçış planı / Escape Plan", cover: "https://m.media-amazon.com/images/M/MV5BMTk3OTcxMTEyNl5BMl5BanBnXkFtZTcwMDQ4MjQ2OQ@@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/sao5x5srtqaa", year: 2013, genre: "Aksiyon", id: "escapeplan" },
  { title: "Savaşçı 3 / Ong Bak 3", cover: "https://m.media-amazon.com/images/M/MV5BMTc3MjkyMzk4N15BMl5BanBnXkFtZTcwODQxMDg5Mw@@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/tjvzyo1ok7n5", year: 2010, genre: "Aksiyon", id: "ongbak3" },
  { title: "Savaşçı 2 / Ong Bak 2", cover: "https://m.media-amazon.com/images/M/MV5BODUzMjVkMDItNmQ3OS00ZjNlLWE1ZjMtNGI5YTY1NmI1M2MyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/4uqkinxe11iq", year: 2008, genre: "Aksiyon", id: "ongbak2" },
  { title: "Savaşçı / Ong Bak", cover: "https://m.media-amazon.com/images/M/MV5BOTcwMTAzNDItODg2MC00MjE0LWEyNzYtYzZjNjZmNjdhODE2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/97jqak09ashr", year: 2003, genre: "Aksiyon", id: "ongbak" },
  { title: "Ip Man: Kung Fu efsanesi / Ip Man: Kung Fu Legend", cover: "https://m.media-amazon.com/images/M/MV5BOTg3ZWY4NWEtNzBhNS00MjRlLTgzNjItM2Q0Njc3ODc5NzZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.vkvideo.ru/video-230451560_456239915", year: 2026, genre: "Aksiyon", id: "ipmankungfulegend" },
  { title: "Ip Man: Kung Fu ustası / Ip Man: Kung Fu Master", cover: "https://m.media-amazon.com/images/M/MV5BMmFkYjRhOGItNGNmYy00OTQyLThhYjctNWVkNmRhZTNiNDgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/5419892083370", year: 2019, genre: "Aksiyon", id: "ipmankungfumaster" },
  { title: "Ip Man: Son dövüş / Ip Man: The Final Fight", cover: "https://m.media-amazon.com/images/M/MV5BMTQwMTY0NDQxMV5BMl5BanBnXkFtZTgwMjEwMTEwMDE@._V1_.jpg", src: "https://ok.ru/video/1979158432390", year: 2013, genre: "Aksiyon", id: "ipmanthefinalfight" },
  { title: "Efsane doğuyor: Ip Man / The Legend is Born: Ip Man", cover: "https://m.media-amazon.com/images/M/MV5BMjA2ODgyMjE1MF5BMl5BanBnXkFtZTcwMzE3MDU3Ng@@._V1_.jpg", src: "https://ok.ru/video/1979158235782", year: 2010, genre: "Aksiyon", id: "ipmanthelegendisborn" },
  { title: "Ip Man 4: The Final", cover: "https://m.media-amazon.com/images/M/MV5BOGVjMDEzNjMtMWJmMy00NDdjLWFkMzItOTBhZTE3OWU0YmM4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/1770461137542", year: 2019, genre: "Aksiyon", id: "ipman4" },
  { title: "Master Z: Ip Man Legacy (Spin-off)", cover: "https://m.media-amazon.com/images/M/MV5BMTYxNzA0ODQyMF5BMl5BanBnXkFtZTgwNzUwNTg1NzM@._V1_.jpg", src: "https://ok.ru/video/1978023217798", year: 2018, genre: "Aksiyon", id: "ipmanlegacy" },
  { title: "Ip Man 3", cover: "https://m.media-amazon.com/images/M/MV5BMmZhOWNlMDEtN2M1OC00Yzk5LThhOTAtZDA5NTNjNjQyZDM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/1501966895750", year: 2015, genre: "Aksiyon", id: "ipman3" },
  { title: "Ip Man 2: Legend of the Grandmaster", cover: "https://m.media-amazon.com/images/M/MV5BYzEzYTBmYjgtNjQzMi00YmNiLTkyZGItOGFhMzEzOWY3MjI4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://m.vkvideo.ru/video359109645_456239197", year: 2010, genre: "Aksiyon", id: "ipman2" },
  { title: "Ip Man", cover: "https://m.media-amazon.com/images/M/MV5BMjE0NDUzMDcyOF5BMl5BanBnXkFtZTcwNzAxMTA2Mw@@._V1_.jpg", src: "https://my.mail.ru/video/embed/2812081686177647104", year: 2008, genre: "Aksiyon", id: "ipman" },
  { title: "Avatar 3: Ateş ve kül / Avatar 3: Fire and Ash", cover:"https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vkvideo.ru/video359563763_456241595", year:2025, genre:"Fantastik", id:"avatar3" },
  { title: "Avatar: Suyun yolu / Avatar: The Deep Dive", cover: "https://m.media-amazon.com/images/M/MV5BY2ExYzkyNGUtODQwNS00MGZiLWE2NmItYTg3YjVjZGIxN2NhXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vG8OrNND6-3Y?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2022, genre: "Fantastik", id: "avatar2" },
  { title: "Avatar", cover: "https://m.media-amazon.com/images/M/MV5BM2RiNGMzM2QtMzkyNi00OGYyLWE5MTctNDRkOTRkZmI5ZGJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v_MR3qG1GUis?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2009, genre: "Fantastik", id: "avatar" },
  { title: "Fantastik dörtlü 4: İlk adımlar / The Fantastic Four: First Steps", cover:"https://m.media-amazon.com/images/S/pv-target-images/4c3b60c421dc73dd20bace682b1d68b2165fffcbeac63865a129addb85f31c0e.jpg", src:"https://vidmax.fit/vize.php?vod=v1x3e86c6ae", year:2025, genre:"Fantastik", id: "fantasticfour4" },
  { title: "Fantastik dörtlü 3 / Fantastic Four 3", cover:"https://m.media-amazon.com/images/M/MV5BMTk0OTMyMDA0OF5BMl5BanBnXkFtZTgwMzY5NTkzNTE@._V1_FMjpg_UX1000_.jpg", src:"https://vidmax.fit/vize.php?vod=v1xd28b309a", year:2015, genre:"Fantastik", id: "fantasticfour3" },
  { title: "Fantastik dörtlü 2: Gümüş sörfçü'nün yükselişi / 4: Rise of the Silver Surfer", cover:"https://m.media-amazon.com/images/M/MV5BNmZmMTU0OGQtOWRmNS00ZjA1LWJkM2EtYmUwNGEzMjIyZDM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmax.fit/vize.php?vod=v1xf0648203", year:2007, genre:"Fantastik", id: "fantasticfour2" },
  { title: "Fantastik dörtlü / Fantastic Four", cover:"https://m.media-amazon.com/images/M/MV5BNjY2YmZmMzUtZWY5Mi00MzI3LTljOTgtYTMwMWY1ODI5ZWY5XkEyXkFqcGc@._V1_.jpg", src:"https://vidmax.fit/vize.php?vod=v1xe8af3a99", year:2005, genre:"Fantastik", id: "fantasticfour" },
  { title: "Hayalet sürücü: İntikam ateşi / Ghost Rider: Spirit of Vengeance", cover:"https://m.media-amazon.com/images/M/MV5BN2FmZGVlNTgtYTllNC00YmUzLTk5YmUtNWNhMzk3ZmE2NmQ0XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vPSd-pYlxDEk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2011, genre:"Fantastik", id: "ghostrider2" },
  { title: "Hayalet sürücü / Ghost Rider", cover:"https://m.media-amazon.com/images/M/MV5BMzIyNDE5ODI1OV5BMl5BanBnXkFtZTcwNTIyNDE0MQ@@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vv7qHAy68Xn4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2007, genre:"Fantastik", id: "ghostrider" },
  { title: "Elektra", cover:"https://m.media-amazon.com/images/M/MV5BMTI3MTUwNzM5MV5BMl5BanBnXkFtZTcwNzczMDIzMw@@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vDNxIpvnSrRc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2005, genre:"Fantastik", id: "elektra" },
  { title: "Korkusuz / Daredevil", cover:"https://m.media-amazon.com/images/M/MV5BZGVjZjU3MmEtNDFjZS00N2ExLTk4YzktYjYzM2MzYTJjYmE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v_STydMzAO0Y?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2003, genre:"Fantastik", id: "daredevil" },
  { title: "Bıçağın iki yüzü: Kutsal üçleme / Blade: Trinity", cover:"https://m.media-amazon.com/images/M/MV5BNWYzN2Y4NTEtM2JlNS00MTA5LWIyZDYtOTk1YzdiOWVkNDdlXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7169636698811", year:2004, genre:"Fantastik", id: "blade3" },
  { title: "Bıçağın iki yüzü 2 / Blade II", cover:"https://m.media-amazon.com/images/M/MV5BMGE5ZmY2NzEtZTEyMi00MWIyLThmOWYtYzJkOTQ0Y2U3ZWU1XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7169581386427", year:2002, genre:"Fantastik", id: "blade2" },
  { title: "Bıçağın iki yüzü / Blade", cover:"https://m.media-amazon.com/images/M/MV5BNzAzMmY3OWMtNDgyMS00Y2U4LTlmM2UtY2YwMmM0MDI5ODJmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7169571621563", year:1998, genre:"Fantastik", id: "blade" },
  { title: "Deadpool &amp; Wolverine", cover:"https://m.media-amazon.com/images/M/MV5BZTk5ODY0MmQtMzA3Ni00NGY1LThiYzItZThiNjFiNDM4MTM3XkEyXkFqcGc@._V1_.jpg", src:"https://vidmoly.me/dl/nsleekgb1y09", year:2024, genre:"Fantastik", id: "deadpoolandwolverine" },
  { title: "Deadpool 2", cover:"https://m.media-amazon.com/images/S/pv-target-images/971b2851954bc397d153627d79a297c654e14e3563e3ae6f53ced36d26b58f63._UR2000,3000_SX750_FMpng_.png", src:"https://dzen.ru/embed/v_P-RhlrEFns?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2018, genre:"Fantastik", id: "deadpool2" },
  { title: "Deadpool", cover:"https://m.media-amazon.com/images/M/MV5BNzY3ZWU5NGQtOTViNC00ZWVmLTliNjAtNzViNzlkZWQ4YzQ4XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/477881633445", year:2016, genre:"Fantastik", id: "deadpool" },
  { title: "Galaksinin koruyucuları 3 / Guardians of the Galaxy Vol. 3", cover: "https://m.media-amazon.com/images/M/MV5BOTJhOTMxMmItZmE0Ny00MDc3LWEzOGEtOGFkMzY4MWYyZDQ0XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vYul2ODcWXFc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2023, genre: "Fantastik", id: "guardiansofthegalaxy3" },
  { title: "The Guardians of the Galaxy Holiday Special", cover: "https://m.media-amazon.com/images/M/MV5BZDA3MzdlYTQtMTUxNi00ZjJmLTkyOTYtNDkzYmIzYTJkZjMzXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vJ0UCeCIE1CA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2022, genre: "Fantastik", id: "guardiansofthegalaxyholidayspecial" },
  { title: "Galaksinin koruyucuları 2 / Guardians of the Galaxy Vol. 2", cover: "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/h1hqe5w978yx", year: 2017, genre: "Fantastik", id: "guardiansofthegalaxy2" },
  { title: "Galaksinin koruyucuları / Guardians of the Galaxy", cover: "https://m.media-amazon.com/images/M/MV5BM2ZmNjQ2MzAtNDlhNi00MmQyLWJhZDMtNmJiMjFlOWY4MzcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/v5DmIy_By9nI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2014, genre: "Fantastik", id: "guardiansofthegalaxy" },
  { title: "Karınca Adam ve Yaban arısı: Kuantum Alemi / Ant-Man and the Wasp: Quantumania", cover: "https://m.media-amazon.com/images/M/MV5BMThkYWY5ZjQtYjJlMS00MDFmLWFkYzEtODEzZjg5YWFmMGY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmax.fit/vize.php?vod=v1xab5b77ac", year: 2023, genre: "Fantastik", id: "antmanandthewaspquantumania" },
  { title: "Karınca Adam ve Yaban arısı / Ant-Man and the Wasp", cover: "https://m.media-amazon.com/images/M/MV5BODVkY2ZmZTAtYzFhMi00YzZlLWE2YWMtMDBiYjY2OTU4ZWM0XkEyXkFqcGc@._V1_.jpg", src: "https://vidmax.fit/vize.php?vod=v1x9f956aaa", year: 2018, genre: "Fantastik", id: "antmanandthewasp" },
  { title: "Karınca adam / Ant-Man", cover: "https://m.media-amazon.com/images/M/MV5BMWZiY2U0YTYtZDRiMS00ZmRjLTllOGEtMzUxYzg3NGVjYjc3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmax.fit/vize.php?vod=v1x91ba3d82", year: 2015, genre: "Fantastik", id: "antman" },
  { title: "X-Men: Dark Phoenix", cover: "https://m.media-amazon.com/images/M/MV5BN2IyZjUwNDQtZmMzZi00MWJhLTgyN2ItNTE1MmNmMDhlMzIwXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/kxu887wlwbin", year: 2019, genre: "Fantastik", id: "xmendarkphoenix" },
  { title: "Logan", cover: "https://m.media-amazon.com/images/M/MV5BZjNhOTIzYWEtNjdhNS00NGJjLWE1NzctYmIxMDY4M2UzOGU3XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vPgQgIzhbLQI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2017, genre: "Fantastik", id: "logan" },
  { title: "X-Men: Kıyamet / X-Men: Apocalypse", cover: "https://m.media-amazon.com/images/M/MV5BNjVhNWY3NjItNmZjOS00NTU3LWFiZTctNzdjNGM5Y2Y0MDUwXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vIjkY2faLYUs?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2016, genre: "Fantastik", id: "xmenapocalypse" },
  { title: "X-Men: Geçmiş günler gelecek / X-Men: Days of Future Past", cover: "https://m.media-amazon.com/images/M/MV5BNzNiYWE4NjMtMTU4OS00NmM4LWE4ZjAtYmE5OTA5NjkzODExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vT4JnMGbA7Ts?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2014, genre: "Fantastik", id: "xmendaysoffuturepast" },
  { title: "The Wolverine", cover: "https://m.media-amazon.com/images/M/MV5BNGU0MzRhMWEtYTBkNS00NzliLWJkMmUtMDFlMjkyOTkyYmZlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vbALmIYnU5xY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2013, genre: "Fantastik", id: "thewolverine" },
  { title: "X-Men: Birinci sınıf / X-Men: First Class", cover: "https://m.media-amazon.com/images/M/MV5BMTg5OTMxNzk4Nl5BMl5BanBnXkFtZTcwOTk1MjAwNQ@@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/058wk3ohtled", year: 2011, genre: "Fanstastik", id: "xmenfirstclass" },
  { title: "X-Men Başlangıç: Wolverine / X-Men Origins: Wolverine", cover: "https://m.media-amazon.com/images/M/MV5BZjQwOGEzNjUtNDgwYS00NzUzLWJhZjAtNmFlNzY2YTQyOTllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vF6MAQ4QiZ3M?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2009, genre: "Fanstastik", id: "xmenoriginswolverine" },
  { title: "X-Men: Son direniş / X-Men: The Last Stand", cover: "https://m.media-amazon.com/images/M/MV5BMThmOWE3OWEtODJmNC00ZDEzLTk4MWUtNzEzM2RiNmJiZmU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/valS5zQ85zVA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2006, genre: "Fantastik", id: "xmenthelaststand" },
  { title: "X2: X-Men United", cover: "https://m.media-amazon.com/images/M/MV5BNWMzMWNmNmMtMjg2ZC00YWJhLTgwOTAtMjJlZjljNDczMjY1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/wrqr72yjznet", year: 2003, genre: "Fantastik", id: "x2" },
  { title: "X-Men", cover: "https://m.media-amazon.com/images/M/MV5BZjdiZTUwYzItNzczYi00MjcxLTkzNWMtY2IyZGE2OTFlN2VhXkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/mif0pfxi0ztc", year: 2000, genre: "Fantastik", id: "xmen" },
  { title: "İnfazcı: Savaş bölgesi / Punisher: War Zone", cover:"https://m.media-amazon.com/images/M/MV5BZTdlOTkyZjUtODE4NC00ODZmLTg5OGYtMjkwZDY0MTZhMTQ0XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vhncDaXO-GHA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2008, genre:"Aksiyon", id: "thepunisherwarzone" },
  { title: "İnfazcı / The Punisher", cover:"https://m.media-amazon.com/images/M/MV5BMjI5NjcwMTQxMV5BMl5BanBnXkFtZTcwODg5ODkwNQ@@._V1_.jpg", src:"https://dzen.ru/embed/v13kikMMqKxY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2004, genre:"Aksiyon", id: "thepunisher2004" },
  { title: "İnfazcı / The Punisher", cover:"https://m.media-amazon.com/images/M/MV5BMzcxY2U1NmItNDMxYi00YTRjLWE1NTAtMmEzZDA4NmY2NTY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/1071595850427", year:1989, genre:"Aksiyon", id: "thepunisher1989" },
  { title: "Kara panter: Yaşasın Wakanda  / Black Panther: Wakanda Forever", cover:"https://m.media-amazon.com/images/M/MV5BYWY5NDY1ZjItZDQxMy00MTAzLTgyOGQtNTQxYjFiMzZjMjUyXkEyXkFqcGc@._V1_.jpg", src:"https://vidmoly.me/dl/3yj0i84glfld", year:2022, genre:"Fantastik", id: "blackpanther2" },
  { title: "Kara panter / Black Panther", cover:"https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg", src:"https://vidmoly.me/dl/7kl5vrogjdtd", year:2018, genre:"Fantastik", id: "blackpanther" },
  { title: "Doktor Strange çoklu evren çılgınlığında / Doctor Strange in the Multiverse of Madness", cover:"https://m.media-amazon.com/images/M/MV5BN2YxZGRjMzYtZjE1ZC00MDI0LThjZmQtZTZmMzVmMmQ2NzBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v42uE-grlMk4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2022, genre:"Fantastik", id: "doctorstrange2" },
  { title: "Doktor Strange  / Doctor Strange", cover:"https://m.media-amazon.com/images/M/MV5BNjgwNzAzNjk1Nl5BMl5BanBnXkFtZTgwMzQ2NjI1OTE@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/veY_n23UtCwg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2016, genre:"Fantastik", id: "doctorstrange" },
  { title: "İnanılmaz yeşil dev / The Incredible Hulk", cover: "https://m.media-amazon.com/images/M/MV5BNzI4YjkyZTQtMjk1NS00MzhkLWEwYzgtZjZiODUyNWViNDdlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vdv9TgfOtdBo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Fantastik", id: "theincrediblehulk" },
  { title: "Yeşil dev / Hulk", cover: "https://m.media-amazon.com/images/M/MV5BODY3ZjQ1OWItMGI5NS00NzZjLTk3ODgtZDVjOTFiMjY3NjBlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vGsuDOBwImgM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2003, genre: "Fantastik", id: "hulk" },
  { title: "Demir adam 3 / Iron Man 3", cover: "https://m.media-amazon.com/images/M/MV5BMjIzMzAzMjQyM15BMl5BanBnXkFtZTcwNzM2NjcyOQ@@._V1_.jpg", src: "https://dzen.ru/embed/vDBsSF-YKOXE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2013, genre: "Fantastik", id: "ironman3" },
  { title: "Demir adam 2 / Iron Man 2", cover: "https://m.media-amazon.com/images/M/MV5BYWYyOGQzOGYtMGQ1My00ZWYxLTgzZjktZWYzN2IwYjkxYzM0XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vZFXW4wMebjE?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2010, genre: "Fantastik", id: "ironman2" },
  { title: "Demir adam / Iron Man", cover: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vIGzkdQpfFF8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2008, genre: "Fantastik", id: "ironman" },
  { title: "Thor: Aşk ve gök gürültüsü / Thor: Love and Thunder", cover: "https://m.media-amazon.com/images/M/MV5BZjRiMDhiZjQtNjk5Yi00ZDcwLTkyYTEtMDc1NjdmNjFhNGIzXkEyXkFqcGc@._V1_.jpg", src: "https://vidmax.fit/vize.php?vod=v1x748712c7", year: 2022, genre: "Fantastik", id: "thor4" },
  { title: "Thor: Ragnarok", cover: "https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_FMjpg_UX1000_.jpg", src: "https://vidmax.fit/vize.php?vod=v1x23500e37", year: 2017, genre: "Fantastik", id: "thor3" },
  { title: "Thor: Karanlık Dünya / Thor: The Dark World", cover: "https://m.media-amazon.com/images/M/MV5BMTQyNzAwOTUxOF5BMl5BanBnXkFtZTcwMTE0OTc5OQ@@._V1_.jpg", src: "https://vidmax.fit/vize.php?vod=v1x83e58438", year: 2013, genre: "Fantastik", id: "thor2" },
  { title: "Thor", cover: "https://m.media-amazon.com/images/M/MV5BNjRhNGZjZjEtYTQzYS00OWUxLThjNGEtMTIwMTE2ZDFlZTZkXkEyXkFqcGc@._V1_.jpg", src: "https://vidmax.fit/vize.php?vod=v1xd6981a51", year: 2011, genre: "Fantastik", id: "thor" },
  { title: "Kaptan Amerika: Cesur yeni dünya / Captain America: Brave New World", cover: "https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/m8cm6bo0yykf", year: 2025, genre: "Fantastik", id: "captainamericabravenewworld" },
  { title: "Kaptan Amerika: Kahramanların savaşı / Captain America: Civil War", cover: "https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_.jpg", src: "https://vidmoly.me/dl/9c3lat8szmo2", year: 2016, genre: "Fantastik", id: "captainamericacivilwar" },
  { title: "Kaptan Amerika: Kış askeri / Captain America: The Winter Soldier", cover: "https://m.media-amazon.com/images/M/MV5BNWY1NjFmNDItZDhmOC00NjI1LWE0ZDItMTM0MjBjZThiOTQ2XkEyXkFqcGc@._V1_.jpg", src: "https://vidmoly.me/dl/qnwftwtslw02", year: 2014, genre: "Fantastik", id: "captainamericathewintersoldier" },
  { title: "Kaptan Amerika: İlk yenilmez / Captain America: First Avenger", cover: "https://m.media-amazon.com/images/M/MV5BNzUyM2YyY2MtNzNlMS00MWU5LTgxNjAtNzZlNmI2NjU2NDZlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vGMyO9P5eMRc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2011, genre: "Fantastik", id: "captainamericafirstavenger" },
  { title: "Kaptan Amerika / Captain America", cover:"https://m.media-amazon.com/images/S/pv-target-images/2ba90419b7524012efaa20008d8ed76046c94dc0079b7e72da6cece5512b74b5.jpg", src:"https://ok.ru/video/7973223664209", year:1990, genre:"Fantastik", id: "captainamerica1990" },
  { title: "Yenilmezler: Son oyun / The Avengers: Endgame", cover: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg", src: "https://vidmoly.me/dl/opulhizp255c", year: 2019, genre: "Fantastik", id: "theavengers4" },
  { title: "Yenilmezler: Sonsuzluk savaşı / The Avengers: Infinity War", cover: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg", src: "https://dzen.ru/embed/v19pPfuEckQ8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Fantastik", id: "theavengers3" },
  { title: "Yenilmezler: Ultron çağı / The Avengers: Age of Ultron", cover: "https://m.media-amazon.com/images/M/MV5BY2I5M2M0ZDctMjEwYS00MmM3LTgzZTctOWFkZjY1Y2I5OTJlXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v764uOr-vdh8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2015, genre: "Fantastik", id: "theavengers2" },
  { title: "Yenilmezler / The Avengers", cover: "https://m.media-amazon.com/images/M/MV5BOGIzNGQ0M2EtMTFmZC00ZWMyLWI4NWItYTE2MzVkOGJmZDE1XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/v-3EuHfWh4hw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2012, genre: "Fantastik", id: "theavengers" },
  { title: "Venom: Son dans / Venom: Last Dance", cover: "https://m.media-amazon.com/images/M/MV5BZDMyYWU4NzItZDY0MC00ODE2LTkyYTMtMzNkNDdmYmFhZDg0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vidmoly.me/dl/jlfcrodyau7h", year: 2024, genre: "Fantastik", id: "venom3" },
  { title: "Venom: Zehirli öfke 2 / Venom: Let There Be Carnage", cover: "https://m.media-amazon.com/images/M/MV5BZTZkMGY0NTQtMzg2NC00YzdhLTg1NzYtZDMyNzZhNGU3ZGUwXkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vUO66L0mC9GM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2021, genre: "Fantastik", id: "venom2" },
  { title: "Venom: Zehirli öfke 1", cover: "https://m.media-amazon.com/images/M/MV5BMTU3MTQyNjQwM15BMl5BanBnXkFtZTgwNDgxNDczNTM@._V1_.jpg", src: "https://ok.ru/video/2786564115078", year: 2018, genre: "Fantastik", id: "venom" },
  { title: "Örümcek Adam: Örümcek evrenine geçiş  / Spider Man: Across the Spider-Verse", cover: "https://m.media-amazon.com/images/M/MV5BZjI5MjFiZmQtNGQ4Ni00OThjLWE3OTctOGI4NmZiNmZmZmNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://vkvideo.ru/video784107073_456239616", year: 2023, genre: "Fantastik", id: "spidermanacrossthespiderverse" },
  { title: "Örümcek Adam: Örümcek evreninde  / Spider Man: Into the Spider-Verse", cover: "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vJtyGbz7qu3I?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2018, genre: "Fantastik", id: "spidermanintothespiderverse" },
  { title: "Örümcek Adam: Yepyeni bir gün / Spider Man: Brand New Day", cover: "https://m.media-amazon.com/images/M/MV5BOWNjYWM3NWItOGE0ZS00MWRjLThiZWEtYjc4ZmNmMmU5ZTVmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://watch.trplayer.com/watch?v=92JWN3XY", year: 2026, genre: "Fantastik", id: "spidermanbrandnewday", special: "yes" },
  { title: "Örümcek Adam: Eve dönüş yok / Spider Man: No Way Home", cover: "https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/9940033669820", year: 2021, genre: "Fantastik", id: "spidermannowayhome" },
  { title: "Örümcek Adam: Evden uzakta / Spider Man: Far from Home", cover: "https://m.media-amazon.com/images/M/MV5BM2Y2YzE5MGEtMGZjYS00MGM5LTlmYzEtYTNmMGZjZDY4YTkzXkEyXkFqcGc@._V1_.jpg", src: "https://ok.ru/video/10501162339004", year: 2019, genre: "Fantastik", id: "spidermanfarfromhome" },
  { title: "Örümcek Adam: Eve dönüş / Spider Man: Homecoming", cover: "https://m.media-amazon.com/images/M/MV5BODY2MTAzOTQ4M15BMl5BanBnXkFtZTgwNzg5MTE0MjI@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/9249481558716", year: 2017, genre: "Fantastik", id: "spidermanhomecoming" },
  { title: "İnanılmaz Örümcek Adam 2 / The Amazing Spider Man 2", cover: "https://m.media-amazon.com/images/M/MV5BOTA5NDYxNTg0OV5BMl5BanBnXkFtZTgwODE5NzU1MTE@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/22823766703", year: 2014, genre: "Fantastik", id: "theamazingspiderman2" },
  { title: "İnanılmaz Örümcek Adam / The Amazing Spider Man", cover: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_FMjpg_UX1000_.jpg", src: "https://ok.ru/video/880941075131", year: 2012, genre: "Fantastik", id: "theamazingspiderman" },
  { title: "Örümcek Adam 3 / Spider Man 3", cover: "https://m.media-amazon.com/images/M/MV5BODE2NzNhMDctYjUzMC00Y2M5LWI2Y2EtODJkZTFjN2Y5ODlmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src: "https://dzen.ru/embed/vKghmm3uOxAg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2007, genre: "Fantastik", id: "spiderman3" },
  { title: "Örümcek adam 2 / Spider Man 2", cover: "https://m.media-amazon.com/images/M/MV5BNGQ0YTQyYTgtNWI2YS00NTE2LWJmNDItNTFlMTUwNmFlZTM0XkEyXkFqcGc@._V1_.jpg", src: "https://dzen.ru/embed/vCVk2OhAtQgs?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2004, genre: "Fantastik", id: "spiderman2" },
  { title: "Örümcek adam / Spider Man", cover: "https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SY450_CR2", src: "https://dzen.ru/embed/vljXGDHz-3XI?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year: 2002, genre: "Fantastik", id: "spiderman" }   
];

/* ===========================
   State & refs
   =========================== */
let state = { all: MOVIES.slice(), filtered: MOVIES.slice(), perPage:21, page:0, loading:false, modalOpen:false, current:null };

const grid = document.getElementById('grid');
const loader = document.getElementById('loader');
const allLoaded = document.getElementById('allLoaded');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const infoBtn = document.getElementById('infoBtn');
const logoImg = document.getElementById('logoImg');
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('modal');
const playerTitle = document.getElementById('playerTitle');
const playerSub = document.getElementById('playerSub');
const playerSourceLabel = document.getElementById('playerSourceLabel');
const toast = document.getElementById('toast');
const closeModal = document.getElementById('closeModal');
const genreFilter = document.getElementById('genreFilter'); // <-- YENİ DOM Referansı

/* === YENİ ===: Janr Filtrini Doldurmaq */
function populateGenres() {
  // Bütün unikal janrları tap və əlifba sırası ilə düz
  const genres = [...new Set(MOVIES.map(m => m.genre))].sort();
  
  // Hər janr üçün bir <option> yarat və <select> menyusuna əlavə et
  genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}
populateGenres(); // Səhifə yüklənəndə funksiyanı çağır
/* === SON === */

/* Theme handling + logo swapping - YENİLƏNDİ */
let theme = localStorage.getItem('flix-theme') || 'dark';

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('flix-theme', t);

  const isDark = t === 'dark';

  // 1. Loqo dəyişimi (Yolun düzgünlüyündən əmin ol)
  // Əgər loqo tapılmazsa (onerror), alternativ yolu yoxlayır
  if (typeof logoImg !== 'undefined') {
    const color = isDark ? 'white' : 'black';
    logoImg.src = `../FILES/IMG/logos/${color}.png`;
    
    logoImg.onerror = function() {
      this.src = `FILES/IMG/logos/${color}.png`;
      this.onerror = null;
    };
  }

  // 2. İkon dəyişimi (Emoji əvəzinə FontAwesome istifadə edirik)
  if (typeof themeToggle !== 'undefined') {
    themeToggle.innerHTML = isDark 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  }
}

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
});

// Səhifə yüklənəndə tətbiq et
applyTheme(theme);

/* Toast helper */
function showToast(msg, ms=2000){
  toast.textContent = msg; toast.classList.add('show'); toast.style.display='block';
  clearTimeout(toast._t); toast._t = setTimeout(()=>{ toast.classList.remove('show'); toast.style.display='none'; }, ms);
}

/* safe escape */
function esc(s){ return String(s).replace(/[&<>"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

/* Render chunk */
function renderChunk(){
  if(state.loading) return;
  state.loading = true; loader.style.display='flex';
  setTimeout(()=>{
    const start = state.page * state.perPage;
    const chunk = state.filtered.slice(start, start + state.perPage);
    chunk.forEach(m=>{
      const el = document.createElement('article');
      el.className = 'card';
      el.tabIndex = 0;
      
      // --- MƏCBURİ STİLLƏR (JS daxilində) ---
      const isGold = m.special === "yes";
      const isTrend = m.trend === "yes";

      // 1. Alov ikonu (Bütün stillər daxilindədir)
      const fireHtml = isTrend ? `
        <div style="position:absolute !important; top:8px !important; right:8px !important; 
                    background:orange !important; background:linear-gradient(45deg, #ff4500, #ff8c00) !important; 
                    color:white !important; width:28px !important; height:28px !important; 
                    border-radius:50% !important; display:flex !important; align-items:center !important; 
                    justify-content:center !important; z-index:1 !important; font-size:14px !important;
                    box-shadow: 0 0 8px rgba(0,0,0,0.3) !important;">
            <i class="fa-solid fa-fire"></i>
        </div>` : '';

      // 2. Qızılı Fon və Yazı Rəngləri
      const goldBg = isGold ? `style="background:linear-gradient(135deg, #FFD700, #FDB931) !important;"` : '';
      const goldText = isGold ? `style="color:#000000 !important; font-weight:800 !important;"` : '';
      
      // Kənar xətt silindi, sadəcə mövqe təyin edilir
      el.style.position = "relative";

      el.innerHTML = `
        ${fireHtml}
        <div class="poster" style="background-image:url('${esc(m.cover)}');"></div>
        <div class="meta" ${goldBg}>
          <h3 class="title" ${goldText}>${esc(m.title)}</h3>
          <p class="sub" ${goldText}>${m.year} · ${esc(m.genre)}</p>
        </div>`;

      el.addEventListener('click', ()=>openPlayer(m));
      el.addEventListener('keydown', e=>{ if(e.key === 'Enter' || e.key === ' ') openPlayer(m); });
      grid.appendChild(el);
    });
    state.page++; state.loading=false; loader.style.display='none';
    if(state.page * state.perPage >= state.filtered.length){ allLoaded.style.display='block'; showToast('Filmlər yükləndi! ✅'); } else allLoaded.style.display='none';

    // Əgər heç bir nəticə tapılmasa
    if (state.filtered.length === 0 && state.page === 1) {
      allLoaded.textContent = 'Axtardığınız film saytımızda mövcud deyil!';
      allLoaded.style.display = 'block';
    } else {
      allLoaded.textContent = 'Səhifənin sonuna çatdınız!';
    }
    
  }, 260);
}
function resetGrid(){ grid.innerHTML=''; state.page=0; allLoaded.style.display='none'; renderChunk(); }

  /* === YENİ ===: Birləşdirilmiş Filtr Funksiyası */
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase(); // Axtarış mətni
  const g = genreFilter.value; // Seçilmiş janr

  let results = state.all.slice(); // Bütün filmlərdən başla

  // 1. Ada görə filtr (əgər axtarış mətni varsa)
  if (q) {
    results = results.filter(m => m.title.toLowerCase().includes(q));
  }

  // 2. Janra görə filtr (əgər janr seçilibsə, yəni dəyəri boş deyilsə)
  if (g) {
    results = results.filter(m => m.genre === g);
  }

  // Yekun nəticəni state-ə yaz və qaleriyanı yenilə
  state.filtered = results;
  resetGrid();
}
/* === SON === */

/* Search: open/close behavior (YENİLƏNDİ) */
searchBtn.addEventListener('click', ()=>{
  if(searchInput.classList.contains('open')){ 
    searchInput.classList.remove('open'); 
    searchInput.value=''; 
    searchInput.blur(); 
    applyFilters(); // <-- DƏYİŞDİ: Köhnə resetGrid() əvəzinə applyFilters() çağırılır
  }
  else { searchInput.classList.add('open'); searchInput.focus(); }
});

searchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ 
    searchInput.classList.remove('open'); 
    searchInput.value=''; 
    searchInput.blur(); 
    applyFilters(); // <-- DƏYİŞDİ: Köhnə resetGrid() əvəzinə applyFilters() çağırılır
  }
});

  // Axtarışa hər hərf yazdıqda filtrləri tətbiq et
searchInput.addEventListener('input', applyFilters); // <-- DƏYİŞDİ

// === YENİ ===: Janr dəyişdikdə filtrləri tətbiq et
genreFilter.addEventListener('change', applyFilters);
/* === SON === */

/* Lazy scroll */
let st=false;
window.addEventListener('scroll', ()=>{
  if(st) return; st=true; setTimeout(()=>st=false,140);
  if(state.loading) return;
  const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 560);
  if(nearBottom && state.page * state.perPage < state.filtered.length) renderChunk();
});

/* initial render */
renderChunk();

/* ============ Video.js + HLS integration with DOM-parsed SVG buttons ============ */
let videoElement = document.getElementById('my-video');
let videojsPlayer = null;
let hlsInstance = null;

function svgFromString(svgString){
  try{
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    return doc.documentElement;
  }catch(e){
    const wrap = document.createElement('div');
    wrap.innerHTML = svgString;
    return wrap.querySelector('svg');
  }
}

function initVideojs(){
  if(window.videojs && !videojsPlayer){
    videojsPlayer = videojs('my-video', { controls:true, preload:'auto', muted:true });

    videojsPlayer.ready(function(){
      const controlBar = videojsPlayer.getChild('controlBar');
      if(controlBar){
        const playButton = controlBar.getChild('playToggle');

        // exact svg strings from user's original player
        const rewindSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11 18V6L2.5 12L11 18ZM11 12L21.5 18V6L11 12Z"></path></svg>`;
        const forwardSvgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 6V18L21.5 12L13 6ZM13 12L2.5 6V18L13 12Z"></path></svg>`;

        // create buttons
        const backButton = videojs.dom.createEl('button', { className:'vjs-control custom-skip vjs-button', title:'10 saniyə geri al', type:'button', innerHTML:'' });
        const forwardButton = videojs.dom.createEl('button', { className:'vjs-control custom-skip vjs-button', title:'10 saniyə irəli al', type:'button', innerHTML:'' });

        // parse SVGs and append
        const backSvgNode = svgFromString(rewindSvgString);
        const forwardSvgNode = svgFromString(forwardSvgString);

        [backSvgNode, forwardSvgNode].forEach(svg=>{
          if(!svg.getAttribute('width')) svg.setAttribute('width','22');
          if(!svg.getAttribute('height')) svg.setAttribute('height','22');
          svg.setAttribute('preserveAspectRatio','xMidYMid meet');
          svg.style.display = 'block';
          svg.style.pointerEvents = 'none';
          const path = svg.querySelector('path');
          if(path) path.removeAttribute('fill'); // let CSS control color
        });

        backButton.appendChild(backSvgNode);
        forwardButton.appendChild(forwardSvgNode);

        // handlers
        backButton.addEventListener('click', ()=>{ try{ videojsPlayer.currentTime(Math.max(0, videojsPlayer.currentTime() - 10)); }catch(e){} });
        forwardButton.addEventListener('click', ()=>{ try{ videojsPlayer.currentTime(Math.min(videojsPlayer.duration(), videojsPlayer.currentTime() + 10)); }catch(e){} });

        // insert into control bar: Play -> Back -> Forward
        try{
          const parent = controlBar.el();
          parent.insertBefore(playButton.el(), parent.firstChild);
          parent.insertBefore(backButton, playButton.el().nextSibling);
          parent.insertBefore(forwardButton, backButton.nextSibling);
        }catch(e){}
      }
    });
  }
}

/* ---- Scrollbar compensation (avoid reflow) ---- */
let savedBodyPaddingRight = '';
function lockBodyScroll(){
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  savedBodyPaddingRight = document.body.style.paddingRight || '';
  document.body.style.overflow = 'hidden';
  if(scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
}
function unlockBodyScroll(){
  document.body.style.overflow = '';
  document.body.style.paddingRight = savedBodyPaddingRight || '';
}

/* Open player modal */
function openPlayer(movie){
  initVideojs();
  state.modalOpen = true; state.current = movie;
  playerTitle.textContent = movie.title; playerSub.textContent = `${movie.year} · ${movie.genre}`;
  playerSourceLabel.textContent = movie.src.split('/').pop();

  lockBodyScroll();
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');

  if(hlsInstance){ try{ hlsInstance.destroy(); }catch(e){} hlsInstance = null; }
  try{ videojsPlayer.pause(); }catch(e){}
  videoElement.removeAttribute('src'); videoElement.load();

  const src = movie.src;
  if((src.indexOf('.m3u8') !== -1) && window.Hls && Hls.isSupported()){
    hlsInstance = new Hls();
    hlsInstance.loadSource(src);
    hlsInstance.attachMedia(videoElement);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, function(){ try{ videojsPlayer.play().catch(()=>{}); }catch(e){} });
  } else {
    try{ videojsPlayer.src({ src: src, type: src.endsWith('.mp4') ? 'video/mp4' : 'application/x-mpegURL' }); videojsPlayer.play().catch(()=>{}); } catch(e){ videoElement.src = src; videoElement.setAttribute('type', src.endsWith('.mp4') ? 'video/mp4' : ''); try{ videojsPlayer.play().catch(()=>{}); }catch(e){} }
  }

  setTimeout(()=>{ try{ videoElement.focus(); }catch(e){} }, 160);
  showToast(`${movie.title} başladılır!`);
}

/* Close player modal */
function closePlayer(){
  state.modalOpen = false; state.current = null;
  try{ if(videojsPlayer){ videojsPlayer.pause(); videojsPlayer.currentTime(0); } }catch(e){}
  if(hlsInstance){ try{ hlsInstance.stopLoad(); hlsInstance.destroy(); }catch(e){} hlsInstance = null; }
  try{ if(videojsPlayer){ videojsPlayer.src({src:'', type:''}); } }catch(e){}
  try{ videoElement.removeAttribute('src'); videoElement.load(); }catch(e){}
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
  unlockBodyScroll();
  showToast('Film dayandırıldı!', 900);
  // === YENİ KOD (URL-i Təmizləmək) ===
          // URL-i ?m=... hissəsi olmadan əsas hala (index.html) qaytar
          window.history.pushState({ movieId: null }, document.title, window.location.pathname);
          // === SON ===
}

/* wire close actions */
closeModal.addEventListener('click', closePlayer);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closePlayer(); });

/* keyboard handling */
document.addEventListener('keydown', (e)=>{
  const tag = document.activeElement && document.activeElement.tagName && document.activeElement.tagName.toLowerCase();
  if(tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;
  if(state.modalOpen){
    if(e.code === 'Space'){ e.preventDefault(); try{ if(videojsPlayer.paused()) videojsPlayer.play(); else videojsPlayer.pause(); }catch(e){} }
    else if(e.code === 'ArrowLeft'){ e.preventDefault(); try{ videojsPlayer.currentTime(Math.max(0, videojsPlayer.currentTime() - 10)); }catch(e){} }
    else if(e.code === 'ArrowRight'){ e.preventDefault(); try{ videojsPlayer.currentTime(Math.min(videojsPlayer.duration(), videojsPlayer.currentTime() + 10)); }catch(e){} }
    else if(e.code === 'Escape'){ e.preventDefault(); closePlayer(); }
    else { e.preventDefault(); }
  }
});

/* video ended */
videoElement.addEventListener('ended', ()=>{ showToast('Film sona çatdı',1500); });

/* Info button */
infoBtn.addEventListener('click', ()=>{ showToast('Powered by Əliqoşqar Kərimli!', 1800); });

/* accessibility focus */
searchInput.setAttribute('aria-label','Film axtar');

/* === YENİLƏNDİ ===: Deep link dəstəyi ?m=deepId ilə işləyir */
(function(){
  const p = new URLSearchParams(location.search); 
  const q = p.get('id'); // Buraya 'spiderman' kimi bir xüsusi ID yazılacaq
  if(q){
    const qLower = q.toLowerCase();
    // 'id' sahəsi olan və 'q' ilə eyniləşən filmi tap
    const found = MOVIES.find(x => x.id && x.id.toLowerCase() === qLower); 
    if(found) {
      setTimeout(()=> openPlayer(found), 400); 
    }
  }
})();
/* === SON === */

/* ============================================================
   UNIVERSAL VIDEO HANDLER
   ============================================================ */
(function () {

  /* ---------- Orijinal openPlayer hazır olana qədər gözlə ---------- */
  function whenOpenPlayerReady(cb) {
    if (typeof window.openPlayer === 'function') { cb(); return; }
    let tries = 0;
    const iv = setInterval(() => {
      if (typeof window.openPlayer === 'function' || ++tries > 40) { clearInterval(iv); cb(); }
    }, 100);
  }

  /* ============================================================
     PROVIDER (platforma) siyahısı
     ============================================================ */

  const DEFAULT_SANDBOX = 'allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen';

  const PROVIDERS = [
    {
      name: 'Odnoklassniki',
      test: u => /ok\.ru|odnoklassniki/i.test(u),
      embed: u => {
        let m = u.match(/\/video(?:\/|%2F)(\d{6,})/i) ||
                u.match(/\/video\/?(\d{6,})/i) ||
                u.match(/video(?:=|:)?(\d{6,})/i);
        if (!m) { const dd = u.match(/(\d{6,})/g); if (dd && dd.length) m = [null, dd[0]]; }
        return (m && m[1]) ? `https://ok.ru/videoembed/${encodeURIComponent(m[1])}` : u;
      }
    },
    {
      name: 'AbyssPlayer',
      test: u => /abyssplayer\.com/i.test(u),
      embed: u => {
        const m = u.match(/abyssplayer\.com\/(?:embed\/|e\/)?([a-zA-Z0-9]+)/i);
        return (m && m[1]) ? `https://abyssplayer.com/${m[1]}` : null;
      }
    },
    {
      name: 'Vidmax',
      test: u => /vidmax\./i.test(u),
      embed: u => {
        const m = u.match(/vod=([a-zA-Z0-9_-]+)/i);
        return (m && m[1]) ? `https://vidmax.fit/vize.php?vod=${m[1]}` : u;
      }
    },
    {
      name: 'VK',
      test: u => /vk\.com|vkvideo\.ru/i.test(u),
      embed: u => {
        let m = u.match(/video(-?\d+)[_\/-](\d+)/i);
        if (!m) {
          try {
            const p = new URL(u);
            const oid = p.searchParams.get('oid') || p.searchParams.get('owner_id') || p.searchParams.get('owner');
            const vid = p.searchParams.get('id') || p.searchParams.get('video_id') || p.searchParams.get('v');
            if (oid && vid) m = [null, oid.replace(/[^-0-9]/g, ''), vid.replace(/\D/g, '')];
          } catch (e) {}
        }
        return (m && m[1] && m[2])
          ? `https://vk.com/video_ext.php?oid=${encodeURIComponent(m[1])}&id=${encodeURIComponent(m[2])}`
          : u;
      }
    },
    {
      name: 'Streamtape',
      test: u => /streamtape|strtape/i.test(u),
      embed: u => {
        const m = u.match(/\/(?:v|e)\/([a-zA-Z0-9]+)/i);
        return (m && m[1]) ? `https://streamtape.com/e/${encodeURIComponent(m[1])}` : u;
      },
      // Streamtape-in öz anti-adblock skriptini kor edən sınanmış "forum trick":
      // 'allow-popups' YOXDUR, amma 'allow-popups-to-escape-sandbox' var.
      sandbox: 'allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-modals allow-popups-to-escape-sandbox allow-fullscreen'
    },
    {
      name: 'Mail.ru',
      test: u => /mail\.ru/i.test(u),
      embed: u => {
        let m = u.match(/\/mail\/([^\/]+)\/video\/(?:_myvideo\/)?(\d+)\.html/i);
        if (m && m[2]) return `https://my.mail.ru/video/embed/${encodeURIComponent(m[2])}`;
        m = u.match(/\/video\/(\d+)(?:\.html)?/i);
        if (m && m[1]) return `https://my.mail.ru/video/embed/${encodeURIComponent(m[1])}`;
        m = u.match(/\/mail\/([^\/]+)\/(\d+)\.html/i);
        if (m && m[2]) return `https://my.mail.ru/video/embed/${encodeURIComponent(m[2])}`;
        return u; // artıq embed formatında ola bilər
      }
    },
    {
      name: 'Dzen',
      test: u => /dzen\.ru/i.test(u),
      embed: u => {
        const m = u.match(/(?:watch\/)([a-zA-Z0-9\-_]+)/i);
        return (m && m[1])
          ? `https://dzen.ru/embed/${encodeURIComponent(m[1])}?from_block=partner&from=zen&mute=0&autoplay=0&tv=0`
          : u;
      }
    },
    {
      name: 'VidMoly',
      test: u => /vidmoly\./i.test(u),
      embed: u => {
        const m = u.match(/vidmoly\.[a-z]+.*?(?:\/embed-|\/d\/|\/w\/|\/)([a-zA-Z0-9]{10,20})/i);
        return (m && m[1]) ? `https://vidmoly.net/embed-${m[1]}.html` : null;
      },
      // VidMoly-nin daxili fullscreen düyməsi cross-origin/nested iframe
      // icazə zənciri səbəbindən modal daxilində işləmir, ona görə bizim
      // əl ilə idarə olunan Fullscreen düyməmiz YALNIZ bu provayder üçün göstərilir.
      forceFsButton: true
      // sandbox verilmir -> DEFAULT_SANDBOX tətbiq olunur
    },
    {
      name: 'Google Drive',
      test: u => /drive\.google\.com/i.test(u),
      embed: u => {
        const m = u.match(/\/file\/d\/([a-zA-Z0-9\-_]+)(?:\/preview)?/i);
        return (m && m[1]) ? `https://drive.google.com/file/d/${encodeURIComponent(m[1])}/preview` : null;
      }
    },
    {
      name: 'Sibnet',
      test: u => /video\.sibnet\.ru/i.test(u),
      embed: u => {
        let m = u.match(/video(\d+)/i) || u.match(/videoid=(\d+)/i);
        if (!m) {
          try {
            const p = new URL(u);
            const vid = p.searchParams.get('videoid') || p.searchParams.get('id') || p.searchParams.get('v');
            if (vid) m = [null, vid.replace(/\D/g, '')];
          } catch (e) {}
        }
        return (m && m[1]) ? `https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(m[1])}` : u;
      }
    },
    {
      name: 'Vidmody Smart',
      test: u => /vidmody\.com/i.test(u),
      embed: u => u // birbaşa link istifadə olunur
    },
    {
      name: 'Dailymotion',
      test: u => /dailymotion\.com|dai\.ly/i.test(u),
      embed: u => {
        let m = u.match(/video\/([a-zA-Z0-9]+)/i) || u.match(/dai\.ly\/([a-zA-Z0-9]+)/i);
        return (m && m[1]) ? `https://geo.dailymotion.com/player.html?video=${encodeURIComponent(m[1])}` : u;
      }
    },
     {
      name: 'TRPlayer',
      test: u => /trplayer\.com/i.test(u),
      embed: u => u // Linki dəyişmədən birbaşa iframe-ə verir (watch?v=... formatında)
    }
    /* Yeni platforma əlavə etmək üçün buraya eyni formatda { name, test, embed } obyekti əlavə edin */
  ];

  /* ============================================================
     TƏK universal modal (bütün platformalar üçün ortaq UI)
     ============================================================ */
  let univModal = null;

  function createUnivModal() {
    if (univModal) return univModal;

    const css = `
      .univmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(2,6,23,0.8),rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .univmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .univmodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .univmodal-left{display:flex;align-items:center;gap:8px}
      .univmodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .univmodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .univmodal-close, .univmodal-fs{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .univmodal-close:hover, .univmodal-fs:hover{background:rgba(255,255,255,0.05)}
      .univmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000;position:relative}
      .univmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .univmodal-iframe-wrap{height:48vh} .univmodal-title{font-size:14px} .univmodal-sub{font-size:12px} .univmodal-sheet{width:100%} }
    `;
    /* QEYD: .univmodal-overlay üçün "transform: translateX(...)" YAZMAYIN.
       CSS transform olan əcdad (ancestor) elementi native Fullscreen API-nin
       düzgün renderini poza bilər (Chrome/Firefox top-layer məhdudiyyəti).
       Bu, aşağıdakı əl ilə idarə olunan Fullscreen düyməsinin etibarlı
       işləməsi üçün önəmlidir. */
    const st = document.createElement('style');
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);

    univModal = document.createElement('div');
    univModal.className = 'univmodal-overlay';
    univModal.style.display = 'none';
    univModal.innerHTML = `
      <div class="univmodal-sheet" role="dialog" aria-modal="true">
        <div class="univmodal-top">
          <div class="univmodal-left">
            <button class="univmodal-close" aria-label="Bağla">✕</button>
            <button class="univmodal-fs" title="Tam Ekran" aria-label="Tam Ekran"><i class="fas fa-expand"></i></button>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <div class="univmodal-title"></div>
            <div class="univmodal-sub"></div>
          </div>
          <div class="player-right-controls">
            <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
                <circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"></circle>
                <circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"></circle>
                <circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="univmodal-iframe-wrap">
          <iframe class="univmodal-iframe" allowfullscreen webkitallowfullscreen mozallowfullscreen
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture; geolocation; microphone; camera"
            referrerpolicy="no-referrer" src="about:blank"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(univModal);

    const closeBtn = univModal.querySelector('.univmodal-close');
    const closeWithToast = () => { hideUnivModal(); try { if (typeof showToast === 'function') showToast('Film dayandırıldı!', 900); } catch (e) {} };

    closeBtn.addEventListener('click', closeWithToast);
    univModal.addEventListener('click', (e) => { if (e.target === univModal) closeWithToast(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && univModal.style.display === 'flex') closeWithToast(); });

    /* --- FULLSCREEN DÜYMƏSİ ---
       Bəzi platformaların (məs. VidMoly) daxili player fullscreen düyməsi
       cross-origin/nested iframe icazə zənciri səbəbindən modal daxilində
       işləmir. Ona görə öz div-imizi (iframe-wrap) fullscreen edirik —
       bu bizim öz DOM elementimiz olduğu üçün icazə problemi yaranmır. */
    const fsBtn = univModal.querySelector('.univmodal-fs');
    const wrap = univModal.querySelector('.univmodal-iframe-wrap');
    fsBtn.addEventListener('click', async () => {
      try {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (wrap.requestFullscreen) await wrap.requestFullscreen();
          else if (wrap.webkitRequestFullscreen) await wrap.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) await document.exitFullscreen();
          else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        }
      } catch (err) { console.error(err); }
    });

    return univModal;
  }

  function showUnivModal(embedUrl, originalUrl, titleText, subtitleText, showFsButton, sandboxTokens) {
    const m = createUnivModal();
    const iframe = m.querySelector('.univmodal-iframe');
    const titleEl = m.querySelector('.univmodal-title');
    const subEl = m.querySelector('.univmodal-sub');
    const fsBtn = m.querySelector('.univmodal-fs');

    fsBtn.style.display = showFsButton ? '' : 'none';

    // Sandbox-u src-dən ƏVVƏL qoyuruq ki, iframe elə əvvəldən məhdudiyyətli
    // kontekstdə naviqasiya etsin (reklam/pop-up bloklaması üçün vacibdir).
    if (sandboxTokens) iframe.setAttribute('sandbox', sandboxTokens);
    else iframe.removeAttribute('sandbox');

    if (titleText) titleEl.textContent = titleText;
    if (subtitleText) { subEl.textContent = subtitleText; subEl.style.display = 'block'; }
    else { subEl.textContent = ''; subEl.style.display = 'none'; }

    try {
      iframe.removeAttribute('srcdoc');
      iframe.src = embedUrl;
    } catch (e) {
      window.open(originalUrl, '_blank', 'noopener');
      return;
    }

    try { if (typeof lockBodyScroll === 'function') lockBodyScroll(); else document.documentElement.style.overflow = 'hidden'; } catch (e) {}
    m.style.display = 'flex';
    try { if (typeof showToast === 'function') showToast(`${titleText} başladılır!`, 1000); } catch (e) {}
  }

  function hideUnivModal() {
    // URL-i ?m=... hissəsi olmadan qaytar
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);

    const m = createUnivModal();
    const iframe = m.querySelector('.univmodal-iframe');
    try { iframe.src = 'about:blank'; } catch (e) {}
    m.style.display = 'none';
    try { if (typeof unlockBodyScroll === 'function') unlockBodyScroll(); else document.documentElement.style.overflow = ''; } catch (e) {}
    try {
      if (document.fullscreenElement) { document.exitFullscreen && document.exitFullscreen(); }
      else if (document.webkitFullscreenElement) { document.webkitExitFullscreen && document.webkitExitFullscreen(); }
    } catch (e) {}
  }

  /* ============================================================
     openPlayer-i YALNIZ BİR DƏFƏ ələ keçiririk
     ============================================================ */
  whenOpenPlayerReady(function () {
    const original = (typeof window.openPlayer === 'function') ? window.openPlayer.bind(window) : null;

    window.openPlayer = function (movie) {
      try {
        const src = (movie && (movie.src || movie.url)) ? (movie.src || movie.url) : String(movie || '');
        const provider = PROVIDERS.find(p => p.test(src));

        // Heç bir platformaya uyğun gəlmirsə (məs. birbaşa .mp4/.m3u8) -> native player
        if (!provider) {
          if (original) return original(movie);
          return;
        }

        const embed = provider.embed(src);

        // AbyssPlayer / VidMoly / Google Drive kimi "strict" providerlərdə
        // ID tapılmasa embed null olur -> native player-ə keçirik
        if (!embed) {
          if (original) return original(movie);
          return;
        }

        let subtitle = '';
        if (movie && (movie.year || movie.genre)) {
          const parts = [];
          if (movie.year) parts.push(String(movie.year));
          if (movie.genre) parts.push(String(movie.genre));
          if (parts.length) subtitle = parts.join(' · ');
        }

        showUnivModal(embed, src, (movie && movie.title) ? movie.title : `${provider.name} video`, subtitle, !!provider.forceFsButton, provider.sandbox || DEFAULT_SANDBOX);
      } catch (err) {
        if (original) return original(movie);
        try { window.open((movie && movie.src) || movie || '', '_blank'); } catch (e) {}
      }
    };
  });

})();

  // Bütün adi və xüsusi handler-lərdə (HLS/MP3, OK.RU, DZEN.RU və s.) adres çubuğunda linkin göstərilməsi

if (typeof window.openPlayer === 'function') {
    const originalOpenPlayer = window.openPlayer.bind(window);

    // openPlayer funksiyasını yenidən təyin edirik
    window.openPlayer = function(movie) {
        
        // 1. URL DƏYİŞİKLİYİNİ ƏN BİRİNCİ İŞ OLARAQ İCRA EDİRİK
        if (movie && movie.id) {
            const newUrl = window.location.pathname + '?id=' + encodeURIComponent(movie.id);
            window.history.pushState({ movieId: movie.id }, movie.title, newUrl);
        }
        
        // 2. SONRA, ARTIQ URL DƏYİŞMİŞ VƏZİYYƏTDƏ, ORIGINAL FUNKSİYANI ÇAĞIRIRIQ
        return originalOpenPlayer(movie);
    };
}

    /**
 * Köməkçi funksiya: Hal-hazırda aktiv olan pəncərənin 
 * başlığını tapıb qaytarır.
 */
function getActivePlayerTitle() {
  // Bütün pəncərələrdə istifadə olunan başlıq seçicilərinin (selectors) siyahısı
  const titleSelectors = [
    '#playerTitle',       // 1. Əsas video.js pəncərəsi
    '.univmodal-title'     // 2. Universal modal pəncərəsi
    // Universal modaldan ayrı yeni handler əlavə etdikdə, onun başlıq class-ını bura əlavə etmək lazımdır.
  ];

  for (const selector of titleSelectors) {
    const el = document.querySelector(selector);
    
    // Elementin mövcud olub-olmadığını VƏ hal-hazırda görünən olduğunu yoxlayır
    // (gizli elementlər üçün offsetParent 'null' olur)
    if (el && el.offsetParent !== null) {
      return el.textContent; // Görünən başlığı tapdıq!
    }
  }
  
  // Heç bir başlıq tapılmazsa (ehtimal ki, pəncərə bağlıdır), sənədin başlığını qaytar
  return document.title;
}


/**
 * Universal Paylaşma Funksiyası (YENİLƏNMİŞ)
 * Paylaşma düyməsinə kliklənəndə cari filmin URL-ni götürür
 * və yerli paylaşma API (və ya fallback olaraq kopyalama + WhatsApp) ilə paylaşır.
 */
function sharePlayer(){
  // Universal hook sayəsində cari URL artıq ?id=... ilə dəyişdirilmiş vəziyyətdədir.
  const shareUrl = window.location.href;
  
  // YENİLƏNMİŞ: Başlığı tapmaq üçün "ağıllı" köməkçi funksiyanı çağırırıq
  const movieTitle = getActivePlayerTitle() || document.title;
  
  // Mətn indi həmişə düzgün başlığı göstərəcək
  const text = `Film vaxtıdır! 🍿 ${movieTitle}:`;

  // 1. Web Share API (Mobil cihazlar və müasir brauzerlər üçün)
  if (navigator.share) {
    navigator.share({
      title: movieTitle,
      text: text,
      url: shareUrl,
    }).catch((error) => console.log('Paylaşma ləğv edildi:', error));
  } else {
    // 2. Fallback (Desktop və ya API dəstəyi olmayan brauzerlər)
    
    // Linki kopyalayırıq
    navigator.clipboard.writeText(shareUrl).then(() => {
        // İstifadəçiyə bildiriş vermək
        if (typeof showToast === 'function') {
            showToast('Film linki panoya kopyalandı! Kopyalanan link: ' + shareUrl, 3000);
        }
    }).catch(err => {
        console.error('Kopyalama uğursuz oldu:', err);
    });

    // Alternativ: WhatsApp-ı açmağa cəhd etmək
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  }
}

/* =========================================================
   UNIVERSAL KART YÖNLƏNDİRMƏ HANDLERİ (MODAL LƏĞVİ)
   ========================================================= */
(function () {

  const REDIRECT_CARDS = [
    { match: 'Beyblade: Bakuten Shoot', url: '../beyblade' },
    { match: 'Spider-Noir',             url: '../spider-noir' },
    { match: 'MARVEL',                  url: '../marvel' }
    /* Yeni kart əlavə etmək üçün buraya { match: '...', url: '...' } əlavə edin */
  ];

  function findRedirect(card) {
    const titleEl = card.querySelector('.title');
    if (!titleEl) return null;
    const text = titleEl.textContent;
    return REDIRECT_CARDS.find(r => text.includes(r.match)) || null;
  }

  // Siçanla klikləmə üçün
  document.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) return;
    const redirect = findRedirect(card);
    if (redirect) {
      e.stopImmediatePropagation(); // openPlayer funksiyasının işləməsini dayandırır
      e.preventDefault();           // Standart hərəkətləri ləğv edir
      window.location.href = redirect.url;
    }
  }, true); // "true" məcburidir: kliki kartdan əvvəl tutmasını təmin edir

  // Klaviatura (Enter və ya Boşluq) ilə seçmək üçün
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.card');
    if (!card || document.activeElement !== card) return;
    const redirect = findRedirect(card);
    if (redirect) {
      e.stopImmediatePropagation();
      e.preventDefault();
      window.location.href = redirect.url;
    }
  }, true);

})();

/* =========================================================
   SON ƏLAVƏ EDİLƏNLƏR CHECK BOX (İL KORREKSİYASI VƏ REJİM TƏRSİNƏ ÇEVRİLDİ)
   ========================================================= */

// 1. Köhnə (orijinal) resetGrid funksiyasını başqa bir dəyişəndə saxlayırıq
const originalResetGrid = resetGrid;

// 2. resetGrid funksiyasına kənardan mükəmməl bir yamaq vururuq
resetGrid = function() {
  const sortCheckbox = document.getElementById('sort-latest-trigger');
  const labelText = document.querySelector('.flix-switch-label');
  const isLatestChecked = sortCheckbox?.checked;

  // --- 1. Mətnlərin sinxron dəyişdirilməsi (YENİLƏNDİ) ---
  if (labelText) {
    // Checkbox sönülüdürsə -> "Son əlavə edilənlər" (Massiv sırası)
    // Checkbox seçilidirsə -> "İllərə görə ardıcıllıq" (Year dəyəri)
    labelText.textContent = isLatestChecked ? "İllərə görə ardıcıllıq" : "Son əlavə edilənlər";
  }

  // --- 2. Filmlər ekrana çıxmazdan dərhal əvvəl sıralama ---
  if (state.filtered && state.filtered.length > 0) {
    state.filtered.sort((a, b) => {
      // 🌟 QAYDA 1: Qızılı (special === "yes") olanlar hər iki halda da hər zaman ən öndə qalır
      const isSpecialA = a.special === "yes" ? 1 : 0;
      const isSpecialB = b.special === "yes" ? 1 : 0;

      if (isSpecialA !== isSpecialB) {
        return isSpecialB - isSpecialA; 
      }

      // 🌟 QAYDA 2: Əgər Checkbox AKTİVDİRSƏ (İllərə görə ardıcıllıq rejimi)
      if (isLatestChecked) {
        const yearA = Number(a.year) || 0;
        const yearB = Number(b.year) || 0;
        return yearB - yearA; // Filmləri "year" parametrinə görə böyükdən kiçiyə düzür
      }

      // 🌟 QAYDA 3: Əgər Checkbox SÖNÜLÜDÜRSƏ (Səhifəyə ilk giriş və ya Son əlavə edilənlər rejimi)
      // Heç bir sıralama etmirik (0 qaytarırıq), filmlər massivdəki ilkin sırasını (ən başa qoyduğun 5 filmi) qoruyur.
      return 0;
    });
  }

  // 3. İndi isə orijinal resetGrid işini görsün (ekranı təmizləsin və renderChunk çağırsın)
  originalResetGrid();
};

// === 3. Checkbox kliklənəndə mövcud filtri yenidən tetikləyirik ===
document.getElementById('sort-latest-trigger').addEventListener('change', (e) => {
  localStorage.setItem('flixlite_sort_latest', e.target.checked);
  if (typeof applyFilters === 'function') applyFilters(); // Mövcud filtri yenidən çağırır
});

// === 4. Səhifə ilk açılanda LocalStorage-dan vəziyyəti bərpa etmək ===
document.addEventListener('DOMContentLoaded', () => {
  const sortCheckbox = document.getElementById('sort-latest-trigger');
  if (sortCheckbox) {
    const savedStatus = localStorage.getItem('flixlite_sort_latest') === 'true';
    sortCheckbox.checked = savedStatus;
    // İlkin vəziyyəti tətbiq etmək üçün filtri bir dəfə işə salırıq
    if (typeof applyFilters === 'function') applyFilters();
  }
});

/* =========================================================
   SON ƏLAVƏ EDİLƏNLƏR CHECK BOX-SON
   ========================================================= */

/* =========================================================
   KOLLEKSİYA PANELİ (AUTOPLAY & SMOOTH SLIDESHOW VERSİYASI)
   ========================================================= */

// 1. KOLLEKSİYALAR MASSİVİ
const COLLECTIONS = [
   {
    id: "spiderman",
    title: "Örümcek adam / Spider Man",
    cover: "https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_.jpg",
    movies: ["spiderman", "spiderman2", "spiderman3", "theamazingspiderman", "theamazingspiderman2", "spidermanhomecoming", "spidermanintothespiderverse", "spidermanfarfromhome", "spidermannowayhome", "spidermanacrossthespiderverse", "spidermanbrandnewday"]
   },
   {
    id: "venom",
    title: "Venom",
    cover: "https://m.media-amazon.com/images/M/MV5BZDMyYWU4NzItZDY0MC00ODE2LTkyYTMtMzNkNDdmYmFhZDg0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["venom", "venom2", "venom3"]
   },
   {
    id: "avatar",
    title: "Avatar",
    cover: "https://m.media-amazon.com/images/M/MV5BZDYxY2I1OGMtN2Y4MS00ZmU1LTgyNDAtODA0MzAyYjI0N2Y2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["avatar", "avatar2", "avatar3"]
   },
   {
    id: "twilight",
    title: "Alacakaranlık / Twilight",
    cover: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_FMjpg_UX1000_.jpg",
    movies: ["twilight", "twilight2", "twilight3", "twilight4", "twilight5"]
   },
   {
    id: "thefastandthefurious",
    title: "Hızlı ve öfkeli / The Fast and the Furious",
    cover: "https://m.media-amazon.com/images/M/MV5BMzFiZTY2OGUtNzZmMC00MTk2LTgyNzMtZmM5YzMzNjIyYTljXkEyXkFqcGc@._V1_.jpg",
    movies: ["thefastandthefurious", "2fast2furious", "thefastandthefurioustokyodrift", "fastandfurious", "fastfive", "fastandfurious6", "furious7", "thefateofthefurious", "fastandfuriouspresentshobbsandshaw", "f9thefastsaga", "fastx"]
   },
   {
    id: "ipman1",
    title: "Ip Man (Wilson Yip)",
    cover: "https://m.media-amazon.com/images/M/MV5BOGVjMDEzNjMtMWJmMy00NDdjLWFkMzItOTBhZTE3OWU0YmM4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["ipman", "ipman2", "ipman3", "ipmanlegacy", "ipman4"]
   },
   {
    id: "ipman2",
    title: "Ip Man (Herman Yau)",
    cover: "https://m.media-amazon.com/images/M/MV5BMTQwMTY0NDQxMV5BMl5BanBnXkFtZTgwMjEwMTEwMDE@._V1_.jpg",
    movies: ["ipmanthelegendisborn", "ipmanthefinalfight"]
   },
   {
    id: "ipman3",
    title: "Ip Man (Liming Li)",
    cover: "https://m.media-amazon.com/images/M/MV5BMmFkYjRhOGItNGNmYy00OTQyLThhYjctNWVkNmRhZTNiNDgzXkEyXkFqcGc@._V1_.jpg",
    movies: ["ipmankungfumaster", "ipmankungfulegend"]
   },
   {
    id: "ongbak",
    title: "Savaşçı / Ong Bak",
    cover: "https://m.media-amazon.com/images/M/MV5BMTc3MjkyMzk4N15BMl5BanBnXkFtZTcwODQxMDg5Mw@@._V1_FMjpg_UX1000_.jpg",
    movies: ["ongbak", "ongbak2", "ongbak3"]
   },
   {
    id: "karatekid",
    title: "Karateci çocuk / Karate Kid",
    cover: "https://m.media-amazon.com/images/M/MV5BM2MwYTlkY2MtNmUzNy00MTljLThjNDAtZGUzNzMxMzcxNzM5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["thekaratekid", "thekaratekid2"]
   },
   {
    id: "planetoftheapes",
    title: "Maymunlar cehennemi / Planet of the Apes",
    cover: "https://m.media-amazon.com/images/S/pv-target-images/945441437c34ba93d21a08a69f511a52bd0b1c749ad2cada5de1e8135c3700ca.jpg",
    movies: ["planetoftheapes", "planetoftheapes2", "planetoftheapes3", "planetoftheapes4", "planetoftheapes5", "planetoftheapes6", "planetoftheapes7", "planetoftheapes8", "planetoftheapes9", "planetoftheapes10"]
   },
   {
    id: "malefisent",
    title: "Malefiz / Malefisent",
    cover: "https://m.media-amazon.com/images/M/MV5BNTY4YjYwYzMtYTg1NC00ZmJiLTk0OTYtMWMzM2Y4Yzc5MDc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["malefisent", "malefisent2"]
   },
   {
    id: "rio",
    title: "Rio",
    cover: "https://m.media-amazon.com/images/M/MV5BMTgzMDczMDYzNl5BMl5BanBnXkFtZTgwMzk2MDIwMTE@._V1_.jpg",
    movies: ["rio", "rio2"]
   },
   {
    id: "moana",
    title: "Moana",
    cover: "https://m.media-amazon.com/images/M/MV5BZDUxNThhYTUtYjgxNy00MGQ4LTgzOTEtZjg1YTU5NTcwNThlXkEyXkFqcGc@._V1_.jpg",
    movies: ["moana", "moana2"]
   },
   {
    id: "thelionking",
    title: "Aslan kral / The Lion King",
    cover: "https://m.media-amazon.com/images/M/MV5BNjg1YzI5ZmQtZjZkOC00ZDMzLWI4YjYtMmY5MzZjYWE3YzhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["thelionking", "mufasa"]
   },
   {
    id: "taxi",
    title: "Taksi / Taxi",
    cover: "https://m.media-amazon.com/images/M/MV5BYmVmYzBiMWMtZWM1NC00NWI0LWEyNDQtOGQ0NmQxNDE1NGYzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["taxi", "taxi2", "taxi3", "taxi4", "taxi5"]
   },
   {
    id: "theoldguard",
    title: "Ölümsüzlük / The Old Guard",
    cover: "https://m.media-amazon.com/images/M/MV5BNjcwN2Y0MGEtMjkyYy00YTYxLWFjMWItZTEyZjA1MTJhMjE2XkEyXkFqcGc@._V1_.jpg",
    movies: ["theoldguard", "theoldguard2"]
   },
   {
    id: "diehard",
    title: "Zor ölüm / Die Hard",
    cover: "https://m.media-amazon.com/images/M/MV5BMTcwNzgyNzUzOV5BMl5BanBnXkFtZTcwMzAwOTA5OA@@._V1_FMjpg_UX1000_.jpg",
    movies: ["diehard", "diehard2", "diehard3", "diehard4", "diehard5"]
   },
   {
    id: "theblackphone",
    title: "Siyah telefon / The Black Phone",
    cover: "https://m.media-amazon.com/images/M/MV5BMWIyYmM5OWYtZWE4Ni00YjYzLTkzMDItYzY2MGVkODk3ZjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["theblackphone", "theblackphone2"]
   },
   {
    id: "dag",
    title: "Dağ",
    cover: "https://m.media-amazon.com/images/M/MV5BMWE3ODFkZjEtMGI3OS00MTdmLWE0YTAtNjIzMWJjZDc2MTRkXkEyXkFqcGc@._V1_.jpg",
    movies: ["dag", "dag2"]
   },
   {
    id: "recepivedik",
    title: "Recep İvedik",
    cover: "https://m.media-amazon.com/images/M/MV5BYjg2NzkyYjgtZWJjOS00NDdkLWE1NWQtMTY4ZDc3MTkxYWVhXkEyXkFqcGc@._V1_.jpg",
    movies: ["recepivedik", "recepivedik2", "recepivedik3", "recepivedik4", "recepivedik5", "recepivedik6", "recepivedik7"]
   },
   {
    id: "homealone",
    title: "Evde tek başına / The Home Alone",
    cover: "https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg",
    movies: ["homealone", "homealoneaz", "homealoneaz2", "homealone2", "homealone2az", "homealone2az2"]
   },
   {
    id: "themummy",
    title: "Mumya / The Mummy",
    cover: "https://m.media-amazon.com/images/M/MV5BMTU4NDIzMDY1OV5BMl5BanBnXkFtZTcwNjQxMzk3MQ@@._V1_FMjpg_UX1000_.jpg",
    movies: ["themummy1", "themummy2", "themummy3"]
   },
   {
    id: "megan",
    title: "Megan / M3GAN",
    cover: "https://montroseplayhouse.co.uk/wp-content/uploads/2025/07/lHChxm7sv3gWR2qz5PwjdxcXQf7-scaled.webp",
    movies: ["megan", "megan2"]
   },
   {
    id: "daredevilandelektra",
    title: "Daredevil & Elektra",
    cover: "https://m.media-amazon.com/images/M/MV5BMTI3MTUwNzM5MV5BMl5BanBnXkFtZTcwNzczMDIzMw@@._V1_FMjpg_UX1000_.jpg",
    movies: ["daredevil", "elektra"]
   },
   {
    id: "blade",
    title: "Bıçağın iki yüzü / Blade",
    cover: "https://m.media-amazon.com/images/M/MV5BNWYzN2Y4NTEtM2JlNS00MTA5LWIyZDYtOTk1YzdiOWVkNDdlXkEyXkFqcGc@._V1_.jpg",
    movies: ["blade", "blade2", "blade3"]
   },
   {
    id: "ghostrider",
    title: "Hayalet sürücü / Ghost Rider",
    cover: "https://m.media-amazon.com/images/M/MV5BN2FmZGVlNTgtYTllNC00YmUzLTk5YmUtNWNhMzk3ZmE2NmQ0XkEyXkFqcGc@._V1_.jpg",
    movies: ["ghostrider", "ghostrider2"]
   },
   {
    id: "fantasticfour",
    title: "Fantastik dörtlü / Fantastic Four",
    cover: "https://m.media-amazon.com/images/S/pv-target-images/4c3b60c421dc73dd20bace682b1d68b2165fffcbeac63865a129addb85f31c0e.jpg",
    movies: ["fantasticfour", "fantasticfour2", "fantasticfour3", "fantasticfour4"]
   },
   {
    id: "deadpool",
    title: "Deadpool",
    cover: "https://m.media-amazon.com/images/M/MV5BNzY3ZWU5NGQtOTViNC00ZWVmLTliNjAtNzViNzlkZWQ4YzQ4XkEyXkFqcGc@._V1_.jpg",
    movies: ["deadpool", "deadpool2", "deadpoolandwolverine"]
   },
   {
    id: "guardiansofthegalaxy",
    title: "Galaksinin koruyucuları / Guardians of the Galaxy",
    cover: "https://m.media-amazon.com/images/M/MV5BM2ZmNjQ2MzAtNDlhNi00MmQyLWJhZDMtNmJiMjFlOWY4MzcxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["guardiansofthegalaxy", "guardiansofthegalaxyholidayspecial", "guardiansofthegalaxy2", "guardiansofthegalaxy3"]
   },
   {
    id: "antman",
    title: "Karınca adam / Ant-Man",
    cover: "https://m.media-amazon.com/images/M/MV5BODVkY2ZmZTAtYzFhMi00YzZlLWE2YWMtMDBiYjY2OTU4ZWM0XkEyXkFqcGc@._V1_.jpg",
    movies: ["antman", "antmanandthewasp", "antmanandthewaspquantumania"]
   },
   {
    id: "xmen",
    title: "X-Men",
    cover: "https://m.media-amazon.com/images/M/MV5BZjdiZTUwYzItNzczYi00MjcxLTkzNWMtY2IyZGE2OTFlN2VhXkEyXkFqcGc@._V1_.jpg",
    movies: ["xmen", "x2", "xmenthelaststand", "xmenoriginswolverine", "xmenfirstclass", "thewolverine", "xmendaysoffuturepast", "xmenapocalypse", "logan", "xmendarkphoenix"]
   },
   {
    id: "thepunisher",
    title: "İnfazcı / The Punisher",
    cover: "https://m.media-amazon.com/images/M/MV5BZTdlOTkyZjUtODE4NC00ODZmLTg5OGYtMjkwZDY0MTZhMTQ0XkEyXkFqcGc@._V1_.jpg",
    movies: ["thepunisher1989", "thepunisher2004", "thepunisherwarzone"]
   },
   {
    id: "doctorstrange",
    title: "Doktor Strange / Doctor Strange",
    cover: "https://m.media-amazon.com/images/M/MV5BN2YxZGRjMzYtZjE1ZC00MDI0LThjZmQtZTZmMzVmMmQ2NzBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    movies: ["doctorstrange", "doctorstrange2"]
   },
   {
    id: "blackpanther",
    title: "Kara panter / Black Panther",
    cover: "https://m.media-amazon.com/images/M/MV5BYWY5NDY1ZjItZDQxMy00MTAzLTgyOGQtNTQxYjFiMzZjMjUyXkEyXkFqcGc@._V1_.jpg",
    movies: ["blackpanther", "blackpanther2"]
   },
   {
    id: "hulk",
    title: "Yeşil dev / Hulk",
    cover: "https://m.media-amazon.com/images/M/MV5BNzI4YjkyZTQtMjk1NS00MzhkLWEwYzgtZjZiODUyNWViNDdlXkEyXkFqcGc@._V1_.jpg",
    movies: ["hulk", "theincrediblehulk"]
   },
   {
    id: "ironman",
    title: "Demir adam / Iron Man",
    cover: "https://m.media-amazon.com/images/M/MV5BMjIzMzAzMjQyM15BMl5BanBnXkFtZTcwNzM2NjcyOQ@@._V1_.jpg",
    movies: ["ironman", "ironman2", "ironman3"]
   },
   {
    id: "thor",
    title: "Thor",
    cover: "https://m.media-amazon.com/images/M/MV5BNjRhNGZjZjEtYTQzYS00OWUxLThjNGEtMTIwMTE2ZDFlZTZkXkEyXkFqcGc@._V1_.jpg",
    movies: ["thor", "thor2", "thor3", "thor4"]
   },
   {
    id: "captainamerica",
    title: "Kaptan Amerika / Captain America",
    cover: "https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_.jpg",
    movies: ["captainamericafirstavenger", "captainamericathewintersoldier", "captainamericacivilwar", "captainamericabravenewworld"]
   },
   {
    id: "avengers",
    title: "Yenilmezler / The Avengers",
    cover: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    movies: ["theavengers", "theavengers2", "theavengers3", "theavengers4"]
   }
];

// --- 🌟 SLIDESHOW DEYİŞƏNLƏRİ ---
let spotlightInterval = null;
let currentCollectionIndex = 0;
let isSpotlightHovered = false; // Siçanın panel üstündə olub-olmamasını izləyir
const AUTOPLAY_DELAY = 5000;    // Keçid müddəti (5 saniyə)

// 2. Spotlight vizual yeniləmə mexanizmi
function updateSpotlight(collection) {
    const bgImage = document.getElementById('spotlightBgImage');
    if (!bgImage) return;
    
    bgImage.style.opacity = "0.1";
    bgImage.style.transform = "scale(1.03)";
    
    setTimeout(() => {
        bgImage.src = collection.cover;
        document.getElementById('spotlightTitle').innerText = collection.title;
        document.getElementById('spotlightCount').innerText = `${collection.movies.length} Film`;
        bgImage.style.opacity = "0.35";
        bgImage.style.transform = "scale(1)";
    }, 200);

    document.getElementById('spotlightActionBtn').onclick = () => {
        filterMoviesByCollection(collection.id, collection.title);
    };
}

// 🌟 MƏRKƏZİ AKTİVLƏŞDİRMƏ FUNKSİYASI (Masaüstü və Mobil Uyumlu Versiya)
function setActiveCollection(index) {
    if (COLLECTIONS.length === 0) return;
    
    currentCollectionIndex = index;
    const currentCol = COLLECTIONS[index];
    
    const tabs = document.querySelectorAll('.spotlight-tabs .tab-item');
    const tabsContainer = document.getElementById('spotlightTabsContainer');
    
    tabs.forEach((tab, idx) => {
        if (idx === index) {
            tab.classList.add('active');
            
            if (tabsContainer) {
                let targetTop = tabsContainer.scrollTop;
                let targetLeft = tabsContainer.scrollLeft;

                // 1. Əgər İLK elementə (0) qayıdıbsa - dərhal tam ən başa / sola scroll et
                if (index === 0) {
                    targetTop = 0;
                    targetLeft = 0;
                } 
                // 2. Əgər EN SON elementi seçibsə - dərhal tam ən aşağıya / sağa scroll et
                else if (index === COLLECTIONS.length - 1) {
                    targetTop = tabsContainer.scrollHeight;
                    targetLeft = tabsContainer.scrollWidth;
                } 
                // 3. Orta elementlərdədirsə - ağıllı koordinat hesablaması (Həm Şaquli, həm Üfüqi)
                else {
                    // --- MASAÜSTÜ (Şaquli - Dikey) Hesablama ---
                    const tabTop = tab.offsetTop;
                    const tabHeight = tab.offsetHeight;
                    const containerHeight = tabsContainer.clientHeight;
                    const containerScrollTop = tabsContainer.scrollTop;

                    if (tabTop < containerScrollTop) {
                        targetTop = tabTop;
                    } else if (tabTop + tabHeight > containerScrollTop + containerHeight) {
                        targetTop = tabTop - containerHeight + tabHeight;
                    }

                    // --- MOBİL (Üfüqi - Yatay) Hesablama ---
                    const tabLeft = tab.offsetLeft;
                    const tabWidth = tab.offsetWidth;
                    const containerWidth = tabsContainer.clientWidth;
                    const containerScrollLeft = tabsContainer.scrollLeft;

                    if (tabLeft < containerScrollLeft) {
                        targetLeft = tabLeft;
                    } else if (tabLeft + tabWidth > containerScrollLeft + containerWidth) {
                        targetLeft = tabLeft - containerWidth + tabWidth;
                    }
                }

                // Həm dikey, həm yatay koordinatları eyni anda tətbiq edirik
                tabsContainer.scrollTo({
                    top: targetTop,
                    left: targetLeft,
                    behavior: 'smooth'
                });
            }
        } else {
            tab.classList.remove('active');
        }
    });

    // Vitrini yeniləyirik
    updateSpotlight(currentCol);
}


// 🌟 AUTOPLAY-İ BAŞLADAN FUNKSİYA
function startSpotlightAutoplay() {
    if (spotlightInterval) clearInterval(spotlightInterval);
    
    spotlightInterval = setInterval(() => {
        // Əgər istifadəçi siçanı panelin hər hansı bir yerinə gətiribsə, slaydı dayandırırıq
        if (isSpotlightHovered) return;
        
        if (COLLECTIONS.length <= 1) return;
        
        // Növbəti indeksə keçid (Sona çatanda 0-a qayıdır)
        currentCollectionIndex = (currentCollectionIndex + 1) % COLLECTIONS.length;
        setActiveCollection(currentCollectionIndex);
        
    }, AUTOPLAY_DELAY);
}

// 3. Sağ tərəfdəki menyunu ekrana çıxaran funksiya
function initSpotlight() {
    const tabsContainer = document.getElementById('spotlightTabsContainer');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = "";

    COLLECTIONS.forEach((col, index) => {
        const li = document.createElement('li');
        li.className = `tab-item ${index === 0 ? 'active' : ''}`;
        li.innerText = col.title;

        // İstifadəçi əl ilə müdaxilə etdikdə (Hover və ya Klik)
        const handleManualSelect = () => {
            setActiveCollection(index);
            // Əl ilə seçildiyi üçün taymeri yenidən qururuq ki, dərhal növbəti slayda atlamasın
            startSpotlightAutoplay();
        };

        li.onmouseenter = handleManualSelect;
        li.onclick = handleManualSelect;

        tabsContainer.appendChild(li);
    });

    // 🌟 AĞILLI DURDURMA: Siçan ümumi bölmənin üzərinə gələndə dayansın, çıxanda davam etsin
    const spotlightSection = document.querySelector('.spotlight-section');
    if (spotlightSection) {
        spotlightSection.addEventListener('mouseenter', () => { isSpotlightHovered = true; });
        spotlightSection.addEventListener('mouseleave', () => { isSpotlightHovered = false; });
    }

    // İlk elementi aktiv edirik və avtomatik keçidi başladırıq
    if(COLLECTIONS.length > 0) {
        setActiveCollection(0);
        startSpotlightAutoplay();
    }
}

// 4. KOLLEKSİYANI QLOBAL OLARAQ AKTİV EDƏN FUNKSİYA
function filterMoviesByCollection(collectionId, collectionTitle) {
    if (typeof state === "undefined") return;

    state.activeCollectionId = collectionId;

    if (typeof genreFilter !== "undefined") {
        genreFilter.value = ""; 
    }

    if (typeof applyFilters === "function") {
        applyFilters();
    }
}

// Səhifə tam yüklənəndə sistemi başladırıq
document.addEventListener("DOMContentLoaded", () => {
    initSpotlight();

    if (typeof resetGrid === "function") {
        const originalResetGrid = resetGrid; 
        
        resetGrid = function() {
            if (state && state.activeCollectionId && Array.isArray(state.filtered)) {
                const currentCollection = COLLECTIONS.find(c => c.id === state.activeCollectionId);
                
                if (currentCollection) {
                    state.filtered = state.filtered.filter(movie => currentCollection.movies.includes(movie.id));
                    
                    const gridTitle = document.getElementById('movieListTitle') || document.querySelector('.movies-section h2');
                    if (gridTitle) {
                        gridTitle.innerText = `${currentCollection.title} (${state.filtered.length})`;
                    }
                }
            }
            originalResetGrid();
        };
    }
});

/* =========================================================
   KOLLEKSİYA PANELİ-SON
   ========================================================= */

/* Adblocker script (sadələşdirilmiş) */
   
(function() {
        try {
        const originalOpen = window.open;
        window.open = function(url, name, specs) {
            if (url && (url.includes('streamtape') || url.includes('ad') || url.includes('pop'))) {
                return null;
            }
            return originalOpen.apply(this, arguments);
        };
    } catch (e) {}
})();


// CHATBOT

document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const toggleBtn = document.getElementById("chat-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const clearBtn = document.getElementById("chat-clear-btn");
    const themeBtn = document.getElementById("chat-theme-btn");
    const themeIcon = document.getElementById("chat-theme-icon");
    const sendBtn = document.getElementById("chat-send-btn");
    const chatInput = document.getElementById("chat-input");
    const messagesBox = document.getElementById("chat-messages");
    const typingIndicator = document.getElementById("chat-typing-indicator");
    const chipBtns = document.querySelectorAll(".chip-btn");

    const API_URL = "https://kinoflixai.onrender.com/api/chat";

    let isCooldown = false;
    const COOLDOWN_DURATION = 10; 
    let isDarkMode = localStorage.getItem("kinoflix_chat_theme") === "dark";

    // --- 1. KEŞ YADDAŞINDAN MESAJLARI YÜKLƏMƏ ---
    function loadChatHistory() {
        messagesBox.innerHTML = "";
        const history = JSON.parse(localStorage.getItem("kinoflix_chat_history")) || [];
        
        if (history.length === 0) {
            // Əgər keş boşdursa, ilk default mesajı yaz
            addMessage("Salam! Mən KINOFLIX AI assistentiyəm. Sizə hansı janrda film tapmaqda kömək edim? 🍿", "bot-message", false);
        } else {
            history.forEach(msg => {
                addMessage(msg.text, msg.className, false); // false: təkrar keşe yazmasın
            });
        }
    }

    // --- 2. TEMA IDARƏETMƏSİ ---
    function applyTheme(dark) {
        if (dark) {
            chatWindow.classList.remove("light-mode");
            chatWindow.classList.add("dark-mode");
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.22" x2="5.64" y2="17.78"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            chatWindow.classList.remove("dark-mode");
            chatWindow.classList.add("light-mode");
            themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
        localStorage.setItem("kinoflix_chat_theme", dark ? "dark" : "light");
    }
    
    applyTheme(isDarkMode);

    themeBtn.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        applyTheme(isDarkMode);
    });

    // --- 3. DÜYMƏYƏ STRATEJİ KEÇİD (Toggle & Close) ---
    // Bir dəfə vuranda açılır, təkrar vuranda isə bağlanır
    toggleBtn.addEventListener("click", () => {
        if(chatWindow.classList.contains("chat-hidden")) {
            chatWindow.classList.remove("chat-hidden");
            chatInput.focus();
        } else {
            chatWindow.classList.add("chat-hidden");
        }
    });
    
    closeBtn.addEventListener("click", () => chatWindow.classList.add("chat-hidden"));

    // --- 4. ZİBİL QUTUSU (KEŞİ TƏMİZLƏMƏK) ---
    clearBtn.addEventListener("click", () => {
        if (confirm("Söhbət tarixçəsini təmizləmək istəyirsiniz?")) {
            localStorage.removeItem("kinoflix_chat_history");
            loadChatHistory();
        }
    });

    // --- 5. MESAJ GÖNDƏRMƏ ---
    async function sendMessage() {
        if (isCooldown) return;

        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, "user-message", true); // true: keşe yazsın
        chatInput.value = "";

        typingIndicator.classList.remove("indicator-hidden");
        messagesBox.scrollTop = messagesBox.scrollHeight;

        startCooldown();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();
            
            typingIndicator.classList.add("indicator-hidden");
            addMessage(data.reply, "bot-message", true);

        } catch (error) {
            typingIndicator.classList.add("indicator-hidden");
            addMessage("Xəta yarandı. Bağlantını yoxlayın. 😅", "bot-message", false);
        }
    }

    // --- 6. COOLDOWN (Geri Sayım) ---
    function startCooldown() {
        isCooldown = true;
        let timeLeft = COOLDOWN_DURATION;
        const originalContent = sendBtn.innerHTML;

        sendBtn.disabled = true;
        sendBtn.style.opacity = "0.6";

        const timer = setInterval(() => {
            timeLeft--;
            sendBtn.innerText = timeLeft + "s";

            if (timeLeft <= 0) {
                clearInterval(timer);
                isCooldown = false;
                sendBtn.disabled = false;
                sendBtn.style.opacity = "1";
                sendBtn.innerHTML = originalContent;
            }
        }, 1000);
    }

    // --- 7. DOM-A MESAJ ƏLAVƏ ETMƏ VƏ KEŞƏ YAZMA ---
    function addMessage(text, className, saveToHistory = true) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${className}`;
        
        msgDiv.innerHTML = `
            <p style="margin:0; padding:0;">${text}</p>
            <span style="display:block; font-size:8px; margin-top:4px; opacity:0.4; text-align:right;">${timeStr}</span>
        `;
        
        messagesBox.appendChild(msgDiv);
        messagesBox.scrollTop = messagesBox.scrollHeight; 

        // Keş yaddaşına əlavə etmək məntiqi
        if (saveToHistory) {
            const history = JSON.parse(localStorage.getItem("kinoflix_chat_history")) || [];
            history.push({ text, className });
            localStorage.setItem("kinoflix_chat_history", JSON.stringify(history));
        }
    }

    // Chips kliklənməsi
    chipBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            chatInput.value = btn.getAttribute("data-text");
            chatInput.focus();
        });
    });

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // İlk açılışda tarixi yüklə
    loadChatHistory();
});

// CHATBOT-SON

// ============================================================
// AVTOMATİK LOGİN MODAL AÇILIŞI (Tam Təhlükəsiz Versiya)
// ============================================================
(function() {
    var isInitialPhase = true; // Səhifənin ilk yüklənmə fazası (Kilid)

    // İlk 3 saniyə ərzində MutationObserver-in çaşmasının qarşısını alırıq
    setTimeout(function() {
        isInitialPhase = false;
    }, 3000);

    function triggerModalIfLoggedOut() {
        var btn = document.getElementById('authMainBtn');
        if (!btn) return;

        var isLoggedOut = btn.innerHTML.indexOf('fa-circle-user') !== -1;

        if (isLoggedOut) {
            if (typeof window.openAuthModal === 'function') {
                window.openAuthModal();
            } else {
                var modal = document.getElementById('authModal');
                if (modal) {
                    modal.style.display = 'flex';
                    var tabLogin = document.getElementById('tabLogin');
                    var tabRegister = document.getElementById('tabRegister');
                    var loginForm = document.getElementById('loginForm');
                    var registerForm = document.getElementById('registerForm');
                    if (tabLogin && tabRegister && loginForm && registerForm) {
                        tabLogin.classList.add('active');
                        tabRegister.classList.remove('active');
                        loginForm.classList.add('active');
                        registerForm.classList.remove('active');
                    }
                }
            }
        }
    }

    // 1. İLKİN AÇILIŞ: 2 saniyə gözlə və aç
    setTimeout(function() {
        triggerModalIfLoggedOut();
    }, 2000);

    // 2. LOGOUT İZLƏYİCİSİ (Ağıllı Kilid ilə)
    var targetBtn = document.getElementById('authMainBtn');
    if (targetBtn) {
        var observer = new MutationObserver(function(mutations) {
            // Əgər hələ ilk yüklənmə fazasındadısa (Firebase yoxlanışı gedirsə), heç nə etmə
            if (isInitialPhase) return;

            mutations.forEach(function(mutation) {
                if (targetBtn.innerHTML.indexOf('fa-circle-user') !== -1) {
                    // Mövcud açıq modal varsa və istifadəçi qeydiyyatdadırsa, müdaxilə etmə
                    var registerForm = document.getElementById('registerForm');
                    if (registerForm && registerForm.classList.contains('active')) {
                        return; 
                    }
                    
                    setTimeout(triggerModalIfLoggedOut, 300);
                }
            });
        });
        observer.observe(targetBtn, { childList: true, characterData: true, subtree: true });
    }
})();

/* ============================================================
   AUTH GUARD PATCH — Videonu login olmadan başlatmağın qarşısını alır
   Bunu javascripts.js faylının ƏN SONUNA əlavə et.
   (openPlayer, MOVIES, authMainBtn, authModal artıq mövcud olmalıdır)
   ============================================================ */
(function () {
  const originalOpenPlayer = window.openPlayer;

  if (typeof originalOpenPlayer !== 'function') {
    console.warn('[auth-guard] openPlayer tapılmadı — patch tətbiq olunmadı.');
    return;
  }

  // Login olub-olmadığını authMainBtn-in ikonuna görə yoxlayırıq
  // (fa-circle-user = çıxış edilib, fa-right-from-bracket = daxil olunub)
  function isLoggedIn() {
    const btn = document.getElementById('authMainBtn');
    return !!btn && btn.innerHTML.indexOf('fa-right-from-bracket') !== -1;
  }

  // Auth modalını hər şeyin, o cümlədən video handlerin, ÜSTÜNDƏ göstər
  function forceAuthModalOnTop() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;

    // !important ilə təyin edirik ki, styles.css-dəki z-index nə olursa olsun üstələsin
    authModal.style.setProperty('display', 'flex', 'important');
    authModal.style.setProperty('z-index', '2147483647', 'important');

    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (tabLogin && tabRegister && loginForm && registerForm) {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    }
  }

  // Video handlerin arxada belə olsa fəal qalmamasını təmin edən əlavə təhlükəsizlik
  function hardStopVideo() {
    try {
      const modal = document.getElementById('modal');
      if (modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
      const videoEl = document.getElementById('my-video');
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
      }
    } catch (e) {}
  }

  // Login olunana qədər açılmaq istənilən filmi yadda saxlayırıq ki,
  // login olan kimi avtomatik açılsın (birbaşa linkin təcrübəsi pozulmasın)
  let pendingMovie = null;

  window.openPlayer = function (movie) {
    if (!isLoggedIn()) {
      pendingMovie = movie;
      hardStopVideo();
      forceAuthModalOnTop();
      return; // <-- orijinal openPlayer çağırılmır, video HEÇ başlamır
    }
    pendingMovie = null;
    return originalOpenPlayer.apply(this, arguments);
  };

  // İstifadəçi daxil olan kimi gözləyən filmi avtomatik başlat
  const authBtn = document.getElementById('authMainBtn');
  if (authBtn) {
    const observer = new MutationObserver(function () {
      if (pendingMovie && isLoggedIn()) {
        const movie = pendingMovie;
        pendingMovie = null;

        const authModal = document.getElementById('authModal');
        if (authModal) authModal.style.setProperty('display', 'none', 'important');

        originalOpenPlayer(movie);
      }
    });
    observer.observe(authBtn, { childList: true, characterData: true, subtree: true });
  }
})();

/* ========================================================
   Bufer Qorunması & Auto-Landscape
   ======================================================== */
(function() {
    // 1. Element.setAttribute üzərində qlobal nəzarət (yalnız Src qorunması)
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        // Bufer qorunması: Eyni linkin setAttribute ilə təkrar yazılmasını blokla
        if ((this.tagName === 'IFRAME' || this.tagName === 'VIDEO') && name.toLowerCase() === 'src') {
            const currentSrc = this.getAttribute('src') || this.src;
            // Əgər yeni link köhnə ilə eynidirsə (və təmizlənmirsə), icra etmə
            if (currentSrc === value && value !== 'about:blank' && value !== '') {
                return;
            }
        }
        return originalSetAttribute.apply(this, arguments);
    };

    // 2. Birbaşa obyekt xüsusiyyəti kimi (iframe.src = '...') yazılmaların bloklanması
    const iframeSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src');
    if (iframeSrcDescriptor && iframeSrcDescriptor.set) {
        Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
            set: function(value) {
                if (this.src === value && value !== 'about:blank' && value !== '') {
                    return; // Eyni linkin təkrar renderini blokla və buferi qoru
                }
                iframeSrcDescriptor.set.call(this, value);
            },
            get: iframeSrcDescriptor.get,
            configurable: true
        });
    }

    // 3. Mobildə Tam Ekran (Fullscreen) olanda avtomatik eninə (landscape) çevirmək
    const handleFullscreenChange = async () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;

        if (isFullscreen) {
            // Tam ekrana keçdikdə ekranı eninə kilidlə (Landscape)
            if (screen.orientation && screen.orientation.lock) {
                try {
                    await screen.orientation.lock('landscape');
                } catch (err) {
                    // Cihaz dəstəkləmirsə və ya masaüstüdürsə səssizcə keç
                }
            } else if (screen.lockOrientation) {
                screen.lockOrientation('landscape');
            }
        } else {
            // Tam ekrandan çıxdıqda ekran kilidini aç (Portrait-ə qayıda bilsin)
            if (screen.orientation && screen.orientation.unlock) {
                try {
                    screen.orientation.unlock();
                } catch (err) {}
            } else if (screen.unlockOrientation) {
                screen.unlockOrientation();
            }
        }
    };

    // Bütün növ brauzerlər (Chrome, Safari, Firefox) üçün tam ekran hadisələrini dinlə
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

})();
