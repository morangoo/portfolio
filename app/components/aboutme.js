'use client';
import '@/app/styles/aboutme.css';
import { useLang } from '@/app/contexts/LangContext';
import { useState } from 'react';
import Image from 'next/image';

import BlurText from '@/app/utils/BlurText';
import FadeContent from '@/app/utils/FadeContent'

const AboutMe = () => {
    const { language, translations } = useLang();
    const [muted, setMuted] = useState(true);
    const [animationCompleted, setAnimationCompleted] = useState(false);

    const handleMouseEnter = () => {
      setMuted(false); 
    };

    const handleMouseLeave = () => {
      setMuted(true); 
    };
  

    const handleAnimationComplete = () => {
    };

    return (
    <div id="aboutme" className="about-container">
      <div className="flex about-container-text">
      <BlurText
        text={translations?.aboutScreen?.title || ''}
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="about-title"
      />
      </div>
      <FadeContent blur={true} duration={1500} easing="ease-out" initialOpacity={0} delay={500}>
        <div className="about-container-media">
          <div className="media-container-flex">
            <img src="/bruges.png" alt="Bruges" className="about-image" />
            <img src="/ffx.jpg" alt="FFX" className="about-image" />
          </div>
          <div className="media-container-flex">
            <img src="/gym.png" alt="Gym" className="about-image" />
            <video src="concert.mp4" autoPlay loop muted={muted} className="about-image" id="video" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}/>
          </div>
        </div>
      </FadeContent>
    </div>
    );
};

export default AboutMe;