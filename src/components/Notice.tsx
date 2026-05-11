import { motion, AnimatePresence } from 'motion/react';
import { Notice as NoticeType } from '../types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { X, ChevronRight } from 'lucide-react';

interface NoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Notice({ isOpen, onClose }: NoticeProps) {
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, 'notices'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NoticeType[];

      // Sort manually to include legacy docs without createdAt
      noticesData.sort((a, b) => {
        const timeA = (a.createdAt as any)?.seconds || new Date(a.date.replace(/\. /g, '-').replace(/\.$/, '')).getTime() / 1000;
        const timeB = (b.createdAt as any)?.seconds || new Date(b.date.replace(/\. /g, '-').replace(/\.$/, '')).getTime() / 1000;
        return timeB - timeA;
      });

      setNotices(noticesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col overflow-hidden relative"
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
        <div className="absolute top-[30%] left-[15%] w-40 h-40 border border-stone-50 rotate-12 z-0 pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-32 h-32 border border-stone-50 -rotate-12 z-0 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 border-b border-stone-100 bg-white/80 backdrop-blur-md relative z-10">
          <div>
            <h2 className="text-[9px] md:text-[10px] tracking-[0.4em] font-bold uppercase text-stone-400 mb-0.5 md:mb-1">Announcement</h2>
            <h3 className="text-xl md:text-2xl font-serif text-stone-900 italic">Notice</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-stone-50 rounded-full transition-colors group flex items-center gap-1 md:gap-2"
          >
            <span className="text-[9px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-0.5 md:mr-1 hidden sm:inline">Back to site</span>
            <X className="w-4 h-4 md:w-5 md:h-5 text-stone-400 group-hover:text-stone-900" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto relative z-10 scrollbar-hide">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-400 font-apple animate-pulse">불러오는 중...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-400 font-apple">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-px md:space-y-1 pb-12">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Link 
                    to={`/notice/${notice.id}`} 
                    onClick={onClose}
                    className="flex items-center justify-between p-4 md:p-6 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-base md:text-[19px] font-bold text-stone-800 truncate group-hover:text-stone-900 transition-colors font-apple">
                        {notice.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[10px] text-stone-400 tracking-widest font-apple">ART FORESTA COMPREHENSIVE ARTS GROUP</p>
        </div>
      </motion.div>
    </div>
  );
}
