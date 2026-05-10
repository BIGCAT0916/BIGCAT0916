import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, LogOut } from 'lucide-react';
import { Notice } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsUnlocked(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isUnlocked) {
      const q = query(collection(db, 'notices'), orderBy('date', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const noticesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notice[];
        setNotices(noticesData);
      });
      return () => unsubscribe();
    }
  }, [isUnlocked]);

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '0916') {
      setIsUnlocked(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const addNotice = async () => {
    if (!newTitle || !newContent) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'notices'), {
        title: newTitle,
        content: newContent,
        date: new Date().toLocaleDateString('ko-KR').replace(/-/g, '.').slice(0, -1)
      });
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error("Error adding notice:", error);
      alert("공지사항 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'notices', id));
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-bold tracking-widest uppercase text-stone-900">Admin Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!isUnlocked ? (
            <form onSubmit={handlePasswordSubmit} className="max-w-xs mx-auto py-12 text-center">
              <p className="text-sm text-stone-500 mb-6 font-apple">비밀번호를 입력하세요.</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 text-center tracking-[0.5em] mb-4"
                autoFocus
              />
              <button 
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-md text-xs font-bold tracking-widest hover:bg-stone-800 transition-colors"
              >
                ACCESS
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-stone-400">ADMIN</span>
                  </div>
                  <span className="text-sm font-medium text-stone-700">관리자 모드</span>
                </div>
                <button 
                  onClick={() => setIsUnlocked(false)}
                  className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Add New Notice</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 text-sm font-apple"
                  />
                  <textarea
                    placeholder="내용을 입력하세요"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 text-sm font-apple min-h-[100px]"
                  />
                  <button 
                    onClick={addNotice}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-2 rounded-md text-xs font-bold tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" /> {loading ? 'ADDING...' : 'ADD NOTICE'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Existing Notices</h3>
                <div className="space-y-3">
                  {notices.map(notice => (
                    <div key={notice.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-md hover:bg-stone-50 transition-colors group">
                      <div className="flex-1 min-w-0 pr-4">
                        <span className="text-[9px] font-mono text-stone-400 uppercase">{notice.date}</span>
                        <h4 className="text-sm font-bold text-stone-800 truncate">{notice.title}</h4>
                      </div>
                      <button 
                        onClick={() => deleteNotice(notice.id)}
                        className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
