// App fonts. Import this first in main.ts.
// The app chrome (app.css) uses Geist Sans (UI), Bricolage Grotesque (names: deck and
// screen titles) and JetBrains Mono (editor, numbers) as plain CSS faces.
// Inter stays because dev templates and the safe-zone overlay draw with it.
// Slide faces go through the renderer's font gate (slideFonts.ts).
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import '@fontsource/geist-sans/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './slideFonts';
