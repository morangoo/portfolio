'use client';
import '@/app/styles/projects.css';

import { useLang } from '@/app/contexts/LangContext';

import CircularGallery from '@/app/utils/CircularGallery';
import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';
import FadeContent from '@/app/utils/FadeContent';

const Projects = () => {
  const { language, translations } = useLang();

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
          bend={2}
          textColor="#ffffff"
          borderRadius={0.05}
          items={[
            {
              text: "Toshokan",
              image: "/toshokan.png",
              id: "toshokan",
              link: "https://toshokan-azure.vercel.app/",
              tooltip: (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260, maxWidth: 340 }}>
                  <video
                    src="/videos/toshokan.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      height: 'auto',
                      borderRadius: 8,
                      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                      objectFit: 'cover',
                      maxHeight: 190,
                      background: '#181818',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    left: 12,
                    bottom: 12,
                    display: 'flex',
                    gap: 8,
                    background: 'none',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#ff3e00',
                      borderRadius: 6,
                      padding: '2px 10px 2px 6px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                      border: '1px solid #ff3e00',
                      fontWeight: 500,
                      fontSize: 13,
                      color: '#fff',
                      gap: 6,
                    }}>
                      <img src="/software/svelte.png" alt="Svelte" style={{ width: 18, height: 18, marginRight: 2 }} />
                      <span style={{ color: '#fff' }}>Svelte</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#3178c6',
                      borderRadius: 6,
                      padding: '2px 10px 2px 6px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                      border: '1px solid #3178c6',
                      fontWeight: 500,
                      fontSize: 13,
                      color: '#fff',
                      gap: 6,
                    }}>
                      <img src="/software/typescript.png" alt="TypeScript" style={{ width: 18, height: 18, marginRight: 2 }} />
                      <span style={{ color: '#fff' }}>TypeScript</span>
                    </div>
                  </div>
                </div>
              )
            },
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
          ]}
        />
      </div>
    </div>
  );
};

export default Projects;