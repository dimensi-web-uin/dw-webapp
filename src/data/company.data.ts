import { CameraIcon, MailIcon, MapPinIcon } from 'lucide-react';

const CompanyData = {
  name: 'Dimensi Web',
  copyright: '© 2026 Dimensi Web UIN Sunan Gunung Djati Bandung',
  description:
    'BSO (Badan Semi Otonom) Dimensi Web adalah sebuah komunitas mahasiswa di bawah naungan Jurusan Teknik Informatika UIN Sunan Gunung Djati Bandung yang menjadi ruang pengembangan kemampuan di bidang Website Development.',
  menu: {
    main: {
      title: 'Menu utama',
      links: [
        {
          href: '/lessons',
          label: 'Belajar',
        },
        {
          href: '/articles',
          label: 'Artikel',
        },
        {
          href: '/gallery',
          label: 'Galeri',
        },
        {
          href: '/members',
          label: 'Anggota',
        },
      ],
    },
  },
  socials: [
    {
      icon: MapPinIcon,
      label: 'Jl. A.H. Nasution No.105, Cibiru Kota Bandung, 40614',
      href: '#',
    },
    {
      icon: MailIcon,
      label: 'dimensiweb@uinsgd.ac.id',
      href: '#',
    },
    {
      icon: CameraIcon,
      label: 'Instagram @dimensiweb',
      href: 'https://www.instagram.com/dimensiweb/',
    },
  ],
  vision:
    'Menjadi wadah strategis bagi mahasiswa Teknik Informatika dalam mengembangkan minat dan bakat di bidang pengembangan web guna melahirkan solusi kreatif dan prestasi yang berdampak.',
  missions: [
    'Menumbuhkan minat dan bakat mahasiswa di Bidang Website Development',
    'Menjadi lembaga pengembangan dan penelitian mahasiswa di Bidang Website Development',
    'Berperan serta aktif dalam kegiatan nasional, yang mendukung tridharma perguruan tinggi',
    'Menjalin Kerja sama yang saling menguntungkan di Bidang Website Development',
    'Melahirkan Ilmuwan dan teknisi muda yang Unggul dan Kompetitif.',
  ],
};

export default CompanyData;
