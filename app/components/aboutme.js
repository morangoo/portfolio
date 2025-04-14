'use client';
import '@/app/styles/aboutme.css';
import { useLang } from '@/app/contexts/LangContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import BlurText from '@/app/utils/BlurText';

const AboutMe = () => {
    const { language, translations } = useLang();

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
      <div>
      </div>
    </div>
    );
};

export default AboutMe;