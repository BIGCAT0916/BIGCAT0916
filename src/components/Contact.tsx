import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, Mail, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import type { FormEvent } from 'react';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/mzdoaqbg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="pt-24 pb-12 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Left Panel */}
          <div className="p-12 md:p-16 bg-stone-900 text-white">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-stone-500 font-sans tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">
                Let's Collaborate
              </h2>
              <h3 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-8 italic">
                Get in Touch
              </h3>
              <p className="text-stone-400 mb-12 font-light tracking-wide leading-relaxed">
                프로젝트 제안, 협업 문의 혹은 비주얼 브랜딩에 관한 고민이 있으신가요? 
                아트포레스타의 전문가들이 당신의 상상을 현실로 만들어 드립니다.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold uppercase text-stone-500">TEL</p>
                    <p className="text-[17.7px] font-medium">070-7954-4091</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-widest font-bold uppercase text-stone-500">Email</p>
                    <p className="text-[17.7px] font-medium">artforesta@artforesta.co.kr</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel (Form with Success State) */}
          <div className="relative min-h-[500px] flex items-center">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="absolute inset-0 bg-violet-600 p-12 md:p-16 flex flex-col items-center justify-center text-center text-white z-10"
                >
                  <motion.div
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-serif italic mb-4"
                  >
                    Successfully Sent
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-violet-100 font-light max-w-sm mb-12"
                  >
                    메시지가 성공적으로 전송되었습니다.<br />
                    아트포레스타 팀이 확인 후 곧 연락드리겠습니다.
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => setStatus('idle')}
                    className="px-10 py-3 border border-white/30 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-violet-600 transition-all"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full p-12 md:p-16"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] tracking-widest font-bold uppercase text-stone-400 mb-2 ml-1">성함 및 회사명</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          placeholder="홍길동 (아트포레스타)"
                          className="w-full px-4 py-4 bg-stone-50 border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-brand-accent transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-widest font-bold uppercase text-stone-400 mb-2 ml-1">연락처 또는 이메일</label>
                        <input 
                          type="text" 
                          name="contact"
                          required
                          placeholder="Tel & e-mail"
                          className="w-full px-4 py-4 bg-stone-50 border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-brand-accent transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest font-bold uppercase text-stone-400 mb-2 ml-1">Inquiry Type</label>
                    <div className="relative group">
                      <select 
                        name="type" 
                        className="w-full px-4 py-4 bg-stone-50 border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-brand-accent transition-all outline-none appearance-none cursor-pointer pr-12"
                      >
                        <option value="영상제작">영상제작</option>
                        <option value="패션 컨설팅(코디)">패션 컨설팅(코디)</option>
                        <option value="음악 및 음원 제작">음악 및 음원 제작</option>
                        <option value="마케팅">마케팅</option>
                        <option value="협업 제안">협업 제안</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none group-focus-within:text-brand-accent transition-colors" />
                    </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest font-bold uppercase text-stone-400 mb-2 ml-1">Tell us more</label>
                      <textarea 
                        name="message"
                        required
                        rows={4}
                        placeholder="내용을 상세하게 기술해 주시면 빠르고 정확한 답변을 받으실 수 있습니다."
                        className="w-full px-4 py-4 bg-stone-50 border-transparent rounded-xl focus:bg-white focus:ring-1 focus:ring-brand-accent transition-all outline-none resize-none"
                      ></textarea>
                    </div>

                    {status === 'error' && (
                      <p className="text-red-500 text-xs font-semibold ml-1">전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full py-5 bg-stone-900 text-white text-xs font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-stone-800 disabled:bg-stone-400 flex items-center justify-center gap-3 transition-all group overflow-hidden"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

