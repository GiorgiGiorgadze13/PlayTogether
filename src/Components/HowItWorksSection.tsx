import React from 'react';
import type { TranslationContent } from '../types/translations';

interface HowItWorksSectionProps {
  c: TranslationContent;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ c }) => {
  return (
    <section className="how-section" id="about">
      <div className="how-header">
        <div>
          <span>{c.howItWorks}</span>
          <h2>{c.howTitle1}<br />{c.howTitle2}</h2>
        </div>
        <p>{c.howDesc}</p>
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-top"><span>01</span><div>↗</div></div>
          <div className="step-icon">01</div>
          <h3>{c.step1Title}</h3>
          <p>{c.step1Desc}</p>
        </div>
        <div className="step">
          <div className="step-top"><span>02</span><div>↗</div></div>
          <div className="step-icon">02</div>
          <h3>{c.step2Title}</h3>
          <p>{c.step2Desc}</p>
        </div>
        <div className="step">
          <div className="step-top"><span>03</span><div>↗</div></div>
          <div className="step-icon">03</div>
          <h3>{c.step3Title}</h3>
          <p>{c.step3Desc}</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
