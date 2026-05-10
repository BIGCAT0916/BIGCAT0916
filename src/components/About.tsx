import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-stone-50 relative group">
              <img 
                src="https://lh3.googleusercontent.com/d/19jV53aN9TMiuXOmcE_RhG6H6QnjVj3jB" 
                alt="Representative of Art Foresta"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain opacity-80 contrast-110 sepia-[0.3] grayscale-[0.2]"
                onError={(e) => {
                  /* Fallback logic if image fails to load */
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2670&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_80px_rgba(43,40,38,0.1)]"></div>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-50/30 via-transparent to-stone-50/10"></div>
            </div>
            <div className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 bg-brand-primary p-6 md:p-10 text-white rounded-2xl z-10 max-w-[200px] md:max-w-xs shadow-xl">
              <p className="font-serif italic text-sm md:text-lg leading-relaxed mb-4">
                "우리는 영상,음악,패션,마케팅으로 감동의 여운이 있는 숲을 설계합니다."
              </p>
              <p className="text-[10px] md:text-xs tracking-widest font-semibold uppercase opacity-60">CEO. Min-jung Park</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-stone-400 font-sans tracking-[0.3em] text-xs font-bold mb-4 uppercase">
              Founder's Philosophy
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif tracking-tight text-stone-900 mb-8 leading-tight">
              전통의 깊이와 <br />
              현대의 감각이 만나는 <br />
              <span className="text-[1.15em] inline-block font-apple mx-1">숲(Foresta)</span>
            </h3>
            
            <div className="space-y-6 text-stone-600 leading-relaxed text-[14.7px]">
              <p className="font-apple tracking-[-0.05em]">
                아트포레스타는 여성 기업 특유의 섬세함과 수많은 프로젝트로 다져진 전문성을 바탕으로, 이제 우리는 '패션'이라는 옷을 입고 더 넓은 감각의 세계로 확장합니다.
              </p>
              <p className="font-apple tracking-[-0.05em]">
                영상 제작부터 음악 선정, 패션 디렉팅, 그리고 전략적 마케팅까지. 각 분야의 전문가들이 모여 하나의 완성된 브랜드 아이덴티티를 구축하는 것, 그것이 아트포레스타가 지향하는 One-Stop 비주얼 혁신입니다.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-stone-200 pt-10">
              <div className="min-w-[280px]">
                <span className="block text-2xl md:text-3xl font-display font-bold text-stone-900 tracking-tighter uppercase mb-1">ART FORESTA</span>
                <span className="text-[10px] tracking-[0.1em] md:tracking-widest font-bold uppercase text-stone-400">COMPREHENSIVE ARTS GROUP</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
