'use client';
import '@/app/styles/projects.css';

import { useLang } from '@/app/contexts/LangContext';
import { useEffect, useState } from 'react';

import CircularGallery from '@/app/utils/CircularGallery';
import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';

const Projects = () => {
  const { language, translations } = useLang();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Ajusta o limite conforme necessário (768px é um padrão comum).
    };
    
    // Configuração inicial
    handleResize();

    // Ouvinte de redimensionamento
    window.addEventListener('resize', handleResize);

    // Limpeza do ouvinte
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="projects" className="projects-container">
      <h1 className="projects-title">
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
            text={translations?.projectsScreen?.projects || ''}
            animateOn="view"
            revealDirection="start"
            speed={50}
            sequential={true}
            useOriginalCharsOnly={true}
          />
        </AnimatedContent>
      </h1>
      <div className="projects-list-container">
        <CircularGallery 
          bend={isMobile ? 0.25 : 2} // Altera o valor do bend com base no estado
          textColor="#ffffff" 
          borderRadius={0.05}
          items={
            [
              {
                text: "Work in Progress (WIP)",
                image: "https://i.imgur.com/JoPEuOt.jpeg",
                id: "WIP"
              },
              {
                text: "Work in Progress (WIP)",
                image: "https://media.tenor.com/uHpAcN5eP30AAAAe/stillesque.png",
                id: "WIP"
              },
              {
                text: "Work in Progress (WIP)",
                image: "https://i.imgur.com/E4TifXR.jpeg",
                id: "WIP"
              },
            ]
          }
        />
      </div>
    </div>
  );
};

export default Projects;