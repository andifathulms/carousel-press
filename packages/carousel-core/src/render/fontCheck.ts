/** True when `family` is loaded for `sample` (layout's `arabic-font-missing` check). Browser only. */
export function faceAvailable(family: string, sample: string): boolean {
  try {
    return document.fonts.check(`400 40px "${family}"`, sample);
  } catch {
    return false;
  }
}
