'use client';
import { useEffect, useState } from "react";
import Welcome from "@/app/components/welcome";
import Header from "@/app/components/header";
import Projects from "@/app/components/projects";
import AboutMe from "@/app/components/aboutme";

export default function Home() {
  
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
  
      if (!entry.isIntersecting) {
        setShowWelcome(false);
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
      <div style={{position: "fixed", top: 20, right: 20, zIndex: 1000}} className="flex gap-3">
        <a href="https://github.com/migueelss" target="_blank">
          <img className="menuLogo" src="/githublogo.svg" style={{width: "32px"}}/>
        </a>
        <a href="https://www.linkedin.com/in/santosbruno01/" target="_blank">
          <img className="menuLogo" src="/linkedinlogo.svg" style={{width: "32px"}}/>
        </a>
        <a href="https://buymeacoffee.com/migueelss" target="_blank">
          <img className="menuLogo" src="/bmclogo.svg" style={{width: "32px"}}/>
        </a>
      </div>
      {showWelcome && <Welcome />}
      <Header />
      <Projects />
      {/*<AboutMe />*/}
    </div>
  );
}
