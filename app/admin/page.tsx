"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Briefcase, Plus, Pencil, Trash2, ArrowLeft, MapPin, LogOut } from "lucide-react";
import { supabase } from '@/lib/supabase'

interface Job {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  applyUrl: string;
  postedAt: string;
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

const defaultJob: Job = {
  id: "",
  title: "",
  location: "",
  category: "",
  description: "",
  applyUrl: "",
  postedAt: new Date().toLocaleDateString("he-IL"),
};

const defaultContent: SiteContent = {
  mainTitle: "מצא את המשרה המושלמת",
  mainSubtitle: "חיפוש משרות פשוט ויעיל",
  searchTitle: "חיפוש משרות",
  searchPlaceholder: "חיפוש לפי מילות מפתח...",
  locationPlaceholder: "מיקום...",
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

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>(defaultJob);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    // בדיקת מצב התחברות
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (!loginStatus) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    const savedContent = localStorage.getItem("siteContent");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
    if (savedContent) {
      setSiteContent(JSON.parse(savedContent));
    }
  }, []);

  const handleAddJob = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .insert([newJob])
      .select()

    if (error) {
      console.error('Error adding job:', error)
      return
    }

    if (data) {
      setJobs([...jobs, data[0]])
      setNewJob(defaultJob)
    }
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob(job);
  };

  const handleUpdateJob = async () => {
    if (!editingJob) return;
    
    const { error } = await supabase
      .from('jobs')
      .update(newJob)
      .eq('id', editingJob.id)

    if (error) {
      console.error('Error updating job:', error)
      return
    }

    setJobs(jobs.map(j => j.id === editingJob.id ? { ...newJob, id: editingJob.id } : j))
    setEditingJob(null)
    setNewJob(defaultJob)
  }

  const handleDeleteJob = async (jobId: string) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId)

    if (error) {
      console.error('Error deleting job:', error)
      return
    }

    setJobs(jobs.filter(job => job.id !== jobId))
  }

  const handleContentChange = async (field: keyof SiteContent, value: string | string[]) => {
    const updatedContent = { ...siteContent, [field]: value }
    
    const { error } = await supabase
      .from('site_content')
      .upsert([updatedContent])
      .eq('id', 1)

    if (error) {
      console.error('Error updating site content:', error)
      return
    }

    setSiteContent(updatedContent)
  }

  const handleSaveContent = () => {
    localStorage.setItem("siteContent", JSON.stringify(siteContent));
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null; // או טעינה
  }

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
              ניהול משרות
            </h1>
            <p className="text-xl text-gray-600">
              הוסף, ערוך או מחק משרות מהמערכת
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/90 hover:bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            התנתקות
          </Button>
        </div>

        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="bg-white/90 border-2 border-gray-200 p-1">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-gray-100">
              ניהול משרות
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gray-100">
              עריכת תוכן
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-8">
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {editingJob ? "עריכת משרה" : "הוספת משרה חדשה"}
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">כותרת המשרה</label>
                    <Input
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">קטגוריה</label>
                    <Input
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">מיקום</label>
                    <Input
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">תיאור</label>
                    <Textarea
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      className="min-h-[150px] text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">קישור להגשת מועמדות</label>
                    <Input
                      value={newJob.applyUrl}
                      onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })}
                      className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    {editingJob && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingJob(null);
                          setNewJob(defaultJob);
                        }}
                        className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-white/90"
                      >
                        ביטול
                      </Button>
                    )}
                    <Button
                      onClick={editingJob ? handleUpdateJob : handleAddJob}
                      className="bg-black hover:bg-gray-800 px-8 h-12 text-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {editingJob ? "שמירת שינויים" : "הוספת משרה"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                משרות קיימות
              </h2>
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-xl transition-all duration-200 border-2 border-gray-100 bg-white/90">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-4 text-gray-600">
                            <span className="flex items-center gap-2">
                              <Briefcase className="h-5 w-5" />
                              {job.category}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditJob(job)}
                            className="border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-white/90"
                          >
                            עריכה
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            className="border-2 border-red-200 hover:border-red-400 text-red-600 hover:text-red-700 transition-all duration-200 bg-white/90"
                          >
                            מחיקה
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-8">
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/90">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  עריכת תוכן האתר
                </h2>
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">כותרת ראשית</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">כותרת ראשית</label>
                      <Input
                        value={siteContent.mainTitle}
                        onChange={(e) => handleContentChange("mainTitle", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">כותרת משנה</label>
                      <Input
                        value={siteContent.mainSubtitle}
                        onChange={(e) => handleContentChange("mainSubtitle", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">חיפוש</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">כותרת חיפוש</label>
                      <Input
                        value={siteContent.searchTitle}
                        onChange={(e) => handleContentChange("searchTitle", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">מקום חיפוש</label>
                      <Input
                        value={siteContent.searchPlaceholder}
                        onChange={(e) => handleContentChange("searchPlaceholder", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">מקום מיקום</label>
                      <Input
                        value={siteContent.locationPlaceholder}
                        onChange={(e) => handleContentChange("locationPlaceholder", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">טקסט כפתור הגשה</label>
                      <Input
                        value={siteContent.applyButtonText}
                        onChange={(e) => handleContentChange("applyButtonText", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">אודות</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">כותרת</label>
                      <Input
                        value={siteContent.aboutTitle}
                        onChange={(e) => handleContentChange("aboutTitle", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">תוכן</label>
                      {siteContent.aboutContent.map((paragraph, index) => (
                        <div key={index} className="mb-4">
                          <Textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newContent = [...siteContent.aboutContent];
                              newContent[index] = e.target.value;
                              setSiteContent({ ...siteContent, aboutContent: newContent });
                            }}
                            className="min-h-[100px] text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSiteContent({
                            ...siteContent,
                            aboutContent: [...siteContent.aboutContent, ""]
                          });
                        }}
                        className="mt-2 border-2 border-gray-200 hover:border-gray-400 transition-all duration-200 bg-white/90"
                      >
                        הוסף פסקה
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">צור קשר</h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">כותרת</label>
                      <Input
                        value={siteContent.contactTitle}
                        onChange={(e) => handleContentChange("contactTitle", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">תגית שם</label>
                      <Input
                        value={siteContent.contactNameLabel}
                        onChange={(e) => handleContentChange("contactNameLabel", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">תגית אימייל</label>
                      <Input
                        value={siteContent.contactEmailLabel}
                        onChange={(e) => handleContentChange("contactEmailLabel", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">תגית הודעה</label>
                      <Input
                        value={siteContent.contactMessageLabel}
                        onChange={(e) => handleContentChange("contactMessageLabel", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">טקסט כפתור שליחה</label>
                      <Input
                        value={siteContent.contactSubmitButton}
                        onChange={(e) => handleContentChange("contactSubmitButton", e.target.value)}
                        className="h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveContent}
                      className="bg-black hover:bg-gray-800 px-8 h-12 text-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      שמירת שינויים
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 