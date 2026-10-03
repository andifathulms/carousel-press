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
import places from './editorial-places-en.txt?raw';

export interface Sample {
  id: string;
  name: string;
  text: string;
}

export const SAMPLES: readonly Sample[] = [
  { id: 'editorial-couples-id', name: '5 pertanyaan kecil (editorial, id)', text: couples },
  { id: 'dev-git-id', name: '7 perintah git (dev, id)', text: git },
  { id: 'editorial-places-en', name: 'Quiet places at dusk (editorial, en)', text: places },
  // Owner decks: couples questions
  { id: 'editorial-masa-kecil-id', name: '5 pertanyaan masa kecil (editorial, id)', text: masaKecil },
  { id: 'editorial-ldr-id', name: '5 pertanyaan buat yang LDR (editorial, id)', text: ldr },
  { id: 'editorial-sebelum-menikah-id', name: '5 pertanyaan sebelum melangkah (editorial, id)', text: sebelumMenikah },
  // Owner decks: Ruang Rasa (friendship, family, self-reflection, interactive, money talk)
  { id: 'editorial-sahabat-id', name: '5 pertanyaan buat sahabat (editorial, id)', text: sahabat },
  { id: 'editorial-orang-tua-id', name: '5 pertanyaan buat orang tua (editorial, id)', text: orangTua },
  { id: 'editorial-refleksi-diri-id', name: '5 pertanyaan buat diri sendiri (editorial, id)', text: refleksiDiri },
  { id: 'editorial-pilih-satu-id', name: 'Pilih satu: versi pacaran (editorial, id)', text: pilihSatu },
  { id: 'editorial-soal-uang-id', name: '5 obrolan soal uang (editorial, id)', text: soalUang },
  // Owner decks: dev cheat sheets (end slide carries the portfolio line)
  { id: 'dev-linux-id', name: '7 perintah Linux (dev, id)', text: linux },
  { id: 'dev-sql-id', name: '6 query SQL (dev, id)', text: sql },
  { id: 'dev-vscode-id', name: '7 shortcut VS Code (dev, id)', text: vscode },
  { id: 'dev-git-undo-id', name: '6 cara undo di Git (dev, id)', text: gitUndo },
  { id: 'dev-console-id', name: '5 trik console JS (dev, id)', text: consoleTricks },
  // Owner decks: Fathul Learn Coding (fundamentals, AI, learning journey)
  { id: 'dev-api-id', name: 'API itu sebenarnya apa (dev, id)', text: api },
  { id: 'dev-ai-coding-id', name: '5 cara pakai AI buat coding (dev, id)', text: aiCoding },
  { id: 'dev-async-await-id', name: 'Akhirnya paham async/await (dev, id)', text: asyncAwait },
];
