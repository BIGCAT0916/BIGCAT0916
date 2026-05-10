import { motion } from 'motion/react';
import { Notice as NoticeType } from '../types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Notice() {
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const noticesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NoticeType[];
      setNotices(noticesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching notices: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="notice" className="py-16 bg-white border-t border-stone-100 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.7]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #ececec 1px, transparent 1px), linear-gradient(to bottom, #ececec 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Decorative Light Gray Boxes */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-stone-50 rounded-full blur-3xl opacity-60 -z-1" />
      <div className="absolute bottom-20 -left-20 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-60 -z-1" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-[10px] tracking-[0.4em] font-bold uppercase text-stone-400 mb-4">Announcement</h2>
          <h3 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 italic">Notice</h3>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-stone-400 py-16 font-nanum">불러오는 중...</p>
          ) : notices.length === 0 ? (
            <p className="text-center text-stone-400 py-16 font-nanum">등록된 공지사항이 없습니다.</p>
          ) : (
            notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group border-b border-stone-100 last:border-0 pb-6"
              >
                <Link to={`/notice/${notice.id}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <h4 className="text-[22px] font-nanum font-bold text-stone-800 mb-2 group-hover:text-stone-950 transition-colors">
                        {notice.title}
                      </h4>
                      <p className="text-sm text-stone-500 font-apple tracking-[-0.1em] leading-relaxed line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
