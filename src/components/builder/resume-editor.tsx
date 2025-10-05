
'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import type { ResumeFormData } from '@/lib/definitions';
import { AiSummaryGenerator } from './ai-summary-generator';
import { AiExperienceGenerator } from './ai-experience-generator';
import { AiSkillGenerator } from './ai-skill-generator';

const ExperienceDescriptionEditor = ({ experienceIndex }: { experienceIndex: number }) => {
  const { control } = useFormContext<ResumeFormData>();
  const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
    control,
    name: `experience.${experienceIndex}.description`
  });

  return (
    <div className="space-y-2">
      <FormLabel>Description</FormLabel>
      <div className="space-y-2">
        {descFields.map((descField, descIndex) => (
            <div key={descField.id} className="flex items-start gap-2">
            <span className="text-muted-foreground mt-2">&bull;</span>
            <FormField name={`experience.${experienceIndex}.description.${descIndex}.value`} render={({ field }) => (
                <FormItem className="flex-1"><FormControl><Textarea rows={2} {...field} /></FormControl></FormItem>
            )} />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 mt-1" onClick={() => removeDesc(descIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
        ))}
        <Button size="sm" variant="ghost" className="text-accent" onClick={() => appendDesc({ id: crypto.randomUUID(), value: '' })}>
        <Plus className="mr-2 h-4 w-4" /> Add bullet point
        </Button>
      </div>
      <AiExperienceGenerator experienceIndex={experienceIndex} appendDescription={appendDesc} />
    </div>
  );
};


export function ResumeEditor() {
  const { control } = useFormContext<ResumeFormData>();

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: "skills",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects",
  });

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: "certifications",
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control,
    name: "references",
  });


  return (
    <Form {...useFormContext()}>
      <div className="space-y-4">
        <Accordion type="single" collapsible defaultValue="personal-info" className="w-full">
          <AccordionItem value="personal-info">
            <AccordionTrigger className="text-lg font-medium">Personal Information</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <FormField name="personalInfo.name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="personalInfo.email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="personalInfo.phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="personalInfo.location" render={({ field }) => (
                  <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField name="personalInfo.website" render={({ field }) => (
                  <FormItem className="sm:col-span-2"><FormLabel>Website / Portfolio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="sm:col-span-2 space-y-2">
                  <FormField name="personalInfo.summary" render={({ field }) => (
                    <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <AiSummaryGenerator />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="text-lg font-medium">Work Experience</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="rounded-md border p-4 space-y-4 relative bg-card">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    <FormField name={`experience.${index}.role`} render={({ field }) => (
                      <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`experience.${index}.company`} render={({ field }) => (
                      <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name={`experience.${index}.startDate`} render={({ field }) => (
                        <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="e.g. Jan 2020" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField name={`experience.${index}.endDate`} render={({ field }) => (
                        <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="e.g. Present" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <ExperienceDescriptionEditor experienceIndex={index} />
                  </div>
                ))}
                <Button variant="outline" onClick={() => appendExperience({id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', description: []})}>Add Experience</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="projects">
            <AccordionTrigger className="text-lg font-medium">Projects</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="rounded-md border p-4 space-y-4 relative bg-card">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    <FormField name={`projects.${index}.name`} render={({ field }) => (
                      <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`projects.${index}.link`} render={({ field }) => (
                      <FormItem><FormLabel>Project Link</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`projects.${index}.description`} render={({ field }) => (
                      <FormItem><FormLabel>Description (use '-' for bullet points)</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                ))}
                <Button variant="outline" onClick={() => appendProject({id: crypto.randomUUID(), name: '', description: '', link: ''})}>Add Project</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="education">
            <AccordionTrigger className="text-lg font-medium">Education</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {educationFields.map((field, index) => (
                   <div key={field.id} className="rounded-md border p-4 space-y-4 relative bg-card">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    <FormField name={`education.${index}.institution`} render={({ field }) => (
                      <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`education.${index}.degree`} render={({ field }) => (
                      <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`education.${index}.graduationDate`} render={({ field }) => (
                      <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`education.${index}.details`} render={({ field }) => (
                        <FormItem><FormLabel>Details</FormLabel><FormControl><Input placeholder="e.g., GPA, Honors" {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                ))}
                <Button variant="outline" onClick={() => appendEducation({id: crypto.randomUUID(), institution: '', degree: '', graduationDate: '', details: ''})}>Add Education</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

           <AccordionItem value="skills">
            <AccordionTrigger className="text-lg font-medium">Skills</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {skillFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField name={`skills.${index}.name`} render={({ field }) => (
                          <FormItem className="flex-1"><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                 </div>
                <Button variant="outline" onClick={() => appendSkill({ id: crypto.randomUUID(), name: '' })}>Add Skill</Button>
                <AiSkillGenerator append={appendSkill} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="certifications">
            <AccordionTrigger className="text-lg font-medium">Certifications</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-6 pt-2">
                    {certificationFields.map((field, index) => (
                        <div key={field.id} className="rounded-md border p-4 space-y-4 relative bg-card">
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            <FormField name={`certifications.${index}.name`} render={({ field }) => (
                                <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                             <FormField name={`certifications.${index}.issuingOrganization`} render={({ field }) => (
                                <FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                            )} />
                            <FormField name={`certifications.${index}.date`} render={({ field }) => (
                                <FormItem><FormLabel>Date</FormLabel><FormControl><Input placeholder="e.g. June 2023" {...field} /></FormControl></FormItem>
                            )} />
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => appendCertification({id: crypto.randomUUID(), name: '', issuingOrganization: '', date: ''})}>Add Certification</Button>
                </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additional-info">
            <AccordionTrigger className="text-lg font-medium">Additional Information</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <FormField name="additionalInformation.details" render={({ field }) => (
                  <FormItem><FormLabel>Details</FormLabel><FormControl><Textarea rows={5} placeholder="Add any other relevant information, like publications, awards, or volunteer experience. Use '-' for bullet points." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="references">
            <AccordionTrigger className="text-lg font-medium">References</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-2">
                {referenceFields.map((field, index) => (
                   <div key={field.id} className="rounded-md border p-4 space-y-4 relative bg-card">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeReference(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    <FormField name={`references.${index}.name`} render={({ field }) => (
                      <FormItem><FormLabel>Reference's Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`references.${index}.company`} render={({ field }) => (
                      <FormItem><FormLabel>Company / Relationship</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`references.${index}.email`} render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField name={`references.${index}.phone`} render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                  </div>
                ))}
                <Button variant="outline" onClick={() => appendReference({id: crypto.randomUUID(), name: '', company: '', email: '', phone: ''})}>Add Reference</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </Form>
  );
}
