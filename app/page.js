'use client';
import { useEffect, useState } from "react";
import Welcome from "@/app/components/welcome";
import Header from "@/app/components/header";
import Projects from "@/app/components/projects";
import Gallery from "@/app/components/gallery";
import WorkExperience from "@/app/components/workexperience";
import AboutMe from "@/app/components/aboutme";

import { useLang } from '@/app/contexts/LangContext';

import { motion } from "motion/react";

export default function Home() {
  const { language, translations } = useLang();
  
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
  
      if (!entry.isIntersecting) {
        setShowWelcome(false);
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        window.scrollTo(0, 0);
      }
    }, {
      root: null,
      threshold: 0.1,
    });
  
    const targetElement = document.getElementById('welcomescreen');
    if (targetElement) {
      observer.observe(targetElement);
    }
  
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, []);

  return (
    <div>
      <div style={{position: "fixed", top: 20, right: 20, zIndex: 1000}} className="hidden sm:flex gap-3">
        <a href="https://github.com/migueelss" target="_blank">
          <img className="menuLogo" src="/githublogo.svg" style={{width: "32px"}}/>
        </a>
        <a href="https://www.linkedin.com/in/santosbruno01/" target="_blank">
          <img className="menuLogo" src="/linkedinlogo.svg" style={{width: "32px"}}/>
        </a>
        <a href="https://buymeacoffee.com/migueelss" target="_blank">
          <img className="menuLogo" src="/bmclogo.svg" style={{width: "32px"}}/>
        </a>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <a 
            href="/CV.pdf" 
            target="_blank"
            className="menuLogo relative border border-white text-white px-4 py-1.5 rounded overflow-hidden group"
          >
            <span
              className="absolute inset-0 bg-white transition-transform duration-300 scale-y-0 group-hover:scale-y-100 origin-bottom"
            ></span>
            <span className="relative z-10 group-hover:text-black">
              {translations?.downloadCV || ''}
            </span>
          </a>
        </motion.button>
      </div>
      {showWelcome && <Welcome />}
      <Header />
      <Projects />
      <Gallery />
      <WorkExperience />
      <AboutMe />
    </div>
  );
}
