'use client';
import '@/app/styles/aboutme.css';
import { useLang } from '@/app/contexts/LangContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const AboutMe = () => {
    const { language, translations } = useLang();

    return (
    <div id="aboutme" className="about-container">
      <div className="flex">
        <h1 className="text-5xl">But who's Miguel?</h1>
      </div>
    </div>
    );
};

export default AboutMe;