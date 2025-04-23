'use client';
import '@/app/styles/projects.css';

import { useLang } from '@/app/contexts/LangContext';
import { useState, useEffect } from 'react';

import CircularGallery from '@/app/utils/CircularGallery';

const Projects = () => {
  const { language, translations } = useLang();
  const [bend, setBend] = useState(0.15);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const updateBend = () => {
      if (mediaQuery.matches) {
        setBend(0.1); // Mobile
      } else {
        setBend(1); // PC
      }
    };

    updateBend();

    mediaQuery.addEventListener('change', updateBend);

    return () => mediaQuery.removeEventListener('change', updateBend);
  }, []);

  return (
    <div id="projects" className="projects-container">
    <h1 className="projects-title">Projetos</h1>
      <div className="projects-list-container">
        <CircularGallery 
          bend={bend}
          textColor="#ffffff" 
          borderRadius={0.05}
        />
      </div>
    </div>
  );
};

export default Projects;