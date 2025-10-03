
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Edit } from "lucide-react";
import type { WithId } from "@/firebase";
import type { ResumeData } from "@/lib/definitions";
import { formatDistanceToNow } from 'date-fns';
import { ResumePreview } from "../builder/resume-preview";

interface ResumeCardProps {
  resume: WithId<ResumeData>;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const lastEdited = resume.updatedAt?.toDate
    ? `${formatDistanceToNow(resume.updatedAt.toDate())} ago`
    : 'N/A';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group flex flex-col">
      <CardContent className="p-0">
        <Link href={`/builder?resumeId=${resume.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
            <div className="transform scale-[0.25] origin-top-left pointer-events-none absolute -top-12 -left-12">
               <ResumePreview resumeData={resume.data} designOptions={resume.design} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 p-3 text-white">
                <h3 className="font-semibold truncate">{resume.title}</h3>
                <p className="text-xs text-white/80">Last edited: {lastEdited}</p>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 mt-auto">
        <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="ghost" size="sm" asChild>
                <Link href={`/builder?resumeId=${resume.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
                 <Link href={`/builder?resumeId=${resume.id}&action=download`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                 </Link>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
