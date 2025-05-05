'use client';
import '@/app/styles/workexperience.css';

import { useLang } from '@/app/contexts/LangContext';

import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';


const WorkExperience = () => {
  const { language, translations } = useLang();

  return (
    <div id="workexperience" className="workexperience-container">
      <h1 className="workexperience-title">
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
            text={translations?.workExperienceScreen?.title || ''}
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

export default WorkExperience;