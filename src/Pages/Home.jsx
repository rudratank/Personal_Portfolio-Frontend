import React, { useState, useEffect, lazy, Suspense } from "react";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import he from "he";
import { FETCH_RESUME, HOST, USER_HOME_DATA } from "@/lib/constant";

// Lazy load components that are below the fold
const About = lazy(() => import("./About"));
const Skills = lazy(() => import("./Skills"));
const Education = lazy(() => import("./Education"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));

// Extract SocialIcon component for reusability
const SocialIcon = ({ href, icon, hoverColor, label }) => (
  <a
    href={href}
    className={`text-gray-600 hover:${hoverColor} transform hover:scale-125 transition-all duration-300`}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon={icon} size="lg" />
  </a>
);

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function Home() {
  const [homeData, setHomeData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
    },
  });

  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use AbortController for cleanup
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        // Parallel fetching of data
        const [homeResponse, resumeResponse] = await Promise.all([
          fetch(USER_HOME_DATA, { signal }),
          fetch(FETCH_RESUME, { signal }),
        ]);

        if (!homeResponse.ok) throw new Error("Failed to fetch home data");
        if (!resumeResponse.ok) throw new Error("Failed to fetch resume");
        console.log("Home Response:", homeResponse);
        const homeJsonData = await homeResponse.json();
        console.log("Home JSON Data:", homeJsonData);
        const resumeBlob = await resumeResponse.blob();
        homeJsonData.title = he.decode(homeJsonData.title);
        const objectURL = URL.createObjectURL(resumeBlob);

        setHomeData(homeJsonData);
        setResumeUrl(objectURL);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup
    return () => {
      controller.abort();
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, []);

  const downloadResume = async (e) => {
    e.preventDefault();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const response = await fetch(FETCH_RESUME, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error details:", error);
      // Add user-friendly error message
      alert("Failed to download resume. Please try again later.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );

  const { name, title, description, image, socialLinks } = homeData;
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const timestamp = new Date().getTime();
    return `${HOST}${imagePath}?t=${timestamp}`;
  };

  return (
    <>
      <Header />
      <main
        id="home"
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="container mx-auto px-4 pt-20 md:pt-28 pb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex flex-col items-center space-y-8 pr-8">
              <div className="w-px h-24 bg-gradient-to-b from-blue-200 to-purple-200" />
              {socialLinks.facebook && (
                <SocialIcon
                  href={socialLinks.facebook}
                  icon={faFacebook}
                  hoverColor="text-blue-600"
                  label="Facebook"
                />
              )}
              {socialLinks.twitter && (
                <SocialIcon
                  href={socialLinks.twitter}
                  icon={faTwitter}
                  hoverColor="text-blue-500"
                  label="Twitter"
                />
              )}
              {socialLinks.linkedin && (
                <SocialIcon
                  href={socialLinks.linkedin}
                  icon={faLinkedin}
                  hoverColor="text-blue-700"
                  label="LinkedIn"
                />
              )}
              <div className="w-px h-24 bg-gradient-to-b from-purple-200 to-blue-200" />
            </div>

            {/* Main Content */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 flex-grow">
              <div className="text-center md:text-left space-y-6 max-w-xl">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                    {name}
                    <span className="inline-block animate-wave ml-2">👋</span>
                  </h1>
                  <h2 className="text-xl md:text-2xl text-blue-600 font-medium">
                    {title}
                  </h2>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Hire Me
                  </button>
                  <button
                    onClick={downloadResume}
                    className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Download CV
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative w-48 h-64 md:w-64 md:h-96 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                  <picture>
                      <source srcSet={getImageUrl(image)} type="image/webp" />
                      <img
                        src={getImageUrl(image)}
                        alt={name}
                        loading="lazy"
                        className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                      />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lazy loaded components */}
        <Suspense fallback={<LoadingSpinner />}>
          <About />
          <Skills />
          <Education />
          <Projects />
          <Contact />
          <Footer />
        </Suspense>
      </main>
    </>
  );
}

export default Home;
