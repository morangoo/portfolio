'use client';
import '@/app/styles/projects.css';

import { useLang } from '@/app/contexts/LangContext';

import CircularGallery from '@/app/utils/CircularGallery';

const Projects = () => {
  const { language, translations } = useLang();


  return (
    <div id="projects" className="projects-container">
    <h1 className="projects-title">Projetos</h1>
      <div className="projects-list-container">
        <CircularGallery 
          bend={1} 
          textColor="#ffffff" 
          borderRadius={0.05}
          items={
            [
              {
                image: '/bruges.png',
                text: 'SOON'
              },
              {
                image: '/bruges.png',
                text: 'SOON'
              },
              {
                image: 'ffx.jpg',
                text: 'SOON'
              }
            ]
          }
        />
      </div>
    </div>
  );
};

export default Projects;