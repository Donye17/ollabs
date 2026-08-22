import type { UseCase } from '@/lib/useCases';

/** Bahasa Indonesia use-case landings at /id/for/<slug>. */
export const USE_CASES_ID: UseCase[] = [
    {
        slug: 'kampus',
        audience: 'Kampus',
        h1: 'Bingkai foto profil untuk kampus',
        subtitle: 'Homecoming, wisuda, dan hari peringatan dalam satu link.',
        keyword: 'bingkai foto profil kampus',
        intro: [
            'Momen kampus berulang setiap tahun. Satu bingkai, satu link, ribuan profil mahasiswa dan alumni.',
            'Gratis tanpa daftar. Warna kampus atau logo fakultas, bagikan di grup WhatsApp.',
        ],
        benefits: [
            { title: 'Siap dipakai ulang', body: 'Buat bingkai baru tiap acara dengan link dan hitungannya sendiri.' },
            { title: 'Alumni tanpa akun', body: 'Yang jarang login tetap bisa ikut lewat link.' },
            { title: 'HMJ mandiri', body: 'Setiap unit bisa buat kampanyenya sendiri.' },
        ],
        faqs: [
            { q: 'Apakah mahasiswa perlu install aplikasi?', a: 'Tidak. Cukup buka link di browser HP.' },
            { q: 'Bisa dipakai tahun depan?', a: 'Ya. Buat kampanye baru dengan desain yang sama.' },
        ],
    },
    {
        slug: 'masjid',
        audience: 'Masjid & komunitas',
        h1: 'Bingkai foto profil untuk masjid',
        subtitle: 'Kumpulkan jamaah di sekitar acara atau kampanye.',
        keyword: 'bingkai foto profil masjid',
        intro: [
            'Acara besar, penggalangan, atau peringatan: bingkai profil membantu jamaah tampil bersama di media sosial.',
            'Gratis tanpa daftar. Bagikan satu link di grup komunitas.',
        ],
        benefits: [
            { title: 'Satu link untuk semua', body: 'Kirim di grup WhatsApp dan saluran komunitas.' },
            { title: 'Mudah di HP', body: 'Semua usia bisa pasang bingkai dalam hitungan detik.' },
            { title: 'Identitas acara', body: 'Upload logo atau pilih warna yang cocok.' },
        ],
        faqs: [
            { q: 'Apakah gratis?', a: 'Ya. Tanpa watermark dan tanpa biaya untuk pendukung.' },
            { q: 'Perlu akun untuk ikut?', a: 'Tidak. Buka link, pasang foto, selesai.' },
        ],
    },
    {
        slug: 'komunitas',
        audience: 'Komunitas',
        h1: 'Bingkai foto profil untuk komunitas',
        subtitle: 'Satukan relawan dan anggota di sekitar satu tujuan.',
        keyword: 'bingkai foto profil komunitas',
        intro: [
            'Gerakan tumbuh saat orang-orang memakainya di profil. Ollabs memudahkan komunitas membuat bingkai dan membagikan satu link.',
            'Gratis untuk organisasi dan pendukung.',
        ],
        benefits: [
            { title: 'Branding cepat', body: 'Logo atau warna komunitas di setiap foto.' },
            { title: 'Tanpa hambatan', body: 'Tidak perlu login untuk ikut.' },
            { title: 'Angka nyata', body: 'Penghitung menunjukkan dukungan sebenarnya.' },
        ],
        faqs: [
            { q: 'Cocok untuk NGO?', a: 'Ya. Gratis untuk kampanye dan pendukung tanpa batas.' },
            { q: 'Foto disimpan di server?', a: 'Tidak. Proses di browser pengguna.' },
        ],
    },
    {
        slug: 'sekolah',
        audience: 'Sekolah',
        h1: 'Bingkai foto profil untuk sekolah',
        subtitle: 'Hari sekolah, lomba, dan kebanggaan kelas.',
        keyword: 'bingkai foto profil sekolah',
        intro: [
            'Hari peringatan sekolah atau lomba antarkelas: satu bingkai membuat siswa, orang tua, dan guru tampil seragam.',
            'Gratis tanpa aplikasi. Bagikan link di grup kelas.',
        ],
        benefits: [
            { title: 'Warna sekolah', body: 'Atur warna atau upload lambang sekolah.' },
            { title: 'Acara berulang', body: 'Bingkai baru tiap kegiatan.' },
            { title: 'Semua bisa ikut', body: 'Tanpa install, tanpa daftar.' },
        ],
        faqs: [
            { q: 'Orang tua bisa ikut?', a: 'Ya. Siapa pun dengan link bisa pasang bingkai.' },
            { q: 'Aman untuk anak?', a: 'Foto diproses di perangkat, tidak disimpan di server kami.' },
        ],
    },
    {
        slug: 'acara',
        audience: 'Acara',
        h1: 'Bingkai foto profil untuk acara',
        subtitle: 'Buat buzz sebelum, saat, dan sesudah acara.',
        keyword: 'bingkai foto profil acara',
        intro: [
            'Peserta jadi promotor saat memakai bingkai acara. Satu link plus QR di venue, dan orang bergabung di tempat.',
            'Gratis tanpa daftar. Branding acara di setiap foto.',
        ],
        benefits: [
            { title: 'QR siap cetak', body: 'Unduh QR kampanye untuk spanduk dan layar.' },
            { title: 'Tanda "saya datang"', body: 'Peserta menarik peserta lain.' },
            { title: 'Desain acara', body: 'Logo atau warna resmi acara.' },
        ],
        faqs: [
            { q: 'Bisa dipakai saat acara?', a: 'Ya. Tampilkan QR di layar agar orang ikut di lokasi.' },
            { q: 'Perlu aplikasi?', a: 'Tidak. Browser HP sudah cukup.' },
        ],
    },
    {
        slug: 'kampanye',
        audience: 'Kampanye sosial',
        h1: 'Bingkai foto profil untuk kampanye sosial',
        subtitle: 'Sebar awareness dengan satu link yang mudah dibagikan.',
        keyword: 'bingkai kampanye sosial twibbon',
        intro: [
            'Kampanye awareness menyebar saat orang memakainya. Buat bingkai untuk cause Anda dan bagikan di media sosial.',
            'Gratis tanpa watermark. Alternatif twibbon tanpa membebanki pendukung.',
        ],
        benefits: [
            { title: 'Warna awareness', body: 'Pilih warna pita atau upload desain sendiri.' },
            { title: 'Viral lewat share', body: 'Setelah download, orang diajak bagikan lagi.' },
            { title: 'Tanpa watermark', body: 'Foto bersih, tidak ada upsell ke pendukung.' },
        ],
        faqs: [
            { q: 'Bagaimana cara buat twibbon gratis?', a: 'Upload desain bingkai, beri nama kampanye, lalu bagikan link-nya. Pendukung dapat memasang foto tanpa daftar.' },
            { q: 'Apakah ini alternatif Twibbonize?', a: 'Ya. Tanpa watermark dan tanpa biaya untuk yang mendukung.' },
            { q: 'Apakah hitungan asli?', a: 'Ya. Hanya yang benar-benar pasang bingkai yang dihitung.' },
        ],
    },
];

export function getUseCaseId(slug: string): UseCase | undefined {
    return USE_CASES_ID.find((u) => u.slug === slug);
}
