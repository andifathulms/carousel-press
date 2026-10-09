import type { SlideFile } from './exportZip';

/** The slice of `navigator` the share sheet needs; injectable for tests. */
export interface ShareNavigator {
  canShare?(data: ShareData): boolean;
  share?(data: ShareData): Promise<void>;
}

const nav = (): ShareNavigator | undefined => (typeof navigator === 'undefined' ? undefined : navigator);

/**
 * True when this browser can hand PNG files to the OS share sheet
 * (iPadOS/iOS Safari: "Save N Images" puts them in Photos).
 */
export function canSharePngs(n: ShareNavigator | undefined = nav()): boolean {
  if (!n?.share || !n.canShare || typeof File === 'undefined') return false;
  try {
    return n.canShare({ files: [new File([''], 'probe.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

export function toPngFiles(files: SlideFile[]): File[] {
  return files.map((f) => new File([f.blob], f.name, { type: 'image/png' }));
}

/**
 * Open the share sheet with the slide PNGs. Must run inside a user gesture
 * (Safari rejects share() otherwise). Resolves 'cancelled' when the user
 * dismisses the sheet.
 */
export async function sharePngs(files: File[], n: ShareNavigator | undefined = nav()): Promise<'shared' | 'cancelled'> {
  if (!n?.share) throw new Error("This browser can't share files.");
  if (n.canShare && !n.canShare({ files })) throw new Error("This browser can't share these images. Use Download all (ZIP).");
  try {
    await n.share({ files });
    return 'shared';
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
    throw err;
  }
}
