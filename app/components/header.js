'use client';
import '@/app/styles/header.css';

import { useLang } from '@/app/contexts/LangContext';
import { useState } from 'react';

import Image from 'next/image';
import AnimatedContent from '@/app/utils/AnimatedContent';
import RotatingText from '@/app/utils/RotatingText';

const Header = () => {
  const [hovered, setHovered] = useState(false);
  const { language, translations } = useLang();
    return (
    <div id="header" className="header-container">
      <AnimatedContent
        distance={150}
        direction="vertical"
        reverse={true}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0}
        animateOpacity
        scale={0.5}
        threshold={0.1}
        tension={10}
        friction={50}
      >
        <Image src="/miguel.jpg" alt="Miguel" width={500} height={500} className="header-image" />
      </AnimatedContent>
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0}
        animateOpacity
        scale={0.5}
        threshold={0.1}
        tension={15}
        friction={50}
      >
        <h1 className="header-super-text">{translations?.headerScreen?.supertext || ''}</h1>
        <h1
          className="header-text"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className={`inset-0 transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
          >
            Miguel
          </span>
          <span
            className={`absolute inset-0 transition-opacity transition-colors duration-500 ${hovered ? 'opacity-100 header-text-alt' : 'opacity-0 text-white'}`}
          >
            Bruno
          </span>
        </h1>
        <div className="rotating-skills-container flex items-center justify-center">
          <h2 className="header-lower-text">{translations?.headerScreen?.lowerfirst || ''} <span className="work">{translations?.headerScreen?.lowerwork || ''}</span> {translations?.headerScreen?.lowerlast || ''}</h2>
          <RotatingText
            texts={['React', 'MongoDB', 'Javascript', 'Typescript', 'Node.js', 'Next.js', 'RESTful API', 'Rust', 'Golang', 'Tailwind CSS', 'HTML', 'CSS', 'Python', 'Svelte', 'PostgreSQL', 'Photoshop', 'Figma', 'Git', '.NET', 'C#', 'jQuery', 'Java', 'MySQL', 'Microsoft SQL', 'PHP', 'Web Servers', 'WebSockets', 'Docker', 'Kubernetes', 'Lua', 'Linux', 'Apache', 'RabbitMQ', 'Unity', 'Arduino', 'Copywriting', 'Graphic Design', 'Video Editing', 'Vue', 'Bootstrap', 'Kafka', 'Micro Services', 'Nginx', 'Jenkins', 'Unreal Engine', 'Blender']}
            mainClassName="rotating-text px-2 sm:px-2 md:px-3 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
      </AnimatedContent>
        
    </div>
    );
};

export default Header;