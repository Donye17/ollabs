
import fs from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

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

const DOWNLOAD_DIR = path.join(process.cwd(), 'temp_flags');

async function downloadFile(url: string, dest: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    }

    console.log(`Downloading ${COUNTRIES.length} flags to ${DOWNLOAD_DIR}...`);

    for (const country of COUNTRIES) {
        const url = `https://flagcdn.com/w640/${country.code}.png`;
        const filename = `${country.name.replace(/\s+/g, '_')}.png`;
        const dest = path.join(DOWNLOAD_DIR, filename);

        try {
            await downloadFile(url, dest);
            console.log(`✓ ${country.name}`);
        } catch (error) {
            console.error(`✗ Failed ${country.name}:`, error);
        }
    }

    console.log('Done.');
}

main();
