import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, LogOut, Bold, Italic, Link2, Image as ImageIcon, List, AlignLeft, AlignCenter, AlignRight, ChevronLeft, Type, Video, Underline as UnderlineIcon, Edit2 } from 'lucide-react';
import { Notice } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Placeholder from '@tiptap/extension-placeholder';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activePrompt, setActivePrompt] = useState<null | 'image' | 'youtube' | 'link'>(null);
  const [promptValue, setPromptValue] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'aspect-video w-full rounded-lg my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    content: '',
  });

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setIsUnlocked(false);
      setIsAdding(false);
      setEditingId(null);
      setNewTitle('');
      editor?.commands.setContent('');
    }
  }, [isOpen, editor]);

  useEffect(() => {
    if (isUnlocked) {
      const q = query(collection(db, 'notices'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const noticesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notice[];

        // Sort manually to include legacy docs without createdAt
        noticesData.sort((a, b) => {
          const timeA = (a.createdAt as any)?.seconds || new Date(a.date.replace(/\. /g, '-').replace(/\.$/, '')).getTime() / 1000;
          const timeB = (b.createdAt as any)?.seconds || new Date(b.date.replace(/\. /g, '-').replace(/\.$/, '')).getTime() / 1000;
          return timeB - timeA;
        });

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
    if (!newTitle || !editor?.getHTML()) return;
    setLoading(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'notices', editingId), {
          title: newTitle,
          content: editor.getHTML(),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'notices'), {
          title: newTitle,
          content: editor.getHTML(),
          date: new Date().toLocaleDateString('ko-KR').replace(/-/g, '.').slice(0, -1),
          createdAt: serverTimestamp()
        });
      }
      setNewTitle('');
      setEditingId(null);
      editor.commands.setContent('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving notice:", error);
      alert("공지사항 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setNewTitle(notice.title);
    setEditingId(notice.id);
    editor?.commands.setContent(notice.content);
    setIsAdding(true);
  };

  const deleteNotice = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'notices', id));
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("삭제에 실패했습니다. (Firestore 권한 실패일 수 있습니다)");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        editor?.chain().focus().setImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
    }
    // Clear input
    e.target.value = '';
  };

  const handlePromptSubmit = () => {
    if (!promptValue) {
      setActivePrompt(null);
      return;
    }

    if (activePrompt === 'link') {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: promptValue }).run();
    } else if (activePrompt === 'image') {
      editor?.chain().focus().setImage({ src: promptValue }).run();
    } else if (activePrompt === 'youtube') {
      editor?.chain().focus().setYoutubeVideo({ src: promptValue }).run();
    }

    setPromptValue('');
    setActivePrompt(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-stone-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white tracking-widest">AF</span>
            </div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-stone-900">Admin Dashboard</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Close</span>
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {!isUnlocked ? (
            <div className="h-full flex items-center justify-center p-12 bg-stone-50">
              <form onSubmit={handlePasswordSubmit} className="w-full max-w-xs text-center">
                <div className="mb-10">
                  <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-lg font-bold text-white tracking-widest">AF</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">Admin Access</h3>
                  <p className="text-xs text-stone-400 font-apple">관리자 전용 페이지입니다.</p>
                </div>
                <div className="space-y-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full px-4 py-4 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-400 text-center tracking-[1em] text-xl transition-all shadow-sm"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 rounded-lg text-xs font-bold tracking-widest hover:bg-stone-800 transition-all shadow-md active:scale-[0.98]"
                  >
                    LOGIN
                  </button>
                </div>
              </form>
            </div>
          ) : isAdding ? (
            <div className="flex flex-col h-full bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setNewTitle('');
                      editor?.commands.setContent('');
                    }}
                    className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="공지사항 제목"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 text-lg font-bold text-stone-800 placeholder-stone-300 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setNewTitle('');
                      editor?.commands.setContent('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    onClick={addNotice}
                    disabled={loading}
                    className="px-6 py-2 text-xs font-bold text-white bg-[#f86d1a] hover:bg-[#e05d15] rounded shadow-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? '저장 중...' : editingId ? '수정 완료' : '게시'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 px-4 py-2 bg-stone-50 border-b border-stone-200 overflow-x-auto custom-scrollbar">
                <div className="flex items-center gap-1 border-r border-stone-200 pr-2">
                  <button 
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('bold') ? 'bg-stone-200' : ''}`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('italic') ? 'bg-stone-200' : ''}`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('underline') ? 'bg-stone-200' : ''}`}
                    title="Underline"
                  >
                    <UnderlineIcon className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1 border-r border-stone-200 px-2">
                  <button 
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-stone-200' : ''}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'bg-stone-200' : ''}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'bg-stone-200' : ''}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1 border-r border-stone-200 px-2">
                  <button 
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('heading', { level: 1 }) ? 'bg-stone-200 font-bold' : ''}`}
                    title="H1"
                  >
                    <span className="text-xs font-bold">H1</span>
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-stone-200 font-bold' : ''}`}
                    title="H2"
                  >
                    <span className="text-xs font-bold">H2</span>
                  </button>
                  <button 
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('bulletList') ? 'bg-stone-200' : ''}`}
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1 px-2">
                  <button 
                    onClick={() => setActivePrompt(activePrompt === 'link' ? null : 'link')} 
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${editor?.isActive('link') || activePrompt === 'link' ? 'bg-stone-200' : ''}`} 
                    title="Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <div className="relative flex items-center">
                    <button 
                      onClick={() => setActivePrompt(activePrompt === 'image' ? null : 'image')} 
                      className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${activePrompt === 'image' ? 'bg-stone-200' : ''}`} 
                      title="Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <label className="absolute inset-0 cursor-pointer opacity-0">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button 
                    onClick={() => setActivePrompt(activePrompt === 'youtube' ? null : 'youtube')} 
                    className={`p-1.5 hover:bg-stone-200 text-stone-600 rounded transition-colors ${activePrompt === 'youtube' ? 'bg-stone-200' : ''}`} 
                    title="YouTube"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activePrompt && (
                <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">
                    {activePrompt === 'link' ? 'Link URL' : activePrompt === 'youtube' ? 'YouTube URL' : 'Image URL'}
                  </span>
                  <input
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-white border border-stone-200 rounded px-3 py-1 text-xs outline-none focus:border-stone-400"
                    onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
                    autoFocus
                  />
                  <button 
                    onClick={handlePromptSubmit}
                    className="px-3 py-1 bg-stone-900 text-white text-[10px] font-bold rounded"
                  >
                    적용
                  </button>
                  <button 
                    onClick={() => setActivePrompt(null)}
                    className="p-1 hover:bg-stone-200 rounded"
                  >
                    <X className="w-3 h-3 text-stone-400" />
                  </button>
                </div>
              )}

              <div className="flex-1 min-h-0 bg-white editor-container custom-scrollbar-always">
                <EditorContent editor={editor} className="outline-none min-h-full p-10 font-apple" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f86d1a]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#f86d1a]">Admin</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">관리자 모드</p>
                      <p className="text-[10px] text-stone-400 font-apple">Art Foresta Dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsAdding(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#f86d1a] text-white text-[11px] font-bold tracking-widest rounded shadow-sm hover:bg-[#e05d15] transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> 새 공지사항
                    </button>
                    <button 
                      onClick={() => setIsUnlocked(false)}
                      className="p-2.5 text-stone-400 hover:text-stone-900 hover:bg-white rounded-full transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
 
                <div className="flex border-b border-stone-200 mt-4">
                  <button className="px-6 py-3 text-[11px] font-bold text-[#f86d1a] border-b-2 border-[#f86d1a]">글 목록</button>
                </div>
              </div>

              <div className="flex-1 min-h-0 bg-white custom-scrollbar-always">
                <div className="max-w-3xl mx-auto p-6 space-y-px pb-32">
                  {notices.map(notice => (
                    <div key={notice.id} className="flex items-center justify-between p-4 border-b border-stone-50 hover:bg-stone-50 transition-colors group">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200 group-hover:bg-[#f86d1a] transition-colors" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-medium text-stone-800 truncate mb-0.5">{notice.title}</h4>
                          <span className="text-[10px] text-stone-400">{notice.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {deletingId === notice.id ? (
                          <div className="flex items-center gap-1 bg-red-50 rounded-lg p-1 animate-in fade-in zoom-in duration-200">
                            <span className="text-[10px] font-bold text-red-500 px-2 italic">삭제?</span>
                            <button 
                              onClick={() => deleteNotice(notice.id)}
                              disabled={loading}
                              className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              확인
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 bg-stone-200 text-stone-600 text-[10px] font-bold rounded hover:bg-stone-300 transition-colors"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEditNotice(notice)}
                              className="p-2 text-stone-400 hover:text-[#f86d1a] hover:bg-[#f86d1a]/10 rounded transition-all"
                              title="수정"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setDeletingId(notice.id)}
                              className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <div className="py-20 text-center">
                      <p className="text-sm text-stone-400">등록된 공지사항이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
