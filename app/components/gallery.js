'use client';
import '@/app/styles/gallery.css';

import { useLang } from '@/app/contexts/LangContext';

import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';
import Masonry from '@/app/utils/Masonry';


const Gallery = () => {
  const { language, translations } = useLang();

  const items = [
    {
      id: "codeffeine",
      img: "/gallery/codeffeine.gif",
      height: 400,
    },
    {
      id: "cartazfasterfood",
      img: "/gallery/cartazfasterfood.png",
      height: 900,
    },
    {
      id: "centraldocodigo",
      img: "/gallery/centraldocodigo.gif",
      height: 300,
    },
    {
      id: "valorant",
      img: "/gallery/valorant.jpg",
      height: 320,
    },
    {
      id: "fameorshame",
      img: "/gallery/fameorshame.png",
      height: 350,
    },
    {
      id: "ribeiraatalho",
      img: "/gallery/ribeira_atalho.png",
      height: 200,
    },
    {
      id: "saki",
      img: "/gallery/saki.gif",
      height: 370,
    },
    {
      id: "escoladeanimes",
      img: "/gallery/escoladeanimes.png",
      height: 370,
    },
    {
      id: "ff2",
      img: "/gallery/ff2.png",
      height: 600,
    },
    {
      id: "ribeiragif",
      img: "/gallery/ribeiragif.gif",
      height: 500,
    },
    {
      id: "giveaway",
      img: "/gallery/giveaway.png",
      height: 250,
    },

    {
      id: "boost",
      img: "/gallery/boost.png",
      height: 200,
    }
  ];

  return (
    <div id="gallery" className="gallery-container">
      <h1 className="gallery-title">
        <AnimatedContent
            distance={150}
            direction={'vertical'}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            >
            <DecryptedText
            text={translations?.galleryScreen?.title || ''}
            animateOn="view"
            revealDirection="start"
            speed={50}
            sequential={true}
            useOriginalCharsOnly={true}
            />
        </AnimatedContent>
      </h1>
      
      <div className='gallery-list-container' style={{ height: '55%', width: '90%' }}>
        <AnimatedContent
            distance={150}
            direction={'vertical'}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            threshold={0.2}
            >
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        />
        </AnimatedContent>
      </div>
    </div>
  );
};

export default Gallery;