import type { Ctx } from './ctx';
import type { CodeTheme } from '../templates/types';
import type { Placed } from '../layout/stack';
import { withAlpha } from '../core/color';
import { highlightLine } from './highlight';
import type { TokenKind } from './highlight';
import { setFont } from './text';

/** DESIGN §6.4 panel details shared by both families. */
export const CODE_CHROME = {
  border: 2,
  dotR: 9,
  dotX: [36, 64, 92] as const,
  labelSize: 24,
  labelRight: 28,
  fade: 48,
};

const TOKEN_COLOR: Record<TokenKind, keyof CodeTheme> = {
  text: 'text', prompt: 'prompt', command: 'command', subcommand: 'subcommand', flag: 'flag',
  string: 'string', comment: 'comment', number: 'number', keyword: 'keyword', fn: 'fn', punct: 'punct',
};

/** Draw a code panel for a placed `code` stack item. */
export function drawCodeBlock(ctx: Ctx, p: Placed, theme: CodeTheme, mono: string, radius: number, width: number): void {
  if (p.item.kind !== 'code') return;
  const { spec, lines, lang } = p.item;
  const { x, y, h, size } = p;
  ctx.save();
  ctx.shadowColor = 'transparent';

  ctx.beginPath();
  ctx.roundRect(x, y, width, h, radius);
  ctx.fillStyle = theme.panel;
  ctx.fill();
  ctx.lineWidth = CODE_CHROME.border;
  ctx.strokeStyle = theme.border;
  ctx.beginPath();
  const b = CODE_CHROME.border / 2;
  ctx.roundRect(x + b, y + b, width - 2 * b, h - 2 * b, radius - b);
  ctx.stroke();

  if (theme.dots && spec.titleBar > 0) {
    const cy = y + spec.titleBar / 2;
    theme.dots.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x + CODE_CHROME.dotX[i]!, cy, CODE_CHROME.dotR, 0, Math.PI * 2);
      ctx.fill();
    });
    if (lang) {
      setFont(ctx, { family: mono, weight: 500, size: CODE_CHROME.labelSize });
      ctx.fillStyle = theme.comment;
      ctx.textAlign = 'right';
      ctx.fillText(lang, x + width - CODE_CHROME.labelRight, cy + CODE_CHROME.labelSize * 0.35);
      ctx.textAlign = 'left';
    }
    ctx.fillStyle = theme.border;
    ctx.fillRect(x, y + spec.titleBar - CODE_CHROME.border, width, CODE_CHROME.border);
  }

  const left = x + spec.padX;
  const right = x + width - spec.padX;
  const top = y + spec.titleBar + spec.padTop;
  ctx.beginPath();
  ctx.rect(left, y, right - left, h);
  ctx.clip();

  const lineBox = size * spec.lh;
  lines.forEach((line, k) => {
    const baseline = top + k * lineBox + lineBox / 2 + size * 0.35;
    let cx = left;
    for (const tok of highlightLine(line, lang)) {
      const weight = tok.kind === 'command' ? 600 : spec.weight;
      setFont(ctx, { family: mono, weight, size });
      ctx.fillStyle = theme[TOKEN_COLOR[tok.kind]] as string;
      ctx.fillText(tok.text, cx, baseline);
      cx += ctx.measureText(tok.text).width;
    }
  });

  if (p.codeFits === false) {
    const g = ctx.createLinearGradient(right - CODE_CHROME.fade, 0, right, 0);
    g.addColorStop(0, withAlpha(theme.panel, 0));
    g.addColorStop(1, theme.panel);
    ctx.fillStyle = g;
    ctx.fillRect(right - CODE_CHROME.fade, y, CODE_CHROME.fade, h);
  }
  ctx.restore();
}
