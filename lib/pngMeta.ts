// Embed provenance metadata into a PNG as tEXt chunks.
// Note: most social platforms strip metadata on upload, so this survives direct
// file sharing (download, email, drive) but not reposting to social networks.

const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        t[n] = c >>> 0;
    }
    return t;
})();

function crc32(bytes: Uint8Array): number {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
        c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
}

// PNG tEXt is Latin-1 only; drop anything outside that range.
function latin1(s: string): Uint8Array {
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) {
        const code = s.charCodeAt(i);
        out[i] = code > 255 ? 63 : code; // '?'
    }
    return out;
}

function textChunk(keyword: string, text: string): Uint8Array {
    const kw = latin1(keyword.slice(0, 79));
    const tx = latin1(text);
    const data = new Uint8Array(kw.length + 1 + tx.length);
    data.set(kw, 0);
    data[kw.length] = 0;
    data.set(tx, kw.length + 1);

    const type = latin1('tEXt');
    const typeAndData = new Uint8Array(4 + data.length);
    typeAndData.set(type, 0);
    typeAndData.set(data, 4);
    const crc = crc32(typeAndData);

    const chunk = new Uint8Array(4 + 4 + data.length + 4);
    const dv = new DataView(chunk.buffer);
    dv.setUint32(0, data.length);
    chunk.set(type, 4);
    chunk.set(data, 8);
    dv.setUint32(8 + data.length, crc);
    return chunk;
}

export function addPngMetadata(png: Uint8Array, entries: Record<string, string>): Uint8Array {
    if (png.length < 12) return png;
    const dv = new DataView(png.buffer, png.byteOffset, png.byteLength);
    let offset = 8; // skip PNG signature
    let iendStart = -1;
    while (offset + 8 <= png.length) {
        const len = dv.getUint32(offset);
        const type = String.fromCharCode(png[offset + 4], png[offset + 5], png[offset + 6], png[offset + 7]);
        if (type === 'IEND') { iendStart = offset; break; }
        offset += 12 + len;
    }
    if (iendStart < 0) return png;

    const chunks = Object.entries(entries)
        .filter(([, v]) => typeof v === 'string' && v.length > 0)
        .map(([k, v]) => textChunk(k, v));
    if (chunks.length === 0) return png;

    const extra = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(png.length + extra);
    out.set(png.subarray(0, iendStart), 0);
    let p = iendStart;
    for (const c of chunks) { out.set(c, p); p += c.length; }
    out.set(png.subarray(iendStart), p);
    return out;
}
