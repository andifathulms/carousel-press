import couples from './editorial-couples-id.txt?raw';
import masaKecil from './editorial-masa-kecil-id.txt?raw';
import ldr from './editorial-ldr-id.txt?raw';
import sebelumMenikah from './editorial-sebelum-menikah-id.txt?raw';
import git from './dev-git-id.txt?raw';
import linux from './dev-linux-id.txt?raw';
import sql from './dev-sql-id.txt?raw';
import vscode from './dev-vscode-id.txt?raw';
import sahabat from './editorial-sahabat-id.txt?raw';
import orangTua from './editorial-orang-tua-id.txt?raw';
import refleksiDiri from './editorial-refleksi-diri-id.txt?raw';
import pilihSatu from './editorial-pilih-satu-id.txt?raw';
import soalUang from './editorial-soal-uang-id.txt?raw';
import api from './dev-api-id.txt?raw';
import aiCoding from './dev-ai-coding-id.txt?raw';
import consoleTricks from './dev-console-id.txt?raw';
import asyncAwait from './dev-async-await-id.txt?raw';
import gitUndo from './dev-git-undo-id.txt?raw';
import kutai from './sejarah-kutai-id.txt?raw';
import yupa from './sejarah-yupa-id.txt?raw';
import syarifKasim from './sejarah-syarif-kasim-id.txt?raw';
import baabullah from './sejarah-baabullah-id.txt?raw';
import bongaya from './sejarah-bongaya-id.txt?raw';
import offside from './sports-offside-id.txt?raw';
import handball from './sports-handball-id.txt?raw';
import tennisScoring from './sports-tennis-scoring-id.txt?raw';
import badmintonScoring from './sports-badminton-scoring-id.txt?raw';
import badmintonService from './sports-badminton-service-id.txt?raw';
import banjar from './sejarah-banjar-id.txt?raw';
import namaKotaKaltim from './sejarah-nama-kota-kaltim-id.txt?raw';
import fortRotterdam from './sejarah-fort-rotterdam-id.txt?raw';
import tambora from './sejarah-tambora-id.txt?raw';
import opuDaengRisaju from './sejarah-opu-daeng-risaju-id.txt?raw';
import basketTravelling from './sports-basket-travelling-id.txt?raw';
import voliRotasi from './sports-voli-rotasi-id.txt?raw';
import backpass from './sports-backpass-id.txt?raw';
import shotclock from './sports-shotclock-id.txt?raw';
import kriketLbw from './sports-kriket-lbw-id.txt?raw';
import saudara from './editorial-saudara-id.txt?raw';
import temanLama from './editorial-teman-lama-id.txt?raw';
import akhirTahun from './editorial-akhir-tahun-id.txt?raw';
import pilihSatuSahabat from './editorial-pilih-satu-sahabat-id.txt?raw';
import mimpiBareng from './editorial-mimpi-bareng-id.txt?raw';
import httpStatus from './dev-http-status-id.txt?raw';
import pythonTrik from './dev-python-trik-id.txt?raw';
import aiJanganDikirim from './dev-ai-jangan-dikirim-id.txt?raw';
import cliTools from './dev-cli-tools-id.txt?raw';
import cors from './dev-cors-id.txt?raw';
import lexOught from './lexicon-english-ought.txt?raw';
import lexBaku from './lexicon-kamus-baku.txt?raw';
import lexSerapan from './lexicon-kamus-serapan-portugis.txt?raw';
import lexPadanan from './lexicon-kamus-padanan.txt?raw';
import lexKataIndah from './lexicon-kamus-kata-indah.txt?raw';
import lexEjaan from './lexicon-kamus-ejaan.txt?raw';
import lexSalahKaprah from './lexicon-english-salah-kaprah.txt?raw';
import lexFalseFriends from './lexicon-english-false-friends.txt?raw';
import lexEd from './lexicon-english-ed.txt?raw';
import lexMakeDo from './lexicon-english-make-do.txt?raw';
import places from './editorial-places-en.txt?raw';
import ayatHatiTenang from './ayat-hati-tenang.txt?raw';
import ayatBersamaKesulitan from './ayat-bersama-kesulitan.txt?raw';
import ayatSesuaiKesanggupan from './ayat-sesuai-kesanggupan.txt?raw';
import ayatSabarHari1 from './ayat-sabar-hari-1.txt?raw';
import ayatDoaDuniaAkhirat from './ayat-doa-dunia-akhirat.txt?raw';
import ayatDoaOrangTua from './ayat-doa-orang-tua.txt?raw';
import ayatAkuDekat from './ayat-aku-dekat.txt?raw';
import hadisOrangKuat from './hadis-orang-kuat.txt?raw';
import hadisWajahBerseri from './hadis-wajah-berseri.txt?raw';
import hadisHatiDanAmal from './hadis-hati-dan-amal.txt?raw';

/** Topic group in the library; roughly one per account (docs/channels.md). */
export type SampleCategory = 'relationships' | 'dev' | 'history' | 'sports' | 'english' | 'indonesian' | 'ayat' | 'travel';

export const CATEGORIES: readonly { id: SampleCategory; label: string }[] = [
  { id: 'relationships', label: 'Relationships' },
  { id: 'dev', label: 'Dev' },
  { id: 'history', label: 'History' },
  { id: 'sports', label: 'Sports' },
  { id: 'english', label: 'English' },
  { id: 'indonesian', label: 'Bahasa Indonesia' },
  { id: 'ayat', label: 'Ayat & Hadis' },
  { id: 'travel', label: 'Travel' },
];

export interface Sample {
  id: string;
  name: string;
  category: SampleCategory;
  text: string;
}

export const SAMPLES: readonly Sample[] = [
  { id: 'editorial-couples-id', name: '5 pertanyaan kecil (editorial, id)', category: 'relationships', text: couples },
  { id: 'dev-git-id', name: '7 perintah git (dev, id)', category: 'dev', text: git },
  { id: 'editorial-places-en', name: 'Quiet places at dusk (editorial, en)', category: 'travel', text: places },
  // Owner decks: couples questions
  { id: 'editorial-masa-kecil-id', name: '5 pertanyaan masa kecil (editorial, id)', category: 'relationships', text: masaKecil },
  { id: 'editorial-ldr-id', name: '5 pertanyaan buat yang LDR (editorial, id)', category: 'relationships', text: ldr },
  { id: 'editorial-sebelum-menikah-id', name: '5 pertanyaan sebelum melangkah (editorial, id)', category: 'relationships', text: sebelumMenikah },
  // Owner decks: Ruang Rasa (friendship, family, self-reflection, interactive, money talk)
  { id: 'editorial-sahabat-id', name: '5 pertanyaan buat sahabat (editorial, id)', category: 'relationships', text: sahabat },
  { id: 'editorial-orang-tua-id', name: '5 pertanyaan buat orang tua (editorial, id)', category: 'relationships', text: orangTua },
  { id: 'editorial-refleksi-diri-id', name: '5 pertanyaan buat diri sendiri (editorial, id)', category: 'relationships', text: refleksiDiri },
  { id: 'editorial-pilih-satu-id', name: 'Pilih satu: versi pacaran (editorial, id)', category: 'relationships', text: pilihSatu },
  { id: 'editorial-soal-uang-id', name: '5 obrolan soal uang (editorial, id)', category: 'relationships', text: soalUang },
  { id: 'editorial-saudara-id', name: '5 pertanyaan buat saudara kandung (editorial, id)', category: 'relationships', text: saudara },
  { id: 'editorial-teman-lama-id', name: '5 pertanyaan buat teman lama (editorial, id)', category: 'relationships', text: temanLama },
  { id: 'editorial-akhir-tahun-id', name: '5 pertanyaan sebelum tahun berganti (editorial, id)', category: 'relationships', text: akhirTahun },
  { id: 'editorial-pilih-satu-sahabat-id', name: 'Pilih satu: versi sahabat (editorial, id)', category: 'relationships', text: pilihSatuSahabat },
  { id: 'editorial-mimpi-bareng-id', name: '5 pertanyaan tentang mimpi kalian (editorial, id)', category: 'relationships', text: mimpiBareng },
  // Owner decks: dev cheat sheets (end slide carries the portfolio line)
  { id: 'dev-linux-id', name: '7 perintah Linux (dev, id)', category: 'dev', text: linux },
  { id: 'dev-sql-id', name: '6 query SQL (dev, id)', category: 'dev', text: sql },
  { id: 'dev-vscode-id', name: '7 shortcut VS Code (dev, id)', category: 'dev', text: vscode },
  { id: 'dev-git-undo-id', name: '6 cara undo di Git (dev, id)', category: 'dev', text: gitUndo },
  { id: 'dev-console-id', name: '5 trik console JS (dev, id)', category: 'dev', text: consoleTricks },
  // Owner decks: Fathul Learn Coding (fundamentals, AI, learning journey)
  { id: 'dev-api-id', name: 'API itu sebenarnya apa (dev, id)', category: 'dev', text: api },
  { id: 'dev-ai-coding-id', name: '5 cara pakai AI buat coding (dev, id)', category: 'dev', text: aiCoding },
  { id: 'dev-async-await-id', name: 'Akhirnya paham async/await (dev, id)', category: 'dev', text: asyncAwait },
  { id: 'dev-http-status-id', name: '8 status code HTTP (dev, id)', category: 'dev', text: httpStatus },
  { id: 'dev-python-trik-id', name: '6 trik Python (dev, id)', category: 'dev', text: pythonTrik },
  { id: 'dev-ai-jangan-dikirim-id', name: '5 hal jangan ditempel ke AI (dev, id)', category: 'dev', text: aiJanganDikirim },
  { id: 'dev-cli-tools-id', name: '5 CLI tools (dev, id)', category: 'dev', text: cliTools },
  { id: 'dev-cors-id', name: 'Akhirnya paham CORS (dev, id)', category: 'dev', text: cors },
  // Owner decks: Catatan Kaki Sejarah (photos bundled in ./photos, see photos.ts)
  { id: 'sejarah-kutai-id', name: 'Kesultanan Kutai pernah dihapus (sejarah, id)', category: 'history', text: kutai },
  { id: 'sejarah-yupa-id', name: 'Prasasti Yupa (sejarah, id)', category: 'history', text: yupa },
  { id: 'sejarah-syarif-kasim-id', name: 'Sultan Syarif Kasim II (sejarah, id)', category: 'history', text: syarifKasim },
  { id: 'sejarah-baabullah-id', name: 'Sultan Baabullah mengusir Portugis (sejarah, id)', category: 'history', text: baabullah },
  { id: 'sejarah-bongaya-id', name: 'Perjanjian Bongaya (sejarah, id)', category: 'history', text: bongaya },
  { id: 'sejarah-banjar-id', name: 'Kesultanan Banjar dihapus (sejarah, id)', category: 'history', text: banjar },
  { id: 'sejarah-nama-kota-kaltim-id', name: 'Asal-usul nama Balikpapan, Samarinda, Tenggarong (sejarah, id)', category: 'history', text: namaKotaKaltim },
  { id: 'sejarah-fort-rotterdam-id', name: 'Fort Rotterdam setelah 1667 (sejarah, id)', category: 'history', text: fortRotterdam },
  { id: 'sejarah-tambora-id', name: 'Tambora 1815 dari Sumbawa (sejarah, id)', category: 'history', text: tambora },
  { id: 'sejarah-opu-daeng-risaju-id', name: 'Opu Daeng Risaju (sejarah, id)', category: 'history', text: opuDaengRisaju },
  // Owner decks: Whistle Notes (photos bundled in ./photos)
  { id: 'sports-offside-id', name: 'Offside, dijelaskan (sports, id)', category: 'sports', text: offside },
  { id: 'sports-handball-id', name: 'Handball, dijelaskan (sports, id)', category: 'sports', text: handball },
  { id: 'sports-tennis-scoring-id', name: 'Skor tenis 15-30-40 (sports, id)', category: 'sports', text: tennisScoring },
  { id: 'sports-badminton-scoring-id', name: 'Skor bulu tangkis berubah (sports, id)', category: 'sports', text: badmintonScoring },
  { id: 'sports-badminton-service-id', name: 'Servis bulu tangkis (sports, id)', category: 'sports', text: badmintonService },
  { id: 'sports-basket-travelling-id', name: 'Travelling basket, dijelaskan (sports, id)', category: 'sports', text: basketTravelling },
  { id: 'sports-voli-rotasi-id', name: 'Rotasi dan libero voli (sports, id)', category: 'sports', text: voliRotasi },
  { id: 'sports-backpass-id', name: 'Aturan backpass (sports, id)', category: 'sports', text: backpass },
  { id: 'sports-shotclock-id', name: 'Kenapa shot clock 24 detik (sports, id)', category: 'sports', text: shotclock },
  { id: 'sports-kriket-lbw-id', name: 'LBW kriket, dijelaskan (sports, id)', category: 'sports', text: kriketLbw },
  // English Sehari (english) & Kamus Kecil (indonesian), lexicon slides
  { id: 'lexicon-english-ought', name: 'Pola -ought (English Sehari, id)', category: 'english', text: lexOught },
  { id: 'lexicon-english-salah-kaprah', name: '5 kalimat yang sering salah (English Sehari, id)', category: 'english', text: lexSalahKaprah },
  { id: 'lexicon-english-false-friends', name: 'False friends (English Sehari, id)', category: 'english', text: lexFalseFriends },
  { id: 'lexicon-english-ed', name: 'Bunyi -ed ada tiga (English Sehari, id)', category: 'english', text: lexEd },
  { id: 'lexicon-english-make-do', name: 'Make atau do (English Sehari, id)', category: 'english', text: lexMakeDo },
  { id: 'lexicon-kamus-baku', name: 'Baku atau tidak (Kamus Kecil, id)', category: 'indonesian', text: lexBaku },
  { id: 'lexicon-kamus-serapan-portugis', name: 'Kata serapan dari Portugis (Kamus Kecil, id)', category: 'indonesian', text: lexSerapan },
  { id: 'lexicon-kamus-padanan', name: 'Padanan kata asing (Kamus Kecil, id)', category: 'indonesian', text: lexPadanan },
  { id: 'lexicon-kamus-kata-indah', name: '5 kata indah di KBBI (Kamus Kecil, id)', category: 'indonesian', text: lexKataIndah },
  { id: 'lexicon-kamus-ejaan', name: 'Merubah atau mengubah? (Kamus Kecil, id)', category: 'indonesian', text: lexEjaan },
  // Ayat Harian (ayat): ayah/hadith slides, text copied from Tanzil, Kemenag RI and HadeethEnc
  { id: 'ayat-hati-tenang', name: 'Hati yang tenang (Ayat Harian, id)', category: 'ayat', text: ayatHatiTenang },
  { id: 'ayat-bersama-kesulitan', name: 'Bersama kesulitan ada kemudahan (Ayat Harian, id)', category: 'ayat', text: ayatBersamaKesulitan },
  { id: 'ayat-sesuai-kesanggupan', name: 'Sesuai kesanggupan (Ayat Harian, id)', category: 'ayat', text: ayatSesuaiKesanggupan },
  { id: 'ayat-sabar-hari-1', name: 'Sabar · Hari 1 (Ayat Harian, id)', category: 'ayat', text: ayatSabarHari1 },
  { id: 'ayat-doa-dunia-akhirat', name: 'Doa kebaikan dunia dan akhirat (Ayat Harian, id)', category: 'ayat', text: ayatDoaDuniaAkhirat },
  { id: 'ayat-doa-orang-tua', name: 'Doa untuk orang tua (Ayat Harian, id)', category: 'ayat', text: ayatDoaOrangTua },
  { id: 'ayat-aku-dekat', name: 'Aku dekat (Ayat Harian, id)', category: 'ayat', text: ayatAkuDekat },
  { id: 'hadis-orang-kuat', name: 'Orang kuat (hadis) (Ayat Harian, id)', category: 'ayat', text: hadisOrangKuat },
  { id: 'hadis-wajah-berseri', name: 'Wajah berseri (hadis) (Ayat Harian, id)', category: 'ayat', text: hadisWajahBerseri },
  { id: 'hadis-hati-dan-amal', name: 'Hati dan amal (hadis) (Ayat Harian, id)', category: 'ayat', text: hadisHatiDanAmal },
];
