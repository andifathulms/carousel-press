# Word counts per slide of the Sejarah Nusantara decks (docs/channels.md §3): cards 35–45, the hook card 35–40,
# cover subtitle ≤ 28, quote note ≤ 30, end body ≤ 20. Usage: python3 scripts/wc-sejarah.py [deck.txt ...] (default: all).
import glob, re, sys
for f in sys.argv[1:] or sorted(glob.glob("src/samples/sejarah-*.txt")):
    parts = re.split(r'\n---\n', open(f).read())[1:]
    print(f)
    card = 0
    for i, p in enumerate(parts, 1):
        lines = p.strip('\n').split('\n')
        tag = lines[0] if lines and lines[0].startswith('[') else ''
        kind = 'cover' if tag.startswith('[cover') else 'end' if tag.startswith('[end') else 'quote' if tag.startswith('[quote') else 'card'
        body = [l for l in lines[(2 if tag else 1):] if l.strip()]
        if kind == 'quote':
            body = [l for l in body if not l.startswith(('— ', '-- ', '- '))]
        n = len(' '.join(body).split())
        if kind == 'card':
            card += 1
            lo, hi = (35, 40) if card == 1 else (35, 45)
        else:
            lo, hi = {'cover': (0, 28), 'quote': (0, 30), 'end': (0, 20)}[kind]
        flag = '' if lo <= n <= hi else f'  <-- want {lo}-{hi}'
        print(f'  slide {i:2} {kind:5} {n:3} words{flag}')
