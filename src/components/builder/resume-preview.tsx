'use client';

import type { ResumeFormData, DesignOptions, BulletPoint } from '@/lib/definitions';
import { Mail, Phone, Globe, MapPin, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { match } from 'ts-pattern';

interface ResumePreviewProps {
  resumeData: ResumeFormData;
  designOptions: DesignOptions;
  className?: string;
}

const fontClasses: {[key: string]: string} = {
  Inter: 'font-body',
  Roboto: '[font-family:Roboto,sans-serif]',
  Lato: '[font-family:Lato,sans-serif]',
};

// Reusable Helper Functions & Components
const renderDescription = (description: string | BulletPoint[] | undefined) => {
  if (!description) return null;
  const items = Array.isArray(description) 
    ? description.map(item => item.value) 
    : description.split('\n').map(item => item.replace(/^- /, ''));
  
  return (
    <ul className="list-disc list-outside pl-5 space-y-1 text-sm">
      {items.map((item, index) => item.trim() && <li key={index}>{item}</li>)}
    </ul>
  );
};

const renderFreeform = (details: string | undefined) => {
  if (!details) return null;
  return details.split('\n').map((item, index) => item.trim() && (
    item.startsWith('- ') 
      ? <li key={index} className="text-sm">{item.replace(/^- /, '')}</li> 
      : <p key={index} className="text-sm">{item}</p>
  ));
};

const ContactLine: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) => {
  if (!text) return null;
  return <span className="flex items-center gap-1.5">{icon}{text}</span>;
};

// Template 1: Modern
const ModernTemplate: React.FC<Omit<ResumePreviewProps, 'className' | 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
  const { personalInfo, experience, education, skills, projects, certifications, references, additionalInformation } = resumeData;
  const { color } = designOptions;

  const Section: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
      <section>
        <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: color }}>{title}</h2>
        <div className="space-y-4">{children}</div>
      </section>
    );
  };

  return (
    <div className="p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
            <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
            <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
            <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
            <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
        </div>
      </header>

      <div className="space-y-6">
        <Section title="Summary" show={!!personalInfo?.summary}><p className="text-sm">{personalInfo?.summary}</p></Section>
        
        <Section title="Experience" show={experience && experience.length > 0}>
          {experience?.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
              </div>
              <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
              {renderDescription(exp.description)}
            </div>
          ))}
        </Section>
        
        <Section title="Projects" show={projects && projects.length > 0}>
           {projects?.map(proj => (
                <div key={proj.id}>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                        {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
                    </div>
                    {renderDescription(proj.description)}
                </div>
            ))}
        </Section>

        <Section title="Education" show={education && education.length > 0}>
          {education?.map(edu => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-base">{edu.institution || 'Institution'}</h3>
                <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
              </div>
              <div className="italic text-sm text-muted-foreground">{edu.degree || 'Degree'}</div>
              {edu.details && <div className="text-sm">{edu.details}</div>}
            </div>
          ))}
        </Section>

        <Section title="Skills" show={skills && skills.length > 0}>
          <div className="flex flex-wrap gap-2">
            {skills?.map(skill => skill.name && <span key={skill.id} className="bg-muted px-2 py-1 rounded text-sm">{skill.name}</span>)}
          </div>
        </Section>
      </div>
    </div>
  );
};

// Template 2: Classic
const ClassicTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects } = resumeData;
    const { color } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return (
            <section>
                <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-2" style={{ color }}>{title}</h2>
                <div className="border-t w-1/4 mx-auto mb-4" style={{ borderColor: color }}/>
                <div className="space-y-4">{children}</div>
            </section>
        );
    };

    return (
        <div className="p-8">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold tracking-normal">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-xs text-muted-foreground mt-2">
                    <span>{personalInfo?.location}</span>
                    {personalInfo?.location && personalInfo.email && <span className="mx-2">|</span>}
                    <span>{personalInfo?.email}</span>
                    {personalInfo?.email && personalInfo.phone && <span className="mx-2">|</span>}
                    <span>{personalInfo?.phone}</span>
                </div>
            </header>
            <div className="space-y-6">
                <Section title="Summary" show={!!personalInfo?.summary}>
                    <p className="text-sm text-center">{personalInfo?.summary}</p>
                </Section>
                <Section title="Experience" show={experience && experience.length > 0}>
                    {experience?.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-base">{exp.company || 'Company'}</h3>
                                <div className="text-xs font-mono">{exp.startDate} - {exp.endDate}</div>
                            </div>
                            <div className="italic text-sm mb-1">{exp.role || 'Role'}</div>
                            {renderDescription(exp.description)}
                        </div>
                    ))}
                </Section>
                 <Section title="Projects" show={projects && projects.length > 0}>
                    {projects?.map(proj => (
                        <div key={proj.id}>
                            <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                            {renderDescription(proj.description)}
                        </div>
                    ))}
                </Section>
                <Section title="Education" show={education && education.length > 0}>
                    {education?.map(edu => (
                        <div key={edu.id} className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-semibold text-base">{edu.degree || 'Degree'}</h3>
                                <div className="italic text-sm">{edu.institution || 'Institution'}</div>
                            </div>
                            <div className="text-xs font-mono">{edu.graduationDate}</div>
                        </div>
                    ))}
                </Section>
                <Section title="Skills" show={skills && skills.length > 0}>
                    <p className="text-sm text-center">{skills?.map(s => s.name).join(' • ')}</p>
                </Section>
            </div>
        </div>
    );
};

// Template 3: Executive
const ExecutiveTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects } = resumeData;
    const { color } = designOptions;

    const RightSection: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return <section><h2 className="text-base font-bold uppercase tracking-wider mb-2">{title}</h2><div className="space-y-4">{children}</div></section>;
    };

    const LeftSection: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return <section><h2 className="text-sm font-bold uppercase tracking-wider mb-2">{title}</h2><div>{children}</div></section>;
    };

    return (
        <div className="p-0">
            <header className="p-8 mb-6 text-white" style={{backgroundColor: color}}>
                <h1 className="text-4xl font-bold">{personalInfo?.name || 'Your Name'}</h1>
                <p className="text-xl mt-1">{personalInfo?.summary || 'Professional Summary'}</p>
            </header>
            <div className="grid grid-cols-12 gap-x-8 px-8">
                <div className="col-span-4 space-y-6">
                    <LeftSection title="Contact">
                        <div className="text-sm space-y-1">
                            {personalInfo?.location && <p>{personalInfo.location}</p>}
                            {personalInfo?.email && <p>{personalInfo.email}</p>}
                            {personalInfo?.phone && <p>{personalInfo.phone}</p>}
                            {personalInfo?.website && <p>{personalInfo.website}</p>}
                        </div>
                    </LeftSection>
                    <LeftSection title="Skills" show={skills && skills.length > 0}>
                        <ul className="text-sm space-y-1">
                            {skills?.map(skill => skill.name && <li key={skill.id}>{skill.name}</li>)}
                        </ul>
                    </LeftSection>
                    <LeftSection title="Education" show={education && education.length > 0}>
                         {education?.map(edu => (
                            <div key={edu.id} className="text-sm">
                                <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                <p>{edu.degree || 'Degree'}</p>
                                <p className="text-xs">{edu.graduationDate}</p>
                            </div>
                        ))}
                    </LeftSection>
                </div>
                <div className="col-span-8 space-y-6">
                    <RightSection title="Experience" show={experience && experience.length > 0}>
                        {experience?.map(exp => (
                            <div key={exp.id}>
                                <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                                <p className="text-sm mb-1">{exp.company || 'Company'} | {exp.startDate} - {exp.endDate}</p>
                                {renderDescription(exp.description)}
                            </div>
                        ))}
                    </RightSection>
                    <RightSection title="Projects" show={projects && projects.length > 0}>
                        {projects?.map(proj => (
                            <div key={proj.id}>
                                <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                                {renderDescription(proj.description)}
                            </div>
                        ))}
                    </RightSection>
                </div>
            </div>
        </div>
    );
};

// Template 4: Minimal
const MinimalTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects } = resumeData;
    const { color } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return <section><h2 className="text-xs font-semibold uppercase tracking-widest col-span-2 mb-2">{title}</h2><div className="col-span-10">{children}</div></section>;
    };

    return (
        <div className="p-10 space-y-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold tracking-wider">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-xs text-muted-foreground mt-2">
                    <span>{personalInfo?.email}</span>
                    {personalInfo?.email && personalInfo.website && <span className="mx-2">//</span>}
                    <span>{personalInfo?.website}</span>
                </div>
            </header>
            
            <div className="space-y-8">
                <div className="grid grid-cols-12 gap-x-8">
                    <Section title="Summary" show={!!personalInfo?.summary}>
                        <p className="text-sm leading-relaxed">{personalInfo?.summary}</p>
                    </Section>
                </div>
                <div className="grid grid-cols-12 gap-x-8">
                     <Section title="Experience" show={experience && experience.length > 0}>
                        <div className="space-y-6">
                            {experience?.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold">{exp.company || 'Company'}</h3>
                                        <div className="text-xs font-mono">{exp.startDate} - {exp.endDate}</div>
                                    </div>
                                    <div className="text-sm mb-1">{exp.role || 'Role'}</div>
                                    {renderDescription(exp.description)}
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
                <div className="grid grid-cols-12 gap-x-8">
                    <Section title="Education" show={education && education.length > 0}>
                        <div className="space-y-4">
                            {education?.map(edu => (
                                <div key={edu.id} className="flex justify-between">
                                    <div>
                                        <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                        <p className="text-sm">{edu.degree || 'Degree'}</p>
                                    </div>
                                    <p className="text-xs font-mono">{edu.graduationDate}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
                <div className="grid grid-cols-12 gap-x-8">
                    <Section title="Skills" show={skills && skills.length > 0}>
                        <p className="text-sm">{skills?.map(s => s.name).join(', ')}</p>
                    </Section>
                </div>
            </div>
        </div>
    );
};

// Template 5: Bold
const BoldTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects } = resumeData;
    const { color } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode, show?: boolean }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return <section><h2 className="text-2xl font-bold tracking-tighter mb-3" style={{color}}>{title}</h2><div className="space-y-5">{children}</div></section>;
    };

    return (
        <div className="p-8">
            <header className="mb-8 border-b-4 pb-4" style={{borderColor: color}}>
                <h1 className="text-5xl font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                 <div className="flex items-center gap-x-4 text-xs mt-3">
                    <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
                </div>
            </header>
            
            <div className="space-y-8">
                <Section title="Professional Summary" show={!!personalInfo?.summary}>
                    <p className="text-sm">{personalInfo?.summary}</p>
                </Section>
                <Section title="Work Experience" show={experience && experience.length > 0}>
                    {experience?.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-semibold">{exp.role || 'Role'}</h3>
                                <div className="text-sm font-medium">{exp.startDate} - {exp.endDate}</div>
                            </div>
                            <div className="text-base font-medium mb-1">{exp.company || 'Company'}</div>
                            {renderDescription(exp.description)}
                        </div>
                    ))}
                </Section>
                <Section title="Projects" show={projects && projects.length > 0}>
                    {projects?.map(proj => (
                        <div key={proj.id}>
                            <h3 className="text-lg font-semibold">{proj.name || 'Project Name'}</h3>
                            {renderDescription(proj.description)}
                        </div>
                    ))}
                </Section>
                <div className="grid grid-cols-2 gap-8">
                    <Section title="Education" show={education && education.length > 0}>
                        {education?.map(edu => (
                            <div key={edu.id}>
                                <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                <p className="text-sm">{edu.degree || 'Degree'}, {edu.graduationDate}</p>
                            </div>
                        ))}
                    </Section>
                    <Section title="Skills" show={skills && skills.length > 0}>
                        <ul className="columns-2 text-sm">
                        {skills?.map(s => s.name && <li key={s.id}>{s.name}</li>)}
                        </ul>
                    </Section>
                </div>
            </div>
        </div>
    );
};


export function ResumePreview({ resumeData, designOptions, className }: ResumePreviewProps) {
  const { font, template } = designOptions;
  const fontClass = fontClasses[font] || 'font-body';

  const TemplateComponent = match(template)
    .with('classic', () => ClassicTemplate)
    .with('executive', () => ExecutiveTemplate)
    .with('minimal', () => MinimalTemplate)
    .with('bold', () => BoldTemplate)
    .otherwise(() => ModernTemplate);

  return (
    <div 
      id="resume-preview-content"
      className={cn(
        "bg-card text-card-foreground w-[210mm] min-h-[297mm] shadow-lg",
        "resume-preview-container",
        fontClass,
        className
      )}
    >
      <div className={cn("flex flex-col h-full text-[10pt] leading-snug")}>
        <TemplateComponent resumeData={resumeData} designOptions={designOptions} />
      </div>
    </div>
  );
}
