import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Notice as NoticeType } from '../types';
import { ArrowLeft } from 'lucide-react';

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<NoticeType | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('artforesta_notices');
    if (saved) {
      const notices: NoticeType[] = JSON.parse(saved);
      const found = notices.find(n => n.id === id);
      if (found) {
        setNotice(found);
      }
    }
  }, [id]);

  if (!notice) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center bg-white">
        <h2 className="text-xl font-nanum text-stone-400 mb-8">존재하지 않는 공지사항입니다.</h2>
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
      className="min-h-screen bg-white pt-32 pb-24 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Go Back</span>
        </button>

        <div className="mb-12 border-b border-stone-100 pb-12">
          <h1 className="text-4xl md:text-5xl font-nanum font-bold text-stone-900 tracking-tight leading-tight mb-8">
            {notice.title}
          </h1>
        </div>

        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-stone-600 font-nanum leading-relaxed whitespace-pre-wrap">
            {notice.content}
          </p>
        </div>

        <div className="mt-24 pt-12 border-t border-stone-100 flex justify-between items-center">
           <span className="text-[10px] tracking-[0.3em] font-medium text-stone-400 uppercase">Art Foresta Legal Notice Board</span>
        </div>
      </div>
    </motion.div>
  );
}
