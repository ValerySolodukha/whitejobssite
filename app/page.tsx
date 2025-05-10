"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ExternalLink, Briefcase, Mail, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase'

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

interface SiteContent {
  mainTitle: string;
  mainSubtitle: string;
  searchTitle: string;
  searchPlaceholder: string;
  locationPlaceholder: string;
  applyButtonText: string;
  aboutTitle: string;
  aboutContent: string[];
  contactTitle: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  contactMessageLabel: string;
  contactSubmitButton: string;
}

const defaultContent: SiteContent = {
  mainTitle: "🔍 מצא את ההזדמנות הבאה שלך – במקום שבו מחפשים באמת",
  mainSubtitle: "בין אם אתה מחפש משרה ראשונה, קידום בקריירה או שינוי כיוון – כאן תמצא משרות איכותיות, מפורסמות על ידי סוכן השמה עצמאי ולרי",
  searchTitle: "מצא את התפקיד המושלם שלך",
  searchPlaceholder: "חיפוש לפי כותרת, תיאור או קטגוריה",
  locationPlaceholder: "מיקום",
  applyButtonText: "הגש מועמדות",
  aboutTitle: "אודות האתר",
  aboutContent: [
    "אתר זה נוצר כדי לסייע למגייסים למצוא את הפרילנסרים המתאימים ביותר לצרכים שלהם.",
    "אנו מאמינים בשילוב מושלם בין מגייסים לפרילנסרים, ומספקים פלטפורמה נוחה ויעילה לחיבור בין הצדדים.",
    "האתר מציע מגוון רחב של משרות בתחומים שונים, ומאפשר חיפוש מתקדם לפי קטגוריות ומיקום."
  ],
  contactTitle: "צור קשר",
  contactNameLabel: "שם מלא",
  contactEmailLabel: "אימייל",
  contactMessageLabel: "הודעה",
  contactSubmitButton: "שלח הודעה"
};

// Demo data for testing pagination
const demoJobs: Job[] = Array.from({ length: 25 }, (_, i) => ({
  id: (i + 1).toString(),
  title: `משרת ${i + 1}`,
  location: "תל אביב",
  category: "פיתוח",
  description: "תיאור מפורט של המשרה...",
  apply_url: "#",
  created_at: "היום",
  updated_at: "היום"
}));

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const jobsPerPage = 5;

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error('Error connecting to Supabase:', error.message)
        } else {
          console.log('Successfully connected to Supabase!')
        }
      } catch (err) {
        console.error('Failed to connect to Supabase:', err)
      }
    }

    testConnection()
    
    const fetchJobs = async () => {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
        return
      }

      if (jobs) {
        setJobs(jobs)
      }
    }

    const fetchSiteContent = async () => {
      const { data: content, error } = await supabase
        .from('site_content')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching site content:', error)
        return
      }

      if (content) {
        setSiteContent(content)
      } else {
        // אם אין תוכן, נשתמש בברירת המחדל
        setSiteContent(defaultContent)
      }
    }

    fetchJobs()
    fetchSiteContent()
  }, [])

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {siteContent.mainTitle}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              {siteContent.mainSubtitle}
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setShowAbout(true)}
            >
              <Info className="h-5 w-5 ml-2" />
              אודות
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => setShowContact(true)}
            >
              <Mail className="h-5 w-5 ml-2" />
              צור קשר
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/90 hover:bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              onClick={() => router.push("/login")}
            >
              <Settings className="h-5 w-5 ml-2" />
              כניסה למערכת
            </Button>
          </div>
        </div>

        <Card className="mb-12 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {siteContent.searchTitle}
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={siteContent.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder={siteContent.locationPlaceholder}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                />
              </div>
              <Button className="bg-black hover:bg-gray-800 px-8 h-12 text-lg shadow-md hover:shadow-lg transition-all duration-200">
                חיפוש משרות
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8">
          {currentJobs.map((job) => (
            <Card 
              key={job.id} 
              className="hover:shadow-xl transition-all duration-200 border-2 border-gray-100 bg-white/90 cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-5 w-5" />
                        <span>{job.category}</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium shadow-sm">
                      {job.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-8 text-gray-600">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      {job.location}
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-2 text-lg">
                    {job.description}
                  </p>

                  <div className="flex justify-end">
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg text-lg font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {siteContent.applyButtonText}
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-white/90"
            >
              הקודם
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-black" : "border-2 border-gray-200 hover:border-gray-400 bg-white/90"}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-white/90"
            >
              הבא
            </Button>
          </div>
        )}
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full border-2 border-gray-100 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {siteContent.aboutTitle}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowAbout(false)}
                  className="hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4 text-gray-600">
                {siteContent.aboutContent.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full border-2 border-gray-100 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {siteContent.contactTitle}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowContact(false)}
                  className="hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{siteContent.contactNameLabel}</label>
                  <Input className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{siteContent.contactEmailLabel}</label>
                  <Input className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">{siteContent.contactMessageLabel}</label>
                  <Textarea className="min-h-[150px] text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white" />
                </div>
                <Button className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-all duration-200">
                  {siteContent.contactSubmitButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full border-2 border-gray-100 shadow-xl bg-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {selectedJob.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {selectedJob.location}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedJob(null)}
                  className="hover:bg-gray-100"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">תיאור המשרה</h3>
                  <p className="text-gray-600 text-lg whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
                <div className="flex justify-end">
                  <a
                    href={selectedJob.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg text-lg font-medium"
                  >
                    {siteContent.applyButtonText}
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}