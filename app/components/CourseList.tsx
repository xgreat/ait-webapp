'use client';

import { useState } from 'react';

// --- DATA SILABUS (DIAMBIL DARI DOKUMEN WORD) ---
const allCourses = [
  // --- SAINS DATA TERAPAN ---
  {
    id: 'sd-1',
    category: 'Sains Data Terapan',
    title: 'Data Science dengan Python',
    duration: '3 Hari (5 Jam perhari)',
    instructor: 'Hidayah Nurul Hasanah Zen',
    price: 'Rp 3.000.000,-/orang',
    description: 'Fondasi programming Python untuk manipulasi data, visualisasi, dan machine learning dasar.'
  },
  {
    id: 'sd-2',
    category: 'Sains Data Terapan',
    title: 'Analitik Data Excel',
    duration: '2 Hari (5 Jam perhari)',
    instructor: 'Hidayah Nurul Hasanah Zen',
    price: 'Rp 2.500.000,-/orang',
    description: 'Kuasai analisis data bisnis menggunakan Excel untuk pengambilan keputusan yang akurat.'
  },
  {
    id: 'sd-3',
    category: 'Sains Data Terapan',
    title: 'Deteksi Deepfake dengan Computer Vision',
    duration: '2 Hari (5 Jam perhari)',
    instructor: 'Syahmi Sajid',
    price: 'Rp 1.500.000,-/orang',
    description: 'Praktek mendeteksi gambar palsu (Deepfake) dari pengembangan model hingga deployment.'
  },

  // --- AI & ROBOTIK ---
  {
    id: 'ai-1',
    category: 'AI & Robotik',
    title: 'BPMN dengan Bizagi',
    duration: '2 Hari (5 Jam perhari)',
    instructor: 'Yurio Windiatmoko',
    price: 'Rp 3.000.000,-/orang',
    description: 'Modeling proses bisnis menggunakan standar BPMN dengan alat bantu Bizagi.'
  },
  {
    id: 'ai-2',
    category: 'AI & Robotik',
    title: 'Computer Vision untuk Quality Control',
    duration: '3 hari (5 jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 3.000.000,-/orang',
    description: 'Implementasi computer vision untuk kontrol kualitas otomatis dan monitoring visual pabrik.'
  },
  {
    id: 'ai-3',
    category: 'AI & Robotik',
    title: 'AI untuk Otomasi Bisnis',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 2.000.000,-/orang',
    description: 'Implementasi AI untuk efisiensi proses bisnis dan analitik data yang lebih cerdas.'
  },
  {
    id: 'ai-4',
    category: 'AI & Robotik',
    title: 'AI untuk UMKM',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 1.500.000,-/orang',
    description: 'Strategi pemasaran berbasis AI dan optimasi operasional untuk UMKM.'
  },
  {
    id: 'ai-5',
    category: 'AI & Robotik',
    title: 'Pengembangan Aplikasi Mobile AI',
    duration: '3 hari (5 Jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 3.000.000,-/orang',
    description: 'Membangun aplikasi mobile cerdas berbasis AI untuk kebutuhan bisnis.'
  },
  {
    id: 'ai-6',
    category: 'AI & Robotik',
    title: 'Prompt Engineering',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 1.000.000,-/orang',
    description: 'Tingkatkan produktivitas profesional dan edukasi dengan teknik prompt yang efektif.'
  },
  {
    id: 'ai-7',
    category: 'AI & Robotik',
    title: 'Vibe Coding',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Nurdana Ahmad Fadil',
    price: 'Rp 3.000.000,-/orang',
    description: 'Teknik coding modern untuk pengembangan aplikasi yang cepat dan efisien.'
  },
  {
    id: 'ai-8',
    category: 'AI & Robotik',
    title: 'AutoCad Dasar',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Yulis Rijal Fauzan',
    price: 'Rp 1.500.000,-/orang',
    description: 'Desain teknis dasar untuk kebutuhan engineering dan manufaktur digital.'
  },
  {
    id: 'ai-9',
    category: 'AI & Robotik',
    title: 'AutoCad Elektrik',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Yulis Rijal Fauzan',
    price: 'Rp 2.500.000,-/orang',
    description: 'Desain teknik listrik dan elektronik menggunakan AutoCAD.'
  },
  {
    id: 'ai-10',
    category: 'AI & Robotik',
    title: 'PLC (Programmable Logic Control)',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Yulis, Satria, Vian',
    price: 'Rp 4.000.000,-/orang',
    description: 'Logika kontrol otomatis untuk sistem industri, perhatikan: PLC belum tersedia.'
  },
  {
    id: 'ai-11',
    category: 'AI & Robotik',
    title: 'Microsoft Office Specialist',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Satria',
    price: 'Rp 1.500.000,-/orang',
    description: 'Penguasaan paket Microsoft Office standar industri untuk produktivitas kantor.'
  },
  {
    id: 'ai-12',
    category: 'AI & Robotik',
    title: 'IoT untuk Pabrik Lokal',
    duration: '2 hari (5 Jam perhari)',
    instructor: 'Kristiawan Devianto',
    price: 'Rp 1.799.999,-/orang',
    description: 'Perancangan, pemasangan, dan pemeliharaan sistem IoT untuk pabrik skala lokal.'
  },

  // --- REKAYASA KEAMANAN SIBER ---
  {
    id: 'cs-1',
    category: 'Rekayasa Keamanan Siber',
    title: 'Dasar Keamanan Siber',
    duration: '2 Hari (5 jam/hari)',
    instructor: 'Aan Kurniawan',
    price: 'Rp 1.500.000,-/orang',
    description: 'Pelatihan dasar pertahanan siber untuk karyawan dan manajemen non-teknis.'
  },
  {
    id: 'cs-2',
    category: 'Rekayasa Keamanan Siber',
    title: 'OOP dengan Java',
    duration: '3 Hari (5 jam/hari)',
    instructor: 'Fahmi Auliya Tsani',
    price: 'Rp 1.000.000,-/orang',
    description: 'Pemrograman berorientasi objek fundamental menggunakan bahasa Java.'
  },
  {
    id: 'cs-3',
    category: 'Rekayasa Keamanan Siber',
    title: 'RESTful API dengan Spring Boot',
    duration: '4 hari (8 jam/hari)',
    instructor: 'Fahmi Auliya Tsani',
    price: 'Rp 1.500.000,-/orang',
    description: 'Membangun API yang kuat dan aman menggunakan Spring Boot.'
  },
  {
    id: 'cs-4',
    category: 'Rekayasa Keamanan Siber',
    title: 'Secure Coding Java OWASP',
    duration: '3 Hari (5 jam/hari)',
    instructor: 'Fahmi Auliya Tsani',
    price: 'Rp 3.000.000,-/orang',
    description: 'Secure coding standar industri untuk mencegah vulnerabilitas OWASP Top 10.'
  },
  {
    id: 'cs-5',
    category: 'Rekayasa Keamanan Siber',
    title: 'Penanganan Insiden Siber',
    duration: '3 Hari (5 jam/hari)',
    instructor: 'Aan Kurniawan',
    price: 'Rp 7.500.000,-/orang',
    description: 'Penanganan insiden keamanan siber dan prosedur respon insiden.'
  }
];

// --- KOMPONEN KARTU KURSUS ---
function CourseCard({ course }: { course: any }) {
  // Fungsi untuk mendapatkan icon berdasarkan kursus
  const getIcon = (course: any) => {
    if (course.title.includes('Analitik Data Excel')) {
      return (
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Data Science dengan Python')) {
      return (
        <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Computer Vision untuk Quality Control')) {
      return (
        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Deteksi Deepfake')) {
      return (
        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Prompt Engineering')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('AI untuk Otomasi Bisnis')) {
      return (
        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('AutoCad')) {
      return (
        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Dasar Keamanan Siber')) {
      return (
        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('OOP dengan Java')) {
      return (
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('RESTful API dengan Spring Boot')) {
      return (
        <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5.5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('BPMN')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3z M7 7h10v2H7z M7 11h10v2H7z M7 15h6v2H7z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('AI untuk UMKM')) {
      return (
        <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Pengembangan Aplikasi Mobile')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Vibe Coding')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('PLC')) {
      return (
        <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Microsoft Office')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('IoT')) {
      return (
        <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20.1h.01"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Secure Coding Java OWASP')) {
      return (
        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
      );
    } else if (course.title.includes('Penanganan Insiden Siber')) {
      return (
        <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4m0 4h.01"></path>
          </svg>
        </div>
      );
    } else {
      // Default icon
      return (
        <div className={`p-3 rounded-lg ${
          course.category === 'Sains Data Terapan' ? 'bg-blue-500/10 text-blue-400' :
          course.category === 'AI & Robotik' ? 'bg-indigo-500/10 text-indigo-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5c-1.746 0-3.332.477-4.475 1.253v13C4.168 19.003 6.466 21.5 7.5 21.5c1.746 0 3.332-.477 4.475-1.253V11.757c0-1.253-.729-2.475-1.475-4.475V5.253z" />
          </svg>
        </div>
      );
    }
  };

  return (
    <div className={`group bg-slate-800 rounded-xl p-6 border border-white/5 hover:border-sky-500/30 transition-all hover:-translate-y-1 relative overflow-hidden ${course.id === 'ai-6' ? 'relative overflow-hidden' : ''}`}>
      {course.id === 'ai-6' && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">BEST SELLER</div>
      )}
      <div className="flex justify-between items-start mb-4">
        {getIcon(course)}
        <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
          {course.duration.split(' ')[0]} Hari
        </span>
      </div>
      <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{course.title}</h4>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
      <div className="text-sky-400 font-bold text-sm">
        {course.price.split(',')[0]} <span className="text-slate-500 font-normal">/orang</span>
      </div>
    </div>
  );
}

// --- COMPONENT LIST KATEGORI (Dengan Logic Load More) ---
function CategorySection({ title, initialLimit, categoryData, colorBar, colorBorder }: any) {
  // State untuk mengontrol berapa kartu yang ditampilkan (Default: 3)
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  const items = categoryData;

  const handleShowMore = () => {
    setVisibleCount(items.length); // Tampilkan semua item
  };

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className={`w-1 h-6 rounded-full ${colorBar}`}></span>
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.slice(0, visibleCount).map((course: any) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Tombol More: Hanya muncul jika total item lebih dari limit awal */}
      {visibleCount < items.length && (
        <div className="mt-8 text-center">
          <button 
            onClick={handleShowMore}
            className="px-6 py-2 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 hover:bg-slate-800 transition-all text-sm font-semibold"
          >
            Tampilkan Lebih Banyak ({items.length - initialLimit} Lagi)
          </button>
        </div>
      )}
    </div>
  );
}

// --- COMPONENT UTAMA EXPORT ---
export default function CourseList() {
  // Pisahkan data berdasarkan kategori
  const dataSainsData = allCourses.filter(c => c.category === 'Sains Data Terapan');
  const dataAiRobotik = allCourses.filter(c => c.category === 'AI & Robotik');
  const dataCyber = allCourses.filter(c => c.category === 'Rekayasa Keamanan Siber');

  return (
    <>
      {/* Render Kategori dengan fungsi Load More */}
      <CategorySection 
        title="Sains Data & Analitik"
        initialLimit={3}
        categoryData={dataSainsData}
        colorBar="bg-sky-500"
        colorBorder="hover:border-sky-500/30"
      />

      <CategorySection 
        title="AI & Robotik untuk Industri"
        initialLimit={3}
        categoryData={dataAiRobotik}
        colorBar="bg-indigo-500"
        colorBorder="hover:border-indigo-500/30"
      />

      <CategorySection 
        title="Rekayasa Keamanan Siber"
        initialLimit={3}
        categoryData={dataCyber}
        colorBar="bg-red-500"
        colorBorder="hover:border-red-500/30"
      />
    </>
  );
}