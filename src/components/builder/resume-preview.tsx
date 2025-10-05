
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

const fontSizeClasses: {[key: string]: string} = {
    small: 'text-[10pt]',
    medium: 'text-[11pt]',
    large: 'text-[12pt]',
};

const lineHeightClasses: {[key: string]: string} = {
    compact: 'leading-snug',
    standard: 'leading-normal',
    relaxed: 'leading-relaxed',
}

// =================================================================
// Reusable Helper Components & Functions
// =================================================================

const renderDescription = (description: string | BulletPoint[] | undefined) => {
  if (!description) return null;
  const items = Array.isArray(description) 
    ? description.map(item => item.value) 
    : description.split('\n').map(item => item.replace(/^- /, ''));
  
  return (
    <ul className="list-disc list-outside pl-4 space-y-1">
      {items.map((item, index) => item.trim() && <li key={index}>{item}</li>)}
    </ul>
  );
};

const renderFreeform = (details: string | undefined) => {
  if (!details) return null;
  const items = details.split('\n').filter(item => item.trim());
  if (items.length === 0) return null;
  
  return (
     <ul className="list-disc list-outside pl-4 space-y-1">
      {items.map((item, index) => <li key={index}>{item.replace(/^- /, '')}</li>)}
    </ul>
  )
};

const ContactLine: React.FC<{ icon: React.ReactNode; text?: string; link?: string; className?: string }> = ({ icon, text, link, className }) => {
  if (!text) return null;
  const content = <span className={cn("flex items-center gap-1.5", className)}>{icon}{text}</span>;
  if (link) {
    return <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">{content}</a>
  }
  return content;
};


// =================================================================
// SECTION COMPONENTS
// =================================================================

const Sections = {
  summary: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <p>{resumeData.personalInfo.summary}</p>
  ),
  experience: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="space-y-4">
      {resumeData.experience.map(exp => (
        <div key={exp.id}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
            <div className="text-xs text-muted-foreground whitespace-nowrap">{exp.startDate}{exp.endDate && ` - ${exp.endDate}`}</div>
          </div>
          <div className="italic text-muted-foreground mb-1">{exp.company || 'Company'}</div>
          {renderDescription(exp.description)}
        </div>
      ))}
    </div>
  ),
  projects: ({ resumeData }: { resumeData: ResumeFormData }) => (
     <div className="space-y-4">
      {resumeData.projects.map(proj => (
        <div key={proj.id}>
            <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
            </div>
            {renderDescription(proj.description)}
        </div>
      ))}
    </div>
  ),
  education: ({ resumeData }: { resumeData: ResumeFormData }) => (
     <div className="space-y-2">
      {resumeData.education.map(edu => (
        <div key={edu.id}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-base">{edu.institution || 'Institution'}</h3>
            <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
          </div>
          <div className="italic text-muted-foreground">{edu.degree || 'Degree'}</div>
          {edu.details && <div>{edu.details}</div>}
        </div>
      ))}
    </div>
  ),
  skills: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="flex flex-wrap gap-2">
      {resumeData.skills.map(skill => skill.name && <span key={skill.id} className="bg-muted px-2 py-1 rounded">{skill.name}</span>)}
    </div>
  ),
  certifications: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="space-y-2">
        {resumeData.certifications.map(cert => (
            <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-base">{cert.name || 'Certification'}</h3>
                    <div className="text-xs text-muted-foreground">{cert.date}</div>
                </div>
                <div className="italic text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</div>
            </div>
        ))}
    </div>
  ),
  additionalInformation: ({ resumeData }: { resumeData: ResumeFormData }) => (
    renderFreeform(resumeData.additionalInformation.details)
  ),
  references: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {resumeData.references.map(ref => (
        <div key={ref.id}>
          <h3 className="font-semibold">{ref.name}</h3>
          <p className="text-muted-foreground">{ref.company}</p>
          <p className="text-muted-foreground">{ref.email}</p>
          <p className="text-muted-foreground">{ref.phone}</p>
        </div>
      ))}
    </div>
  )
};

const sectionHasContent = (key: keyof typeof Sections, resumeData: ResumeFormData) => {
  switch (key) {
    case 'summary': return !!resumeData.personalInfo.summary;
    case 'experience': return resumeData.experience.length > 0 && resumeData.experience.some(e => e.role || e.company);
    case 'projects': return resumeData.projects.length > 0 && resumeData.projects.some(p => p.name);
    case 'education': return resumeData.education.length > 0 && resumeData.education.some(e => e.institution || e.degree);
    case 'skills': return resumeData.skills.length > 0 && resumeData.skills.some(s => s.name);
    case 'certifications': return resumeData.certifications.length > 0 && resumeData.certifications.some(c => c.name);
    case 'additionalInformation': return !!resumeData.additionalInformation.details;
    case 'references': return resumeData.references.length > 0 && resumeData.references.some(r => r.name);
    default: return false;
  }
};

const sectionTitles: { [key in keyof typeof Sections]: string } = {
  summary: 'Summary',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  additionalInformation: 'Additional Information',
  references: 'References',
};

// =================================================================
// TEMPLATES
// =================================================================

const ModernTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
  const { personalInfo, sectionOrder } = resumeData;
  const { color, alignment } = designOptions;
  
  const sidebarSections: React.ReactNode[] = [];
  const mainSections: React.ReactNode[] = [];

  const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-[16pt] font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ borderColor: color }}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );

  const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-[14pt] font-bold uppercase tracking-wider mb-2" style={{color}}>{title}</h2>
      <div>{children}</div>
    </section>
  );
  
  const smallSections = ['skills', 'education', 'certifications', 'references'];

  sectionOrder.forEach(key => {
    if (!sectionHasContent(key, resumeData)) return;

    const Component = Sections[key];
    const sectionContent = <Component resumeData={resumeData} />;
    
    if (smallSections.includes(key)) {
        sidebarSections.push(<SidebarSection key={key} title={sectionTitles[key]}>{sectionContent}</SidebarSection>);
    } else {
        mainSections.push(<MainSection key={key} title={sectionTitles[key]}>{sectionContent}</MainSection>);
    }
  });

  return (
    <div className={cn("p-0 flex", `text-${alignment}`)}>
      <div className="w-1/3 bg-muted/40 p-6 space-y-6">
          <header className="mb-4">
            <h1 className="text-[22pt] font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
          </header>
          <SidebarSection title="Contact">
             <div className="space-y-2">
                <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} />
                <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} />
                <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={`https://${personalInfo?.website}`} />
                <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
            </div>
          </SidebarSection>
          {sidebarSections}
      </div>
      <div className="w-2/3 p-6 space-y-6">
        {mainSections}
      </div>
    </div>
  );
};


const ClassicTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section>
            <h2 className="text-[15pt] font-bold uppercase tracking-[.2em] mb-2" style={{ color }}>{title}</h2>
            <hr className="mb-3" style={{borderColor: color}}/>
            <div className="space-y-4">{children}</div>
        </section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-6 text-center">
                <h1 className="text-[22pt] font-bold tracking-wide">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-sm text-muted-foreground mt-2">
                    <span>{personalInfo?.location}</span>
                    {personalInfo?.location && (personalInfo.email || personalInfo.phone) && <span className="mx-2">|</span>}
                    <span>{personalInfo?.email}</span>
                    {personalInfo?.email && personalInfo.phone && <span className="mx-2">|</span>}
                    <span>{personalInfo?.phone}</span>
                    {personalInfo.website && <><span className="mx-2">|</span><span>{personalInfo.website}</span></>}
                </div>
            </header>
            <div className="space-y-6">
                {sectionOrder.map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    return (
                        <Section key={key} title={sectionTitles[key]}>
                            <Component resumeData={resumeData} />
                        </Section>
                    )
                })}
            </div>
        </div>
    );
};


const ExecutiveTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;

    const mainSections: React.ReactNode[] = [];
    const sidebarSections: React.ReactNode[] = [];

    const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[14pt] font-semibold uppercase tracking-wider mb-2 text-muted-foreground">{title}</h2><div className="space-y-4">{children}</div></section>
    );

    const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[12pt] font-semibold uppercase tracking-wider mb-2" style={{color}}>{title}</h2><div>{children}</div></section>
    );

    sectionOrder.forEach(key => {
      if (!sectionHasContent(key, resumeData)) return;
      
      const Component = Sections[key];
      const sectionContent = <Component resumeData={resumeData} />;

      const isSidebarSection = ['skills', 'education', 'certifications', 'references'].includes(key);

      if (isSidebarSection) {
        sidebarSections.push(<SidebarSection key={key} title={sectionTitles[key]}>{sectionContent}</SidebarSection>);
      } else {
        mainSections.push(<MainSection key={key} title={sectionTitles[key]}>{sectionContent}</MainSection>);
      }
    });

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-6 pb-4 border-b-2" style={{ borderColor: color }}>
                <h1 className="text-[24pt] font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                 <div className="flex items-center gap-x-4 text-xs mt-3 text-muted-foreground">
                    <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
                </div>
            </header>
            <div className="grid grid-cols-12 gap-x-8">
                <div className="col-span-8 space-y-6">
                    {mainSections}
                </div>
                <div className="col-span-4 space-y-6">
                    {sidebarSections}
                </div>
            </div>
        </div>
    );
};


const MinimalTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <div className="grid grid-cols-12 gap-x-6">
            <h2 className="col-span-3 text-[14pt] font-bold uppercase tracking-widest pt-1" style={{color}}>{title}</h2>
            <div className="col-span-9">{children}</div>
        </div>
    );

    return (
        <div className={cn("p-10 space-y-6", `text-${alignment}`)}>
            <header className="mb-4 text-center">
                <h1 className="text-[20pt] font-semibold tracking-wider">{personalInfo?.name || 'Your Name'}</h1>
                <p className="mt-1">{personalInfo.summary}</p>
                <div className="text-xs text-muted-foreground mt-3">
                    <span>{personalInfo?.email}</span>
                    {personalInfo?.email && personalInfo.website && <span className="mx-2">//</span>}
                    <span>{personalInfo?.website}</span>
                     {personalInfo?.website && personalInfo.location && <span className="mx-2">//</span>}
                    <span>{personalInfo?.location}</span>
                </div>
            </header>
            
            <div className="space-y-6">
                {sectionOrder.map(key => {
                     if (!sectionHasContent(key, resumeData) || key === 'summary') return null;
                     const Component = Sections[key];
                     return (
                        <Section key={key} title={sectionTitles[key]}>
                           <div className="space-y-4">
                                <Component resumeData={resumeData} />
                           </div>
                        </Section>
                     )
                })}
            </div>
        </div>
    );
};


const BoldTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[16pt] font-bold tracking-tighter mb-3">{title}</h2><div className="space-y-5">{children}</div></section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-8 text-white p-6 rounded-lg" style={{backgroundColor: color}}>
                <h1 className="text-[22pt] font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                 <div className={cn(
                    "flex items-center gap-x-4 text-xs mt-3 opacity-90",
                    alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
                 )}>
                    <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
                </div>
            </header>
            
            <div className="space-y-8">
                {sectionOrder.map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    return (
                        <Section key={key} title={sectionTitles[key]}>
                            <Component resumeData={resumeData} />
                        </Section>
                    )
                })}
            </div>
        </div>
    );
};


export function ResumePreview({ resumeData, designOptions, className }: ResumePreviewProps) {
  const { font, template, fontSize, lineHeight } = designOptions;
  const fontClass = fontClasses[font] || 'font-body';
  const fontSizeClass = fontSizeClasses[fontSize] || 'text-[11pt]';
  const lineHeightClass = lineHeightClasses[lineHeight] || 'leading-normal';

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
      <div className={cn("h-full", fontSizeClass, lineHeightClass)}>
        <TemplateComponent resumeData={resumeData} designOptions={designOptions} />
      </div>
    </div>
  );
}

    