'use client';
import '@/app/styles/aboutme.css';
import { useLang } from '@/app/contexts/LangContext';
import { useState } from 'react';
import Image from 'next/image';

import BlurText from '@/app/utils/BlurText';
import FadeContent from '@/app/utils/FadeContent'
import AnimatedContent from '@/app/utils/AnimatedContent';

const AboutMe = () => {
    const { language, translations } = useLang();
    const [animationCompleted, setAnimationCompleted] = useState(false);

  const [mutedVideo1, setMutedVideo1] = useState(true);
  const [mutedVideo2, setMutedVideo2] = useState(true);

  const handleMouseEnterVideo1 = () => {
    setMutedVideo1(false);
  };

  const handleMouseLeaveVideo1 = () => {
    setMutedVideo1(true);
  };

  const handleMouseEnterVideo2 = () => {
    setMutedVideo2(false);
  };

  const handleMouseLeaveVideo2 = () => {
    setMutedVideo2(true);
  };
  

    const handleAnimationComplete = () => {
    };

    return (
    <div id="aboutme" className="about-container">
      <div className="flex-col about-container-text">
      <BlurText
        text={translations?.aboutScreen?.title || ''}
        delay={25}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="about-title"
      />
      <FadeContent blur={true} duration={1500} easing="ease-out" initialOpacity={0} delay={500} className="about-content-container">
        <div className="about-content-container">
          <div className="about-content">{translations?.aboutScreen?.content || ''}</div>
        </div>
      </FadeContent>
      </div>
      <FadeContent blur={true} duration={1500} easing="ease-out" initialOpacity={0} delay={500} className="fadecontent-media">
        <div className="about-container-media">
          <div className="media-container-flex">
            <img src="/bruges.png" alt="Bruges" className="about-image" />
            <video src="slide.mp4" autoPlay loop muted={mutedVideo1} className="about-image" id="video" onMouseEnter={handleMouseEnterVideo1} onMouseLeave={handleMouseLeaveVideo1}/>
          </div>
          <div className="media-container-flex">
            <img src="/gym.png" alt="Gym" className="about-image" />
            <video src="concert.mp4" autoPlay loop muted={mutedVideo2} className="about-image" id="video" onMouseEnter={handleMouseEnterVideo2} onMouseLeave={handleMouseLeaveVideo2}/>
          </div>
        </div>
      </FadeContent>
    </div>
    );
};

export default AboutMe;