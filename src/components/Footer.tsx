import { useState } from 'react';

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);

  const handleTrigger = () => {
    const newCount = clickCount + 1;
    if (newCount >= 3) {
      window.dispatchEvent(new CustomEvent('open-admin-dashboard'));
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }
  };

  return (
    <footer className="py-6 bg-stone-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-6">
          <div className="max-w-md">
            <img 
              src="https://lh3.googleusercontent.com/d/1nyJV5fuIjEpbxSAwEj26z5atbAnJzLbE" 
              alt="ART FORESTA" 
              referrerPolicy="no-referrer"
              className="w-[161px] h-auto mb-2 brightness-100"
            />
            <span className="text-[10px] tracking-[0.3em] font-medium text-stone-500 uppercase block mb-6">Comprehensive Arts Group</span>
            <p className="text-white">
              <span className="text-sm opacity-80 font-apple font-bold inline-block">대표 : 박민정</span><br />
              <span className="text-[12.5px] opacity-60 font-apple inline-block mt-0.5">사업자등록번호 : 837-87-03564</span>
            </p>
          </div>
          
          <div className="md:text-right font-noto">
            <h5 className="text-[10px] tracking-widest font-bold uppercase text-white mb-3">Service Hours</h5>
            <div className="text-[13px] text-stone-400 leading-relaxed font-apple">
              <p>근무 시간 : 09:00~18:00 (점심시간 12:00~13:00)</p>
              <p>주말, 공휴일 휴무</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-6">
          <p className="text-[10px] tracking-widest text-white uppercase font-medium select-none">
            © <span 
                className="cursor-default hover:text-stone-300 transition-colors"
                onClick={handleTrigger}
              >2024</span> ArtForesta. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
