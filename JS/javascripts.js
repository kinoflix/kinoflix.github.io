/* ===========================
   MOVIES data
   =========================== */
const MOVIES = [
  {title:"Eşref Rüya - 32. Bölüm", cover:"https://m.media-amazon.com/images/M/MV5BYzI5MjM5NDMtNTFjZC00ZTI0LWJjMWQtZjQyNzdiYWY2ZjUyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://www.dailymotion.com/video/x9zrunq", year:2025, genre:"Dram", id: "esrefruya", trend: "yes", special: "yes"},
  {title:"Masal", cover:"https://cekicmagazin.com/wp-content/uploads/2025/01/1-20250127.jpg", src:"https://vk.com/video359563763_456241117", year:2026, genre:"Dram", id: "masal"},
  {title:"Gerçek sahtekar / The Big Fake", cover:"https://m.media-amazon.com/images/M/MV5BYzk1MmRiODctMGFkMy00MTlmLTgyZjQtYTc1MWUyZjU5MTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/11018481830505", year:2026, genre:"Dram", id: "thebigfake"},
  {title:"The Rip", cover:"https://m.media-amazon.com/images/M/MV5BNjIzMGY3MzMtNDVlMS00MGU1LTkyNTItMmI4Mzk0Mjg3OTBkXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/10869573814889", year:2026, genre:"Aksiyon", id: "therip"},
  {title:"Tatilde tanıştığımız insanlar / People We Meet on Vacation", cover:"https://m.media-amazon.com/images/M/MV5BM2ZmZWEyOGItYzVjYi00N2Q3LTlmNDItYmUwZjFhMTJmMzgzXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/10745464162921", year:2026, genre:"Romantik", id: "peoplewemeetonvacation"},
  {title:"Predator: Vahşi topraklar / Predator: Badlands", cover:"https://m.media-amazon.com/images/M/MV5BMmMzNzdiZDgtZGVjOC00ZTg2LTg1ZDktMDU2ZDc2YjBiNDJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/11464124336745", year:2025, genre:"Elmi fantastik", id: "predator"},
  {title:"iRehine / iHostage", cover:"https://m.media-amazon.com/images/M/MV5BMGEyNWI4NjctY2NkYS00ZDY0LTkyNTUtOGRhM2UzNWYxOTc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9223073434217", year:2025, genre:"Triller", id: "ihostage"},
  {title:"Nakavt / K.O.", cover:"https://m.media-amazon.com/images/M/MV5BZTExNjM4NzAtY2FiZS00M2VmLWE1MjUtNWM1MTk3YTg1ZjQwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9367826991721", year:2025, genre:"Aksiyon", id: "ko"},
  {title:"Miras / Inheritance", cover:"https://m.media-amazon.com/images/M/MV5BNmRiNWY3ZjYtNDhhMy00NDNjLWIzMTktMTViZDRiYWJjODY1XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9475470854761", year:2025, genre:"Triller", id: "inheritance"},
  {title:"Kara torba operasyonu / Black Bag", cover:"https://m.media-amazon.com/images/M/MV5BNzA1OWU4NDMtMDUxMC00NWI4LWJhYjUtYWQ0OGQ5MTc2NDRjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9595540540009", year:2025, genre:"Triller", id: "blackbag"},
  {title:"Şampanya yüzünden / Champagne Problems", cover:"https://m.media-amazon.com/images/M/MV5BYmZiMTZlMzktOGMxYi00MGJhLWI4YTUtYTAwNTU5Y2UyMGNlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10041178917481", year:2025, genre:"Romantik", id: "champagneproblems"},
  {title:"Lefter: Bir Ordinaryüs Hikayesi", cover:"https://m.media-amazon.com/images/M/MV5BZThkNDM1MGItYjYxZC00ZjJlLTk2YjMtYWJkZGU2MGFmYWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://drive.google.com/file/d/1fiil2V-_1kxy_Y0SSYoNngBoi2Lha-2i/view?usp=drive_link", year:2025, genre:"Bioqrafiya", id: "lefter"},
  {title:"Frankenstein", cover:"https://m.media-amazon.com/images/M/MV5BOGI1ZGY4ODUtMDJlNy00YTdhLWEwNTctMTQ3ZWYwMGUwNTc1XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9951088806505", year:2025, genre:"Fantastik", id: "frankenstein"},
  {title:"Noel soygunu / Jingle Bell Heist", cover:"https://m.media-amazon.com/images/M/MV5BM2JiNjdiN2QtNjlmMS00NzExLTlmZTEtOTVmNzNmYzhmZTc3XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/10088770570857", year:2025, genre:"Komediya", id: "jinglebellheist"},
  {title:"Korku seansı: Son Ayin / The Conjuring: Last Rites", cover:"https://m.media-amazon.com/images/M/MV5BMmNmNTg3ZjctYjZlZS00MDBlLThmNmUtNzFhZGQ4OTVjMjM5XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/o8EYqhocJAAA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2025, genre:"Qorxu", id: "lastrites"},
  {title:"Kara dul Maje / A Widow's Game", cover:"https://m.media-amazon.com/images/M/MV5BYTNkYWE0MjQtZTFlMi00ZTRjLThiMGEtY2JiY2U1NGYyN2Y3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9350185486953", year:2025, genre:"Triller", id: "awidowsgame"},
  {title:"Noel annem / My Secret Santa", cover:"https://m.media-amazon.com/images/M/MV5BNDhiZDFhNzItY2FlYS00NTg4LThhOTAtYWIyMzNkNjZmYmQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10162002332265", year:2025, genre:"Komediya", id: "mysecretsanta"},
  {title:"Merv", cover:"https://m.media-amazon.com/images/M/MV5BNmExNjYzNzMtOTJiYS00MmY2LThlN2UtODk5MjhkMmQwN2NjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmody.com/vs/tt31281659", year:2025, genre:"Romantik", id: "merv"},
  {title:"İki dünya bir dilek", cover:"https://m.media-amazon.com/images/S/pv-target-images/844d63aac37c44edccc943a7060e031918f5d861f3815a090e5e5bf379d94b8b.jpg", src:"https://drive.google.com/file/d/1FATLKOdt6L1R1YmXft2OphjFYWY3hnVu/view?usp=drive_link", year:2025, genre:"Romantik", id: "ikidunyabirdilek"},
  {title:"Avın ardından / After the Hunt", cover:"https://m.media-amazon.com/images/M/MV5BMzYyOTAwODEtZTY4My00MjVkLWJjYjUtMjE2N2UzYTE3MTY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10582441527978", year:2025, genre:"Triller", id: "afterthehunt"},
  {title:"Dokunulmazlık / Exterritorial", cover:"https://m.media-amazon.com/images/M/MV5BYjVkMzI2MjAtYzA3NC00OGE1LWEyZDMtODc0YTc5NTZjYzFiXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9778315201194", year:2025, genre:"Aksiyon", id: "exterritorial"},
  {title:"High Rollers", cover:"https://m.media-amazon.com/images/S/pv-target-images/c5c0ac86cef2ebfbafa5217972be8884ff3e1ed494652e4b1a21ad6fadcfb44e.jpg", src:"https://ok.ru/video/9492997081705", year:2025, genre:"Aksiyon", id: "highrollers"},
  {title:"Tuğla / Brick", cover:"https://m.media-amazon.com/images/M/MV5BMGRjZTI5NmEtNWQzNi00ZDUxLWFmZmQtOGFiZmNkZGY1MDc5XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9986252147370", year:2025, genre:"Elmi fantastik", id: "brick"},
  {title:"Derin kargaşa / Havoc", cover:"https://m.media-amazon.com/images/I/81jqLmsOMpL.jpg", src:"https://ok.ru/video/9245286468201", year:2025, genre:"Aksiyon", id: "havoc"},
  {title:"10 numaralı kabin / The Woman in Cabin 10", cover:"https://m.media-amazon.com/images/M/MV5BNDY0YmEyNDMtNTQ0Yi00MWVmLWFiYjMtODM5NmUzZWQ5MDMxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10297584061098", year:2025, genre:"Dram", id: "thewomanincabin10"},
  {title:"Steve", cover:"https://m.media-amazon.com/images/M/MV5BYmE4N2ZlNWQtMDRhNC00ZmYzLWI5ODMtODAzZjRiOTkxZGZhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10273451674282", year:2025, genre:"Dram", id: "steve"},
  {title:"Bahçedeki kadın / The Woman in the Yard", cover:"https://m.media-amazon.com/images/M/MV5BNmZjZTA2ZmQtMDhiYS00NTlmLTk2NTctNTZlMzVhZmVjYTYyXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/10245770709674", year:2025, genre:"Qorxu", id: "thewomanintheyard"},
  {title:"Oxford aşkım / My Oxford Year", cover:"https://m.media-amazon.com/images/M/MV5BMWU0YTc0OWYtOWJjNy00ZDYzLWFlMTItMGZkNzM4YjQ5OWQzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9528533060201", year:2025, genre:"Romantik", id: "myoxfordyear"},
  {title:"Kayara", cover:"https://m.media-amazon.com/images/M/MV5BY2YxNzg4ZmEtNTdjNy00MTQ0LTgyYTQtNDY4NTQ2YjUwNmQ2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9962068052650", year:2025, genre:"Animasiya", id: "kayara"},
  {title:"Ruth & Boaz", cover:"https://m.media-amazon.com/images/M/MV5BMzU0Mjc1YzktYTc5ZC00OTk2LWExODAtN2UwOGNiN2Q0Y2E4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9719808658025", year:2025, genre:"Romantik", id: "ruthandboaz"},
  {title:"Vicious", cover:"https://m.media-amazon.com/images/M/MV5BMzNiMjhmNWQtNjJhZS00MGFkLTk3MDEtOWRmMjBjYTUwZTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9958881233513", year:2025, genre:"Qorxu", id: "vicious"},
  {title:"Bizim mutlu noelimiz / A Merry Little Ex-Mas", cover:"https://m.media-amazon.com/images/M/MV5BNjBlMTdiN2EtNzQ5MS00ODQ0LWI3NWUtYjdmMDU2N2Y4YWQ2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9988897966697", year:2025, genre:"Romantik", id: "amerrylittleexmas"},
  {title:"On saniye", cover:"https://m.media-amazon.com/images/M/MV5BMDdjMjAzNTktZDUxNS00MzYxLTk2M2YtNTk4NDljNGE4NmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vk.com/video359563763_456240051", year:2024, genre:"Dram", id: "onsaniye"},
  {title:"Penguen arkadaşım / My Penguin Friend", cover:"https://m.media-amazon.com/images/M/MV5BMWFkNWFlNTItNTkxNC00MmNiLWEwZDktNmUwMDA1NTBjNGZkXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9465480546897", year:2024, genre:"Macəra", id: "mypenguinfriend"},
  {title:"Kral Arthur / Arthur The King", cover:"https://m.media-amazon.com/images/S/pv-target-images/a6716cc236e16061e78305f230192d1b94d327c5ba24743981459e1cd24af4c1.jpg", src:"https://ok.ru/video/8663731997265", year:2024, genre:"Dram", id: "arthurtheking"},
  {title:"Rebel Ridge", cover:"https://m.media-amazon.com/images/M/MV5BYTE4ZDE5ZTktZWZkMC00MGY4LWFkZDUtZTc5YWU3NzM2YmM3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7913537079978", year:2024, genre:"Aksiyon", id: "rebelridge"},
  {title:"Kül", cover:"https://m.media-amazon.com/images/M/MV5BODE0ZWVlZTEtMTZiMC00ZWZlLWIxYWQtNWI2MDg1YzYyODlhXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7940212197969", year:2024, genre:"Dram", id: "kul"},
  {title:"Arıcı: Ölüm kovanı / The Beekeeper", cover:"https://m.media-amazon.com/images/M/MV5BNzg3YjVmZGYtOTc5MC00MDdiLTllOTYtZWQ0ODQ1MmMyNTExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://s16.imgmania.org/mr/ITuyYxWyMJgyMKOypv4lZQV0YxWfqKWurF4kZQtjpP5RIHSZd0zxnJ1aoJShnJRho3Was0xi16vr1.m3u8", year:2024, genre:"Aksiyon", id: "thebeekeeper"},
  {title:"Bionic", cover:"https://m.media-amazon.com/images/M/MV5BN2ZmMjdlMWUtODg3Ni00ZTM2LThiMTAtMDgyMWViNDI3OGFjXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7614502210218", year:2024, genre:"Elmi fantastik", id: "bionic"},
  {title:"Atatürk 1", cover:"https://m.media-amazon.com/images/M/MV5BYTEwZjUzMDQtY2YwNi00OTY4LTg0ZDYtNWZmYzIxYjM0YTU1XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/9190331255377", year:2024, genre:"Bioqrafiya", id: "ataturk1"},
  {title:"Atatürk 2", cover:"https://m.media-amazon.com/images/M/MV5BZGFjM2RjODgtMTFlMy00YjYxLWFkNDAtOTYxZDk0NDZhODkxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9191639747153", year:2024, genre:"Bioqrafiya", id: "ataturk2"},
  {title:"Paris'in altında / Under Paris", cover:"https://m.media-amazon.com/images/M/MV5BMDM5ODBiN2ItOTk4Yi00NzgyLWE2YTktYzhjYTc2ODE4ZTE4XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7638122957482", year:2024, genre:"Triller", id: "underparis"},
  {title:"Yaban arısı / The Wasp", cover:"https://m.media-amazon.com/images/M/MV5BNzE1YTljYTgtNzczZi00NTAyLThkYjUtYWExZDU4ZTY5YTdlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9709873728170", year:2024, genre:"Triller", id: "thewasp"},
  {title:"Tarikat / A Sacrifice", cover:"https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/9/2/0/8375029/799959748937.jpg", src:"https://ok.ru/video/9305428986538", year:2024, genre:"Triller", id: "asacrifice"},
  {title:"Sessiz bir yer: Birinci gün / A Quiet Place: Giorno 1", cover:"https://m.media-amazon.com/images/M/MV5BMDdjZTljZWMtMDIwNi00MTA5LTkxZmItNmY0NDA3ZDM0N2M2XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/8838271142570", year:2024, genre:"Triller", id: "aquietplace"},
  {title:"Atlas", cover:"https://m.media-amazon.com/images/M/MV5BNDUwNTFkNzYtMGM5NS00NTc4LWEwMDUtMmE5MzgyMjcwOWM4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7598597212842", year:2024, genre:"Elmi fantastik", id: "atlas"},
  {title:"Madame Web", cover:"https://m.media-amazon.com/images/M/MV5BODViOTZiOTQtOTc4ZC00ZjUxLWEzMjItY2ExMmNlNDliNjE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vkvideo.ru/video784107073_456240757?ref_domain=d2rs.com", year:2024, genre:"Aksiyon", id: "madameweb"},
  {title:"Taş kalpli / Heart of Stone", cover:"https://m.media-amazon.com/images/M/MV5BOTM5OTQ2ZTYtY2EzMC00Zjc3LTg3NWEtZWI4OTdlMjcwMGFlXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/6673580100266", year:2023, genre:"Aksiyon", id: "heartofstone"},
  {title:"Geri sayım", cover:"https://m.media-amazon.com/images/M/MV5BZDQ2YTViODQtZjBhNi00ZmQ5LWE1N2YtOWYxOTQxNjkyOGE3XkEyXkFqcGc@._V1_.jpg", src:"https://www.dailymotion.com/video/x9tkbk6", year:2023, genre:"Aksiyon", id: "gerisayim"},
  {title:"Mavka: Ormanın şarkısı / Mavka: The Forest Song", cover:"https://m.media-amazon.com/images/M/MV5BMzA5NzQ0YzktZjJiYS00OWE0LWE5MWYtMjU4YzA2Y2RmNWYxXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/8233692760657", year:2023, genre:"Animasiya", id: "mavka"},
  {title:"Chupa", cover:"https://m.media-amazon.com/images/M/MV5BY2QzYmU5ZGMtNTI1ZS00ODk2LWFlNWItOTA4NjFlNGU5MDI4XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vOI-pdid1oxM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2023, genre:"Fantastik", id: "chupa"},
  {title:"Dilek / Wish", cover:"https://m.media-amazon.com/images/M/MV5BN2UyZTAxZDctODI5Mi00MDczLWI4OWMtNTliZjEyMmEyN2FkXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vE1ll_LEovQQ?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2023, genre:"Animasiya", id: "wish"},
  {title:"Sen inandır", cover:"https://ortakoltuk.com/wp-content/uploads/2023/07/sen-inandir-7.jpg", src:"https://ok.ru/video/6569448639057", year:2023, genre:"Romantik", id: "seninandir"},
  {title:"Kızıl Hare / Ride On", cover:"https://m.media-amazon.com/images/M/MV5BMjVmNzIyNDMtNWIyZi00ZGYxLThlZjYtMWQ2MDVkNTNhMDM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7698129881770", year:2023, genre:"Macəra", id: "rideon"},
  {title:"Ördeklerin göçü / Migration", cover:"https://m.media-amazon.com/images/M/MV5BNjYwNjhhN2UtYTM3My00Yzk3LWIwMTMtNmE4ZWQ1ZTVjYzQwXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7642400295594", year:2023, genre:"Animasiya", id: "migration"},
  {title:"Uncharted", cover:"https://m.media-amazon.com/images/M/MV5BYjQxYWNiNzgtOTc2Yi00OGEwLTk5MjAtODdiZTk0ZDJlZGY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vNE4MmN0CDG4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2022, genre:"Macəra", id: "uncharted"},
  {title:"Ferrari", cover:"https://m.media-amazon.com/images/M/MV5BYmUzYmJiMDMtZjIxNy00ZjBlLThjZDMtMDA1ZDM4MWMwNmI0XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7596646206122", year:2023, genre:"Bioqrafiya", id: "ferrari"},
  {title:"Lamborghini: Efsanenin arkasındaki adam / Lamborghini: The Man Behind the Legend", cover:"https://m.media-amazon.com/images/M/MV5BMmY3MDAyNDQtYmE2ZS00ZTBiLTgxZjctYTUwOGFjOThmMGU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/6391565585066", year:2022, genre:"Bioqrafiya", id: "lamborghini"},
  {title:"UFO", cover:"https://m.media-amazon.com/images/M/MV5BNmI1YmEzMTAtMDk4ZS00ZWZmLWFiMWYtYjk0MjcxZGU1MTgxXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/4275651086929", year:2022, genre:"Dram", id: "ufo"},
  {title:"Anka", cover:"https://m.media-amazon.com/images/M/MV5BNDUwN2ZlNzQtYWM1ZS00Mjk0LTgwMzktNjJkZThjZTM5MTJjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/3541046200966", year:2022, genre:"Dram", id: "anka"},
  {title:"Öldüren oyun / The Friendship Game", cover:"https://m.media-amazon.com/images/M/MV5BMGQ5NDY0ZmEtYjUyYi00ZDQ5LWJiMDMtMGY1NDRhNmI2NDZkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7466741729962", year:2022, genre:"Elmi fantastik", id: "thefriendshipgame"},
  {title:"Morbius", cover:"https://m.media-amazon.com/images/M/MV5BY2UzYzFiZWUtOGU5ZC00YTIxLWFlNGUtMGU1YmI4OWUzN2FmXkEyXkFqcGc@._V1_.jpg", src:"https://m.ok.ru/video/7211205135036", year:2022, genre:"Fantastik", id: "morbius"},
  {title:"Kağıttan hayatlar", cover:"https://m.media-amazon.com/images/M/MV5BZTQ4NjZmMzctZDUxZC00YzczLWJkYTItMDM4ZTM0OThmMjM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/3121591618129", year:2022, genre:"Dram", id: "kagittanhayatlar"},
  {title:"Raya ve Son Ejderha / Raya and the Last Dragon", cover:"https://m.media-amazon.com/images/M/MV5BYmViOTM3MjMtNTM0OS00OGFlLWE5ZGEtZDlkMmU4MTgwYmE5XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vTfQ-bADzcCg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Animasiya", id: "rayaandthelastdragon"},
  {title:"Suçlu / The Guilty", cover:"https://m.media-amazon.com/images/M/MV5BZWI3NmEyYzAtNWY4OC00YWY4LTk2MjgtM2Y1NDdlZWE4ODgzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v0wNPXPft5CY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Triller", id: "theguilty"},
  {title:"Sihir Gizli Servisi / Secret Magic Control Agency", cover:"https://m.media-amazon.com/images/I/71hRh90EEeL._AC_UF894,1000_QL80_FMwebp_.jpg", src:"https://my.mail.ru/video/embed/2812081686177647812", year:2021, genre:"Animasiya", id: "secretmagiccontrolagency"},
  {title:"Unbreakable / Split / Glass", cover:"https://images.theposterdb.com/prod/public/images/meta/collections/optimized/43491/poster.webp", src:"https://m.ok.ru/video/2586038831803", year: "2000, 2016, 2019", genre:"Trilogy", id: "trilogy"},
  {title:"Bir şans daha / Last Christmas", cover:"https://m.media-amazon.com/images/M/MV5BY2NlNTMwYzgtZjI2Ny00ZWExLWE2NDUtNzFlYTQyMmY1NjkwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vm-MrandBzks?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2019, genre:"Romantik", id: "lastchristmas"},
  {title:"Oda / The Room", cover:"https://m.media-amazon.com/images/S/pv-target-images/ee3aff934c28a9cf68a54a36507e3ea93c9c9113b08d7a8f9797765656c25ca5.jpg", src:"https://dzen.ru/embed/vj-OdUVC37Vo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2019, genre:"Qorxu", id: "theroom"},
  {title:"Özgür dünya", cover:"https://m.media-amazon.com/images/S/pv-target-images/80fd33faa1bec65d1c42b7c5a2e517958f7ff649f71e384d5e5ac8ee3af0987f.jpg", src:"https://m.ok.ru/video/1754350750209", year:2019, genre:"Elmi fantastik", id: "ozgurdunya"},
  {title:"İyi oyun", cover:"https://m.media-amazon.com/images/M/MV5BZjE2ZmZjMzAtYjAwOC00NDFkLTkxZWItMjg0NDc5OTZkMDcyXkEyXkFqcGc@._V1_.jpg", src:"https://my.mail.ru/video/embed/9147329640879095932", year:2018, genre:"Elmi fantastik", id: "iyioyun"},
  {title:"Gösteri köpekleri / Show Dogs", cover:"https://m.media-amazon.com/images/M/MV5BYmM3ZDcwYTMtNGQ0MS00MTBjLWJhMDctOTk1YjMzZGI2ODU3XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/11228344683113", year:2016, genre:"Komediya", id: "showdogs"},
  {title:"ArifV216", cover:"https://m.media-amazon.com/images/M/MV5BNGFkMmRkMzktNTkwYy00ZTA2LWJmYmItNzZlNWQxOWMwZmE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10388208159337", year:2018, genre:"Komediya", id: "arifv216"},
  {title:"Başlat / Ready Player One", cover:"https://m.media-amazon.com/images/M/MV5BNzVkMTgzODQtMWIwZC00NzE4LTgzZjYtMzAwM2I5OGZhNjE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v0xPfqe__MR8?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2018, genre:"Elmi fantastik", id: "readyplayerone"},
  {title:"Neşeli kanatlar: Büyük göç / Duck Duck Goose", cover:"https://m.media-amazon.com/images/M/MV5BMDU1YjUxZjktMmQxZC00YTAxLTlhYzUtMWQ5NzU3MGZkNmM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vkvideo.ru/video784107073_456240993?ref_domain=d2rs.com", year:2018, genre:"Animasiya", id: "duckduckgoose"},
  {title:"Bizim için Şampiyon (Bold Pilot)", cover:"https://m.media-amazon.com/images/S/pv-target-images/444184fdfb75d763999a2499c801cd8aaf0a50583937d8f47fc2783b092e0c21.jpg", src:"https://m.ok.ru/video/8948822313658", year:2018, genre:"Bioqrafiya", id: "boldpilot"},
  {title:"Robot köpek A-X-L / A-X-L", cover:"https://m.media-amazon.com/images/M/MV5BYTRkMzFlZjItYWM0Ni00NWQwLTk3MWEtYjg5ZjQ0MDE2ZDFhXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/1164660836998", year:2018, genre:"Elmi fantastik", id: "axl"},
  {title:"Mumya / The Mummy", cover:"https://m.media-amazon.com/images/M/MV5BMGNhYWEwOTQtNjFhNC00ZTY2LWExNmQtMTAxNjNjYzEwMjA5XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vYuvqKfJ7uks?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2017, genre:"Macəra", id: "themummy"},
  {title:"Kötü kedi Şerafettin", cover:"https://m.media-amazon.com/images/M/MV5BZDRkYThmNTktMmI4Ny00NGY3LTk5M2EtMTgyNGVjM2U4ODgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/11477506853481", year:2016, genre:"Animasiya", id: "kotukediserafettin"},
  {title:"Hayalet hikayesi / Personal Shopper", cover:"https://m.media-amazon.com/images/I/71Pkl6R4jVL._AC_UF1000,1000_QL80_.jpg", src:"https://ok.ru/video/9903725349481", year:2016, genre:"Triller", id: "personalshopper"},
  {title:"Sevimli tehlikeli", cover:"https://m.media-amazon.com/images/M/MV5BNTg2MzU5ODA1Nl5BMl5BanBnXkFtZTgwMTk2NzA0NDE@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9007400329", year:2015, genre:"Romantik", id: "sevimlitehlikeli"},
  {title:"Ben kimim / Who Am I", cover:"https://m.media-amazon.com/images/M/MV5BZDFmNDY0NWUtMzZhYS00ZDk4LTg0MWItMTg5MDliZWExNmI4XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/3620082158161", year:2014, genre:"Triller", id: "whoami"},
  {title:"Çilek", cover:"https://m.media-amazon.com/images/M/MV5BMDdmYmMyYTQtYjgyZS00NjczLTk2ZmUtZGE0NGMwNzFkMDU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/33652935279", year:2014, genre:"Macəra", id: "cilek"},
  {title:"Zaman makinesi 1973", cover:"https://m.media-amazon.com/images/M/MV5BMTYxOTUxNDc2N15BMl5BanBnXkFtZTgwNTIxMDczMTE@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7052021926588", year:2014, genre:"Macəra", id: "zamanmakinesi1973"},
  {title:"Adalet / The Equalizer", cover:"https://m.media-amazon.com/images/M/MV5BMTQ2MzE2NTk0NF5BMl5BanBnXkFtZTgwOTM3NTk1MjE@._V1_.jpg", src:"https://ok.ru/video/9903725611625", year:2014, genre:"Aksiyon", id: "theequalizer"},
  {title:"Man of Tai Chi", cover:"https://m.media-amazon.com/images/M/MV5BMGQ5YzFmNTYtMzkyZi00OTFkLTk3MjYtMDg5Zjg5M2QxMmYxXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/367833778822", year:2013, genre:"Aksiyon", id: "manoftaichi"},
  {title:"Aşkın çekimi / Upside Down", cover:"https://m.media-amazon.com/images/I/91WnNPFs26L.jpg", src:"https://dzen.ru/embed/vPf4X162EXkw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2012, genre:"Romantik", id: "upsidedown"},
  {title:"Zamana karşı / In Time", cover:"https://m.media-amazon.com/images/M/MV5BMjA3NzI1ODc1MV5BMl5BanBnXkFtZTcwMzI5NjQwNg@@._V1_.jpg", src:"https://m.ok.ru/video/9445578902203", year:2011, genre:"Triller", id: "intime"},
  {title:"Limit yok / Limitless", cover:"https://m.media-amazon.com/images/M/MV5BMWQ4OTQ4YzYtODlmMi00ZjA0LTg5M2QtZWUzNjA5N2NmODE5XkEyXkFqcGc@._V1_.jpg", src:"https://m.ok.ru/video/7502382172859", year:2011, genre:"Triller", id: "limitless"},
  {title:"Anadolu Kartalları", cover:"https://m.media-amazon.com/images/M/MV5BYWY0YTJkYWYtMTA3Ni00NGRiLTk1ZTAtMjQ0NmExMmVhMjBlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/86842608282", year:2011, genre:"Dram", id: "anadolukartallari"},
  {title:"Hugo", cover:"https://m.media-amazon.com/images/M/MV5BMjAzNzk5MzgyNF5BMl5BanBnXkFtZTcwOTE4NDU5Ng@@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/773317855931", year:2011, genre:"Macəra", id: "hugo"},
  {title:"Başlangıç / Inception", cover:"https://m.media-amazon.com/images/M/MV5BZjhkNjM0ZTMtNGM5MC00ZTQ3LTk3YmYtZTkzYzdiNWE0ZTA2XkEyXkFqcGc@._V1_.jpg", src:"https://vidmody.com/vs/tt1375666", year:2010, genre:"Elmi fantastik", id: "inception"},
  {title:"Ejderhanı nasıl eğitirsin / How to Train Dragon", cover:"https://m.media-amazon.com/images/M/MV5BMjA5NDQyMjc2NF5BMl5BanBnXkFtZTcwMjg5ODcyMw@@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/7470750370549", year:2010, genre:"Fantastik", id: "howtotraindragon"},
  {title:"39. Dosya / Case 39", cover:"https://m.media-amazon.com/images/M/MV5BNTA4NDUyOTE5NV5BMl5BanBnXkFtZTcwOTQ3NzY3Mw@@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vPv9PS3YoqTg?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2009, genre:"Triller", id: "case39"},
  {title:"Yahşi Batı", cover:"https://m.media-amazon.com/images/M/MV5BMTMyMWY0NzQtZmNkNS00ZGQ3LWIzNTEtNzY1ODEyYmIwNWMzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10397782116969", year:2009, genre:"Komediya", id: "yahsibati"},
  {title:"Gezegen 51 / Planet 51", cover:"https://m.media-amazon.com/images/M/MV5BOGJkZGRhOWItOTM2Ni00ZmFhLThlNDItMDA4YTI4YTc5NTI4XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/3523652487761", year:2009, genre:"Animasiya", id: "planet51"},
  {title:"Atlayıcı / Jumper", cover:"https://m.media-amazon.com/images/M/MV5BMWQ3NjA3NTYtNDJiYi00ZTE0LWFmNzMtZjc0NTUxNjk2YTFkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/28983560785", year:2008, genre:"Aksiyon", id: "jumper"},
  {title:"Mürekkep yürek / Inkheart", cover:"https://image.tmdb.org/t/p/original/pNTJVwXZZzXv5C2YXux7F2Z3jsV.jpg", src:"https://m.ok.ru/video/40711686843", year:2008, genre:"Macəra", id: "inkheart"},
  {title:"Dünyanın merkezine yolculuk / Journey to the Center of the Earth", cover:"https://m.media-amazon.com/images/M/MV5BNTMyMGQ4MWYtZmMyYi00M2JhLWFhZmQtNWM5MTVjYjk1MTYxXkEyXkFqcGc@._V1_.jpg", src:"https://m.ok.ru/video/27941014237", year:2008, genre:"Macəra", id: "journeytothecenteroftheearth"},
  {title:"Bay Evet / Yes Man", cover:"https://m.media-amazon.com/images/M/MV5BZWQ4YzBiMzgtM2ZhZC00ZDQ5LWFiZjgtNmFlNzZlMTBkZTJhXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/2287475493457", year:2008, genre:"Komediya", id: "yesman"},
  {title:"Hız tutkusu / Redline", cover:"https://m.media-amazon.com/images/I/71tf2guXENL._AC_UF1000,1000_QL80_.jpg", src:"https://ok.ru/video/10135492758097", year:2008, genre:"Aksiyon", id: "redline"},
  {title:"V for Vendetta", cover:"https://m.media-amazon.com/images/M/MV5BMGU1MmMwNzctOTM2OS00ZTljLTg3NzUtYzRkN2QxN2Y3ZmU0XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vv026bW7XRU4?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2005, genre:"Aksiyon", id: "vforvendetta"},
  {title:"Aman Tanrım / Bruce Almighty", cover:"https://m.media-amazon.com/images/S/pv-target-images/44b01b4e509dd3eb88531024dfaaac8dbc8c111dbee3febe2a7fc5f2280e79c4.jpg", src:"https://dzen.ru/embed/vVy4ufY-GARY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2003, genre:"Komediya", id: "brucealmighty"},
  {title:"Sıkıysa yakala / Catch Me If You Can", cover:"https://m.media-amazon.com/images/M/MV5BM2FjZTU2ZTYtNTgzNi00MTlmLWE3N2UtZGRiYmE5ZDVmMmVlXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vhMuHZjHxkCM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2002, genre:"Macəra", id: "catchmeifyoucan"},
  {title:"Malena", cover:"https://xl.movieposterdb.com/12_06/2000/213847/xl_213847_aa6c3d38.jpg", src:"https://dzen.ru/embed/vurIqx4USh0s?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2000, genre:"Dram", id: "malena"},
  {title:"Altıncı his / The Sixth Sense", cover:"https://m.media-amazon.com/images/I/61heMaZlMEL._AC_UF894,1000_QL80_.jpg", src:"https://my.mail.ru/video/embed/7537570220391530724", year:1999, genre:"Triller", id: "thesixthsense"},
  {title:"Mulan", cover:"https://m.media-amazon.com/images/M/MV5BMWI4ZjcxMjMtZmJiYi00MDhlLTgxMzQtNTE2ZjM0YzAyYzM1XkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vSKjLnnuwaXk?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:1998, genre:"Animasiya", id: "mulan"},
  {title:"Siyah telefon / The Black Phone", cover:"https://m.media-amazon.com/images/M/MV5BMjFhZTcxOTktMzllMS00MzIzLWJhODEtZDU5YTFkNzRjZWQyXkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/3977190509190", year:2021, genre:"Qorxu", id: "theblackphone"},
  {title:"Siyah telefon 2/ The Black Phone 2", cover:"https://m.media-amazon.com/images/M/MV5BMWIyYmM5OWYtZWE4Ni00YjYzLTkzMDItYzY2MGVkODk3ZjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/10358825486953", year:2025, genre:"Qorxu", id: "theblackphone2"},
  {title:"Evde tek başına / Home Alone", cover:"https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src:"https://dzen.ru/embed/vkE8Hl1epfXM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:1990, genre:"Komediya", id: "homealone"},
  {title:"Evdə tək (Azərbaycan dilində-1) / Home Alone", cover:"https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src:"https://drive.google.com/file/d/1UEZvCQB8M75Ex4oip6aREi9QfPergjRp/view?usp=drive_link", year:1990, genre:"Komediya", id: "homealoneaz"},
  {title:"Evdə tək (Azərbaycan dilində-2) / Home Alone", cover:"https://m.media-amazon.com/images/S/pv-target-images/cc4ebc2e3deda16b41d4d09636efd60c9028577b18dd873f0ba31d4bb9e033db.jpg", src:"https://drive.google.com/file/d/19-WPu3Zw4Mo-hAXdkpEPzxxvFLoRlYSz/view?usp=drive_link", year:1990, genre:"Komediya", id: "homealoneaz2"},
  {title:"Evde tek başına 2 / Home Alone 2: Lost in New York", cover:"https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src:"https://dzen.ru/embed/vh-9MCbZULEo?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:1992, genre:"Komediya", id: "homealone2"},
  {title:"Evdə tək 2 (Azərbaycan dilində-1) / Home Alone 2: Lost in New York", cover:"https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src:"https://drive.google.com/file/d/1sKrdkMrSmMMKojtNcMt7JqF14DibGlKm/view?usp=drive_link", year:1992, genre:"Komediya", id: "homealone2az"},
  {title:"Evdə tək 2 (Azərbaycan dilində-2) / Home Alone 2: Lost in New York", cover:"https://m.media-amazon.com/images/I/91tXzecvy-L._AC_UF1000,1000_QL80_.jpg", src:"https://drive.google.com/file/d/19zNpaPuAVeUEqfSAHgOzvRB1XbADxXQH/view?usp=drive_link", year:1992, genre:"Komediya", id: "homealone2az2"},
  {title:"Aslan Kral / The Lion King", cover:"https://m.media-amazon.com/images/M/MV5BMjIwMjE1Nzc4NV5BMl5BanBnXkFtZTgwNDg4OTA1NzM@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vBjSgKwDTcQw?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2019, genre:"Animasiya", id: "thelionking"},
  {title:"Mufasa: Aslan Kral / Mufasa: The Lion King", cover:"https://m.media-amazon.com/images/M/MV5BNjg1YzI5ZmQtZjZkOC00ZDMzLWI4YjYtMmY5MzZjYWE3YzhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://vidmody.com/vs/tt13186482", year:2024, genre:"Animasiya", id: "mufasa"},
  {title:"Rio", cover:"https://m.media-amazon.com/images/M/MV5BMTU2MDY3MzAzMl5BMl5BanBnXkFtZTcwMTg0NjM5NA@@._V1_FMjpg_UX1000_.jpg", src:"https://vkvideo.ru/video784107073_456239647", year:2011, genre:"Animasiya", id: "rio"},
  {title:"Rio 2", cover:"https://m.media-amazon.com/images/M/MV5BMTgzMDczMDYzNl5BMl5BanBnXkFtZTgwMzk2MDIwMTE@._V1_.jpg", src:"https://vkvideo.ru/video784107073_456239646?ref_domain=d2rs.com", year:2014, genre:"Animasiya", id: "rio2"},
  {title:"Malefiz / Malefisent", cover:"https://m.media-amazon.com/images/M/MV5BMjAwMzAzMzExOF5BMl5BanBnXkFtZTgwOTcwMDA5MTE@._V1_.jpg", src:"https://dzen.ru/embed/vtRZcBxJSrGA?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2014, genre:"Fantastik", id: "malefisent"},
  {title:"Malefiz: Kötülüğün gücü / Malefisent: Mistress of Evil", cover:"https://m.media-amazon.com/images/M/MV5BNTY4YjYwYzMtYTg1NC00ZmJiLTk0OTYtMWMzM2Y4Yzc5MDc2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vOpJWxz212HU?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2019, genre:"Fantastik", id: "malefisent2"},
  {title:"Sihirbazlar çetesi / Now You See Me", cover:"https://m.media-amazon.com/images/M/MV5BMTY0NDY3MDMxN15BMl5BanBnXkFtZTcwOTM5NzMzOQ@@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vfXt5DGIcmAc?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2013, genre:"Macəra", id: "nowyouseeme"},
  {title:"Sihirbazlar çetesi 2 / Now You See Me 2", cover:"https://m.media-amazon.com/images/M/MV5BOTVjNTA0ZWEtNzU2Ny00Njg1LWE1MmEtZTUyZGQzYTVlY2Q5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/89743690427", year:2016, genre:"Macəra", id: "nowyouseeme2"},
  {title:"Karateci çocuk / The Karate kid", cover:"https://m.media-amazon.com/images/M/MV5BODQ2MDJiMDItN2QwMS00Yzg1LWJlZDEtN2Y3M2UyYWEzZDk3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/581747149537", year:2010, genre:"Aksiyon", id: "thekaratekid"},
  {title:"Karateci çocuk: Efsane dövüşçüler / Karate Kid: Legends", cover:"https://m.media-amazon.com/images/M/MV5BM2MwYTlkY2MtNmUzNy00MTljLThjNDAtZGUzNzMxMzcxNzM5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/9885577644649", year:2025, genre:"Aksiyon", id: "thekaratekid2"},
  {title:"Ip Man", cover:"https://m.media-amazon.com/images/M/MV5BMjE0NDUzMDcyOF5BMl5BanBnXkFtZTcwNzAxMTA2Mw@@._V1_.jpg", src:"https://my.mail.ru/video/embed/2812081686177647104", year:2008, genre:"Aksiyon", id: "ipman"},
  {title:"Ip Man 2: Legend of the Grandmaster", cover:"https://m.media-amazon.com/images/M/MV5BYzEzYTBmYjgtNjQzMi00YmNiLTkyZGItOGFhMzEzOWY3MjI4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://m.vkvideo.ru/video359109645_456239197", year:2010, genre:"Aksiyon", id: "ipman2"},
  {title:"Ip Man 3", cover:"https://m.media-amazon.com/images/M/MV5BMmZhOWNlMDEtN2M1OC00Yzk5LThhOTAtZDA5NTNjNjQyZDM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/1501966895750", year:2015, genre:"Aksiyon", id: "ipman3"},
  {title:"Master Z: Ip Man Legacy (Spin-off)", cover:"https://m.media-amazon.com/images/M/MV5BMTYxNzA0ODQyMF5BMl5BanBnXkFtZTgwNzUwNTg1NzM@._V1_.jpg", src:"https://ok.ru/video/1978023217798", year:2018, genre:"Aksiyon", id: "ipmanlegacy"},
  {title:"Ip Man 4: The Final", cover:"https://m.media-amazon.com/images/M/MV5BOGVjMDEzNjMtMWJmMy00NDdjLWFkMzItOTBhZTE3OWU0YmM4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/1770461137542", year:2019, genre:"Aksiyon", id: "ipman4"},
  {title:"Efsane doğuyor: Ip Man / The Legend is Born: Ip Man", cover:"https://m.media-amazon.com/images/M/MV5BMjA2ODgyMjE1MF5BMl5BanBnXkFtZTcwMzE3MDU3Ng@@._V1_.jpg", src:"https://ok.ru/video/1979158235782", year:2010, genre:"Aksiyon", id: "ipmanthelegendisborn"},
  {title:"Ip Man: Son dövüş / Ip Man: The Final Fight", cover:"https://m.media-amazon.com/images/M/MV5BMTQwMTY0NDQxMV5BMl5BanBnXkFtZTgwMjEwMTEwMDE@._V1_.jpg", src:"https://ok.ru/video/1979158432390", year:2013, genre:"Aksiyon", id: "ipmanthefinalfight"},
  {title:"Ip Man: Kung Fu ustası / Ip Man: Kung Fu Master", cover:"https://m.media-amazon.com/images/M/MV5BMmFkYjRhOGItNGNmYy00OTQyLThhYjctNWVkNmRhZTNiNDgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/5419892083370", year:2019, genre:"Aksiyon", id: "ipmankungfumaster"},
  {title:"Avatar", cover:"https://m.media-amazon.com/images/M/MV5BM2RiNGMzM2QtMzkyNi00OGYyLWE5MTctNDRkOTRkZmI5ZGJlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/v_MR3qG1GUis?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2009, genre:"Fantastik", id: "avatar"},
  {title:"Avatar: Suyun yolu / Avatar: The Deep Dive", cover:"https://m.media-amazon.com/images/M/MV5BY2ExYzkyNGUtODQwNS00MGZiLWE2NmItYTg3YjVjZGIxN2NhXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vG8OrNND6-3Y?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2022, genre:"Fantastik", id: "avatar2"},
  {title:"Venom: Zehirli öfke 1", cover:"https://m.media-amazon.com/images/M/MV5BMTU3MTQyNjQwM15BMl5BanBnXkFtZTgwNDgxNDczNTM@._V1_.jpg", src:"https://ok.ru/video/2786564115078", year:2018, genre:"Fantastik", id: "venom"},
  {title:"Venom: Zehirli öfke 2 / Venom: Let There Be Carnage", cover:"https://m.media-amazon.com/images/M/MV5BZTZkMGY0NTQtMzg2NC00YzdhLTg1NzYtZDMyNzZhNGU3ZGUwXkEyXkFqcGc@._V1_.jpg", src:"https://dzen.ru/embed/vUO66L0mC9GM?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2021, genre:"Fantastik", id: "venom2"},
  {title:"Venom: Son dans / Venom: Last Dance", cover:"https://m.media-amazon.com/images/M/MV5BZDMyYWU4NzItZDY0MC00ODE2LTkyYTMtMzNkNDdmYmFhZDg0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://dzen.ru/embed/vUiGTGBhfkiY?from_block=partner&from=zen&mute=0&autoplay=0&tv=0", year:2024, genre:"Fantastik", id: "venom3"},
  {title:"Örümcek adam / Spider Man", cover:"https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SY450_CR2", src:"https://ok.ru/video/33411041913", year:2002, genre:"Fantastik", id: "spiderman"},
  {title:"Örümcek adam 2 / Spider-Man 2", cover:"https://m.media-amazon.com/images/M/MV5BNGQ0YTQyYTgtNWI2YS00NTE2LWJmNDItNTFlMTUwNmFlZTM0XkEyXkFqcGc@._V1_.jpg", src:"https://ok.ru/video/7152378841788", year:2004, genre:"Fantastik", id: "spiderman2"},
  {title:"Örümcek Adam 3 / Spider Man 3", cover:"https://m.media-amazon.com/images/M/MV5BODE2NzNhMDctYjUzMC00Y2M5LWI2Y2EtODJkZTFjN2Y5ODlmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7855932967612", year:2007, genre:"Fantastik", id: "spiderman3"},
  {title:"İnanılmaz Örümcek Adam / The Amazing Spider Man", cover:"https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7512581278396", year:2012, genre:"Fantastik", id: "theamazingspiderman"},
  {title:"İnanılmaz Örümcek Adam 2 / The Amazing Spider Man 2", cover:"https://m.media-amazon.com/images/M/MV5BOTA5NDYxNTg0OV5BMl5BanBnXkFtZTgwODE5NzU1MTE@._V1_FMjpg_UX1000_.jpg", src:"https://ok.ru/video/22823766703", year:2014, genre:"Fantastik", id: "theamazingspiderman2"},
  {title:"Örümcek Adam: Eve dönüş / Spider Man: Homecoming", cover:"https://m.media-amazon.com/images/M/MV5BODY2MTAzOTQ4M15BMl5BanBnXkFtZTgwNzg5MTE0MjI@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7051922901692", year:2017, genre:"Fantastik", id: "spidermanhomecoming"},
  {title:"Örümcek Adam: Evden uzakta / Spider Man: Far from Home", cover:"https://m.media-amazon.com/images/M/MV5BM2Y2YzE5MGEtMGZjYS00MGM5LTlmYzEtYTNmMGZjZDY4YTkzXkEyXkFqcGc@._V1_.jpg", src:"https://m.ok.ru/video/7270672108220", year:2019, genre:"Fantastik", id: "spidermanfarfromhome"},
  {title:"Örümcek Adam: Eve dönüş yok / Spider Man: No Way Home", cover:"https://m.media-amazon.com/images/M/MV5BMmFiZGZjMmEtMTA0Ni00MzA2LTljMTYtZGI2MGJmZWYzZTQ2XkEyXkFqcGc@._V1_.jpg", src:"https://m.ok.ru/video/7190992915132", year:2021, genre:"Fantastik", id: "spidermannowayhome"},
  {title:"Örümcek Adam: Örümcek evreninde  / Spider Man: Into the Spider-Verse", cover:"https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7375842249404", year:2018, genre:"Fantastik", id: "spidermanintothespiderverse"},
  {title:"Örümcek Adam: Örümcek evrenine geçiş  / Spider Man: Across the Spider-Verse", cover:"https://m.media-amazon.com/images/M/MV5BZjI5MjFiZmQtNGQ4Ni00OThjLWE3OTctOGI4NmZiNmZmZmNmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", src:"https://m.ok.ru/video/7656487520893", year:2023, genre:"Fantastik", id: "spidermanacrossthespiderverse"}
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
                    justify-content:center !important; z-index:999 !important; font-size:14px !important;
                    box-shadow: 0 0 8px rgba(0,0,0,0.3) !important;">
            <i class="fa-solid fa-fire"></i>
        </div>` : '';

      // 2. Qızılı Fon və Yazı Rəngləri
      // Əgər special "yes" deyilsə, boş qalacaqlar
      const goldBg = isGold ? `style="background:linear-gradient(135deg, #FFD700, #FDB931) !important;"` : '';
      const goldText = isGold ? `style="color:#000000 !important; font-weight:800 !important;"` : '';
      
      // Kartın özünə kənar xətt (border) verək
      if(isGold) el.style.border = "1px solid #FFD700";
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

  /* Odnoklassniki handler — başlıq + alt başlıq + toast mesajları */
(function(){
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id=setInterval(()=>{
      if(typeof window.openPlayer === 'function' || ++tries>40){ clearInterval(id); cb(); }
    }, 100);
  }

  function extractOkId(url){
    try{
      const u = String(url || '');
      if(!/ok\.ru|odnoklassniki/i.test(u)) return null;
      const m = u.match(/\/video(?:\/|%2F)(\d{6,})/i) || u.match(/\/video\/?(\d{6,})/i) || u.match(/video(?:=|:)?(\d{6,})/i);
      if(m && m[1]) return m[1];
      const dd = u.match(/(\d{6,})/g);
      if(dd && dd.length) return dd[0];
      return null;
    }catch(e){ return null; }
  }

  let okModal = null;
  const showHeaderFSForOk = false;

  function createOkModal(){
    if(okModal) return okModal;

    const css = `
      .okmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg, rgba(2,6,23,0.8), rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .okmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface, #0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .okmodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .okmodal-left{display:flex;align-items:center;gap:8px}
      .okmodal-title{font-weight:700;color:var(--text, #e6eef6);flex:1;text-align:center;line-height:1.05}
      .okmodal-sub{font-size:13px;color:var(--muted, #94a3b8);text-align:center;margin-top:4px}
      .okmodal-close,.okmodal-fs{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .okmodal-close:hover,.okmodal-fs:hover{background:rgba(255,255,255,0.02)}
      .okmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .okmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .okmodal-iframe-wrap{height:48vh} .okmodal-title{text-align:center;font-size:14px} .okmodal-sub{font-size:12px} .okmodal-sheet{width:100%}
      }
      @media (min-width:768px){ .okmodal-overlay {transform: translateX(-6px);}
      }
    `;
    const st = document.createElement('style'); st.appendChild(document.createTextNode(css)); document.head.appendChild(st);

    okModal = document.createElement('div');
    okModal.className = 'okmodal-overlay';
    okModal.style.display = 'none';

    const sheet = document.createElement('div'); sheet.className = 'okmodal-sheet'; sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true');

    const top = document.createElement('div'); top.className = 'okmodal-top';
    const left = document.createElement('div'); left.className = 'okmodal-left';
    const closeBtn = document.createElement('button'); closeBtn.className = 'okmodal-close'; closeBtn.setAttribute('aria-label','Bağla'); closeBtn.innerHTML = '✕';
    left.appendChild(closeBtn);

    // optional fullscreen header button
    let fsBtn = null;
    if(showHeaderFSForOk){
      fsBtn = document.createElement('button'); fsBtn.className = 'okmodal-fs'; fsBtn.setAttribute('aria-label','Tam ekran'); fsBtn.title = 'Tam ekran';
      fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M7 14H5v4h4v-2H7v-2zM17 10h2V6h-4v2h2v2zM7 6h4V4H5v4h2V6zM17 18v-4h2v4h-4v-2h2v-2z" fill="currentColor"/></svg>';
      left.appendChild(fsBtn);
    }

    const center = document.createElement('div'); center.style.flex = '1'; center.style.display = 'flex'; center.style.flexDirection = 'column'; center.style.alignItems = 'center'; center.style.justifyContent = 'center';
    const title = document.createElement('div'); title.className = 'okmodal-title'; title.textContent = 'Odnoklassniki video';
    const sub = document.createElement('div'); sub.className = 'okmodal-sub'; sub.textContent = '';
    center.appendChild(title); center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);
    // DƏYİŞİKLİK: Paylaşma düyməsi
    const rightControls = document.createElement('div');
    rightControls.className = 'player-right-controls';
    rightControls.innerHTML = `
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" role="img">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);
    // DƏYİŞİKLİK SONU
    
    const wrap = document.createElement('div'); wrap.className = 'okmodal-iframe-wrap';
    const iframe = document.createElement('iframe'); iframe.className = 'okmodal-iframe';
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('webkitallowfullscreen','');
    iframe.setAttribute('mozallowfullscreen','');
    iframe.setAttribute('allow','fullscreen; autoplay; encrypted-media; picture-in-picture; geolocation; microphone; camera');
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
    iframe.src = 'about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    okModal.appendChild(sheet);
    document.body.appendChild(okModal);

    // Events
    closeBtn.addEventListener('click', ()=>{ hideOkModal(); showToast('Film dayandırıldı!',900); });
    okModal.addEventListener('click', (e)=>{ if(e.target === okModal){ hideOkModal(); showToast('Film dayandırıldı!',900); } });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && okModal.style.display==='flex'){ hideOkModal(); showToast('Film dayandırıldı!',900); } });

    if(fsBtn){
      fsBtn.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        try{
          if(iframe.requestFullscreen) await iframe.requestFullscreen();
          else if(iframe.webkitRequestFullscreen) await iframe.webkitRequestFullscreen();
          else if(iframe.mozRequestFullScreen) await iframe.mozRequestFullScreen();
          else if(wrap.requestFullscreen) await wrap.requestFullscreen();
        }catch(err){
          const src = iframe.src || '';
          if(src && src !== 'about:blank') window.open(src, '_blank', 'noopener');
        }
      });
    }

    return okModal;
  }

  function showOkModal(embedUrl, originalUrl, titleText, subtitleText){
    const m = createOkModal();
    const iframe = m.querySelector('.okmodal-iframe');
    const titleEl = m.querySelector('.okmodal-title');
    const subEl = m.querySelector('.okmodal-sub');

    if(titleText && titleEl) titleEl.textContent = titleText;
    if(subtitleText && subEl){ subEl.textContent = subtitleText; subEl.style.display = 'block'; }
    else if(subEl){ subEl.textContent = ''; subEl.style.display = 'none'; }

    try{
      iframe.removeAttribute('srcdoc');
      iframe.src = embedUrl;
    }catch(e){
      window.open(originalUrl,'_blank','noopener');
      return;
    }

    try{ if(typeof lockBodyScroll === 'function') lockBodyScroll(); else { document.documentElement.style.overflow='hidden'; } }catch(e){}
    m.style.display = 'flex';

    // **toast mesajı əlavə edildi**
    try{ if(typeof showToast === 'function'){ showToast(`${titleText} başladılır!`, 1000); } }catch(e){}
  }

  function hideOkModal(){
    // === URL TƏMİZLƏMƏ ===
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);
    // === SON ===
    const m = createOkModal();
    const iframe = m.querySelector('.okmodal-iframe');
    try{ iframe.src = 'about:blank'; }catch(e){}
    m.style.display = 'none';
    try{ if(typeof unlockBodyScroll === 'function') unlockBodyScroll(); else { document.documentElement.style.overflow=''; } }catch(e){}
    try{
      if(document.fullscreenElement){ if(document.exitFullscreen) document.exitFullscreen(); }
      else if(document.webkitFullscreenElement){ if(document.webkitExitFullscreen) document.webkitExitFullscreen(); }
    }catch(e){}
  }

  whenOpenPlayerReady(function(){
    const original = (typeof window.openPlayer === 'function') ? window.openPlayer.bind(window) : null;

    window.openPlayer = function(movie){
      try{
        const src = (movie && (movie.src || movie.url)) ? (movie.src || movie.url) : String(movie||'');
        const okHost = /ok\.ru|odnoklassniki/i.test(src);
        if(!okHost){
          if(original) return original(movie);
          return;
        }

        const id = extractOkId(src);
        let subtitle = '';
        if(movie && (movie.year || movie.genre)){
          const parts = [];
          if(movie.year) parts.push(String(movie.year));
          if(movie.genre) parts.push(String(movie.genre));
          if(parts.length) subtitle = parts.join(' · ');
        }

        if(id){
          const embed = `https://ok.ru/videoembed/${encodeURIComponent(id)}`;
          showOkModal(embed, src, movie && movie.title ? movie.title : 'Odnoklassniki video', subtitle);
          return;
        } else {
          try {
            showOkModal(src, src, movie && movie.title ? movie.title : 'Odnoklassniki video', subtitle);
            return;
          } catch(e){
            window.open(src, '_blank', 'noopener');
            return;
          }
        }
      }catch(err){
        if(original) return original(movie);
        try{ window.open((movie && movie.src) || movie || '', '_blank'); }catch(e){}
      }
    };
  });

})();

  /* VK / vkvideo.ru video handler —  */
(function(){
  // Wait until original openPlayer exists, but don't block forever
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id = setInterval(()=>{
      if(typeof window.openPlayer === 'function' || ++tries > 40){ clearInterval(id); cb(); }
    }, 100);
  }

  // Try extract token like:
  // - vk.com/video-12345_67890
  // - vkvideo.ru/video784107073_456240757
  // - any url containing "video" + digits + "_" + digits
  function extractVkToken(url){
    try{
      const u = String(url || '');
      if(!/vk\.com|vkvideo\.ru/i.test(u)) return null;
      // find patterns video-<owner>_<id> or video<owner>_<id>
      let m = u.match(/video-?(\d+)[_\/-](\d+)/i);
      if(m && m[1] && m[2]) return { owner: m[1], id: m[2], raw: `video${m[1]}_${m[2]}` };
      // sometimes path like /video784107073_456240757
      m = u.match(/video(\d+)_(\d+)/i);
      if(m && m[1] && m[2]) return { owner: m[1], id: m[2], raw: `video${m[1]}_${m[2]}` };
      // query params fallback (oid & id)
      try{
        const parsed = new URL(u);
        const oid = parsed.searchParams.get('oid') || parsed.searchParams.get('owner_id') || parsed.searchParams.get('owner');
        const vid = parsed.searchParams.get('id') || parsed.searchParams.get('video_id') || parsed.searchParams.get('v');
        if(oid && vid) return { owner: oid.replace(/\D/g,''), id: vid.replace(/\D/g,''), raw: `video${oid}_${vid}` };
      }catch(e){}
      return null;
    }catch(e){ return null; }
  }

  // build likely embed candidates for VK given owner,id
  function buildVkEmbeds(owner, id){
    const embeds = [];
    // common embed endpoint
    embeds.push(`https://vk.com/video_ext.php?oid=${encodeURIComponent(owner)}&id=${encodeURIComponent(id)}`);
    // direct video page forms
    embeds.push(`https://vk.com/video-${encodeURIComponent(owner)}_${encodeURIComponent(id)}`);
    embeds.push(`https://vk.com/video${encodeURIComponent(owner)}_${encodeURIComponent(id)}`);
    // raw token form
    embeds.push(`https://vk.com/video${owner}_${id}`);
    return embeds;
  }

  // Create modal only once
  let vkModal = null;
  const showHeaderFSForVk = false; // keep header FS hidden to avoid duplicate icon

  function createVkModal(){
    if(vkModal) return vkModal;

    const css = `
      .vkmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg, rgba(2,6,23,0.8), rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .vkmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .vkmodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .vkmodal-left{display:flex;align-items:center;gap:8px}
      .vkmodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .vkmodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .vkmodal-close,.vkmodal-fs{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .vkmodal-close:hover,.vkmodal-fs:hover{background:rgba(255,255,255,0.02)}
      .vkmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .vkmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .vkmodal-iframe-wrap{height:48vh} .vkmodal-title{text-align:center;font-size:14px} .vkmodal-sub{font-size:12px} .vkmodal-sheet{width:100%}
      }
      @media (min-width:768px){ .vkmodal-overlay {transform: translateX(-6px);}
      }
    `;
    const st = document.createElement('style'); st.appendChild(document.createTextNode(css)); document.head.appendChild(st);

    vkModal = document.createElement('div');
    vkModal.className = 'vkmodal-overlay';
    vkModal.style.display = 'none';

    const sheet = document.createElement('div'); sheet.className = 'vkmodal-sheet'; sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true');

    const top = document.createElement('div'); top.className = 'vkmodal-top';
    const left = document.createElement('div'); left.className = 'vkmodal-left';
    const closeBtn = document.createElement('button'); closeBtn.className = 'vkmodal-close'; closeBtn.setAttribute('aria-label','Bağla'); closeBtn.innerHTML = '✕';
    left.appendChild(closeBtn);

    let fsBtn = null;
    if(showHeaderFSForVk){
      fsBtn = document.createElement('button'); fsBtn.className = 'vkmodal-fs'; fsBtn.setAttribute('aria-label','Tam ekran'); fsBtn.title='Tam ekran';
      fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M7 14H5v4h4v-2H7v-2zM17 10h2V6h-4v2h2v2zM7 6h4V4H5v4h2V6zM17 18v-4h2v4h-4v-2h2v-2z" fill="currentColor"/></svg>';
      left.appendChild(fsBtn);
    }

    const center = document.createElement('div'); center.style.flex = '1'; center.style.display = 'flex'; center.style.flexDirection = 'column'; center.style.alignItems = 'center'; center.style.justifyContent = 'center';
    const title = document.createElement('div'); title.className = 'vkmodal-title'; title.textContent = 'VK video';
    const sub = document.createElement('div'); sub.className = 'vkmodal-sub'; sub.textContent = '';
    center.appendChild(title); center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);
    // DƏYİŞİKLİK: Paylaşma düyməsi
    const rightControls = document.createElement('div');
    rightControls.className = 'player-right-controls';
    rightControls.innerHTML = `
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" role="img">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);
    // DƏYİŞİKLİK SONU

    const wrap = document.createElement('div'); wrap.className = 'vkmodal-iframe-wrap';
    const iframe = document.createElement('iframe'); iframe.className = 'vkmodal-iframe';

    // fullscreen permissions and sandbox
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('webkitallowfullscreen','');
    iframe.setAttribute('mozallowfullscreen','');
    iframe.setAttribute('allow','fullscreen; autoplay; encrypted-media; picture-in-picture; geolocation; microphone; camera');
    // include allow-same-origin & allow-scripts to increase chance embeds run (but may be restricted by server)
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-modals');

    iframe.src = 'about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    vkModal.appendChild(sheet);
    document.body.appendChild(vkModal);

    // events: close should also show toast same as MP4/HLS
    closeBtn.addEventListener('click', ()=>{ hideVkModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} });
    vkModal.addEventListener('click', (e)=>{ if(e.target === vkModal){ hideVkModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} } });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && vkModal.style.display==='flex'){ hideVkModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} } });

    // header FS wiring if present
    if(fsBtn){
      fsBtn.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        try{
          if(iframe.requestFullscreen) await iframe.requestFullscreen();
          else if(iframe.webkitRequestFullscreen) await iframe.webkitRequestFullscreen();
          else if(iframe.mozRequestFullScreen) await iframe.mozRequestFullScreen();
          else if(wrap.requestFullscreen) await wrap.requestFullscreen();
        }catch(err){
          // fallback: open currently set src externally
          const src = iframe.src || '';
          if(src && src !== 'about:blank') window.open(src, '_blank', 'noopener');
        }
      });
    }

    return vkModal;
  }

  function showVkModal(embedUrl, originalUrl, titleText, subtitleText){
    const m = createVkModal();
    const iframe = m.querySelector('.vkmodal-iframe');
    const titleEl = m.querySelector('.vkmodal-title');
    const subEl = m.querySelector('.vkmodal-sub');

    if(titleText && titleEl) titleEl.textContent = titleText;
    if(subtitleText && subEl){ subEl.textContent = subtitleText; subEl.style.display = 'block'; }
    else if(subEl){ subEl.textContent = ''; subEl.style.display = 'none'; }

    try{
      iframe.removeAttribute('srcdoc');
      iframe.src = embedUrl;
    }catch(e){
      // if assignment throws for some reason, fallback open original in new tab
      window.open(originalUrl, '_blank', 'noopener');
      return;
    }

    try{ if(typeof lockBodyScroll === 'function') lockBodyScroll(); else { document.documentElement.style.overflow='hidden'; } }catch(e){}
    m.style.display = 'flex';

    // toast same text as MP4/HLS player
    try{ if(typeof showToast === 'function') showToast(`${titleText} başladılır!`, 1000); }catch(e){}
  }

  function hideVkModal(){
    // === URL TƏMİZLƏMƏ ===
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);
    // === SON ===
    const m = createVkModal();
    const iframe = m.querySelector('.vkmodal-iframe');
    try{ iframe.src = 'about:blank'; }catch(e){}
    m.style.display = 'none';
    try{ if(typeof unlockBodyScroll === 'function') unlockBodyScroll(); else { document.documentElement.style.overflow=''; } }catch(e){}
    try{
      if(document.fullscreenElement){ if(document.exitFullscreen) document.exitFullscreen(); }
      else if(document.webkitFullscreenElement){ if(document.webkitExitFullscreen) document.webkitExitFullscreen(); }
    }catch(e){}
  }

  // When openPlayer exists, wrap it
  whenOpenPlayerReady(function(){
    const original = (typeof window.openPlayer === 'function') ? window.openPlayer.bind(window) : null;

    window.openPlayer = function(movie){
      try{
        const src = (movie && (movie.src || movie.url)) ? (movie.src || movie.url) : String(movie||'');
        // quick host detection for vk variants
        const isVkHost = /vk\.com|vkvideo\.ru/i.test(src);

        if(!isVkHost){
          if(original) return original(movie);
          return;
        }

        // try extract token
        const t = extractVkToken(src);
        let subtitle = '';
        if(movie && (movie.year || movie.genre)){
          const parts = [];
          if(movie.year) parts.push(String(movie.year));
          if(movie.genre) parts.push(String(movie.genre));
          if(parts.length) subtitle = parts.join(' · ');
        }

        if(t && t.owner && t.id){
          const candidates = buildVkEmbeds(t.owner, t.id);
          // try candidates in order — use the first candidate as iframe src
          // (we can't reliably detect cross-origin frame rejection from JS, so we set the first and hope)
          const embedUrl = candidates[0];
          showVkModal(embedUrl, src, movie && movie.title ? movie.title : 'VK video', subtitle);
          return;
        } else {
          // fallback: try embedding original URL
          showVkModal(src, src, movie && movie.title ? movie.title : 'VK video', subtitle);
          return;
        }
      }catch(err){
        if(original) return original(movie);
        try{ window.open((movie && movie.src) || movie || '', '_blank'); }catch(e){}
      }
    };
  });

})();

  /* Mail.ru (my.mail.ru) video handler — wrapper for openPlayer
   Add this script to the end of your page WITHOUT editing existing code. */
(function(){
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id = setInterval(()=>{
      if(typeof window.openPlayer === 'function' || ++tries > 40){ clearInterval(id); cb(); }
    }, 100);
  }

  // Try extract mail.ru token from urls like:
  // https://my.mail.ru/mail/cloud064/video/_myvideo/3268.html
  // https://my.mail.ru/video/3268 or https://video.mail.ru/mail/cloud064/3268.html
  function extractMailToken(url){
    try{
      const u = String(url || '');
      if(!/mail\.ru|my\.mail\.ru/i.test(u)) return null;
      // pattern: /mail/{owner}/video/_myvideo/{id}.html
      let m = u.match(/\/mail\/([^\/]+)\/video\/(?:_myvideo\/)?(\d+)\.html/i);
      if(m && m[1] && m[2]) return { owner: m[1], id: m[2] };
      // alternative: /video/{id}.html or /video/{id}
      m = u.match(/\/video\/(\d+)(?:\.html)?/i);
      if(m && m[1]) return { owner: null, id: m[1] };
      // another form: /mail/{owner}/{id}.html
      m = u.match(/\/mail\/([^\/]+)\/(\d+)\.html/i);
      if(m && m[1] && m[2]) return { owner: m[1], id: m[2] };
      return null;
    }catch(e){ return null; }
  }

  // Build possible embed candidates for mail.ru given owner & id
  function buildMailEmbeds(owner, id){
    const c = [];
    // mail.ru historically uses player embeds like:
    // https://my.mail.ru/video/embed/{id}  (try)
    c.push(`https://my.mail.ru/video/embed/${encodeURIComponent(id)}`);
    // or with owner path
    if(owner) c.push(`https://my.mail.ru/mail/${encodeURIComponent(owner)}/video/_myvideo/${encodeURIComponent(id)}?embed=1`);
    if(owner) c.push(`https://my.mail.ru/mail/${encodeURIComponent(owner)}/video/${encodeURIComponent(id)}?embed=1`);
    // generic direct page (may allow iframe sometimes)
    c.push(`https://my.mail.ru/mail/${owner ? encodeURIComponent(owner)+'/' : ''}video/_myvideo/${encodeURIComponent(id)}.html`);
    c.push(`https://video.mail.ru/mail/${owner ? encodeURIComponent(owner) + '/' : ''}${encodeURIComponent(id)}.html`);
    return c;
  }

  // Create modal only once
  let mailModal = null;
  const showHeaderFSForMail = false; // keep header fullscreen hidden to avoid duplicate icon

  function createMailModal(){
    if(mailModal) return mailModal;

    const css = `
      .mailmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg, rgba(2,6,23,0.8), rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .mailmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .mailmodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .mailmodal-left{display:flex;align-items:center;gap:8px}
      .mailmodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .mailmodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .mailmodal-close,.mailmodal-fs{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .mailmodal-close:hover,.mailmodal-fs:hover{background:rgba(255,255,255,0.02)}
      .mailmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .mailmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .mailmodal-iframe-wrap{height:48vh} .mailmodal-title{text-align:center;font-size:14px} .mailmodal-sub{font-size:12px} .mailmodal-sheet{width:100%}
      }
      @media (min-width:768px){ .mailmodal-overlay {transform: translateX(-6px);}
      }
    `;
    const st = document.createElement('style'); st.appendChild(document.createTextNode(css)); document.head.appendChild(st);

    mailModal = document.createElement('div');
    mailModal.className = 'mailmodal-overlay';
    mailModal.style.display = 'none';

    const sheet = document.createElement('div'); sheet.className = 'mailmodal-sheet'; sheet.setAttribute('role','dialog'); sheet.setAttribute('aria-modal','true');

    const top = document.createElement('div'); top.className = 'mailmodal-top';
    const left = document.createElement('div'); left.className = 'mailmodal-left';
    const closeBtn = document.createElement('button'); closeBtn.className = 'mailmodal-close'; closeBtn.setAttribute('aria-label','Bağla'); closeBtn.innerHTML = '✕';
    left.appendChild(closeBtn);

    let fsBtn = null;
    if(showHeaderFSForMail){
      fsBtn = document.createElement('button'); fsBtn.className = 'mailmodal-fs'; fsBtn.setAttribute('aria-label','Tam ekran'); fsBtn.title='Tam ekran';
      fsBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path d="M7 14H5v4h4v-2H7v-2zM17 10h2V6h-4v2h2v2zM7 6h4V4H5v4h2V6zM17 18v-4h2v4h-4v-2h2v-2z" fill="currentColor"/></svg>';
      left.appendChild(fsBtn);
    }

    const center = document.createElement('div'); center.style.flex = '1'; center.style.display = 'flex'; center.style.flexDirection = 'column'; center.style.alignItems = 'center'; center.style.justifyContent = 'center';
    const title = document.createElement('div'); title.className = 'mailmodal-title'; title.textContent = 'Mail.ru video';
    const sub = document.createElement('div'); sub.className = 'mailmodal-sub'; sub.textContent = '';
    center.appendChild(title); center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);
    // DƏYİŞİKLİK: Paylaşma düyməsi
    const rightControls = document.createElement('div');
    rightControls.className = 'player-right-controls';
    rightControls.innerHTML = `
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" role="img">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);
    // DƏYİŞİKLİK SONU
    
    const wrap = document.createElement('div'); wrap.className = 'mailmodal-iframe-wrap';
    const iframe = document.createElement('iframe'); iframe.className = 'mailmodal-iframe';

    // fullscreen permissions and sandbox
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('webkitallowfullscreen','');
    iframe.setAttribute('mozallowfullscreen','');
    iframe.setAttribute('allow','fullscreen; autoplay; encrypted-media; picture-in-picture; geolocation; microphone; camera');
    iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-modals');

    iframe.src = 'about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    mailModal.appendChild(sheet);
    document.body.appendChild(mailModal);

    // events: close should show toast same as MP4/HLS
    closeBtn.addEventListener('click', ()=>{ hideMailModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} });
    mailModal.addEventListener('click', (e)=>{ if(e.target === mailModal){ hideMailModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} } });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && mailModal.style.display==='flex'){ hideMailModal(); try{ if(typeof showToast==='function') showToast('Film dayandırıldı!',900); }catch(e){} } });

    if(fsBtn){
      fsBtn.addEventListener('click', async (ev)=>{
        ev.preventDefault();
        try{
          if(iframe.requestFullscreen) await iframe.requestFullscreen();
          else if(iframe.webkitRequestFullscreen) await iframe.webkitRequestFullscreen();
          else if(iframe.mozRequestFullScreen) await iframe.mozRequestFullScreen();
          else if(wrap.requestFullscreen) await wrap.requestFullscreen();
        }catch(err){
          const src = iframe.src || '';
          if(src && src !== 'about:blank') window.open(src, '_blank', 'noopener');
        }
      });
    }

    return mailModal;
  }

  function showMailModal(embedUrl, originalUrl, titleText, subtitleText){
    const m = createMailModal();
    const iframe = m.querySelector('.mailmodal-iframe');
    const titleEl = m.querySelector('.mailmodal-title');
    const subEl = m.querySelector('.mailmodal-sub');

    if(titleText && titleEl) titleEl.textContent = titleText;
    if(subtitleText && subEl){ subEl.textContent = subtitleText; subEl.style.display = 'block'; }
    else if(subEl){ subEl.textContent = ''; subEl.style.display = 'none'; }

    try{
      iframe.removeAttribute('srcdoc');
      iframe.src = embedUrl;
    }catch(e){
      window.open(originalUrl, '_blank', 'noopener');
      return;
    }

    try{ if(typeof lockBodyScroll === 'function') lockBodyScroll(); else { document.documentElement.style.overflow='hidden'; } }catch(e){}
    m.style.display = 'flex';

    // toast same as MP4/HLS
    try{ if(typeof showToast === 'function') showToast(`${titleText} başladılır!`, 1000); }catch(e){}
  }

  function hideMailModal(){
    // === URL TƏMİZLƏMƏ ===
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);
    // === SON ===
    const m = createMailModal();
    const iframe = m.querySelector('.mailmodal-iframe');
    try{ iframe.src = 'about:blank'; }catch(e){}
    m.style.display = 'none';
    try{ if(typeof unlockBodyScroll === 'function') unlockBodyScroll(); else { document.documentElement.style.overflow=''; } }catch(e){}
    try{
      if(document.fullscreenElement){ if(document.exitFullscreen) document.exitFullscreen(); }
      else if(document.webkitFullscreenElement){ if(document.webkitExitFullscreen) document.webkitExitFullscreen(); }
    }catch(e){}
  }

  // wrap openPlayer when ready
  whenOpenPlayerReady(function(){
    const original = (typeof window.openPlayer === 'function') ? window.openPlayer.bind(window) : null;

    window.openPlayer = function(movie){
      try{
        const src = (movie && (movie.src || movie.url)) ? (movie.src || movie.url) : String(movie||'');
        const mailHost = /my\.mail\.ru|video\.mail\.ru|mail\.ru/i.test(src);
        if(!mailHost){
          if(original) return original(movie);
          return;
        }

        const t = extractMailToken(src);
        let subtitle = '';
        if(movie && (movie.year || movie.genre)){
          const parts = [];
          if(movie.year) parts.push(String(movie.year));
          if(movie.genre) parts.push(String(movie.genre));
          if(parts.length) subtitle = parts.join(' · ');
        }

        if(t && t.id){
          const candidates = buildMailEmbeds(t.owner, t.id);
          // pick first candidate; embedding may be blocked by server headers but we try
          const embedUrl = candidates[0];
          showMailModal(embedUrl, src, movie && movie.title ? movie.title : 'Mail.ru video', subtitle);
          return;
        } else {
          // fallback: try embedding original URL
          showMailModal(src, src, movie && movie.title ? movie.title : 'Mail.ru video', subtitle);
          return;
        }
      }catch(err){
        if(original) return original(movie);
        try{ window.open((movie && movie.src) || movie || '', '_blank'); }catch(e){}
      }
    };
  });

})();
  

  /* DZEN.RU video handler */
  
    (function(){
  // Wait until original openPlayer exists
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id=setInterval(()=>{ if(typeof window.openPlayer==='function'||++tries>40){clearInterval(id);cb();}},100);
  }

  // Extract Dzen video ID from watch link
  function extractDzenId(url){
    try{
      const u=String(url||'');
      if(!/dzen\.ru/i.test(u)) return null;
      // match watch/<id> or /video/watch/<id>
      const m=u.match(/(?:watch\/)([a-zA-Z0-9\-_]+)/i);
      return m && m[1] ? m[1] : null;
    }catch(e){ return null; }
  }

  // Build embed URL
  function buildDzenEmbed(id){
    return `https://dzen.ru/embed/${encodeURIComponent(id)}?from_block=partner&from=zen&mute=0&autoplay=0&tv=0`;
  }

  // Create modal
  let dzenModal=null;
  function createDzenModal(){
    if(dzenModal) return dzenModal;
    const css=`
      .dzenmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(2,6,23,0.8),rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .dzenmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .dzenmodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .dzenmodal-left{display:flex;align-items:center;gap:8px}
      .dzenmodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .dzenmodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .dzenmodal-close{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .dzenmodal-close:hover{background:rgba(255,255,255,0.02)}
      .dzenmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .dzenmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .dzenmodal-iframe-wrap{height:48vh} .dzenmodal-title{font-size:14px} .dzenmodal-sub{font-size:12px} .dzenmodal-sheet{width:100%}
      }
      @media (min-width:768px){ .dzenmodal-overlay {transform: translateX(-6px);}
      }
    `;
    const st=document.createElement('style');
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);

    dzenModal=document.createElement('div');
    dzenModal.className='dzenmodal-overlay';
    dzenModal.style.display='none';

    const sheet=document.createElement('div');
    sheet.className='dzenmodal-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');

    const top=document.createElement('div');
    top.className='dzenmodal-top';
    const left=document.createElement('div');
    left.className='dzenmodal-left';
    const closeBtn=document.createElement('button');
    closeBtn.className='dzenmodal-close';
    closeBtn.setAttribute('aria-label','Bağla');
    closeBtn.innerHTML='✕';
    left.appendChild(closeBtn);

    const center=document.createElement('div');
    center.style.flex='1';
    center.style.display='flex';
    center.style.flexDirection='column';
    center.style.alignItems='center';
    center.style.justifyContent='center';
    const title=document.createElement('div');
    title.className='dzenmodal-title';
    title.textContent='Dzen video';
    const sub=document.createElement('div');
    sub.className='dzenmodal-sub';
    sub.textContent='';
    center.appendChild(title);
    center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);
    // DƏYİŞİKLİK: Paylaşma düyməsi
    const rightControls = document.createElement('div');
    rightControls.className = 'player-right-controls';
    rightControls.innerHTML = `
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" role="img">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);
    // DƏYİŞİKLİK SONU

    const wrap=document.createElement('div');
    wrap.className='dzenmodal-iframe-wrap';
    const iframe=document.createElement('iframe');
    iframe.className='dzenmodal-iframe';
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('allow','autoplay; fullscreen; accelerometer; gyroscope; picture-in-picture; encrypted-media');
    iframe.src='about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    dzenModal.appendChild(sheet);
    document.body.appendChild(dzenModal);

    closeBtn.addEventListener('click',()=>{hideDzenModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}});
    dzenModal.addEventListener('click',(e)=>{if(e.target===dzenModal){hideDzenModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}}});
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&dzenModal.style.display==='flex'){hideDzenModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}}});

    return dzenModal;
  }

  function showDzenModal(embedUrl, originalUrl, titleText, subtitleText){
    const m=createDzenModal();
    const iframe=m.querySelector('.dzenmodal-iframe');
    const titleEl=m.querySelector('.dzenmodal-title');
    const subEl=m.querySelector('.dzenmodal-sub');

    if(titleText&&titleEl)titleEl.textContent=titleText;
    if(subtitleText&&subEl){subEl.textContent=subtitleText;subEl.style.display='block';}
    else if(subEl){subEl.textContent='';subEl.style.display='none';}

    iframe.src=embedUrl;

    try{if(typeof lockBodyScroll==='function')lockBodyScroll();else{document.documentElement.style.overflow='hidden';}}catch(e){}
    m.style.display='flex';
    try{if(typeof showToast==='function')showToast(`${titleText} başladılır!`,1000);}catch(e){}
  }

  function hideDzenModal(){
    // === URL TƏMİZLƏMƏ ===
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);
    // === SON ===
    const m=createDzenModal();
    const iframe=m.querySelector('.dzenmodal-iframe');
    iframe.src='about:blank';
    m.style.display='none';
    try{if(typeof unlockBodyScroll==='function')unlockBodyScroll();else{document.documentElement.style.overflow='';}}catch(e){}
  }

  // Hook into openPlayer
  whenOpenPlayerReady(function(){
    const original=typeof window.openPlayer==='function'?window.openPlayer.bind(window):null;
    window.openPlayer=function(movie){
      try{
        const src=(movie&&(movie.src||movie.url))?(movie.src||movie.url):String(movie||'');
        if(!/dzen\.ru/i.test(src)){if(original)return original(movie);return;}
        const id=extractDzenId(src);
        const embed=id?buildDzenEmbed(id):src;
        let subtitle='';
        if(movie&&(movie.year||movie.genre)){
          const parts=[];
          if(movie.year)parts.push(String(movie.year));
          if(movie.genre)parts.push(String(movie.genre));
          if(parts.length)subtitle=parts.join(' · ');
        }
        showDzenModal(embed,src,movie&&movie.title?movie.title:'Dzen video',subtitle);
      }catch(err){
        if(original)return original(movie);
        try{window.open((movie&&movie.src)||movie||'','_blank');}catch(e){}
      }
    };
  });
})();


  /* DAILYMOTION video handler */

(function(){
  // Wait until original openPlayer exists
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id=setInterval(()=>{
      if(typeof window.openPlayer==='function' || ++tries>40){
        clearInterval(id); cb();
      }
    },100);
  }

  // Extract Dailymotion ID
  function extractDmId(url){
    try{
      const u=String(url||'');
      if(!/dailymotion\.com|dai\.ly/i.test(u)) return null;
      let m=u.match(/video\/([a-zA-Z0-9]+)/i);
      if(m && m[1]) return m[1];
      m=u.match(/dai\.ly\/([a-zA-Z0-9]+)/i);
      return m && m[1] ? m[1] : null;
    }catch(e){ return null; }
  }

  function buildDmEmbed(id){
    return `https://geo.dailymotion.com/player.html?video=${encodeURIComponent(id)}`;
  }

  // Create modal
  let dmModal=null;
  function createDmModal(){
    if(dmModal) return dmModal;

    const css=`
      .dmmodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
        background:linear-gradient(180deg,rgba(2,6,23,0.8),rgba(2,6,23,0.95));
        z-index:9999;padding:20px}
      .dmmodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;
        background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);
        display:flex;flex-direction:column}
      .dmmodal-top{display:flex;align-items:center;justify-content:space-between;
        padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .dmmodal-left{display:flex;align-items:center;gap:8px}
      .dmmodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .dmmodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .dmmodal-close{background:transparent;border:0;color:var(--text,#e6eef6);
        font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .dmmodal-close:hover{background:rgba(255,255,255,0.02)}
      .dmmodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .dmmodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){
        .dmmodal-iframe-wrap{height:48vh}
        .dmmodal-title{font-size:14px}
        .dmmodal-sub{font-size:12px}
        .dmmodal-sheet{width:100%}
      }
      @media (min-width:768px){
        .dmmodal-overlay{transform:translateX(-6px);}
      }
    `;
    const st=document.createElement('style');
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);

    dmModal=document.createElement('div');
    dmModal.className='dmmodal-overlay';
    dmModal.style.display='none';

    const sheet=document.createElement('div');
    sheet.className='dmmodal-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');

    const top=document.createElement('div');
    top.className='dmmodal-top';

    const left=document.createElement('div');
    left.className='dmmodal-left';
    const closeBtn=document.createElement('button');
    closeBtn.className='dmmodal-close';
    closeBtn.setAttribute('aria-label','Bağla');
    closeBtn.innerHTML='✕';
    left.appendChild(closeBtn);

    const center=document.createElement('div');
    center.style.flex='1';
    center.style.display='flex';
    center.style.flexDirection='column';
    center.style.alignItems='center';
    center.style.justifyContent='center';
    const title=document.createElement('div');
    title.className='dmmodal-title';
    title.textContent='Dailymotion video';
    const sub=document.createElement('div');
    sub.className='dmmodal-sub';
    center.appendChild(title);
    center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);

    /* Paylaşma düyməsi */
    const rightControls=document.createElement('div');
    rightControls.className='player-right-controls';
    rightControls.innerHTML=`
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);

    const wrap=document.createElement('div');
    wrap.className='dmmodal-iframe-wrap';
    const iframe=document.createElement('iframe');
    iframe.className='dmmodal-iframe';
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('allow','autoplay; fullscreen; picture-in-picture; encrypted-media');
    iframe.src='about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    dmModal.appendChild(sheet);
    document.body.appendChild(dmModal);

    closeBtn.addEventListener('click',()=>{hideDmModal();toastStop();});
    dmModal.addEventListener('click',(e)=>{if(e.target===dmModal){hideDmModal();toastStop();}});
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&dmModal.style.display==='flex'){hideDmModal();toastStop();}});

    return dmModal;
  }

  function showDmModal(embedUrl, originalUrl, titleText, subtitleText){
    const m=createDmModal();
    const iframe=m.querySelector('.dmmodal-iframe');
    const titleEl=m.querySelector('.dmmodal-title');
    const subEl=m.querySelector('.dmmodal-sub');

    if(titleText) titleEl.textContent=titleText;
    if(subtitleText){ subEl.textContent=subtitleText; subEl.style.display='block'; }
    else{ subEl.textContent=''; subEl.style.display='none'; }

    iframe.src=embedUrl;
    try{ lockBodyScroll(); }catch(e){ document.documentElement.style.overflow='hidden'; }
    m.style.display='flex';
    try{ showToast(`${titleText} başladılır!`,1000); }catch(e){}
  }

  function hideDmModal(){
    // URL TƏMİZLƏMƏ
    window.history.pushState({ movieId:null }, document.title, window.location.pathname);
    const m=createDmModal();
    m.querySelector('.dmmodal-iframe').src='about:blank';
    m.style.display='none';
    try{ unlockBodyScroll(); }catch(e){ document.documentElement.style.overflow=''; }
  }

  function toastStop(){
    try{ showToast('Film dayandırıldı!',900); }catch(e){}
  }

  // Hook openPlayer
  whenOpenPlayerReady(function(){
    const original=window.openPlayer.bind(window);
    window.openPlayer=function(movie){
      try{
        const src=(movie&&(movie.src||movie.url))?(movie.src||movie.url):'';
        if(!/dailymotion\.com|dai\.ly/i.test(src)) return original(movie);

        const id=extractDmId(src);
        const embed=id?buildDmEmbed(id):src;
        let subtitle='';
        if(movie&&(movie.year||movie.genre)){
          subtitle=[movie.year,movie.genre].filter(Boolean).join(' · ');
        }
        showDmModal(embed,src,movie?.title||'Dailymotion video',subtitle);
      }catch(e){
        return original(movie);
      }
    };
  });

})();
  /* ===========================
   Google Drive video handler
   =========================== */
(function(){
  function whenOpenPlayerReady(cb){
    if(typeof window.openPlayer === 'function'){ cb(); return; }
    let tries=0;
    const id=setInterval(()=>{ if(typeof window.openPlayer==='function'||++tries>40){clearInterval(id);cb();}},100);
  }

  function extractDriveId(url){
    try{
      const u=String(url||'');
      if(!/drive\.google\.com/i.test(u)) return null;
      const m=u.match(/\/file\/d\/([a-zA-Z0-9\-_]+)(?:\/preview)?/i);
      return m && m[1] ? m[1] : null;
    }catch(e){ return null; }
  }

  function buildDriveEmbed(id){
    return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
  }

  let driveModal=null;
  // let movieEndTimer = null; // <-- TAYMER SİLİNDİ
  
  function createDriveModal(){
    if(driveModal) return driveModal;
    const css=`
      .drivemodal-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(2,6,23,0.8),rgba(2,6,23,0.95));z-index:9999;padding:20px}
      .drivemodal-sheet{width:52%;max-width:1100px;border-radius:12px;overflow:hidden;background:var(--surface,#0f1720);box-shadow:0 20px 60px rgba(2,6,23,0.7);display:flex;flex-direction:column}
      .drivemodal-top{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.03)}
      .drivemodal-left{display:flex;align-items:center;gap:8px}
      .drivemodal-title{font-weight:700;color:var(--text,#e6eef6);flex:1;text-align:center;line-height:1.05}
      .drivemodal-sub{font-size:13px;color:var(--muted,#94a3b8);text-align:center;margin-top:4px}
      .drivemodal-close{background:transparent;border:0;color:var(--text,#e6eef6);font-size:18px;cursor:pointer;padding:6px 10px;border-radius:8px}
      .drivemodal-close:hover{background:rgba(255,255,255,0.02)}
      .drivemodal-iframe-wrap{width:100%;height:60vh;min-height:320px;background:#000}
      .drivemodal-iframe{width:100%;height:100%;border:0}
      @media (max-width:520px){ .drivemodal-iframe-wrap{height:48vh} .drivemodal-title{font-size:14px} .drivemodal-sub{font-size:12px} .drivemodal-sheet{width:100%}
      }
      @media (min-width:768px){ .drivemodal-overlay {transform: translateX(-6px);}
      }
    `;
    const st=document.createElement('style');
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);

    driveModal=document.createElement('div');
    driveModal.className='drivemodal-overlay';
    driveModal.style.display='none';

    const sheet=document.createElement('div');
    sheet.className='drivemodal-sheet';
    sheet.setAttribute('role','dialog');
    sheet.setAttribute('aria-modal','true');

    const top=document.createElement('div');
    top.className='drivemodal-top';
    const left=document.createElement('div');
    left.className='drivemodal-left';
    const closeBtn=document.createElement('button');
    closeBtn.className='drivemodal-close';
    closeBtn.setAttribute('aria-label','Bağla');
    closeBtn.innerHTML='✕';
    left.appendChild(closeBtn);

    const center=document.createElement('div');
    center.style.flex='1';
    center.style.display='flex';
    center.style.flexDirection='column';
    center.style.alignItems='center';
    center.style.justifyContent='center';
    const title=document.createElement('div');
    title.className='drivemodal-title';
    title.textContent='Google Drive Video';
    const sub=document.createElement('div');
    sub.className='drivemodal-sub';
    sub.textContent='';
    center.appendChild(title);
    center.appendChild(sub);

    top.appendChild(left);
    top.appendChild(center);
    const rightSpacer=document.createElement('div');
    // DƏYİŞİKLİK: Paylaşma düyməsi
    const rightControls = document.createElement('div');
    rightControls.className = 'player-right-controls';
    rightControls.innerHTML = `
      <button class="share-btn" title="Paylaş" aria-label="Paylaş" onclick="sharePlayer()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" role="img">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      </button>
    `;
    top.appendChild(rightControls);
    // DƏYİŞİKLİK SONU

    const wrap=document.createElement('div');
    wrap.className='drivemodal-iframe-wrap';
    const iframe=document.createElement('iframe');
    iframe.className='drivemodal-iframe';
    iframe.setAttribute('allowfullscreen','');
    iframe.setAttribute('allow','autoplay; fullscreen'); 
    iframe.src='about:blank';
    wrap.appendChild(iframe);

    sheet.appendChild(top);
    sheet.appendChild(wrap);
    driveModal.appendChild(sheet);
    document.body.appendChild(driveModal);

    // Bağlama (Close) hadisələri
    closeBtn.addEventListener('click',()=>{hideDriveModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}});
    driveModal.addEventListener('click',(e)=>{if(e.target===driveModal){hideDriveModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}}});
    document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&driveModal.style.display==='flex'){hideDriveModal();try{if(typeof showToast==='function')showToast('Film dayandırıldı!',900);}catch(e){}}});

    return driveModal;
  }

  // Modalı göstərən funksiya
  function showDriveModal(embedUrl, originalUrl, movie){
    const m=createDriveModal();
    const iframe=m.querySelector('.drivemodal-iframe');
    const titleEl=m.querySelector('.drivemodal-title');
    const subEl=m.querySelector('.drivemodal-sub');

    const titleText = movie && movie.title ? movie.title : 'Google Drive Video';
    const subtitleText = (movie.year || movie.genre) ? `${movie.year || ''} · ${movie.genre || ''}` : '';

    if(titleText&&titleEl)titleEl.textContent=titleText;
    if(subtitleText&&subEl){subEl.textContent=subtitleText;subEl.style.display='block';}
    else if(subEl){subEl.textContent='';subEl.style.display='none';}

    iframe.src=embedUrl;

    try{if(typeof lockBodyScroll==='function')lockBodyScroll();else{document.documentElement.style.overflow='hidden';}}catch(e){}
    m.style.display='flex';
    try{if(typeof showToast==='function')showToast(`${titleText} başladılır!`,1000);}catch(e){}

  }

  // Modalı gizlədən funksiya
  function hideDriveModal(){
    // === URL TƏMİZLƏMƏ ===
    window.history.pushState({ movieId: null }, document.title, window.location.pathname);
    // === SON ===

    const m=createDriveModal();
    const iframe=m.querySelector('.drivemodal-iframe');
    iframe.src='about:blank';
    m.style.display='none';
    try{if(typeof unlockBodyScroll==='function')unlockBodyScroll();else{document.documentElement.style.overflow='';}}catch(e){}
  }

  // Əsas openPlayer funksiyasını ələ keçir (Hook into openPlayer)
  whenOpenPlayerReady(function(){
    const original=typeof window.openPlayer==='function'?window.openPlayer.bind(window):null;
    
    window.openPlayer=function(movie){
      // (Universal hook bu işi görəcək)

      try{
        const src=(movie&&(movie.src||movie.url))?(movie.src||movie.url):String(movie||'');
        
        // Əgər Google Drive linkidirsə, bu handler işləsin
        if(/drive\.google\.com/i.test(src)){
          const id=extractDriveId(src);
          if (id) {
             const embed=buildDriveEmbed(id);
             showDriveModal(embed,src,movie); // movie obyektini tam ötürürük
             return;
          }
        }
        
        // Google Drive deyilsə, zəncir üzrə əvvəlki handler-i (Dzen, OK.RU və s.) çağır
        if(original) return original(movie);
        
      }catch(err){
        if(original) return original(movie);
        try{window.open((movie&&movie.src)||movie||'','_blank');}catch(e){}
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
    '.okmodal-title',     // 2. OK.ru pəncərəsi
    '.vkmodal-title',     // 3. VK pəncərəsi
    '.mailmodal-title',   // 4. Mail.ru pəncərəsi
    '.dzenmodal-title',   // 5. Dzen pəncərəsi
    '.drivemodal-title',  // 6. Google Drive pəncərəsi
    '.dmmodal-title'      // 7. DM pəncərəsi
    // Gələcəkdə yeni pəncərə əlavə etsəniz, onun başlıq class-ını bura əlavə edin
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

  /* ============================================================
   VİDMODY SMART HANDLER (Hybrid Method)
   Desktop: Modal (Səliqəli)
   Mobile:  Direct Native Player (100% İşlək)
   ============================================================ */

(function() {
    // 1. CSS-İ BİRBAŞA SAYTA ƏLAVƏ EDİRİK (Sənin dizaynın + Mobil Fix)
    const style = document.createElement('style');
    // ... (kodun əvvəli eyni qalır)

    style.innerHTML = `
        /* Digər stillər eyni qalır... */
        .vm-overlay {
            position: fixed !important; inset: 0 !important; display: none;
            align-items: center; justify-content: center;
            background: linear-gradient(180deg, rgba(2,6,23,0.85), rgba(2,6,23,0.98)) !important;
            z-index: 9999999 !important; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .vm-sheet {
            width: 52%; max-width: 1100px; border-radius: 12px; overflow: hidden;
            background: #0f172a !important; display: flex; flex-direction: column;
            border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .vm-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 10px 16px; background: #0f172a; border-bottom: 1px solid rgba(255, 255, 255, 0.03); gap: 12px;
        }
        .vm-title-group {
            flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; overflow: hidden;
        }
        .vm-title { font-weight: 700; font-size: 16px; color: #fff; margin: 0; white-space: nowrap; text-overflow: ellipsis; }
        #vmSub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .vm-close-btn {
            background: transparent; border: none; color: #fff; font-size: 24px;
            cursor: pointer; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
        }

        /* SHARE BUTONU YENİLƏNMİŞ HİSSƏ */
        .vm-share-box button {
            width: 44px; height: 44px; border-radius: 12px; 
            background: transparent !important; /* Arxa fon şəffaf */
            border: 1px solid transparent !important; /* Xətt normalda yoxdur */
            color: #fff; cursor: pointer;
            transition: all 0.2s ease;
            display: flex; align-items: center; justify-content: center;
        }
        .vm-share-box button:hover {
            border-color: var(--accent, #3b82f6) !important; /* Hover-də görünən rəng (mavi/yaşıl) */
            box-shadow: 0 0 0 1px var(--accent, #3b82f6); /* Daha kəskin görünməsi üçün */
        }
        
        .vm-body { width: 100%; position: relative; background: #000; padding-bottom: 56.25%; height: 0; }
        .vm-iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        
        @media (max-width: 768px) {
            .vm-sheet { width: 100% !important; height: 100% !important; border-radius: 0; justify-content: center; }
            .vm-body { padding-bottom: 75%; }
        }
    `;

// ... (Stil kodlarının sonu)
    document.head.appendChild(style);

    // 2. MODAL ELEMENTİNİ YARADIRIQ
    const modal = document.createElement('div');
    modal.className = 'vm-overlay';
    modal.innerHTML = `
        <div class="vm-sheet">
            <div class="vm-header">
                <button class="vm-close-btn" id="vmClose">✕</button>
                <div class="vm-title-group">
                    <div class="vm-title" id="vmTitle">Yüklənir...</div>
                    <div id="vmSub"></div>
                </div>
                <div class="vm-share-box"><button id="vmShare">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button></div>
            </div>
            <div class="vm-body"><iframe class="vm-iframe" id="vmIframe" allowfullscreen allow="autoplay; fullscreen"></iframe></div>
        </div>
    `;
    document.body.appendChild(modal);

    // 3. FUNKSİYALAR
    const closeVid = () => {
        modal.style.display = 'none';
        modal.querySelector('#vmIframe').src = '';
    };

    modal.querySelector('#vmClose').onclick = closeVid;
    modal.onclick = (e) => { if(e.target === modal) closeVid(); };
    modal.querySelector('#vmShare').onclick = () => { if(window.sharePlayer) window.sharePlayer(); };

    window.openVidmody = function(movie, src) {
        modal.querySelector('#vmTitle').textContent = movie.title || "Video";
        modal.querySelector('#vmSub').textContent = movie.year || "";
        
        modal.style.display = 'flex';
        // Mobildə səs-görüntü sinxronu üçün kiçik gecikmə
        setTimeout(() => {
            modal.querySelector('#vmIframe').src = src;
        }, 100);
    };

    // 4. OPENPLAYER-İ TUTMAQ
    const hook = setInterval(() => {
        if (typeof window.openPlayer === 'function') {
            const original = window.openPlayer;
            window.openPlayer = function(movie) {
                const url = (movie && (movie.src || movie.url)) ? (movie.src || movie.url) : String(movie || '');
                if (url.includes('vidmody.com')) {
                    window.openVidmody(movie, url);
                    return;
                }
                return original(movie);
            };
            clearInterval(hook);
        }
    }, 100);
})();
