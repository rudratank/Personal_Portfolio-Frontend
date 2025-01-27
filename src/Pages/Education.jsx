import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ExternalLink, Award, Calendar, Hash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HOST, USER_EDUCATION_DATA } from "@/lib/constant";

const CustomArrow = ({ direction, onClick }) => (
  <Button
    onClick={onClick}
    variant="outline"
    size="icon"
    className={`absolute top-1/2 -translate-y-1/2 ${
      direction === "next" ? "-right-12" : "-left-12"
    } z-10 rounded-full bg-white/90 hover:bg-blue-500 hover:text-white`}
  >
    {direction === "next" ? (
      <ChevronRight className="w-5 h-5" />
    ) : (
      <ChevronLeft className="w-5 h-5" />
    )}
  </Button>
);

const TimelineItem = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    className="relative pl-8 md:pl-12"
  >
    <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-4 ring-white" />
    <Card className="hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <Badge className="mb-2" variant="outline">
          {item.period}
        </Badge>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-blue-600 font-medium mb-3">{item.institution}</p>
        <p className="text-gray-600">{item.description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="relative pl-8 md:pl-12">
        <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gray-200" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    ))}
  </div>
);

const Education = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [educationData, setEducationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await fetch(USER_EDUCATION_DATA);
        if (!response.ok) {
          throw new Error('Failed to fetch education data');
        }
        const data = await response.json();
        setEducationData(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, educationData?.certificates?.length || 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(2, educationData?.certificates?.length || 2),
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ],
    customPaging: () => (
      <div className="w-2 h-2 mx-1 rounded-full bg-blue-200 hover:bg-blue-400 transition-colors duration-300" />
    ),
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <Card className="max-w-lg mx-auto">
          <CardContent className="flex flex-col items-center p-6">
            <Badge variant="destructive" className="mb-4">Error</Badge>
            <p className="text-red-600">Error loading education data: {error}</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="education" className="py-16 md:py-24 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Education Journey</Badge>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Academic & Certifications</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-pink-500">
          {educationData?.education?.map((item, index) => (
            <TimelineItem key={index} item={item} index={index} />
          ))}

          {educationData?.certificates?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute left-0 mt-3 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-4 ring-white" />
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Professional Certifications</h3>
                  <div className="px-8">
                    <Slider {...settings}>
                      {educationData.certificates.map((cert) => (
                        <div key={cert.id} className="px-2">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="cursor-pointer"
                            onClick={() => {
                              setActiveCertificate(cert);
                              setIsModalOpen(true);
                            }}
                          >
                            <Card>
                              <CardContent className="p-0">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                                  <img
                                  loading="lazy"
                                    src={`${HOST}${cert.imageUrl}`}
                                    alt={cert.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 text-white">
                                      <p className="font-medium">{cert.platform}</p>
                                      <p className="text-sm opacity-75">{cert.date}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h4 className="font-bold text-gray-800">{cert.title}</h4>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{activeCertificate?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={`${HOST}${activeCertificate?.imageUrl}`}
                  alt={activeCertificate?.title}
                  className="w-full"
                />
              </div>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Platform:</span>
                  {activeCertificate?.platform}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Completed:</span>
                  {activeCertificate?.date}
                </div>
                {activeCertificate?.credentialId && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Credential ID:</span>
                    {activeCertificate.credentialId}
                  </div>
                )}
                {activeCertificate?.credentialUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(activeCertificate.credentialUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Credential
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Education;