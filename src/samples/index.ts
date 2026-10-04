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
import places from './editorial-places-en.txt?raw';

/** Topic group in the library; roughly one per account (docs/channels.md). */
export type SampleCategory = 'relationships' | 'dev' | 'history' | 'sports' | 'travel';

export const CATEGORIES: readonly { id: SampleCategory; label: string }[] = [
  { id: 'relationships', label: 'Relationships' },
  { id: 'dev', label: 'Dev' },
  { id: 'history', label: 'History' },
  { id: 'sports', label: 'Sports' },
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
  // Owner decks: Catatan Kaki Sejarah (photos bundled in ./photos, see photos.ts)
  { id: 'sejarah-kutai-id', name: 'Kesultanan Kutai pernah dihapus (sejarah, id)', category: 'history', text: kutai },
  { id: 'sejarah-yupa-id', name: 'Prasasti Yupa (sejarah, id)', category: 'history', text: yupa },
  { id: 'sejarah-syarif-kasim-id', name: 'Sultan Syarif Kasim II (sejarah, id)', category: 'history', text: syarifKasim },
  { id: 'sejarah-baabullah-id', name: 'Sultan Baabullah mengusir Portugis (sejarah, id)', category: 'history', text: baabullah },
  { id: 'sejarah-bongaya-id', name: 'Perjanjian Bongaya (sejarah, id)', category: 'history', text: bongaya },
  // Owner decks: Whistle Notes (photos bundled in ./photos)
  { id: 'sports-offside-id', name: 'Offside, dijelaskan (sports, id)', category: 'sports', text: offside },
  { id: 'sports-handball-id', name: 'Handball, dijelaskan (sports, id)', category: 'sports', text: handball },
  { id: 'sports-tennis-scoring-id', name: 'Skor tenis 15-30-40 (sports, id)', category: 'sports', text: tennisScoring },
  { id: 'sports-badminton-scoring-id', name: 'Skor bulu tangkis berubah (sports, id)', category: 'sports', text: badmintonScoring },
  { id: 'sports-badminton-service-id', name: 'Servis bulu tangkis (sports, id)', category: 'sports', text: badmintonService },
];
