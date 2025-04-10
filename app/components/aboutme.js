'use client';
import '@/app/styles/aboutme.css';
import { useLang } from '@/app/contexts/LangContext';
import { useState, useEffect } from 'react';

const AboutMe = () => {
    const { language, translations } = useLang();

    return (
    <div id="aboutme" className="about-container">
      <span className="text-2xl text-white">{translations.greeting}</span>
    </div>
    );
};

export default AboutMe;