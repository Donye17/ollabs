
import fs from 'fs';
import path from 'path';

const API_BASE = 'https://ollabs.studio';
// const API_BASE = 'http://localhost:3000'; // Toggle for testing

const COUNTRIES = [
    { code: 'us', name: 'USA' },
    { code: 'cn', name: 'China' },
    { code: 'in', name: 'India' },
    { code: 'br', name: 'Brazil' },
    { code: 'gb', name: 'UK' },
    { code: 'fr', name: 'France' },
    { code: 'de', name: 'Germany' },
    { code: 'jp', name: 'Japan' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'ru', name: 'Russia' },
    { code: 'kr', name: 'South Korea' },
    { code: 'it', name: 'Italy' },
    { code: 'es', name: 'Spain' },
    { code: 'mx', name: 'Mexico' },
    { code: 'id', name: 'Indonesia' },
    { code: 'tr', name: 'Turkey' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'za', name: 'South Africa' },
    { code: 'ar', name: 'Argentina' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'eg', name: 'Egypt' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'ph', name: 'Philippines' },
    { code: 'ir', name: 'Iran' },
    { code: 'th', name: 'Thailand' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'pl', name: 'Poland' }
];

async function main() {
    console.log(`Targeting: ${API_BASE}`);

    // 1. Sign Up / Sign In
    const email = `flagmaster${Date.now()}@ollabs.local`; // Unique email
    const password = 'Password123!';
    const name = 'FlagMaster2026';

    console.log(`Creating user: ${email}...`);

    let cookie = '';
    let userId = '';

    try {
        const authRes = await fetch(`${API_BASE}/api/auth/sign-up/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': API_BASE // spoof origin
            },
            body: JSON.stringify({ email, password, name })
        });

        if (!authRes.ok) {
            const errorText = await authRes.text();
            console.error('Auth failed:', authRes.status, errorText);
            // If user exists, try login? Or just fail since random email
            return;
        }

        // Capture cookie
        const setCookie = authRes.headers.get('set-cookie');
        if (setCookie) {
            cookie = setCookie;
            console.log('Authenticated!');
        }

        const authData = await authRes.json();
        userId = authData.user?.id || authData.id; // Adjust based on BetterAuth response
        console.log(`User ID: ${userId}`);

    } catch (e) {
        console.error('Auth Error:', e);
        return;
    }

    // 2. Create Frames
    const flagsDir = path.join(process.cwd(), 'temp_flags');

    for (const country of COUNTRIES) {
        console.log(`Processing ${country.name}...`);

        // Read image
        const filename = `${country.name.replace(/\s+/g, '_')}.png`;
        const filePath = path.join(flagsDir, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        const buffer = fs.readFileSync(filePath);
        const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;

        // Construct Frame Payload
        const frameData = {
            name: `${country.name} Flag`,
            description: `Show your support for ${country.name}!`,
            creator_id: userId,
            creator_name: name,
            is_public: true,
            tags: ['flag', 'country', country.name.toLowerCase()],
            config: {
                id: `flag-${country.code}`,
                type: 'SOLID',
                name: `${country.name} Flag`,
                color1: '#ffffff',
                width: 25, // Slightly thicker for flag texture
                imageUrl: base64Image, // Apply flag as texture
                stickers: [], // No stickers
                textLayers: [] // No text
            },
            preview_url: null,
            media_type: 'image/png'
        };

        try {
            const res = await fetch(`${API_BASE}/api/frames`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': API_BASE, // spoof origin
                    'Cookie': cookie
                },
                body: JSON.stringify(frameData)
            });

            if (res.ok) {
                const json = await res.json();
                console.log(`✓ Created: ${country.name} (ID: ${json.id})`);
            } else {
                console.error(`✗ Failed ${country.name}:`, res.status, await res.text());
            }
        } catch (e) {
            console.error(`Error creating ${country.name}:`, e);
        }

        // Delay to be nice
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('Done.');
}

main();
