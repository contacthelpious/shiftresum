
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
  const items = details.split('\n').filter(item => item.trim());
  if (items.length === 0) return null;
  
  return (
     <ul className="list-disc list-outside pl-5 space-y-1 text-sm">
      {items.map((item, index) => <li key={index}>{item.replace(/^- /, '')}</li>)}
    </ul>
  )
};

const ContactLine: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) => {
  if (!text) return null;
  return <span className="flex items-center gap-1.5">{icon}{text}</span>;
};

// =================================================================
// SECTION COMPONENTS
// These are the building blocks for the templates.
// =================================================================
const Sections = {
  summary: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <p className="text-sm">{resumeData.personalInfo.summary}</p>
  ),
  experience: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="space-y-4">
      {resumeData.experience.map(exp => (
        <div key={exp.id}>
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
            <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
          </div>
          <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
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
          <div className="italic text-sm text-muted-foreground">{edu.degree || 'Degree'}</div>
          {edu.details && <div className="text-sm">{edu.details}</div>}
        </div>
      ))}
    </div>
  ),
  skills: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="flex flex-wrap gap-2">
      {resumeData.skills.map(skill => skill.name && <span key={skill.id} className="bg-muted px-2 py-1 rounded text-sm">{skill.name}</span>)}
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
                <div className="italic text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</div>
            </div>
        ))}
    </div>
  ),
  additionalInformation: ({ resumeData }: { resumeData: ResumeFormData }) => (
    renderFreeform(resumeData.additionalInformation.details)
  ),
  references: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="grid grid-cols-2 gap-4">
      {resumeData.references.map(ref => (
        <div key={ref.id} className="text-sm">
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

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ borderColor: color }}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );

  return (
    <div className={cn("p-8", `text-${alignment}`)}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
        <div className={cn(
          "flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap",
           alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
        )}>
            <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
            <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
            <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
            <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
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


const ClassicTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-2" style={{ color }}>{title}</h2>
            <div className="border-t w-1/4 mx-auto mb-4" style={{ borderColor: color }}/>
            <div className="space-y-4">{children}</div>
        </section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
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
                {sectionOrder.map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    
                    if (key === 'skills') {
                         return (
                            <Section key={key} title={sectionTitles[key]}>
                                <p className="text-sm text-center">{resumeData.skills.map(s => s.name).join(' • ')}</p>
                            </Section>
                        )
                    }

                    if (key === 'summary') {
                         return (
                            <Section key={key} title={sectionTitles[key]}>
                                 <p className="text-sm text-center">{personalInfo.summary}</p>
                            </Section>
                        )
                    }

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
    const { color } = designOptions;

    const sidebarContent: React.ReactNode[] = [];
    const mainContent: React.ReactNode[] = [];

    const RightSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-base font-bold uppercase tracking-wider mb-2">{title}</h2><div className="space-y-4">{children}</div></section>
    );

    const LeftSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-sm font-bold uppercase tracking-wider mb-2">{title}</h2><div>{children}</div></section>
    );

    let cumulativeMainHeight = 0;
    
    // Distribute sections between sidebar and main content
    sectionOrder.forEach(key => {
        if (!sectionHasContent(key, resumeData) || key === 'summary') return;

        const Component = Sections[key];
        let sectionContent = <Component resumeData={resumeData} />;
        
        let wordCount = 0;
        try {
            if (key === 'summary') {
                wordCount = (resumeData.personalInfo.summary || '').length;
            } else {
                 wordCount = JSON.stringify(resumeData[key as keyof typeof resumeData]).length;
            }
        } catch (e) {
            wordCount = 1000; // Default to large if stringify fails
        }
        
        const isSmallSection = key === 'skills' || key === 'education' || key === 'certifications' || key === 'references';

        if (isSmallSection && cumulativeMainHeight > 2000 && sidebarContent.length < 4) {
             if (key === 'skills') {
                sidebarContent.push(
                    <LeftSection key={`${key}-sidebar`} title={sectionTitles[key]}>
                        <ul className="text-sm space-y-1">
                            {resumeData.skills.map(skill => skill.name && <li key={skill.id}>{skill.name}</li>)}
                        </ul>
                    </LeftSection>
                );
             } else if (key === 'education') {
                 sidebarContent.push(
                    <LeftSection key={`${key}-sidebar`} title={sectionTitles[key]}>
                        {resumeData.education.map(edu => (
                            <div key={edu.id} className="text-sm mb-2">
                                <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                <p>{edu.degree || 'Degree'}</p>
                                <p className="text-xs">{edu.graduationDate}</p>
                            </div>
                        ))}
                    </LeftSection>
                );
             } else {
                sidebarContent.push(
                    <LeftSection key={`${key}-sidebar`} title={sectionTitles[key]}>{sectionContent}</LeftSection>
                );
             }
        } else {
            cumulativeMainHeight += wordCount;
            mainContent.push(
                <RightSection key={`${key}-main`} title={sectionTitles[key]}>{sectionContent}</RightSection>
            );
        }
    });


    return (
        <div className="p-0">
            <header className="p-8 mb-6 text-white" style={{backgroundColor: color}}>
                <h1 className="text-4xl font-bold">{personalInfo?.name || 'Your Name'}</h1>
                {sectionHasContent('summary', resumeData) && <p className="text-xl mt-1">{personalInfo.summary}</p>}
            </header>
            <div className="grid grid-cols-12 gap-x-8 px-8">
                <div className="col-span-4 space-y-6">
                    <LeftSection title="Contact">
                        <div className="text-sm space-y-1">
                           <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                            <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} />
                            <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} />
                            <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} />
                        </div>
                    </LeftSection>
                    {sidebarContent}
                </div>
                <div className="col-span-8 space-y-6">
                    {mainContent}
                </div>
            </div>
        </div>
    );
};


const MinimalTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions }) => {
    const { personalInfo, sectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <div className="grid grid-cols-12 gap-x-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest col-span-3 mb-2 pt-0.5" style={{color}}>{title}</h2>
            <div className="col-span-9">{children}</div>
        </div>
    );

    return (
        <div className={cn("p-10 space-y-8", `text-${alignment}`)}>
            <header className="mb-8">
                <h1 className="text-2xl font-bold tracking-wider">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-xs text-muted-foreground mt-2">
                    <span>{personalInfo?.email}</span>
                    {personalInfo?.email && personalInfo.website && <span className="mx-2">//</span>}
                    <span>{personalInfo?.website}</span>
                     {personalInfo?.website && personalInfo.location && <span className="mx-2">//</span>}
                    <span>{personalInfo?.location}</span>
                </div>
            </header>
            
            <div className="space-y-8">
                {sectionOrder.map(key => {
                     if (!sectionHasContent(key, resumeData)) return null;
                     const Component = Sections[key];
                     if (key === 'skills') {
                        return (
                            <Section key={key} title={sectionTitles[key]}>
                                <p className="text-sm">{resumeData.skills.map(s => s.name).join(', ')}</p>
                            </Section>
                        )
                     }
                     return (
                        <Section key={key} title={sectionTitles[key]}>
                           <div className="space-y-6">
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
        <section><h2 className="text-2xl font-bold tracking-tighter mb-3" style={{color}}>{title}</h2><div className="space-y-5">{children}</div></section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-8 border-b-4 pb-4" style={{borderColor: color}}>
                <h1 className="text-5xl font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                 <div className={cn(
                    "flex items-center gap-x-4 text-xs mt-3",
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
                    if (key === 'skills') {
                        return (
                           <Section key={key} title={sectionTitles[key]}>
                               <ul className="columns-2 sm:columns-3 text-sm">
                               {resumeData.skills.map(s => s.name && <li key={s.id}>{s.name}</li>)}
                               </ul>
                           </Section>
                        )
                    }
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
