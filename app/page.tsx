import Navbar from './components/Navbar';
import Link from 'next/link';
import CourseList from './components/CourseList'; // Kita akan buat komponen ini nanti

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-sky-500 selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-900/30 border border-sky-500/30 text-sky-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Official Training Partner PLAI BMD
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Transformasi Digital <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              Bersama Ahlinya
            </span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400 mb-10">
            Solusi pelatihan teknologi komprehensif. Mulai dari fondasi data, keamanan siber, hingga implementasi AI strategis untuk bisnis dan industri.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#programs" className="px-8 py-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-lg transition-all shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2">
              Lihat Program
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </Link>
            <Link href="#contact" className="px-8 py-4 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-lg border border-white/10 transition-all backdrop-blur-sm">
              Konsultasi Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* --- THE BRIDGE --- */}
      <section id="bridge" className="py-20 bg-slate-800 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky-500/30 text-sky-400 font-bold text-xl relative z-10">1</div>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-sky-500/50 to-transparent -z-0"></div>
              <h3 className="text-xl font-bold text-white mb-3">Digital Literacy</h3>
              <p className="text-slate-400 text-sm">Penguasaan tools dasar: Microsoft Office Specialist, AutoCAD, dan Analitik Excel.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 text-indigo-400 font-bold text-xl relative z-10">2</div>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent -z-0"></div>
              <h3 className="text-xl font-bold text-white mb-3">Data & Automation</h3>
              <p className="text-slate-400 text-sm">Tingkatkan kapabilitas dengan Python, IoT, dan Otomasi Proses Bisnis (BPA).</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg shadow-sky-500/25">3</div>
              <h3 className="text-xl font-bold text-white mb-3">Advanced AI</h3>
              <p className="text-slate-400 text-sm">Implementasi tingkat lanjut: Computer Vision, Prompt Engineering, dan Secure Coding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROGRAMS SECTION (Call Component Khusus) --- */}
      <section id="programs" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sky-400 font-semibold tracking-wide uppercase text-sm">Katalog Program 2026</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Kurikulum Berbasis Industri
            </p>
            <p className="mt-4 text-slate-400">Disusun oleh para praktisi PLAI BMD untuk menjawab tantangan masa depan.</p>
          </div>

          {/* Memanggil komponen CourseList yang berisi logika interaktif */}
          <CourseList />
        </div>
      </section>

      {/* --- CTA --- */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
            Siap Meningkatkan Skill Digital Anda?
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Konsultasikan kebutuhan training perusahaan atau personal Anda dengan tim ahli kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/" target="_blank" className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold flex items-center justify-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.15-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Chat via WhatsApp
            </a>
            <a href="mailto:info@plai-bmd.com" className="px-8 py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-200 transition-colors">
              Kirim Email
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 border-t border-white/5 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-white">AI & Tech Training Center</span>
            <span className="text-xs text-sky-400 font-semibold uppercase tracking-wider">Powered by PLAI BMD</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 PLAI BMD. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}