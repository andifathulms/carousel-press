// iPad specifics that live outside any one component.

/** iPhone, or iPad (iPadOS reports itself as a Mac with touch). */
export function isIOS(nav: Pick<Navigator, 'userAgent' | 'platform' | 'maxTouchPoints'> = navigator): boolean {
  return /iPad|iPhone|iPod/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
}

/**
 * Keep the app inside the part of the screen the on-screen keyboard leaves visible.
 * Safari shrinks only the visual viewport when the keyboard opens, so the app sizes
 * itself to it (--app-h) and undoes the page scroll Safari adds when an input gets focus.
 */
export function trackVisualViewport(): void {
  const vv = window.visualViewport;
  if (!vv) return;
  const root = document.documentElement;
  const update = (): void => {
    if (Math.abs(vv.scale - 1) > 0.01) return; // pinch-zoomed: leave the layout alone
    root.style.setProperty('--app-h', `${Math.round(vv.height)}px`);
    if (window.scrollY !== 0 && vv.height < window.innerHeight) window.scrollTo(0, 0);
  };
  vv.addEventListener('resize', update);
  vv.addEventListener('scroll', update);
  update();
}

export function setupPlatform(): void {
  document.documentElement.classList.toggle('ios', isIOS());
  trackVisualViewport();
}
