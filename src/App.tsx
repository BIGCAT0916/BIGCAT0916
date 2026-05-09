/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Divisions from './components/Divisions';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Notice from './components/Notice';
import NoticeDetail from './components/NoticeDetail';
import AdminDashboard from './components/AdminDashboard';
import { PortfolioItem } from './types';

const PROJECTS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Film',
    category: 'Pr-Film / Commercial / AI / Cinema',
    description: '클라이언트 : 삼성전자, 현대자동차, 현대엔지니어링, E1, Dsec, 대한민국 정부, 재정경제부, 사행산업통합감독위원회, 부산교육청, 대구광역시, KWATER, 한국중부발전, 한국농어촌공사, 신용보증기금, 국방품질기술원 등',
    image: 'https://lh3.googleusercontent.com/d/188wtdPW7Nwpf5OMMdhswAhOyJA2wF1cC',
  },
  {
    id: '2',
    title: 'Branding Campaign',
    category: 'Commercial / Marketing',
    description: '클라이언트 : MBC, SBS, KBS, CBS, 온라인 캠페인(유튜브,인스타그램) 등',
    image: 'https://lh3.googleusercontent.com/d/1SXpudBfBo2ll2lJtkISqvNjbNpAKjtvF',
  },
  {
    id: '3',
    title: 'Fashion Consulting',
    category: 'Fashion / Style',
    description: 'Style Consulting : 아티스트 스타일링 컨설팅. TVCF(배달쑤맨, 부산교육청, 어떤 선택을 하시겠습니까? 등), 뮤직비디오 아트웍, Fashion Brand TEB 등',
    image: 'https://lh3.googleusercontent.com/d/16r7giBs813NCECgkAQTGjvUHDzwDEkyV',
  },
  {
    id: '4',
    title: 'Modern Soulful Music',
    category: 'Sound / Music',
    description: 'Musician : Ji yoon Park_"블루포레스타", "오래의 부탁", "새벽항해" 등.',
    image: 'https://lh3.googleusercontent.com/d/1YQAEYBYQjQ1H9Et_zkPn1OOU5GV7z2OG',
  },
  {
    id: '5',
    title: 'Educational Institutions',
    category: 'PROMOTIONAL VIDEO',
    description: '촬영 및 제작 : 미국 노스웨스턴대학교, 중국 북경대학교, 싱가폴 난양공대, 국립경상대학교, 솔브릿지국제경영대학, 우송대학교, 대구가톨릭대학교, 대구과학대학교, 경남대학교, 국립창원대학교, 창신대학교, 인제대학교, 영산대학교 등',
    image: 'https://lh3.googleusercontent.com/d/1RN-jpn_kRGmEDpV7G2qHDJ1e4N9oj60g',
  },
];

function Landing() {
  return (
    <>
      <Hero />
      <About />
      <Divisions />
      <Portfolio items={PROJECTS} />
      <Contact />
      <Notice />
    </>
  );
}

function PageScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handleOpenAdmin = () => setIsAdminOpen(true);
    window.addEventListener('open-admin-dashboard', handleOpenAdmin);
    return () => window.removeEventListener('open-admin-dashboard', handleOpenAdmin);
  }, []);

  return (
    <BrowserRouter>
      <PageScrollToTop />
      <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
          </Routes>
        </main>

        <Footer />
        <ScrollToTop />
        
        <AnimatePresence>
          {isAdminOpen && (
            <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

