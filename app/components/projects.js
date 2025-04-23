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