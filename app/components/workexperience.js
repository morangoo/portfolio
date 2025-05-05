'use client';
import '@/app/styles/workexperience.css';
import { useLang } from '@/app/contexts/LangContext';
import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';
import { useState } from 'react';

const carouselItems = [
  {
    title: 'Desenvolvedor Full-Stack',
    company: 'Refresh Bubbles',
    period: 'Nov 2024 - Today',
    description: 'Responsável pelo desenvolvimento e manutenção de aplicações web modernas usando React e NextJS.',
    logo: 'refreshbubbles.png',
    techstack: ["React", "Javascript"]
  },
  {
    title: 'Estágio Fullstack',
    company: 'Empresa Y',
    period: 'Jul 2020 - Dez 2020',
    description: 'Participação em projetos de backend e frontend, com foco em Node.js e interfaces responsivas.',
    logo: '/logos/empresa-y.png',
    techstack: ["React", "Javascript"]
  },
  {
    title: 'Fullstack Developer',
    company: 'Vários clientes',
    period: '2019 - 2020',
    description: 'Entrega de soluções web rápidas e responsivas para clientes nacionais e internacionais.',
    logo: 'tawsoftware.png',
    techstack: ["React", "Javascript", "Vue", "jQuery"]
  }
];

const WorkExperience = () => {
  const { language, translations } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('right');

  const handlePrev = () => {
    if (animating) return;
    setDirection('left');
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx => (idx === 0 ? carouselItems.length - 1 : idx - 1));
      setAnimating(false);
    }, 320);
  };

  const handleNext = () => {
    if (animating) return;
    setDirection('right');
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx => (idx === carouselItems.length - 1 ? 0 : idx + 1));
      setAnimating(false);
    }, 320);
  };

  const handleDot = (idx) => {
    if (animating || idx === activeIdx) return;
    setDirection(idx > activeIdx ? 'right' : 'left');
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setAnimating(false);
    }, 320);
  };

  return (
    <div id="workexperience" className="work-experience-container">
      <h1 className="workexperience-title">
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
            text={translations?.workExperienceScreen?.title || ''}
            animateOn="view"
            revealDirection="start"
            speed={50}
            sequential={true}
            useOriginalCharsOnly={true}
          />
        </AnimatedContent>
      </h1>
      <div className="carousel-wrapper align-left">
        <button
          className="carousel-arrow outside left"
          aria-label="Anterior"
          onClick={handlePrev}
          tabIndex={0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div
          className={`carousel ${animating ? `animating ${direction}` : ''}`}
          key={activeIdx}
        >
          <div className="carousel-item-container">
            <div className="carousel-logo-container">
            {carouselItems[activeIdx].logo && (
              <img
                src={carouselItems[activeIdx].logo}
                alt={`Logo ${carouselItems[activeIdx].company}`}
                className="workexperience-logo"
                style={{ width: 48, height: 48, objectFit: 'contain', marginBottom: 8 }}
              />
            )}
            </div>
            <div className="carousel-item">
            <h2>{carouselItems[activeIdx].title}</h2>
            <h3>{carouselItems[activeIdx].company}</h3>
            <span className="period">{carouselItems[activeIdx].period}</span>
            <p>{carouselItems[activeIdx].description}</p>
            <div className="workexperience-techstack">
              {carouselItems[activeIdx].techstack.map((tech, i) => (
                <span className="workexperience-tech" key={i}>{tech}</span>
              ))}
            </div>
          </div>
          </div>
        </div>
        <button
          className="carousel-arrow outside right"
          aria-label="Seguinte"
          onClick={handleNext}
          tabIndex={0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="9 6 15 12 9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="carousel-dots align-left">
        {carouselItems.map((_, idx) => (
          <span
            key={idx}
            className={`dot${idx === activeIdx ? ' active' : ''}`}
            onClick={() => handleDot(idx)}
            tabIndex={0}
            aria-label={`Ir para item ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;