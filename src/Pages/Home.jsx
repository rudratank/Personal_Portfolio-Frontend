import React, { useState, useEffect } from 'react';
import Header from './Header';
import img from '../assets/20230112_102034.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import About from './About';
import Skills from './Skills';
import Education from './Education';
import Projects from './Projects';
import Contact from './Contact';
import Footer from './Footer';
import { FETCH_RESUME, HOST, USER_HOME_DATA } from '@/lib/constant';
import he from 'he'

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
  
  const [resume,setResume]=useState({
    resume:'',
  })
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(USER_HOME_DATA); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data = await response.json();
        data.title = he.decode(data.title);

        setHomeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    
    const fetchResume = async () => {
      try {
        const response = await fetch(FETCH_RESUME); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch resume');
        }
    
        const blob = await response.blob(); // Handle binary data
        const objectURL = URL.createObjectURL(blob);
        setResume({ resume: objectURL }); // Save the object URL for download
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchHomeData();
    fetchResume();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">
      Error loading data: {error}
    </div>;
  }

  const downloadResume = async () => {
    try {
      const response = await fetch(FETCH_RESUME, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN', // If needed
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching resume: ${response.statusText}`);
      }
  
      const blob = await response.blob(); // Get the file data as a Blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Resume.pdf'; // Specify the filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };
  

  return (
    <>
      <Header />
      <main id='home' className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 pt-20 md:pt-28 pb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
            {/* Social Icons - Vertical on desktop */}
            <div className="hidden lg:flex flex-col items-center space-y-8 pr-8">
              <div className="w-px h-24 bg-gradient-to-b from-blue-200 to-purple-200" />
              {homeData.socialLinks.facebook && (
                <a 
                  href={homeData.socialLinks.facebook}
                  className="text-gray-600 hover:text-blue-600 transform hover:scale-125 transition-all duration-300"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
              )}
              {homeData.socialLinks.twitter && (
                <a 
                  href={homeData.socialLinks.twitter}
                  className="text-gray-600 hover:text-blue-400 transform hover:scale-125 transition-all duration-300"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </a>
              )}
              {homeData.socialLinks.linkedin && (
                <a 
                  href={homeData.socialLinks.linkedin}
                  className="text-gray-600 hover:text-blue-700 transform hover:scale-125 transition-all duration-300"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedin} size="lg" />
                </a>
              )}
              <div className="w-px h-24 bg-gradient-to-b from-purple-200 to-blue-200" />
            </div>

            {/* Main Content */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 flex-grow">
              {/* Text Content */}
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

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
  <button
    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
  >
    Hire Me
  </button>
  <a
    onClick={downloadResume}
    rel="noopener noreferrer"
    className="px-8 py-3 cursor-pointer border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 text-center"
  >
    Download CV
  </a>
</div>


                {/* Mobile Social Icons */}
                <div className="flex lg:hidden justify-center md:justify-start space-x-8 pt-4">
                  {homeData.socialLinks.facebook && (
                    <a 
                      href={homeData.socialLinks.facebook}
                      className="text-gray-600 hover:text-blue-600 transform hover:scale-125 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faFacebook} size="lg" />
                    </a>
                  )}
                  {homeData.socialLinks.twitter && (
                    <a 
                      href={homeData.socialLinks.twitter}
                      className="text-gray-600 hover:text-blue-400 transform hover:scale-125 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faTwitter} size="lg" />
                    </a>
                  )}
                  {homeData.socialLinks.linkedin && (
                    <a 
                      href={homeData.socialLinks.linkedin}
                      className="text-gray-600 hover:text-blue-700 transform hover:scale-125 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-lg opacity-20 
                  group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative w-48 h-64 md:w-64 md:h-96 rounded-full overflow-hidden 
                  ring-4 ring-white shadow-2xl">
                  <img 
                    src={`${HOST}${homeData.image}`} 
                    loading='lazy'
                    alt={homeData.name} 
                    className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <About/>
        <Skills/>
        <Education/>
        <Projects/>
        <Contact/>
        <Footer/>
      </main>
    </>
  );
}

// Add the wave animation
const style = document.createElement('style');
style.textContent = `
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-15deg); }
  }
  .animate-wave {
    animation: wave 1.5s infinite;
    transform-origin: 70% 70%;
  }
`;
document.head.appendChild(style);

export default Home;