'use client';

import '@/app/styles/welcome.css';

import SplitText from "@/app/utils/SplitText";
import Magnet from "@/app/utils/Magnet";
import { motion } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Welcome = () => {
    const [text, setText] = useState("Hey!");
    const [splitKey, setSplitKey] = useState(0);
    const [buttonsVisible, setButtonsVisible] = useState(false);

    const handleAnimationComplete = () => {
      setButtonsVisible(true);
  };

    const updateText = (newText) => {
        if (text !== newText) {
            setText(newText);
            setSplitKey(prev => prev + 1);
        }
    };

    useEffect(() => {
      const handleScroll = (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
      };

      const observer = new IntersectionObserver(handleScroll, {
        root: null,
        threshold: 0.1,
      });

      const element = document.getElementById('welcomescreen');
      if (element) {
        observer.observe(element);
      }

      

      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }, []);

    const scrollToNextSection = () => {
      const nextSection = document.getElementById('teste');
      if (nextSection) {
        nextSection.scrollIntoView({/* behavior: 'smooth' */});
      }
    };

    return (
    <div id="welcomescreen" className="welcome-container">
      {buttonsVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          onMouseEnter={() => updateText("Olá!")}
          onClick={() => {
            scrollToNextSection();
          }}
        >
          <Magnet padding={50} disabled={false} magnetStrength={4}>
            <Image src="/flagptround.png" alt="Português" width={55} height={55} />
          </Magnet>
        </motion.button>
      )}

      <SplitText
        key={splitKey}
        text={text}
        className="hello-message font-semibold text-center"
        delay={150}
        animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
        onLetterAnimationComplete={handleAnimationComplete}
      />

      {buttonsVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          onMouseEnter={() => updateText("Hey!")}
          onClick={() => {
            scrollToNextSection();
          }}
        >
          <Magnet padding={50} disabled={false} magnetStrength={4}>
            <Image src="/flagukround.png" alt="Inglês" width={55} height={55} />
          </Magnet>
        </motion.button>
      )}
      
    </div>
    );
};

export default Welcome;