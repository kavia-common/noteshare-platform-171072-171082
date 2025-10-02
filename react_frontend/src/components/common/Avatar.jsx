import React, { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Avatar
 * Displays a circular avatar from Gravatar (by email) with fallback to initials.
 * Props:
 *  - email?: string
 *  - name?: string
 *  - size?: number (px)
 *  - className?: string
 *  - ariaLabel?: string
 */
export default function Avatar({ email = '', name = '', size = 28, className = '', ariaLabel }) {
  // compute initials from name or email
  const initials = useMemo(() => {
    const src = (name || email || '').trim();
    if (!src) return '?';
    const parts = src.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (src.includes('@')) return src[0].toUpperCase();
    return (src[0] || '?').toUpperCase();
  }, [name, email]);

  // Simple lightweight md5 implementation for Gravatar (RFC1321-like)
  // Note: For production, prefer a vetted md5 library. This is a minimal inline version to avoid adding deps.
  function md5(input) {
    // eslint-disable-next-line no-bitwise
    function cmn(q, a, b, x, s, t) { a = (((a + q) | 0) + ((x + t) | 0)) | 0; return ((((a << s) | (a >>> (32 - s))) + b) | 0); }
    // eslint-disable-next-line no-bitwise
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    // eslint-disable-next-line no-bitwise
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    // eslint-disable-next-line no-bitwise
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    // eslint-disable-next-line no-bitwise
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }

    function toBytes(s) {
      const utf8 = unescape(encodeURIComponent(s));
      const bytes = [];
      for (let i = 0; i < utf8.length; i += 1) bytes.push(utf8.charCodeAt(i));
      return bytes;
    }
    function toWords(bytes) {
      const words = [];
      for (let i = 0; i < bytes.length * 8; i += 8) {
        words[i >> 5] = words[i >> 5] || 0;
        // eslint-disable-next-line no-bitwise
        words[i >> 5] |= (bytes[i / 8] & 0xff) << (i % 32);
      }
      return words;
    }
    function wordsToBytes(words) {
      const bytes = [];
      for (let i = 0; i < words.length * 32; i += 8) {
        // eslint-disable-next-line no-bitwise
        bytes.push((words[i >> 5] >>> (i % 32)) & 0xff);
      }
      return bytes;
    }
    function bytesToHex(bytes) {
      const hex = [];
      for (let i = 0; i < bytes.length; i += 1) {
        const x = bytes[i];
        hex.push((x >>> 4).toString(16));
        hex.push((x & 0x0f).toString(16));
      }
      return hex.join('');
    }

    const bytes = toBytes(input);
    const len = bytes.length * 8;
    const words = toWords(bytes);
    // append padding
    // eslint-disable-next-line no-bitwise
    words[len >> 5] |= 0x80 << (len % 32);
    // eslint-disable-next-line no-bitwise
    words[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 1732584193; // 0x67452301
    let b = -271733879; // 0xefcdab89
    let c = -1732584194; // 0x98badcfe
    let d = 271733878; // 0x10325476

    for (let i = 0; i < words.length; i += 16) {
      const oa = a;
      const ob = b;
      const oc = c;
      const od = d;

      a = ff(a, b, c, d, words[i], 7, -680876936);
      d = ff(d, a, b, c, words[i + 1], 12, -389564586);
      c = ff(c, d, a, b, words[i + 2], 17, 606105819);
      b = ff(b, c, d, a, words[i + 3], 22, -1044525330);
      a = ff(a, b, c, d, words[i + 4], 7, -176418897);
      d = ff(d, a, b, c, words[i + 5], 12, 1200080426);
      c = ff(c, d, a, b, words[i + 6], 17, -1473231341);
      b = ff(b, c, d, a, words[i + 7], 22, -45705983);
      a = ff(a, b, c, d, words[i + 8], 7, 1770035416);
      d = ff(d, a, b, c, words[i + 9], 12, -1958414417);
      c = ff(c, d, a, b, words[i + 10], 17, -42063);
      b = ff(b, c, d, a, words[i + 11], 22, -1990404162);
      a = ff(a, b, c, d, words[i + 12], 7, 1804603682);
      d = ff(d, a, b, c, words[i + 13], 12, -40341101);
      c = ff(c, d, a, b, words[i + 14], 17, -1502002290);
      b = ff(b, c, d, a, words[i + 15], 22, 1236535329);

      a = gg(a, b, c, d, words[i + 1], 5, -165796510);
      d = gg(d, a, b, c, words[i + 6], 9, -1069501632);
      c = gg(c, d, a, b, words[i + 11], 14, 643717713);
      b = gg(b, c, d, a, words[i], 20, -373897302);
      a = gg(a, b, c, d, words[i + 5], 5, -701558691);
      d = gg(d, a, b, c, words[i + 10], 9, 38016083);
      c = gg(c, d, a, b, words[i + 15], 14, -660478335);
      b = gg(b, c, d, a, words[i + 4], 20, -405537848);
      a = gg(a, b, c, d, words[i + 9], 5, 568446438);
      d = gg(d, a, b, c, words[i + 14], 9, -1019803690);
      c = gg(c, d, a, b, words[i + 3], 14, -187363961);
      b = gg(b, c, d, a, words[i + 8], 20, 1163531501);
      a = gg(a, b, c, d, words[i + 13], 5, -1444681467);
      d = gg(d, a, b, c, words[i + 2], 9, -51403784);
      c = gg(c, d, a, b, words[i + 7], 14, 1735328473);
      b = gg(b, c, d, a, words[i + 12], 20, -1926607734);

      a = hh(a, b, c, d, words[i + 5], 4, -378558);
      d = hh(d, a, b, c, words[i + 8], 11, -2022574463);
      c = hh(c, d, a, b, words[i + 11], 16, 1839030562);
      b = hh(b, c, d, a, words[i + 14], 23, -35309556);
      a = hh(a, b, c, d, words[i + 1], 4, -1530992060);
      d = hh(d, a, b, c, words[i + 4], 11, 1272893353);
      c = hh(c, d, a, b, words[i + 7], 16, -155497632);
      b = hh(b, c, d, a, words[i + 10], 23, -1094730640);
      a = hh(a, b, c, d, words[i + 13], 4, 681279174);
      d = hh(d, a, b, c, words[i], 11, -358537222);
      c = hh(c, d, a, b, words[i + 3], 16, -722521979);
      b = hh(b, c, d, a, words[i + 6], 23, 76029189);
      a = hh(a, b, c, d, words[i + 9], 4, -640364487);
      d = hh(d, a, b, c, words[i + 12], 11, -421815835);
      c = hh(c, d, a, b, words[i + 15], 16, 530742520);
      b = hh(b, c, d, a, words[i + 2], 23, -995338651);

      a = ii(a, b, c, d, words[i], 6, -198630844);
      d = ii(d, a, b, c, words[i + 7], 10, 1126891415);
      c = ii(c, d, a, b, words[i + 14], 15, -1416354905);
      b = ii(b, c, d, a, words[i + 5], 21, -57434055);
      a = ii(a, b, c, d, words[i + 12], 6, 1700485571);
      d = ii(d, a, b, c, words[i + 3], 10, -1894986606);
      c = ii(c, d, a, b, words[i + 10], 15, -1051523);
      b = ii(b, c, d, a, words[i + 1], 21, -2054922799);
      a = ii(a, b, c, d, words[i + 8], 6, 1873313359);
      d = ii(d, a, b, c, words[i + 15], 10, -30611744);
      c = ii(c, d, a, b, words[i + 6], 15, -1560198380);
      b = ii(b, c, d, a, words[i + 13], 21, 1309151649);
      a = (a + oa) | 0; b = (b + ob) | 0; c = (c + oc) | 0; d = (d + od) | 0;
    }

    return bytesToHex(wordsToBytes([a, b, c, d]));
  }

  const hash = useMemo(() => (email ? md5(email.trim().toLowerCase()) : ''), [email]);
  const url = email ? `https://www.gravatar.com/avatar/${hash}?d=404&s=${size * 2}` : '';

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: Math.max(10, Math.floor(size * 0.45)),
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
  };

  if (url) {
    return (
      <img
        src={url}
        alt={ariaLabel || name || email || 'User avatar'}
        width={size}
        height={size}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
        style={{ width: size, height: size, borderRadius: '50%', border: '1px solid var(--color-border)' }}
        className={className}
      />
    );
  }

  return (
    <span className={className} style={style} aria-label={ariaLabel || 'User avatar'}>
      {initials}
    </span>
  );
}
