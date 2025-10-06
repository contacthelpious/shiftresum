
'use client';

import type { ResumeFormData, DesignOptions, BulletPoint, SectionKey } from '@/lib/definitions';
import { Mail, Phone, Globe, MapPin, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { match } from 'ts-pattern';

interface ResumePreviewProps {
  resumeData: ResumeFormData;
  designOptions: DesignOptions;
  className?: string;
  isInteractive?: boolean; // New prop
}

const fontClasses: {[key: string]: string} = {
  Inter: 'font-inter',
  Roboto: 'font-roboto',
  Lato: 'font-lato',
  Georgia: 'font-georgia',
  Garamond: 'font-garamond',
  Verdana: 'font-verdana',
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

const defaultSectionOrder: SectionKey[] = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'additionalInformation', 'references'];

// =================================================================
// Reusable Helper Components & Functions
// =================================================================

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const getContrastColor = (hexColor: string): string => {
  if (!hexColor) return '#FFFFFF';
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#FFFFFF'; // Default to white for invalid colors
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF'; // Black for light backgrounds, white for dark
};

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

const ContactLine: React.FC<{ icon: React.ReactNode; text?: string; link?: string; className?: string; isInteractive?: boolean }> = ({ icon, text, link, className, isInteractive = true }) => {
  if (!text) return null;
  const content = <span className={cn("flex items-center gap-1.5", className)}>{icon}{text}</span>;
  
  if (link && isInteractive) {
    const isEmail = link.startsWith('mailto:');
    const finalLink = isEmail ? link : (link.startsWith('http') ? link : `https://${link}`);
    return <a href={finalLink} target="_blank" rel="noopener noreferrer" className="hover:underline">{content}</a>
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
            <h3 className="font-semibold text-[1.1em]">{exp.role || 'Role'}</h3>
            <div className="text-xs text-muted-foreground whitespace-nowrap">{exp.startDate}{exp.endDate && ` - ${exp.endDate}`}</div>
          </div>
          <div className="italic text-muted-foreground mb-1">{exp.company || 'Company'}</div>
          {renderDescription(exp.description)}
        </div>
      ))}
    </div>
  ),
  projects: ({ resumeData, designOptions, isInteractive }: { resumeData: ResumeFormData; designOptions: DesignOptions; isInteractive?: boolean; }) => (
     <div className="space-y-4">
      {resumeData.projects.map(proj => (
        <div key={proj.id}>
            <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[1.1em]">{proj.name || 'Project Name'}</h3>
                {proj.link && isInteractive && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
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
            <h3 className="font-semibold text-[1.1em]">{edu.institution || 'Institution'}</h3>
            <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
          </div>
          <div className="italic text-muted-foreground">{edu.degree || 'Degree'}</div>
          {edu.details && <div>{edu.details}</div>}
        </div>
      ))}
    </div>
  ),
  skills: ({ resumeData, designOptions }: { resumeData: ResumeFormData; designOptions: DesignOptions }) => {
    const rgb = hexToRgb(designOptions.color);
    const skillBgColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : 'hsl(var(--muted))';
    const skillTextColor = rgb ? designOptions.color : 'hsl(var(--foreground))';

    return (
        <div className="flex flex-wrap gap-2">
            {resumeData.skills.map(skill => skill.name && 
                <span key={skill.id} className="px-2 py-1 rounded text-[0.9em]" style={{ backgroundColor: skillBgColor, color: skillTextColor }}>
                    {skill.name}
                </span>
            )}
        </div>
    );
  },
  skillsVertical: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <ul className="space-y-1">
        {resumeData.skills.map(skill => skill.name && 
            <li key={skill.id} className="text-sm">{skill.name}</li>
        )}
    </ul>
  ),
  certifications: ({ resumeData }: { resumeData: ResumeFormData }) => (
    <div className="space-y-2">
        {resumeData.certifications.map(cert => (
            <div key={cert.id}>
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-[1.1em]">{cert.name || 'Certification'}</h3>
                    <div className="text-xs text-muted-foreground">{cert.date}</div>
                </div>
                <div className="italic text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</div>
            </div>
        ))}
    </div>
  ),
  additionalInformation: ({ resumeData }: { resumeData: ResumeFormData }) => (
    renderFreeform(resumeData.additionalInformation?.details)
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
  if (!resumeData) return false;
  switch (key) {
    case 'summary': return !!resumeData.personalInfo?.summary;
    case 'experience': return !!resumeData.experience?.length && resumeData.experience.some(e => e.role || e.company);
    case 'projects': return !!resumeData.projects?.length && resumeData.projects.some(p => p.name);
    case 'education': return !!resumeData.education?.length && resumeData.education.some(e => e.institution || e.degree);
    case 'skills': return !!resumeData.skills?.length && resumeData.skills.some(s => s.name);
    case 'certifications': return !!resumeData.certifications?.length && resumeData.certifications.some(c => c.name);
    case 'additionalInformation': return !!resumeData.additionalInformation?.details;
    case 'references': return !!resumeData.references?.length && resumeData.references.some(r => r.name);
    default: return false;
  }
};

const sectionTitles: { [key in keyof typeof Sections]: string } = {
  summary: 'Summary',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
  skillsVertical: 'Skills',
  certifications: 'Certifications',
  additionalInformation: 'Additional Information',
  references: 'References',
};

// =================================================================
// TEMPLATES
// =================================================================

const ModernTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
  const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
  const { color, alignment } = designOptions;
  
  const sidebarSections: React.ReactNode[] = [];
  const mainSections: React.ReactNode[] = [];

  const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-[14pt] font-bold uppercase tracking-wider mb-3 pb-1 border-b-2" style={{ borderColor: color }}>{title}</h2>
      {children}
    </section>
  );

  const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section>
      <h2 className="text-[12pt] font-bold uppercase tracking-wider mb-2" style={{color}}>{title}</h2>
      <div>{children}</div>
    </section>
  );
  
  (sectionOrder || defaultSectionOrder).forEach(key => {
    if (!sectionHasContent(key, resumeData)) return;

    const isSidebarSection = ['skills', 'education', 'certifications', 'references'].includes(key);

    let Component, sectionContent;
    if (key === 'skills' && isSidebarSection) {
      Component = Sections['skillsVertical'];
      sectionContent = <Component resumeData={resumeData} />;
    } else {
      Component = Sections[key as keyof typeof Sections];
      sectionContent = <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />;
    }
    
    if (isSidebarSection && sidebarSections.length < 4) {
      sidebarSections.push(<SidebarSection key={key} title={sectionTitles[key]}>{sectionContent}</SidebarSection>);
    } else {
      mainSections.push(<MainSection key={key} title={sectionTitles[key]}>{sectionContent}</MainSection>);
    }
  });

  return (
    <div className={cn("p-0 flex h-full items-stretch", `text-${alignment}`)}>
      <div className="w-1/3 bg-muted/30 p-6 space-y-6">
          <header className="mb-4">
            <h1 className="text-[22pt] font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
          </header>
          <SidebarSection title="Contact">
             <div className="space-y-2 text-sm">
                <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive} />
                <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive} />
                <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive} />
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


const ClassicTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
    const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section>
            <h2 className="text-[15pt] font-bold uppercase tracking-[.2em] mb-2" style={{ color }}>{title}</h2>
            <hr className="mb-3" style={{borderColor: color}}/>
            {children}
        </section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-6 text-center">
                <h1 className="text-[24pt] font-bold tracking-wide">{personalInfo?.name || 'Your Name'}</h1>
                 <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive} />
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive} />
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive} />
                </div>
            </header>
            <div className="space-y-6">
                {(sectionOrder || defaultSectionOrder).map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    return (
                        <Section key={key} title={sectionTitles[key]}>
                            <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />
                        </Section>
                    )
                })}
            </div>
        </div>
    );
};


const ExecutiveTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
    const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
    const { color, alignment } = designOptions;

    const mainSections: React.ReactNode[] = [];
    const sidebarSections: React.ReactNode[] = [];

    const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[14pt] font-semibold uppercase tracking-wider mb-2 text-muted-foreground">{title}</h2><div className="space-y-4">{children}</div></section>
    );

    const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[12pt] font-semibold uppercase tracking-wider mb-2" style={{color}}>{title}</h2><div>{children}</div></section>
    );
    
    (sectionOrder || defaultSectionOrder).forEach(key => {
      if (!sectionHasContent(key, resumeData)) return;
      
      const isSidebarSection = ['skills', 'education', 'certifications', 'references'].includes(key);

      let Component, sectionContent;
      if (key === 'skills' && isSidebarSection) {
        Component = Sections['skillsVertical'];
        sectionContent = <Component resumeData={resumeData} />;
      } else {
        Component = Sections[key as keyof typeof Sections];
        sectionContent = <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />;
      }

      if (isSidebarSection && sidebarSections.length < 4) {
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
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive}/>
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive}/>
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive}/>
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


const BoldTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
    const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    const headerTextColor = getContrastColor(color);
    
    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[16pt] font-bold tracking-tighter mb-3">{title}</h2><div className="space-y-5">{children}</div></section>
    );

    return (
        <div className={cn("p-8", `text-${alignment}`)}>
            <header className="mb-8 p-6 rounded-lg" style={{backgroundColor: color, color: headerTextColor}}>
                <h1 className="text-[22pt] font-extrabold tracking-tighter">{personalInfo?.name || 'Your Name'}</h1>
                 <div className={cn(
                    "flex items-center flex-wrap gap-x-4 gap-y-1 text-xs mt-3 opacity-90",
                    alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start'
                 )}>
                    <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} isInteractive={isInteractive} />
                    <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive} />
                    <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive} />
                    <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive} />
                </div>
            </header>
            
            <div className="space-y-8">
                {(sectionOrder || defaultSectionOrder).map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    return (
                        <Section key={key} title={sectionTitles[key]}>
                            <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />
                        </Section>
                    )
                })}
            </div>
        </div>
    );
};

const ProfessionalTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
    const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
    const { color, alignment } = designOptions;
    
    const sidebarKeys: (keyof typeof Sections)[] = ['skills', 'certifications', 'references'];
    const mainKeys: (keyof typeof Sections)[] = ['summary', 'experience', 'projects', 'education', 'additionalInformation'];

    const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[11pt] font-semibold uppercase tracking-wider mb-2 border-b pb-1" style={{borderColor: color}}>{title}</h2>{children}</section>
    );

    const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ children, title }) => (
        <section><h2 className="text-[14pt] font-bold uppercase tracking-wider mb-3 border-b-2 pb-1" style={{borderColor: color}}>{title}</h2>{children}</section>
    );

    return (
        <div className={cn("grid grid-cols-12 gap-x-8 p-8 h-full items-stretch", `text-${alignment}`)}>
            <div className="col-span-3 space-y-6">
                <header>
                    <h1 className="text-[24pt] font-bold leading-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
                </header>
                <SidebarSection title="Contact">
                    <div className="space-y-1 text-sm">
                        <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive} />
                        <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive} />
                        <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive} />
                        <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                    </div>
                </SidebarSection>
                {(sectionOrder || defaultSectionOrder).filter(k => sidebarKeys.includes(k)).map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;

                    let Component, sectionContent;
                    if (key === 'skills') {
                      Component = Sections['skillsVertical'];
                      sectionContent = <Component resumeData={resumeData} />;
                    } else {
                      Component = Sections[key as keyof typeof Sections];
                      sectionContent = <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />;
                    }

                    return <SidebarSection key={key} title={sectionTitles[key]}>{sectionContent}</SidebarSection>
                })}
            </div>
            <div className="col-span-9 pl-8 border-l space-y-6">
                 {(sectionOrder || defaultSectionOrder).filter(k => mainKeys.includes(k)).map(key => {
                    if (!sectionHasContent(key, resumeData)) return null;
                    const Component = Sections[key];
                    return <MainSection key={key} title={sectionTitles[key]}><Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} /></MainSection>
                })}
            </div>
        </div>
    );
};

const FocusTemplate: React.FC<Omit<ResumePreviewProps, 'className'>> = ({ resumeData, designOptions, isInteractive }) => {
    const { personalInfo, sectionOrder = defaultSectionOrder } = resumeData;
    const { color, alignment } = designOptions;

    return (
        <div className="flex h-full items-stretch">
            <div className="w-1.5 h-full" style={{backgroundColor: color}}></div>
            <div className={cn("p-8 flex-1", `text-${alignment}`)}>
                <header className="mb-8">
                    <h1 className="text-[28pt] font-bold tracking-tight">{personalInfo?.name || 'Your Name'}</h1>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                        <ContactLine icon={<MapPin size={12}/>} text={personalInfo?.location} />
                        <ContactLine icon={<Mail size={12}/>} text={personalInfo?.email} link={`mailto:${personalInfo?.email}`} isInteractive={isInteractive} />
                        <ContactLine icon={<Phone size={12}/>} text={personalInfo?.phone} link={`tel:${personalInfo?.phone}`} isInteractive={isInteractive} />
                        <ContactLine icon={<Globe size={12}/>} text={personalInfo?.website} link={personalInfo?.website} isInteractive={isInteractive} />
                    </div>
                </header>
                <div className="space-y-6">
                    {(sectionOrder || defaultSectionOrder).map(key => {
                        if (!sectionHasContent(key, resumeData)) return null;
                        const Component = Sections[key];
                        return (
                            <section key={key}>
                                <h2 className="text-[14pt] font-bold uppercase tracking-wider mb-2" style={{color}}>{sectionTitles[key]}</h2>
                                <Component resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export function ResumePreview({ resumeData, designOptions, className, isInteractive = true }: ResumePreviewProps) {
  const { font, template, fontSize, lineHeight } = designOptions;
  const fontClass = fontClasses[font] || 'font-inter';
  const fontSizeClass = fontSizeClasses[fontSize] || 'text-[11pt]';
  const lineHeightClass = lineHeightClasses[lineHeight] || 'leading-normal';

  const TemplateComponent = match(template)
    .with('classic', () => ClassicTemplate)
    .with('executive', () => ExecutiveTemplate)
    .with('bold', () => BoldTemplate)
    .with('professional', () => ProfessionalTemplate)
    .with('focus', () => FocusTemplate)
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
        <TemplateComponent resumeData={resumeData} designOptions={designOptions} isInteractive={isInteractive} />
      </div>
    </div>
  );
}
