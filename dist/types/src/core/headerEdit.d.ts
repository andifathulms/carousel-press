/**
 * Set a header key in the deck text, keeping every other line and its order.
 * - Existing key → its line is rewritten in place.
 * - Header without the key → the key is appended as the last header line.
 * - No header → `key: value` + `---` is inserted at the top.
 */
export declare function setHeaderKey(text: string, key: string, value: string): string;
/** Read a header key's raw value from the text (or undefined). */
export declare function getHeaderKey(text: string, key: string): string | undefined;
