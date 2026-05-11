import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Notice as NoticeType } from '../types';
import { ArrowLeft } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'notices', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as NoticeType;
          setNotice({ id: docSnap.id, ...data } as NoticeType);
          // Set dynamic title for SEO
          document.title = `${data.title} | Art Foresta Notice`;
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();

    // Reset title when unmounting
    return () => {
      document.title = "Art Foresta | 아트포레스타 - 종합 예술 전문가 그룹";
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex items-center justify-center bg-white">
        <p className="text-stone-400 font-apple">불러오는 중...</p>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-white">
        <h2 className="text-xl font-apple text-stone-400 mb-8">존재하지 않는 공지사항입니다.</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-stone-900 text-white text-xs font-bold tracking-widest hover:bg-stone-800 transition-colors"
        >
          BACK TO HOME
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pt-20 md:pt-32 pb-12 px-6 relative overflow-hidden"
    >
      {/* Decorative Grid Background (Portfolio Style) */}
      <div className="absolute inset-0 z-0 opacity-[0.4]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #ececec 1px, transparent 1px), linear-gradient(to bottom, #ececec 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Decorative Blur Circles */}
      <div className="absolute top-[20%] -left-[10%] w-96 h-96 bg-stone-50 rounded-full blur-[100px] opacity-60 z-0 pointer-events-none" />
      <div className="absolute bottom-[10%] -right-[5%] w-[30rem] h-[30rem] bg-stone-50 rounded-full blur-[120px] opacity-60 z-0 pointer-events-none" />
      
      {/* Decorative Borders */}
      <div className="absolute top-[30%] left-[15%] w-40 h-40 border border-stone-100 rotate-12 z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-32 h-32 border border-stone-100 -rotate-12 z-0 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <button 
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('open-notice-modal'));
            }, 100);
          }}
          className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="mb-1 border-b border-stone-100 pb-1">
          <h1 className="text-2xl md:text-3xl font-nanum font-bold text-stone-900 tracking-tight leading-tight mb-1">
            {notice.title}
          </h1>
        </div>

        <div className="prose prose-stone max-w-none prose-img:rounded-xl prose-headings:font-nanum prose-p:font-apple">
          <div 
            className="text-lg text-stone-600 font-apple leading-relaxed"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>

        <div className="mt-12 pt-12 border-t border-stone-100 flex justify-between items-center">
        </div>
      </div>
    </motion.div>
  );
}
