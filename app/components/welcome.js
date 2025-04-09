'use client';

import '@/app/styles/welcome.css';
import Squares from "@/app/utils/Squares";
import SplitText from "@/app/utils/SplitText";
import Magnet from "@/app/utils/Magnet";
import { motion } from "motion/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useIdle } from 'react-haiku';

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

    const scrollToNextSection = () => {
      const nextSection = document.getElementById('teste');
      if (nextSection) {
        nextSection.scrollIntoView({/* behavior: 'smooth' */});
      }
    };

    const idle = useIdle(5000);

    useEffect(() => {
      if (idle) {
        setText(text.replace("!", "?"));
      } else {
        setText(text.replace("?", "!"));
      }
    }, [idle]);
    
    return (
    <div id="welcomescreen" className="welcome-container">
      <Squares 
          speed={0.5} 
          squareSize={40} 
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#fff"
          hoverFillColor="#222"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1 // Garante que o fundo fique atrás do conteúdo
          }}
        />
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
          <Magnet padding={50} disabled={false} magnetStrength={1}>
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
          <Magnet padding={60} disabled={false} magnetStrength={1}>
            <Image src="/flagukround.png" alt="Inglês" width={55} height={55} />
          </Magnet>
        </motion.button>
      )}
      
    </div>
    );
};

export default Welcome;