"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // בדיקת פרטי התחברות
    if (email === "solodohavalery@gmail.com" && password === "hypsin245") {
      // שמירת מצב התחברות
      localStorage.setItem("isLoggedIn", "true");
      // מעבר לדף הניהול
      router.push("/admin");
    } else {
      setError("פרטי התחברות שגויים");
    }
  };

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
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-gray-100 shadow-xl bg-white/90">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                התחברות למערכת
              </h1>
              <p className="mt-2 text-gray-600">
                הכנס את פרטי ההתחברות שלך
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12 h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    placeholder="הכנס את האימייל שלך"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  סיסמה
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-12 h-12 text-lg border-2 border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
                    placeholder="הכנס את הסיסמה שלך"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-black hover:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200"
              >
                התחברות
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 