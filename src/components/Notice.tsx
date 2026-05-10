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
        className="w-full h-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 bg-white">
          <div>
            <h2 className="text-[10px] tracking-[0.4em] font-bold uppercase text-stone-400 mb-1">Announcement</h2>
            <h3 className="text-2xl font-serif text-stone-900 italic">Notice</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-50 rounded-full transition-colors group flex items-center gap-2"
          >
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Back to site</span>
            <X className="w-5 h-5 text-stone-400 group-hover:text-stone-900" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 custom-scrollbar-always">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-400 font-apple animate-pulse">불러오는 중...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-400 font-apple">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-1 pb-32">
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
                    className="flex items-center justify-between p-6 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-tighter">{notice.date}</span>
                        <div className="w-1 h-1 rounded-full bg-stone-200" />
                        <span className="text-[10px] font-bold text-[#f86d1a] uppercase tracking-widest">Notice</span>
                      </div>
                      <h4 className="text-[19px] font-bold text-stone-800 truncate group-hover:text-stone-900 transition-colors font-apple">
                        {notice.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
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
