'use client';
import { useEffect, useState } from "react";
import Welcome from "@/app/components/welcome";
import Header from "@/app/components/header";
import Projects from "@/app/components/projects";
import Gallery from "@/app/components/gallery";

import { useLang } from '@/app/contexts/LangContext';

import { motion } from "motion/react";

// Simple mobile detection function
function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(window.navigator.userAgent);
}

export default function Home() {
  const { language, translations } = useLang();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't setup observer if on mobile

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
  
      if (!entry.isIntersecting) {
        setShowWelcome(false);
        document.documentElement.style.overflowY = 'auto';
        document.body.style.overflowY = 'auto';
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
  }, [isMobile]);

  if (isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#141414",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          position: "fixed",
          top: 0,
          left: 0,
          padding: "5vw",
        }}
      >
        <style>
          {`
            @media (max-width: 900px) {
              .pc-block-img {
                width: 350px !important;
                height: 350px !important;
                margin-bottom: 1.3rem !important;
              }
              .block-title {
                font-size: 1.6rem !important;
              }
              .block-main-text {
                font-size: 1.1rem !important;
              }
              .block-secondary-text {
                font-size: 1rem !important;
              }
            }
            @media (max-width: 600px) {
              .pc-block-img {
                width: 225px !important;
                height: 225px !important;
                margin-bottom: 1rem !important;
              }
              .block-title {
                font-size: 1.1rem !important;
              }
              .block-main-text {
                font-size: 0.95rem !important;
              }
              .block-secondary-text {
                font-size: 0.9rem !important;
              }
            }
          `}
        </style>
        <img
          src="/gandalf.gif"
          alt="PC Only"
          className="pc-block-img"
          style={{
            width: "16rem",
            height: "16rem",
            objectFit: "contain",
            marginBottom: "2rem",
            filter: "drop-shadow(0 0 16px #000a)",
            maxWidth: "35vw",
            maxHeight: "35vw",
          }}
        />
        <div style={{ textAlign: "center", width: "100%" }}>
          <div className="block-title" style={{ fontWeight: 700, fontSize: "2.3rem", marginBottom: "0.5rem" }}>
            Uh oh!
          </div>
          <div className="block-main-text" style={{ fontSize: "1.3rem" }}>
            Only PC users are welcome.
          </div>
          <div className="block-secondary-text" style={{ marginTop: "1.2rem", fontSize: "1.1rem", color: "#cccccc" }}>
            Please visit this site on a desktop device.
          </div>
          <div style={{ marginTop: "1.2rem", fontSize: "0.8rem", color: "#cccccc" }}>You can check my projects here: </div>
          <div style={{ marginTop: "0.5rem", fontSize: "1.1rem", color: "#ffffff" }}><a href="https://github.com/migueelss">GitHub</a></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{position: "fixed", top: 20, right: 20, zIndex: 1000}} className="hidden sm:flex gap-3">
        <a href="https://github.com/migueelss" target="_blank">
          <img className="menuLogo" src="/githublogo.svg" style={{width: "32px"}}/>
        </a>
        <a href="https://www.linkedin.com/in/migueel/" target="_blank">
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
    </div>
  );
}