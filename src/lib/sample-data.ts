
import { type ResumeFormData, type TemplateName } from './definitions';

export interface TemplateSample {
    template: TemplateName;
    data: ResumeFormData;
}

const softwareEngineerData: ResumeFormData = {
    personalInfo: {
        name: 'Alex Doe',
        email: 'alex.doe@email.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA',
        website: 'alexdoe.dev',
        summary: 'Innovative Software Engineer with 5+ years of experience in building and scaling modern web applications. Proficient in TypeScript, React, and Node.js. Passionate about creating seamless user experiences and writing clean, efficient code.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'Tech Solutions Inc.',
            role: 'Senior Software Engineer',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Led the development of a new microservices architecture, improving system scalability by 40%.'},
                {id: 'd2', value: 'Mentored a team of 3 junior engineers, fostering their growth and improving team velocity.'},
            ],
        },
    ],
    education: [
        {
            id: 'edu1',
            institution: 'University of Technology',
            degree: 'B.S. in Computer Science',
            graduationDate: 'May 2018',
            details: 'Graduated with Honors, GPA: 3.8/4.0',
        }
    ],
    skills: [
        {id: 's1', name: 'TypeScript'},
        {id: 's2', name: 'React'},
        {id: 's3', name: 'Node.js'},
        {id: 's4', name: 'GraphQL'},
        {id: 's5', name: 'Docker'},
    ],
    projects: [],
    certifications: [],
    references: [],
};

const uxDesignerData: ResumeFormData = {
    personalInfo: {
        name: 'Samantha Carter',
        email: 's.carter@email.com',
        phone: '987-654-3210',
        location: 'New York, NY',
        website: 'samcarter-designs.com',
        summary: 'Creative and detail-oriented UX/UI Designer with a strong portfolio of projects. Specializes in user-centered design methodologies to create intuitive and engaging digital products. Skilled in Figma, Sketch, and Adobe Creative Suite.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'DesignFirst Studio',
            role: 'Lead UX Designer',
            startDate: 'Jun 2019',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Redesigned the user onboarding flow for a major SaaS product, increasing user retention by 25%.'},
                {id: 'd2', value: 'Conducted extensive user research and usability testing to inform design decisions.'},
            ],
        },
    ],
    education: [
        {
            id: 'edu1',
            institution: 'Design Institute',
            degree: 'M.A. in Interaction Design',
            graduationDate: 'Jun 2019',
            details: ''
        }
    ],
    skills: [
        {id: 's1', name: 'Figma'},
        {id: 's2', name: 'User Research'},
        {id: 's3', name: 'Prototyping'},
        {id: 's4', name: 'Wireframing'},
        {id: 's5', name: 'Design Systems'},
    ],
    projects: [],
    certifications: [],
    references: [],
};

const marketingManagerData: ResumeFormData = {
    personalInfo: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '555-555-5555',
        location: 'Chicago, IL',
        website: 'linkedin.com/in/michaelchen',
        summary: 'Results-driven Marketing Manager with a proven track record of developing and executing successful marketing campaigns. Expert in digital marketing, SEO, and content strategy. Adept at leveraging data analytics to drive growth and ROI.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'MarketPro Agency',
            role: 'Marketing Manager',
            startDate: 'Aug 2020',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Developed and managed a content marketing strategy that increased organic traffic by 150% in one year.'},
                {id: 'd2', value: 'Managed a marketing budget of $500K, optimizing ad spend to achieve a 3:1 return on investment.'},
            ],
        },
    ],
    education: [
        {
            id: 'edu1',
            institution: 'State University',
            degree: 'B.A. in Marketing',
            graduationDate: 'Dec 2017',
            details: '',
        }
    ],
    skills: [
        {id: 's1', name: 'SEO/SEM'},
        {id: 's2', name: 'Content Strategy'},
        {id: 's3', name: 'Google Analytics'},
        {id: 's4', name: 'Email Marketing'},
        {id: 's5', name: 'Social Media Advertising'},
    ],
    projects: [],
    certifications: [],
    references: [],
};

export const sampleData: TemplateSample[] = [
    {
        template: 'modern',
        data: softwareEngineerData,
    },
    {
        template: 'executive',
        data: uxDesignerData,
    },
    {
        template: 'classic',
        data: marketingManagerData,
    },
    {
        template: 'bold',
        data: softwareEngineerData,
    },
    {
        template: 'professional',
        data: uxDesignerData,
    },
    {
        template: 'focus',
        data: marketingManagerData,
    },
];
