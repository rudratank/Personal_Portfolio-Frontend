import React, { useState, useEffect, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DownloadCloud,
  ChevronRight,
  Code2Icon,
  AwardIcon,
  CheckCircle,
} from "lucide-react";
import { FETCH_RESUME, HOST, USER_ABOUT_DATA } from "@/lib/constant";

// Memoized stat card component
const StatCard = memo(({ icon: Icon, title, value, color }) => (
  <Card className="group hover:shadow-xl transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div
          className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center
          transform group-hover:scale-110 transition-all duration-300`}
        >
          <Icon className="w-6 h-6 text-gray-800" />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-blue-600 font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

// Loading skeleton component
const LoadingSkeleton = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        <Skeleton className="lg:w-1/2 h-[600px] rounded-3xl" />
        <div className="lg:w-1/2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </div>
  </section>
);

// Error component
const ErrorDisplay = ({ error }) => (
  <section className="py-20 px-4">
    <Card className="max-w-lg mx-auto">
      <CardContent className="flex flex-col items-center p-6">
        <Badge variant="destructive" className="mb-4">Error</Badge>
        <p className="text-red-600">Error loading data: {error}</p>
      </CardContent>
    </Card>
  </section>
);

function About() {
  const [aboutData, setAboutData] = useState({
    image: "",
    description: "",
    projectsCompleted: 0,
    experience: 0,
    support: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const downloadResume = async () => {
    try {
      const response = await fetch(FETCH_RESUME);
      if (!response.ok) throw new Error(`Error fetching resume: ${response.statusText}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchAboutData = async () => {
      try {
        const response = await fetch(USER_ABOUT_DATA, {
          signal: controller.signal
        });
        
        if (!response.ok) throw new Error("Failed to fetch about data");
        
        const result = await response.json();
        if (result.success) {
          setAboutData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();

    return () => controller.abort();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;

  const stats = [
    {
      icon: AwardIcon,
      title: "Certificate",
      value: `${aboutData.experience}+ Professional Certificate`,
      color: "bg-blue-100",
    },
    {
      icon: CheckCircle,
      title: "Projects",
      value: `${aboutData.projectsCompleted}+ Projects Completed`,
      color: "bg-purple-100",
    },
    {
      icon: Code2Icon,
      title: "Skills",
      value: `${aboutData.support}+ Skills`,
      color: "bg-green-100",
    },
  ];

  const scrollToSkills = () => {
    document.querySelector("#skills")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Me</Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">My Introduction</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 
              group-hover:opacity-30 transition-all duration-500" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform 
              group-hover:scale-[1.02] transition-all duration-500">
              <img
                loading="lazy"
                src={`${HOST}${aboutData.image}` || "/placeholder-image.jpg"}
                alt="Profile"
                className="w-full h-full object-cover transition-all duration-700 
                  group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          </div>

          <div className="lg:w-1/2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {aboutData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="group"
                  onClick={scrollToSkills}
                >
                  Open to Learning
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={downloadResume}
                  className="group"
                >
                  Download CV
                  <DownloadCloud className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;