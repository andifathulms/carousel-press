import couples from './editorial-couples-id.txt?raw';
import masaKecil from './editorial-masa-kecil-id.txt?raw';
import ldr from './editorial-ldr-id.txt?raw';
import sebelumMenikah from './editorial-sebelum-menikah-id.txt?raw';
import git from './dev-git-id.txt?raw';
import linux from './dev-linux-id.txt?raw';
import sql from './dev-sql-id.txt?raw';
import vscode from './dev-vscode-id.txt?raw';
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
  // Owner decks: dev cheat sheets (end slide carries the portfolio line)
  { id: 'dev-linux-id', name: '7 perintah Linux (dev, id)', text: linux },
  { id: 'dev-sql-id', name: '6 query SQL (dev, id)', text: sql },
  { id: 'dev-vscode-id', name: '7 shortcut VS Code (dev, id)', text: vscode },
];
