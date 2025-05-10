"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JobDetails() {
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
              Senior Technical Recruiter
            </h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-8">
              <span className="flex items-center gap-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                TechHire Solutions
              </span>
              <span>Remote</span>
              <span>Full-time</span>
              <span>Posted 2 days ago</span>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
              <p className="mb-6">
                We&apos;re looking for an experienced technical recruiter to join our team and help us find
                top engineering talent for our clients in the tech industry.
              </p>
              <p className="mb-6">
                We&apos;re looking for a talented recruiter to join our team and help us find the best talent
                for our clients. You&apos;ll be responsible for the full recruitment lifecycle, from sourcing
                candidates to conducting interviews and making placement recommendations.
              </p>

              <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Source and screen candidates using various channels</li>
                <li>Conduct initial interviews and technical assessments</li>
                <li>Manage the full recruitment lifecycle</li>
                <li>Build and maintain relationships with clients</li>
                <li>Provide regular updates on recruitment progress</li>
              </ul>
            </div>

            <div className="mt-8">
              <Button className="w-full bg-black hover:bg-gray-800 py-6">
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}