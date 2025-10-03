
'use client';

import type { ResumeFormData, DesignOptions } from '@/lib/definitions';
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

// Main Section Component
const Section: React.FC<{ title: string; color: string; children: React.ReactNode, show?: boolean, className?: string }> = ({ title, color, children, show = true, className }) => {
  if (!show) return null;
  return (
    <section className={className}>
      <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ borderColor: color }}>{title}</h2>
      {children}
    </section>
  );
};

// Modern Template
const ModernTemplate: React.FC<Omit<ResumePreviewProps, 'className' | 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
  const { color } = designOptions;
  return (
    <>
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color }}>
          {personalInfo?.name || 'Your Name'}
        </h1>
        <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
          {personalInfo?.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{personalInfo.location}</span>}
          {personalInfo?.email && <span className="flex items-center gap-1.5"><Mail size={12} />{personalInfo.email}</span>}
          {personalInfo?.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{personalInfo.phone}</span>}
          {personalInfo?.website && <span className="flex items-center gap-1.5"><Globe size={12} />{personalInfo.website}</span>}
        </div>
      </header>

      {/* Body */}
      <div className="space-y-6">
        <Section title="Summary" color={color} show={!!personalInfo?.summary}>
          <p className="text-sm">{personalInfo?.summary}</p>
        </Section>
        
        <Section title="Experience" color={color} show={experience && experience.length > 0}>
          <div className="space-y-4">
            {experience?.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                  <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                </div>
                <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
                <ul className="list-disc list-outside pl-5 space-y-1">
                  {exp.description?.split('\n').map((item, i) => item.trim() && <li key={`${exp.id}-desc-${i}`} className="text-sm">{item.replace(/^- /, '')}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>
        
        <Section title="Projects" color={color} show={projects && projects.length > 0}>
           <div className="space-y-4">
                {projects?.map(proj => (
                    <div key={proj.id}>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                            {proj.link && (
                                <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                    <LinkIcon size={12} />
                                </Link>
                            )}
                        </div>
                        <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                            {proj.description?.split('\n').map((item, i) => item.trim() && <li key={`${proj.id}-desc-${i}`} className="text-sm">{item.replace(/^- /, '')}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </Section>

        <Section title="Education" color={color} show={education && education.length > 0}>
          <div className="space-y-2">
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
          </div>
        </Section>

        <Section title="Certifications" color={color} show={certifications && certifications.length > 0}>
            <div className="space-y-2">
                {certifications?.map(cert => (
                    <div key={cert.id}>
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-base">{cert.name || 'Certification'}</h3>
                            <div className="text-xs text-muted-foreground">{cert.date}</div>
                        </div>
                         <div className="italic text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</div>
                    </div>
                ))}
            </div>
        </Section>

        <Section title="Skills" color={color} show={skills && skills.length > 0}>
          <div className="flex flex-wrap gap-2">
            {skills?.map(skill => (
              skill.name &&
              <span key={skill.id} className="bg-muted px-2 py-1 rounded text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
};

// Classic Template
const ClassicTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    const { color } = designOptions;
    return (
        <div className="text-left">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
                <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
                    {personalInfo?.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{personalInfo.location}</span>}
                    {personalInfo?.email && <span className="flex items-center gap-1.5"><Mail size={12} />{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{personalInfo.phone}</span>}
                    {personalInfo?.website && <span className="flex items-center gap-1.5"><Globe size={12} />{personalInfo.website}</span>}
                </div>
            </header>
            <div className="space-y-5">
                <Section title="Summary" color={color} show={!!personalInfo?.summary}>
                    <p className="text-sm">{personalInfo?.summary}</p>
                </Section>
                <Section title="Experience" color={color} show={experience && experience.length > 0}>
                    <div className="space-y-4">
                        {experience?.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{exp.role || 'Role'} at <span className="italic">{exp.company || 'Company'}</span></h3>
                                    <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                                </div>
                                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                                    {exp.description?.split('\n').map((item, i) => item.trim() && <li key={`${exp.id}-desc-${i}`} className="text-sm">{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section title="Education" color={color} show={education && education.length > 0}>
                    <div className="space-y-2">
                        {education?.map(edu => (
                            <div key={edu.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-semibold text-base">{edu.institution || 'Institution'}</h3>
                                    <div className="italic text-sm text-muted-foreground">{edu.degree || 'Degree'}</div>
                                    {edu.details && <div className="text-sm text-muted-foreground">{edu.details}</div>}
                                </div>
                                <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
                            </div>
                        ))}
                    </div>
                </Section>
                 <Section title="Projects" color={color} show={projects && projects.length > 0}>
                    <div className="space-y-4">
                        {projects?.map(proj => (
                            <div key={proj.id}>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                                    {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
                                </div>
                                <ul className="list-disc list-outside pl-5 space-y-1 mt-1">
                                    {proj.description?.split('\n').map((item, i) => item.trim() && <li key={`${proj.id}-desc-${i}`} className="text-sm">{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section title="Certifications" color={color} show={certifications && certifications.length > 0}>
                    <div className="space-y-2">
                       {certifications?.map(cert => (
                            <div key={cert.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-semibold text-base">{cert.name || 'Certification'}</h3>
                                    <div className="italic text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</div>
                                </div>
                                <div className="text-xs text-muted-foreground">{cert.date}</div>
                            </div>
                        ))}
                    </div>
                </Section>
                <Section title="Skills" color={color} show={skills && skills.length > 0}>
                    <p className="text-sm">{skills?.map(s => s.name).join(' | ')}</p>
                </Section>
            </div>
        </div>
    );
};

// Compact Template (Two-Column)
const CompactTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    const { color } = designOptions;
    return (
        <div className="grid grid-cols-12 gap-x-8">
            {/* Left Column */}
            <div className="col-span-4 space-y-6">
                 <header className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight" style={{ color }}>{personalInfo?.name || 'Your Name'}</h1>
                 </header>

                <div>
                    <h2 className="text-base font-bold uppercase tracking-wider mb-2" style={{ color }}>Contact</h2>
                    <div className="space-y-1 text-xs text-card-foreground">
                        {personalInfo?.location && <p className="flex items-center gap-1.5"><MapPin size={12} className="shrink-0"/>{personalInfo.location}</p>}
                        {personalInfo?.email && <p className="flex items-center gap-1.5"><Mail size={12} className="shrink-0"/>{personalInfo.email}</p>}
                        {personalInfo?.phone && <p className="flex items-center gap-1.5"><Phone size={12} className="shrink-0"/>{personalInfo.phone}</p>}
                        {personalInfo?.website && <p className="flex items-center gap-1.5"><Globe size={12} className="shrink-0"/>{personalInfo.website}</p>}
                    </div>
                </div>

                <Section title="Skills" color={color} show={skills && skills.length > 0} className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                      {skills?.map(skill => (
                          skill.name && <span key={skill.id} className="bg-muted px-2 py-1 rounded text-xs">{skill.name}</span>
                      ))}
                  </div>
                </Section>

                <Section title="Education" color={color} show={education && education.length > 0}>
                    <div className="space-y-3">
                        {education?.map(edu => (
                            <div key={edu.id}>
                                <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                <p className="italic text-sm text-muted-foreground">{edu.degree || 'Degree'}</p>
                                <p className="text-xs text-muted-foreground">{edu.graduationDate}</p>
                                {edu.details && <p className="text-xs">{edu.details}</p>}
                            </div>
                        ))}
                    </div>
                </Section>
                <Section title="Certifications" color={color} show={certifications && certifications.length > 0}>
                    <div className="space-y-3">
                        {certifications?.map(cert => (
                            <div key={cert.id}>
                                <h3 className="font-semibold">{cert.name || 'Certification'}</h3>
                                <p className="italic text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</p>
                                <p className="text-xs text-muted-foreground">{cert.date}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
            
            {/* Right Column */}
            <div className="col-span-8 space-y-6">
                <Section title="Summary" color={color} show={!!personalInfo?.summary}>
                    <p className="text-sm">{personalInfo?.summary}</p>
                </Section>

                <Section title="Experience" color={color} show={experience && experience.length > 0}>
                    <div className="space-y-4">
                        {experience?.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                                    <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                                </div>
                                <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
                                <ul className="list-disc list-outside pl-4 space-y-1 text-sm">
                                    {exp.description?.split('\n').map((item, i) => item.trim() && <li key={`${exp.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Projects" color={color} show={projects && projects.length > 0}>
                    <div className="space-y-4">
                        {projects?.map(proj => (
                            <div key={proj.id}>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                                    {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
                                </div>
                                <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-sm">
                                    {proj.description?.split('\n').map((item, i) => item.trim() && <li key={`${proj.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
};

// Professional Template
const ProfessionalTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    const { color } = designOptions;

    const Section: React.FC<{ title: string; show?: boolean, children: React.ReactNode }> = ({ title, show = true, children }) => {
        if (!show) return null;
        return (
            <section>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color }}>{title}</h2>
                <div className="border-t-2" style={{ borderColor: color }} />
                <div className="pt-3">{children}</div>
            </section>
        );
    };

    return (
        <div className="text-left space-y-5">
            <header className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">{personalInfo?.name || 'Your Name'}</h1>
                <div className="text-xs text-muted-foreground mt-2">
                    {personalInfo?.location}
                    {personalInfo?.location && (personalInfo.email || personalInfo.phone || personalInfo.website) ? ' • ' : ''}
                    {personalInfo?.email}
                    {personalInfo?.email && (personalInfo.phone || personalInfo.website) ? ' • ' : ''}
                    {personalInfo?.phone}
                    {personalInfo?.phone && personalInfo.website ? ' • ' : ''}
                    {personalInfo?.website}
                </div>
            </header>

            <Section title="Summary" show={!!personalInfo?.summary}>
                <p className="text-sm">{personalInfo?.summary}</p>
            </Section>

            <Section title="Skills" show={skills && skills.length > 0}>
                <p className="text-sm">{skills?.map(s => s.name).filter(Boolean).join(' | ')}</p>
            </Section>

            <Section title="Experience" show={experience && experience.length > 0}>
                <div className="space-y-4">
                    {experience?.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold">{exp.role || 'Role'}</h3>
                                <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                            </div>
                            <div className="italic text-sm mb-1">{exp.company || 'Company'}</div>
                            <ul className="list-disc list-outside pl-5 space-y-1 text-sm">
                                {exp.description?.split('\n').map((item, i) => item.trim() && <li key={`${exp.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

             <Section title="Projects" show={projects && projects.length > 0}>
                <div className="space-y-4">
                    {projects?.map(proj => (
                        <div key={proj.id}>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{proj.name || 'Project Name'}</h3>
                                {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
                            </div>
                            <ul className="list-disc list-outside pl-5 space-y-1 mt-1 text-sm">
                                {proj.description?.split('\n').map((item, i) => item.trim() && <li key={`${proj.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Education" show={education && education.length > 0}>
                <div className="space-y-2">
                    {education?.map(edu => (
                        <div key={edu.id} className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                <p className="text-sm">{edu.degree || 'Degree'}{edu.details ? `, ${edu.details}` : ''}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">{edu.graduationDate}</div>
                        </div>
                    ))}
                </div>
            </Section>
            
            <Section title="Certifications" show={certifications && certifications.length > 0}>
                 <div className="space-y-2">
                    {certifications?.map(cert => (
                        <div key={cert.id} className="flex justify-between items-baseline">
                            <div>
                                <h3 className="font-semibold">{cert.name || 'Certification'}</h3>
                                <p className="text-sm italic">{cert.issuingOrganization || 'Issuing Organization'}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">{cert.date}</div>
                        </div>
                    ))}
                </div>
            </Section>

        </div>
    );
};

// Creative Template
const CreativeTemplate: React.FC<Omit<ResumePreviewProps, 'className'| 'resumeData'> & {resumeData: Partial<ResumeFormData>}> = ({ resumeData, designOptions }) => {
    const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
    const { color } = designOptions;

    return (
        <div className="grid grid-cols-12 gap-x-8 h-full">
            {/* Left Column (Sidebar) */}
            <div className="col-span-4 h-full p-6 text-white" style={{ backgroundColor: color }}>
                <div className="text-center mb-8">
                     <h1 className="text-3xl font-bold tracking-tight text-white">{personalInfo?.name || 'Your Name'}</h1>
                </div>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b-2 border-white/50 pb-1">Contact</h2>
                        <div className="space-y-2 text-xs">
                            {personalInfo?.location && <p className="flex items-start gap-2"><MapPin size={12} className="shrink-0 mt-0.5"/><span>{personalInfo.location}</span></p>}
                            {personalInfo?.email && <p className="flex items-start gap-2"><Mail size={12} className="shrink-0 mt-0.5"/><span>{personalInfo.email}</span></p>}
                            {personalInfo?.phone && <p className="flex items-start gap-2"><Phone size={12} className="shrink-0 mt-0.5"/><span>{personalInfo.phone}</span></p>}
                            {personalInfo?.website && <p className="flex items-start gap-2"><Globe size={12} className="shrink-0 mt-0.5"/><span>{personalInfo.website}</span></p>}
                        </div>
                    </div>
                    
                    {skills && skills.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b-2 border-white/50 pb-1">Skills</h2>
                            <ul className="text-xs space-y-1">
                                {skills?.map(skill => skill.name && <li key={skill.id}>{skill.name}</li>)}
                            </ul>
                        </div>
                    )}

                    {education && education.length > 0 && (
                        <div>
                             <h2 className="text-sm font-bold uppercase tracking-widest mb-2 border-b-2 border-white/50 pb-1">Education</h2>
                             <div className="space-y-3 text-xs">
                                {education?.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-semibold">{edu.institution || 'Institution'}</h3>
                                        <p className="opacity-80">{edu.degree || 'Degree'}</p>
                                        <p className="opacity-80">{edu.graduationDate}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Column (Main Content) */}
            <div className="col-span-8 p-6 space-y-6">
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Summary</h2>
                    <p className="text-sm">{personalInfo?.summary}</p>
                </section>

                 <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Experience</h2>
                     <div className="space-y-4">
                        {experience?.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold text-base">{exp.role || 'Role'}</h3>
                                    <div className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</div>
                                </div>
                                <div className="italic text-sm text-muted-foreground mb-1">{exp.company || 'Company'}</div>
                                <ul className="list-disc list-outside pl-4 space-y-1 text-sm">
                                    {exp.description?.split('\n').map((item, i) => item.trim() && <li key={`${exp.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Projects</h2>
                    <div className="space-y-4">
                        {projects?.map(proj => (
                            <div key={proj.id}>
                                 <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-base">{proj.name || 'Project Name'}</h3>
                                    {proj.link && <Link href={proj.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline"><LinkIcon size={12} /></Link>}
                                </div>
                                <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-sm">
                                    {proj.description?.split('\n').map((item, i) => item.trim() && <li key={`${proj.id}-desc-${i}`}>{item.replace(/^- /, '')}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{ color }}>Certifications</h2>
                    <div className="space-y-3">
                        {certifications?.map(cert => (
                            <div key={cert.id}>
                                <h3 className="font-semibold">{cert.name || 'Certification'}</h3>
                                <p className="italic text-sm text-muted-foreground">{cert.issuingOrganization || 'Issuing Organization'}</p>
                                <p className="text-xs text-muted-foreground">{cert.date}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export function ResumePreview({ resumeData, designOptions, className }: ResumePreviewProps) {
  const { font, template } = designOptions;
  const fontClass = fontClasses[font] || 'font-body';

  const TemplateComponent = match(template)
    .with('classic', () => ClassicTemplate)
    .with('compact', () => CompactTemplate)
    .with('professional', () => ProfessionalTemplate)
    .with('creative', () => CreativeTemplate)
    .otherwise(() => ModernTemplate);

  const creativeClasses = template === 'creative' ? 'p-0' : 'p-8';

  return (
    <div 
      id="resume-preview-content"
      className={cn(
        "bg-card text-card-foreground w-[210mm] min-h-[297mm] shadow-lg",
        "resume-preview-container",
        fontClass,
        creativeClasses,
        className
      )}
    >
      <div className={cn("flex flex-col h-full text-[10pt] leading-snug", template === 'creative' && 'text-foreground')}>
        <TemplateComponent resumeData={resumeData} designOptions={designOptions} />
      </div>
    </div>
  );
}

    