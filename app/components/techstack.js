'use client';
import '@/app/styles/techstack.css';

import { useLang } from '@/app/contexts/LangContext';

import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';

import ExpandableCards from '@/app/utils/ExpandableCards';


const TechStack = () => {
  const { language, translations } = useLang();

  return (
    <div id="techstack" className="techstack-container">
      <h1 className="techstack-title">
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
            text={translations?.techStackScreen?.title || ''}
            animateOn="view"
            revealDirection="start"
            speed={50}
            sequential={true}
            useOriginalCharsOnly={true}
            />
        </AnimatedContent>
      </h1>
    </div>
  );
};

export default TechStack;