/**
 * Command Reference Utilities
 *
 * Utilities for transforming command references to tool-specific formats.
 */

/**
 * Transforms colon-based command references to hyphen-based format.
 * Converts `/phsx:` patterns to `/phsx-` for tools that use hyphen syntax.
 *
 * @param text - The text containing command references
 * @returns Text with command references transformed to hyphen format
 *
 * @example
 * transformToHyphenCommands('/phsx:new') // returns '/phsx-new'
 * transformToHyphenCommands('Use /phsx:apply to implement') // returns 'Use /phsx-apply to implement'
 */
export function transformToHyphenCommands(text: string): string {
  return text.replace(/\/phsx:/g, "/phsx-");
}
