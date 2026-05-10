import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const images = [
  'https://lh3.googleusercontent.com/d/1diwbf_vUKkzdXTZrf24LfAa035WTmRDU',
  'https://lh3.googleusercontent.com/d/14vgmT2LelRkWt6cOaP3A5QoE_I-GnMCA',
  'https://lh3.googleusercontent.com/d/1HY_kfzrDGEL3oPJkiVForAhEaXt6aFGM',
  'https://lh3.googleusercontent.com/d/179jNbdfg0kugsnMawGbUPPGo79Den2xg',
  'https://lh3.googleusercontent.com/d/1MjjOLvSJLNy-KzZtw1V0nuLM7jlejN3x',
  'https://lh3.googleusercontent.com/d/1nMolIcIJ4c076hgTe5ha_8lZ9QDwwX8p',
  'https://lh3.googleusercontent.com/d/1pKnyyn183I4rYXWiY5UWm_vtCXEj5p0s'
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-stone-950">
        {/* Base Mesh Gradient Layer */}
        <div className="absolute inset-0 z-0 opacity-40">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/30 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-800/40 blur-[100px] rounded-full"
          />
        </div>

        {/* Image Slideshow Layer */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 0.8, scale: 1.08 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2, ease: "easeInOut" },
                scale: { duration: 7, ease: "linear" }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={images[currentImage]} 
                alt="Slideshow Background" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] z-20"></div>
        
        {/* Artistic Texture & Gradients */}
        <div className="absolute inset-0 z-30 opacity-20 pointer-events-none mix-blend-overlay"
             style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/natural-paper.png')` }} />
        
        <div className="absolute inset-0 forest-gradient opacity-30 z-30"></div>

        {/* Floating Aura Glows */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-500/10 blur-[100px] animate-pulse z-40" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stone-400/5 blur-[120px] animate-pulse z-40" />
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h2 className="text-stone-300 font-sans tracking-[0.4em] text-[15.2px] md:text-[17.7px] font-semibold mb-6 uppercase">
            Art Foresta
          </h2>
          <h1 className="text-white font-serif italic text-[36.7px] md:text-[73.4px] lg:text-[97.9px] tracking-tighter mb-8 leading-[0.9]">
            The Intersection of <br />
            <span className="text-stone-200">Intuition & Pragmatism</span>
          </h1>
          <p className="max-w-3xl mx-auto text-stone-300 leading-relaxed">
            <span className="block mb-2">
              <span className="font-apple font-medium text-[12.8px] md:text-[16.5px] tracking-[-0.05em]">
                영상·음악 제작 기반 위에 감각적인 패션과 마케팅이 이뤄지는
              </span>
              <span className="font-apple font-bold text-[18.1px] md:text-[23.3px] ml-2">
                숲
              </span>
            </span>
            <span className="text-[16.6px] md:text-[21.4px] font-apple font-bold block">
              새로운 스타일의 미디어 컨설팅
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
