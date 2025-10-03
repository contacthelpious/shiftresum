'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Edit } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  lastEdited: string;
  previewUrl: string;
}

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={resume.previewUrl}
            alt={`Preview of ${resume.title}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            data-ai-hint="resume preview"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
           <div className="absolute bottom-0 p-3 text-white">
                <h3 className="font-semibold truncate">{resume.title}</h3>
                <p className="text-xs text-white/80">Last edited: {resume.lastEdited}</p>
           </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50">
        <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/builder?resumeId=${resume.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Link>
            </Button>
            <Button variant="ghost" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
