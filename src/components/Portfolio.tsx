import { PortfolioItem } from '../types';
import { motion } from 'motion/react';

interface PortfolioProps {
  items: PortfolioItem[];
}

export default function Portfolio({ items }: PortfolioProps) {
  return (
    <section id="portfolio" className="py-12 bg-white border-t border-stone-100 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.7]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #ececec 1px, transparent 1px), linear-gradient(to bottom, #ececec 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* Decorative Light Gray Boxes */}
      <div className="absolute top-40 -left-20 w-80 h-80 bg-stone-50 rounded-full blur-3xl opacity-60 -z-1" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-60 -z-1" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-stone-100 rotate-12 -z-1" />
      <div className="absolute bottom-1/4 right-1/3 w-24 h-24 border border-stone-100 -rotate-12 -z-1" />

      <div className="w-full md:w-[80%] mx-auto px-6 relative z-10">
        <div className="mb-4 flex flex-col items-center text-center">
          <h2 className="text-stone-400 font-sans tracking-[0.5em] text-[10px] font-bold mb-4 uppercase">
            Curated Portfolio
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 leading-none">
            Selected <span className="italic">Fragments</span>
          </h3>
          <div className="mt-1 w-px h-3 bg-stone-100" />
        </div>

        <div className="mb-5 flex justify-end">
          <div className="text-right font-apple text-stone-400">
            <p className="text-sm md:text-base tracking-wide leading-relaxed font-apple">
              전통의 깊이와 현대의 감각이 만나는 숲. 
              <span className="text-[1.2em] font-bold text-stone-700 ml-2">아트포레스타</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: index * 0.1 }}
              className={`group relative flex flex-col md:flex-row items-center justify-between gap-8 py-6 ${
                index !== items.length - 1 ? 'border-b border-stone-50' : ''
              }`}
            >
              {/* Index Number background */}
              <div className="absolute top-10 left-0 text-[120px] font-serif italic text-stone-50 select-none -z-10 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-1000">
                0{index + 1}
              </div>

              <div className="w-full md:w-[55%] flex flex-col justify-center pl-0 md:pl-10 relative">
                {/* Vertical accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-stone-300 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top" />
                
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-extrabold bg-brand-accent text-white px-2.5 py-1 rounded-sm uppercase mb-4 w-fit inline-block shadow-sm transition-all duration-300">
                  {item.category}
                </span>
                <h4 className="text-[40px] md:text-[53px] font-serif italic text-stone-900 leading-[1.1] group-hover:translate-x-4 transition-transform duration-500">
                  {item.title}
                </h4>
                <p className="mt-6 text-[15.5px] text-stone-500 font-noto leading-relaxed max-w-lg transition-all duration-500 group-hover:text-stone-900 group-hover:translate-x-4">
                  {item.description}
                </p>
              </div>
              
              <div className="w-full md:w-[31%] flex justify-end">
                <div className="w-full aspect-[4/3] p-1 md:p-1.5 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)] group-hover:scale-[1.05] group-hover:rotate-1">
                  <div className="w-full h-full overflow-hidden rounded-xl">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale-[0.2] contrast-[1.05] hover:grayscale-0 hover:scale-110 transition-all duration-1000"
                    />
                  </div>
                </div>
              </div>

              {/* Horizontal accent line at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
