'use client';
import '@/app/styles/projects.css';

import { useLang } from '@/app/contexts/LangContext';

import CircularGallery from '@/app/utils/CircularGallery';

const Projects = () => {
  const { language, translations } = useLang();
    return (
    <div id="projects" className="projects-container">
        <div className="projects-list-container">
            <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
        </div>
    </div>
    );
};

export default Projects;