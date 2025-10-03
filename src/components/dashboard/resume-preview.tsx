
'use client';

import type { ResumeData, DesignOptions } from '@/lib/definitions';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumePreviewProps {
  resumeData: ResumeData;
  designOptions: DesignOptions;
  className?: string;
}

const fontClasses: {[key: string]: string} = {
  Inter: 'font-body',
  Roboto: '[font-family:Roboto,sans-serif]',
  Lato: '[font-family:Lato,sans-serif]',
};

export function ResumePreview({ resumeData, designOptions, className }: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = resumeData;
  const { color, font } = designOptions;

  const fontClass = fontClasses[font] || 'font-body';

  return (
    <div 
      id="resume-preview-content"
      className={cn(
        "bg-card text-card-foreground w-[210mm] min-h-[297mm] p-8 shadow-lg resume-preview-container",
        "print:w-full print:h-full print:p-10 print:shadow-none print:scale-100 print:min-h-screen",
        fontClass,
        className
      )}
    >
      <div className="flex flex-col h-full text-[10pt] leading-snug">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
            {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{personalInfo.location}</span>}
            {personalInfo.email && <span className="flex items-center gap-1.5"><Mail size={12} />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{personalInfo.phone}</span>}
            {personalInfo.website && <span className="flex items-center gap-1.5"><Globe size={12} />{personalInfo.website}</span>}
          </div>
        </header>

        {/* Body */}
        <div className="space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: color }}>Summary</h2>
              <p className="text-sm">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: color }}>Experience</h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                      <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                    </div>
                    <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
                    <ul className="list-disc list-outside pl-5 space-y-1">
                      {exp.description?.split('\n').map((item, i) => item.trim() && <li key={i} className="text-sm">{item.replace(/^- /, '')}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: color }}>Education</h2>
              <div className="space-y-2">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-base">{edu.institution || 'Institution'}</h3>
                      <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
                    </div>
                    <div className="italic text-sm text-muted-foreground">{edu.degree || 'Degree'}</div>
                    {edu.details && <div className="text-sm">{edu.details}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: color }}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  skill.name &&
                  <span key={skill.id} className="bg-muted px-2 py-1 rounded text-sm">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
