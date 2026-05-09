import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Notice } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('artforesta_notices');
      if (saved) setNotices(JSON.parse(saved));
      setPassword('');
      setIsAuthorized(false);
    }
  }, [isOpen]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === '0916') {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const addNotice = () => {
    if (!newTitle || !newContent) return;
    const notice: Notice = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      date: new Date().toLocaleDateString('ko-KR').replace(/-/g, '.').slice(0, -1)
    };
    const updated = [notice, ...notices];
    setNotices(updated);
    localStorage.setItem('artforesta_notices', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notices-updated'));
    setNewTitle('');
    setNewContent('');
  };

  const deleteNotice = (id: string) => {
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    localStorage.setItem('artforesta_notices', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notices-updated'));
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
          {!isAuthorized ? (
            <form onSubmit={handleLogin} className="max-w-xs mx-auto py-12 text-center">
              <p className="text-sm text-stone-500 mb-6 font-nanum">비밀번호를 입력하세요.</p>
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
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Add New Notice</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 text-sm font-nanum"
                  />
                  <textarea
                    placeholder="내용을 입력하세요"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-4 py-2 border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 text-sm font-nanum min-h-[100px]"
                  />
                  <button 
                    onClick={addNotice}
                    className="flex items-center justify-center gap-2 w-full bg-stone-900 text-white py-2 rounded-md text-xs font-bold tracking-widest hover:bg-stone-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> ADD NOTICE
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
