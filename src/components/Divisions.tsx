import { motion } from 'motion/react';
import { Camera, Music, Shirt, BarChart3 } from 'lucide-react';

export default function Divisions() {
  const divisions = [
    {
      title: 'Cinema & Film',
      description: 'TV-CF, 브랜드 필름, 홍보영상 및 AI 기반의 혁신적인 영상 제작 시스템을 갖추고 있습니다.',
      icon: <Camera className="w-6 h-6" />,
      image: 'https://lh3.googleusercontent.com/d/1yp2IhOh2Y06BJQadPw3ebULnmUxnf3a-',
      points: ['TV-CF Production', 'Fashion Film', 'AI Video Integration'],
      opacity: 'opacity-50',
      grayscale: false,
      filter: '',
      overlayOpacity: ''
    },
    {
      title: 'Sound & Music',
      description: '자체 뮤직 라이브러리를 기반으로 대중가요, BGM, CM송, 라디오 광고 및 브랜드 커스텀 배경음악을 제작합니다.',
      icon: <Music className="w-6 h-6" />,
      image: 'https://lh3.googleusercontent.com/d/1tcFvNky7anOoD73bnsJ7zSuyxOLx1ZNU',
      points: ['Custom Soundtracks', 'Audio Branding', 'Music Library'],
      opacity: 'opacity-60',
      grayscale: false,
      filter: '',
      overlayOpacity: ''
    },
    {
      title: 'Fashion & Style',
      description: '비주얼 디렉팅부터 스타일 컨설팅, 커머스 콘텐츠 기획까지 패션 브랜드에 최적화된 비주얼을 제공합니다.',
      icon: <Shirt className="w-6 h-6" />,
      image: 'https://lh3.googleusercontent.com/d/1XwJnKCJDcqtsnt-iBwn4tVOZRf8pfo7-',
      points: ['Visual Directing', 'STYLE CONSULTING', 'Branding Content'],
      opacity: 'opacity-60',
      grayscale: false,
      filter: '',
      overlayOpacity: ''
    },
    {
      title: 'Marketing & Strategy',
      description: '제작된 고감도 콘텐츠를 기반으로 타겟팅 정교화와 SNS 마케팅 전략을 통합적으로 실행합니다.',
      icon: <BarChart3 className="w-6 h-6" />,
      image: 'https://lh3.googleusercontent.com/d/1nldWYz8l59h3bVPByi4sV1E_lXdxROY9',
      points: ['Brand Strategy', 'SNS Marketing', 'Distribution Plan'],
      opacity: 'opacity-60',
      overlayOpacity: 'opacity-60',
      grayscale: false,
      filter: ''
    }
  ];

  return (
    <section id="divisions" className="py-24 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-stone-500 font-sans tracking-[0.4em] text-[10px] font-bold mb-4 uppercase">
              Our Core Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-6">
              Core Divisions
            </h3>
            <p className="max-w-xl mx-auto text-stone-400 text-[15.4px] tracking-wide leading-relaxed font-barun">
              영상과 음악, 패션, 마케팅이 융합된 아트포레스타만의 <br className="hidden md:block" />
              전문 사업부는 브랜드의 정체성을 가장 감각적인 방식으로 정의합니다.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {divisions.map((div, index) => (
            <motion.div
              key={div.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-2xl bg-stone-800"
            >
              <img 
                src={div.image} 
                alt={div.title}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover ${div.grayscale ? 'grayscale' : ''} ${div.filter || ''} ${div.opacity || 'opacity-40'} group-hover:scale-105 transition-transform duration-700`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent ${div.overlayOpacity || ''}`}></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="mb-4 text-white p-3 bg-white/5 backdrop-blur-md rounded-full w-fit">
                  {div.icon}
                </div>
                <h4 className="text-2xl font-serif text-white mb-3 italic">{div.title}</h4>
                <p className="text-white text-sm leading-relaxed mb-6 max-w-sm font-barun">
                  {div.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {div.points.map((point) => (
                    <span key={point} className="text-[10px] tracking-widest font-semibold uppercase px-3 py-1 bg-white/10 rounded-full">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
