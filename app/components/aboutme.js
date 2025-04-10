'use client';
import '@/app/styles/aboutme.css';
import { useTranslation } from 'next-i18next';

const AboutMe = () => {
    const { t } = useTranslation();
    return (
    <div id="aboutme" className="about-container">
      <span className="text-2xl text-white">{t('test')}</span>
    </div>
    );
};

export default AboutMe;