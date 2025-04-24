'use client';
import '@/app/styles/workexperience.css';

import { useLang } from '@/app/contexts/LangContext';

import DecryptedText from '@/app/utils/DecryptedText';
import AnimatedContent from '@/app/utils/AnimatedContent';


const WorkExperience = () => {
  const { language, translations } = useLang();
  const moments = [
    { year: 2020, description: 'Started my first job' },
    { year: 2021, description: 'Promoted to team lead' },
    { year: 2022, description: 'Started working on new projects' }
  ];

  return (
    <div id="workexperience" className="work-experience-container">
      <h1 className="timeline-title">
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