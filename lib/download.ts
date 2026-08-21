/**
 * Saving a rendered PNG to the phone.
 *
 * The campaign page learned both of these the hard way and they are worth
 * having in one place, because every screen that renders a frame ends in the
 * same two actions.
 */

/**
 * Trigger a file download for a blob.
 *
 * Two details matter, both of them mobile-only:
 *
 *  - The anchor goes into the document and is removed after. Some mobile
 *    browsers ignore a click on an element that was never in the tree, so a
 *    detached anchor silently does nothing.
 *  - The object URL outlives the click by a long way. Revoking straight after
 *    click() raced the download: the browser had not finished reading the blob
 *    when the URL went away, and the file never arrived.
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
