import couples from './editorial-couples-id.txt?raw';
import git from './dev-git-id.txt?raw';
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
];
