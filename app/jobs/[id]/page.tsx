"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  apply_url: string;
  created_at: string;
  updated_at: string;
}

export default async function JobDetails({ params }: { params: { id: string } }) {
  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching job:', error);
    return <div>שגיאה בטעינת פרטי המשרה</div>;
  }

  if (!job) {
    return <div>המשרה לא נמצאה</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {job.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 ml-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-500 ml-2" />
                <span>{job.category}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">תיאור המשרה</h2>
              <div className="whitespace-pre-wrap">{job.description}</div>
            </div>

            <div className="mt-8">
              {job.apply_url && (
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  הגש מועמדות
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}