
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const aboutImage = PlaceHolderImages.find(p => p.id === 'hero') ?? { imageUrl: 'https://picsum.photos/seed/about/1200/600', imageHint: 'team collaboration' };
const teamMembers = [
  { name: 'Jane Doe', role: 'CEO & Founder', avatar: 'https://picsum.photos/seed/jane/100/100', fallback: 'JD' },
  { name: 'John Smith', role: 'Lead Developer', avatar: 'https://picsum.photos/seed/john/100/100', fallback: 'JS' },
  { name: 'Emily White', role: 'UX Designer', avatar: 'https://picsum.photos/seed/emily/100/100', fallback: 'EW' },
];

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="container py-20 text-center md:py-32">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter md:text-6xl font-headline">
              About Shift Resume
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              We're on a mission to make resume building intuitive, fast, and effective for everyone.
            </p>
          </div>
        </section>

        {/* Image Section */}
        <section className="container">
          <div className="relative overflow-hidden rounded-xl border bg-card shadow-lg">
             <Image
                src={aboutImage.imageUrl}
                alt="A team collaborating in a modern office"
                width={1200}
                height={600}
                className="w-full object-cover"
                data-ai-hint={aboutImage.imageHint}
              />
          </div>
        </section>

        {/* Our Story Section */}
        <section className="container py-20 md:py-32">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:gap-20">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">Our Story</h2>
              <p className="text-muted-foreground">
                Shift Resume was born from a simple observation: creating a standout resume is hard. Too many talented individuals struggle with clunky software and outdated advice. We saw an opportunity to combine beautiful design with the power of AI to create a tool that not only simplifies the process but actively helps you write a better resume.
              </p>
              <p className="text-muted-foreground">
                Founded in 2023, our team of developers, designers, and career experts has been dedicated to building a platform that empowers job seekers to put their best foot forward.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter font-headline">Our Mission</h2>
              <p className="text-muted-foreground">
                Our mission is to level the playing field in the job market. We believe that everyone deserves a fair chance to land their dream job, and a great resume is the first step. By providing powerful, accessible tools, we aim to give job seekers the confidence and the resources they need to succeed in their careers.
              </p>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="bg-muted/50 py-20 md:py-32">
            <div className="container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tighter font-headline">Meet the Team</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        The passionate individuals behind Shift Resume.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="text-center">
                            <Avatar className="mx-auto h-24 w-24 mb-4">
                                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person face" />
                                <AvatarFallback>{member.fallback}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-xl font-semibold">{member.name}</h3>
                            <p className="text-accent">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
