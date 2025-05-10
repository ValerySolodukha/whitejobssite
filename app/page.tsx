"use client";

import { useState } from "react";
import { Search, Building2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  featured: boolean;
  postedAt: string;
  description: string;
  tags: string[];
  salary: string;
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Technical Recruiter",
    company: "TechHire Solutions",
    location: "Remote",
    type: "Full-time",
    featured: true,
    postedAt: "2 days ago",
    description: "We're looking for an experienced technical recruiter to join our team and help us find top engineering...",
    tags: ["Technical Recruiting", "Engineering", "Remote"],
    salary: "$80,000 - $100,000"
  },
  {
    id: "2",
    title: "Talent Acquisition Specialist",
    company: "Global Staffing Inc",
    location: "New York, NY",
    type: "Full-time",
    featured: false,
    postedAt: "3 days ago",
    description: "Join our talent acquisition team to help identify, attract, and hire top talent across various industries and...",
    tags: ["Talent Acquisition", "Sourcing", "Onsite"],
    salary: "$65,000 - $85,000"
  },
  {
    id: "3",
    title: "Executive Recruiter",
    company: "C-Suite Search",
    location: "Chicago, IL",
    type: "Full-time",
    featured: true,
    postedAt: "1 week ago",
    description: "Specialized executive search firm seeking an experienced recruiter to help place C-level executives in...",
    tags: ["Executive Search", "C-Level", "Leadership"],
    salary: "$90,000 - $120,000 + Commission"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              Freelance Recruiter Job Board
            </h1>
            <p className="text-xl text-gray-600">
              Find your next opportunity in recruitment
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white">
              Admin Login
            </Button>
            <Button className="bg-black hover:bg-gray-800">Post a Job</Button>
          </div>
        </div>

        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Find Your Perfect Role
            </h2>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search job titles or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 px-8">
                Search Jobs
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {job.featured && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white">
                            Featured
                          </span>
                        )}
                        <span className="text-gray-500">{job.postedAt}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900">
                        {job.title}
                      </h3>

                      <div className="flex items-center gap-6 text-gray-600">
                        <span className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          {job.type}
                        </span>
                      </div>

                      <p className="text-gray-600 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-lg font-semibold text-gray-900">
                        {job.salary}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}