'use client';
import '@/app/styles/aboutme.css';

import { useLang } from '@/app/contexts/LangContext';

import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';

const AboutMe = () => {
    const { language, translations } = useLang();

    return (
      <div id="aboutme" className="aboutme-container">
      <h1 className="aboutme-title">
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
            text={translations?.aboutScreen?.title || ''}
            animateOn="view"
            revealDirection="start"
            speed={50}
            sequential={true}
            useOriginalCharsOnly={true}
            />
        </AnimatedContent>
      </h1>
      <p>WIP</p>
    </div>
    );
};

export default AboutMe;