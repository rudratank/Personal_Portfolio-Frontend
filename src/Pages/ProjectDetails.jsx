import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HOST, USER_PROJECTS_DATA_BY_ID } from "@/lib/constant";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${USER_PROJECTS_DATA_BY_ID}/${id}`);
        console.log(response);

        setProject(response.data);
      } catch (error) {
        setError("Failed to fetch project details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Project not found</h2>
        <Button onClick={handleBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-12 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50"
    >
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={handleBack}
          variant="outline"
          className="mb-8 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <Card className="overflow-hidden">
          <div className="relative h-96">
            <img
              src={`${HOST}${project.image}`}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/api/placeholder/800/600";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <CardContent className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack?.map((tech, i) => (
                <Badge key={i} variant="outline" className="bg-blue-50">
                  {tech}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {project.title}
            </h1>
            <p className="text-gray-600 text-lg mb-8">{project.description}</p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Key Features
              </h2>
              <ul className="space-y-3">
                {project.features?.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-4">
  <a
    href={project.liveLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button className="bg-blue-600 hover:bg-blue-700">
      <ExternalLink className="w-4 h-4 mr-2" />
      Live Demo
    </Button>
  </a>
  <a
    href={project.codeLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button
      variant="outline"
      className="hover:bg-blue-50"
    >
      <Github className="w-4 h-4 mr-2" />
      View Code
    </Button>
  </a>
</div>

          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default ProjectDetails;
