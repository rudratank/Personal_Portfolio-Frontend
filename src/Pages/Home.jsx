import React, { useState, useEffect, lazy, Suspense } from 'react';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import he from 'he';
import { FETCH_RESUME, USER_HOME_DATA } from '@/lib/constant';

// Lazy load components that aren't needed immediately
const About = lazy(() => import('./About'));
const Skills = lazy(() => import('./Skills'));
const Education = lazy(() => import('./Education'));
const Projects = lazy(() => import('./Projects'));
const Contact = lazy(() => import('./Contact'));
const Footer = lazy(() => import('./Footer'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function Home() {
  const [homeData, setHomeData] = useState({
    name: '',
    title: '',
    description: '',
    image: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: ''
    }
  });
  
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Combine fetch requests to reduce network calls
    const fetchData = async () => {
      try {
        const [homeResponse, resumeResponse] = await Promise.all([
          fetch(USER_HOME_DATA),
          fetch(FETCH_RESUME)
        ]);

        if (!homeResponse.ok || !resumeResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const homeData = await homeResponse.json();
        const resumeBlob = await resumeResponse.blob();
        
        setHomeData({
          ...homeData,
          title: he.decode(homeData.title)
        });
        setResumeUrl(URL.createObjectURL(resumeBlob));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
    };
  }, []);

  const downloadResume = () => {
    if (resumeUrl) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = 'Resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">
      Error loading data: {error}
    </div>;
  }

  const SocialLink = ({ href, icon, color }) => (
    href && (
      <a 
        href={href}
        className={`text-gray-600 hover:${color} transform hover:scale-125 transition-all duration-300`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={icon} size="lg" />
      </a>
    )
  );

  return (
    <>
      <Header />
      <main id='home' className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 pt-20 md:pt-28 pb-12">
          {/* Main content section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
            {/* Social Icons */}
            <div className="hidden lg:flex flex-col items-center space-y-8 pr-8">
              <div className="w-px h-24 bg-gradient-to-b from-blue-200 to-purple-200" />
              <SocialLink href={homeData.socialLinks.facebook} icon={faFacebook} color="text-blue-600" />
              <SocialLink href={homeData.socialLinks.twitter} icon={faTwitter} color="text-blue-400" />
              <SocialLink href={homeData.socialLinks.linkedin} icon={faLinkedin} color="text-blue-700" />
              <div className="w-px h-24 bg-gradient-to-b from-purple-200 to-blue-200" />
            </div>

            {/* Profile Content */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 flex-grow">
              <div className="text-center md:text-left space-y-6 max-w-xl">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
                    {homeData.name}
                    <span className="inline-block animate-wave ml-2">👋</span>
                  </h1>
                  <h2 className="text-xl md:text-2xl text-blue-600 font-medium">
                    {homeData.title}
                  </h2>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {homeData.description}
                </p>

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

                {/* Mobile Social Icons */}
                <div className="flex lg:hidden justify-center md:justify-start space-x-8 pt-4">
                  <SocialLink href={homeData.socialLinks.facebook} icon={faFacebook} color="text-blue-600" />
                  <SocialLink href={homeData.socialLinks.twitter} icon={faTwitter} color="text-blue-400" />
                  <SocialLink href={homeData.socialLinks.linkedin} icon={faLinkedin} color="text-blue-700" />
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-48 h-64 md:w-64 md:h-96 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                  <img 
                    src={`${HOST}${homeData.image}`}
                    alt={homeData.name}
                    loading="lazy"
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500"
                  />
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