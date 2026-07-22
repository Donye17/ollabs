"use client";
import React, { useEffect, useState } from 'react';
import QR from 'qrcode';

// Renders a QR for any string as a PNG data URL. Brand colors baked in.
export const QRCode: React.FC<{ value: string; size?: number; className?: string }> = ({ value, size = 180, className }) => {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        QR.toDataURL(value, { width: size * 2, margin: 1, color: { dark: '#06141F', light: '#FDFCF9' } })
            .then((url) => { if (active) setSrc(url); })
            .catch(() => { /* ignore */ });
        return () => { active = false; };
    }, [value, size]);

    return (
        <div
            className={className}
            style={{ width: size, height: size, borderRadius: 12, overflow: 'hidden', background: '#FDFCF9' }}
        >
            {src && <img src={src} width={size} height={size} alt="Campaign QR code" />}
        </div>
    );
};
