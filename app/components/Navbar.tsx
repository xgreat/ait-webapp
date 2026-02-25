'use client'; // WAJIB ADA! Ini memberi tahu Next.js bahwa file ini bisa pakai onClick

import Link from 'next/link';

export default function Navbar() {
    const toggleMobileMenu = () => {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
    };

    return (
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Area */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div className="leading-tight">
                                <span className="font-bold text-lg text-white block">AI & Tech Training Center</span>
                                <span className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold">Powered by PLAI BMD</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#home" className="text-white hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Beranda</Link>
                            <Link href="#programs" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Program</Link>
                            <Link href="#bridge" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Jalur Karir</Link>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="#contact" className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg">
                            Daftar Sekarang
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden hidden bg-slate-800 border-b border-gray-700" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="#home" className="text-white block px-3 py-2 rounded-md text-base font-medium">Beranda</Link>
                    <Link href="#programs" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Program</Link>
                    <Link href="#contact" className="text-sky-400 block px-3 py-2 rounded-md text-base font-medium font-bold">Daftar Sekarang</Link>
                </div>
            </div>
        </nav>
    );
}