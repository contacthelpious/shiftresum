
import { type ResumeFormData, type TemplateName } from './definitions';

export interface TemplateSample {
    template: TemplateName;
    data: ResumeFormData;
    color: string;
}

const softwareEngineerData: ResumeFormData = {
    personalInfo: {
        name: 'Alex Doe',
        email: 'alex.doe@email.com',
        phone: '123-456-7890',
        location: 'San Francisco, CA',
        website: 'github.com/alexdoe',
        summary: 'Innovative and results-driven Software Engineer with over 8 years of experience in building and scaling modern web applications. Proficient in TypeScript, React, and Node.js, with a proven track record of delivering high-quality, performant, and user-centric solutions. Passionate about clean code, system architecture, and collaborative problem-solving.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'Tech Solutions Inc.',
            role: 'Senior Software Engineer',
            startDate: 'Jan 2021',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Led the development of a new microservices architecture using Node.js and Docker, improving system scalability by 40% and reducing latency by 20%.'},
                {id: 'd2', value: 'Engineered a complete redesign of the main dashboard using React and TypeScript, resulting in a 30% increase in user engagement.'},
                {id: 'd3', value: 'Mentored a team of 3 junior engineers, conducting code reviews and fostering their growth, which improved team velocity by 15%.'},
            ],
        },
        {
            id: 'exp2',
            company: 'Web Innovators',
            role: 'Software Engineer',
            startDate: 'Jun 2018',
            endDate: 'Dec 2020',
            description: [
                {id: 'd4', value: 'Developed and maintained full-stack features for a high-traffic e-commerce platform.'},
                {id: 'd5', value: 'Collaborated with UX designers to implement responsive and accessible user interfaces that improved customer satisfaction scores by 10%.'},
                {id: 'd6', value: 'Wrote and maintained unit and integration tests, increasing code coverage from 60% to 85%.'},
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
        {id: 's6', name: 'AWS'},
        {id: 's7', name: 'PostgreSQL'},
        {id: 's8', name: 'CI/CD'},
        {id: 's9', name: 'System Design'},
        {id: 's10', name: 'Agile Methodologies'},
    ],
    projects: [
        {
            id: 'proj1',
            name: 'Real-time Chat Application',
            description: 'Built a full-stack real-time chat app using WebSockets, React, and a Node.js backend. Implemented features like private messaging and user authentication.',
            link: 'github.com/alexdoe/chat-app'
        },
        {
            id: 'proj2',
            name: 'E-commerce Analytics Dashboard',
            description: 'Designed and built an analytics dashboard for an e-commerce client to track sales, user behavior, and inventory. Utilized D3.js for data visualization.',
            link: 'github.com/alexdoe/analytics-dashboard'
        }
    ],
    certifications: [
        {
            id: 'cert1',
            name: 'AWS Certified Developer - Associate',
            issuingOrganization: 'Amazon Web Services',
            date: '2022'
        }
    ],
    references: [],
};

const uxDesignerData: ResumeFormData = {
    personalInfo: {
        name: 'Samantha Carter',
        email: 's.carter@email.com',
        phone: '987-654-3210',
        location: 'New York, NY',
        website: 'samcarter-designs.com',
        summary: 'Creative and empathetic UX/UI Designer with a strong portfolio of successful projects across mobile and web platforms. Specializes in user-centered design methodologies, from initial research and wireframing to high-fidelity prototyping and usability testing. Skilled in Figma, Sketch, and Adobe Creative Suite.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'DesignFirst Studio',
            role: 'Lead UX Designer',
            startDate: 'Jun 2019',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Redesigned the user onboarding flow for a major SaaS product, conducting A/B tests that led to a 25% increase in user retention.'},
                {id: 'd2', value: 'Led user research initiatives, including interviews and surveys, to create detailed user personas and journey maps that guided product strategy.'},
                {id: 'd3', value: 'Developed and maintained a comprehensive design system in Figma, ensuring brand consistency and accelerating the design-to-development workflow.'},
            ],
        },
        {
            id: 'exp2',
            company: 'Innovate Apparel',
            role: 'UX/UI Designer',
            startDate: 'Mar 2017',
            endDate: 'May 2019',
            description: [
                {id: 'd4', value: 'Designed and prototyped a new mobile shopping app from concept to launch, resulting in a 4.8-star rating on the App Store.'},
                {id: 'd5', value: 'Collaborated with product managers and engineers to deliver pixel-perfect designs and ensure seamless implementation.'},
            ],
        }
    ],
    education: [
        {
            id: 'edu1',
            institution: 'Design Institute',
            degree: 'M.A. in Interaction Design',
            graduationDate: 'Jun 2019',
            details: 'Thesis on Accessible Design in E-commerce'
        },
        {
            id: 'edu2',
            institution: 'State Art College',
            degree: 'B.F.A. in Graphic Design',
            graduationDate: 'May 2017',
            details: ''
        }
    ],
    skills: [
        {id: 's1', name: 'Figma'},
        {id: 's2', name: 'User Research'},
        {id: 's3', name: 'Prototyping'},
        {id: 's4', name: 'Wireframing'},
        {id: 's5', name: 'Design Systems'},
        {id: 's6', name: 'Usability Testing'},
        {id: 's7', name: 'Adobe XD'},
        {id: 's8', name: 'Journey Mapping'},
    ],
    projects: [
        {
            id: 'proj1',
            name: 'Mobile Banking App Redesign',
            description: 'A personal concept project to improve the user experience of a popular mobile banking application. Focused on simplifying navigation and transaction flows.',
            link: 'behance.net/samcarter/banking-app'
        }
    ],
    certifications: [
        {
            id: 'cert1',
            name: 'Certified Usability Analyst (CUA)',
            issuingOrganization: 'Human Factors International',
            date: '2021'
        }
    ],
    references: [],
};

const marketingManagerData: ResumeFormData = {
    personalInfo: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '555-555-5555',
        location: 'Chicago, IL',
        website: 'linkedin.com/in/michaelchen',
        summary: 'Results-driven Marketing Manager with 8+ years of experience developing and executing successful, data-informed marketing campaigns. Expert in digital marketing, SEO/SEM, and content strategy. Adept at leveraging data analytics and market research to drive brand growth, engagement, and ROI.'
    },
    experience: [
        {
            id: 'exp1',
            company: 'MarketPro Agency',
            role: 'Marketing Manager',
            startDate: 'Aug 2020',
            endDate: 'Present',
            description: [
                {id: 'd1', value: 'Developed and managed a multi-channel content marketing strategy that increased organic traffic by 150% and generated over 5,000 qualified leads in one year.'},
                {id: 'd2', value: 'Managed a marketing budget of $500K, optimizing ad spend across Google Ads and social media to achieve a 3:1 return on investment.'},
                {id: 'd3', value: 'Led a team of 4 marketing specialists, providing mentorship and direction to achieve departmental goals.'},
            ],
        },
        {
            id: 'exp2',
            company: 'Growth Solutions',
            role: 'Digital Marketing Specialist',
            startDate: 'Jul 2017',
            endDate: 'Aug 2020',
            description: [
                {id: 'd4', value: 'Executed successful email marketing campaigns with an average open rate of 25% and click-through rate of 5%.'},
                {id: 'd5', value: 'Managed and optimized PPC campaigns on Google Ads, improving conversion rates by 20%.'},
            ],
        }
    ],
    education: [
        {
            id: 'edu1',
            institution: 'State University',
            degree: 'B.A. in Marketing',
            graduationDate: 'May 2017',
            details: 'Minor in Business Analytics',
        }
    ],
    skills: [
        {id: 's1', name: 'SEO/SEM'},
        {id: 's2', name: 'Content Strategy'},
        {id: 's3', name: 'Google Analytics'},
        {id: 's4', name: 'Email Marketing'},
        {id: 's5', name: 'Social Media Advertising'},
        {id: 's6', name: 'HubSpot'},
        {id: 's7', name: 'Market Research'},
        {id: 's8', name: 'A/B Testing'},
    ],
    projects: [
        {
            id: 'proj1',
            name: 'Brand Awareness Campaign',
            description: 'Launched a brand awareness campaign targeting a new demographic, resulting in a 200% increase in social media engagement and a 15% growth in market share.',
            link: ''
        }
    ],
    certifications: [
        {
            id: 'cert1',
            name: 'Google Ads Search Certification',
            issuingOrganization: 'Google',
            date: 'Renewed 2023'
        },
        {
            id: 'cert2',
            name: 'HubSpot Inbound Marketing Certified',
            issuingOrganization: 'HubSpot Academy',
            date: '2022'
        }
    ],
    references: [],
};

export const sampleData: TemplateSample[] = [
    {
        template: 'modern',
        data: softwareEngineerData,
        color: '#2563EB', // Shift Blue
    },
    {
        template: 'executive',
        data: uxDesignerData,
        color: '#4338CA', // Deep Indigo
    },
    {
        template: 'classic',
        data: marketingManagerData,
        color: '#06B6D4', // Electric Cyan
    },
    {
        template: 'bold',
        data: softwareEngineerData,
        color: '#10B981', // Emerald Green
    },
    {
        template: 'professional',
        data: uxDesignerData,
        color: '#F59E0B', // Amber
    },
    {
        template: 'focus',
        data: marketingManagerData,
        color: '#EF4444', // Coral Red
    },
];
