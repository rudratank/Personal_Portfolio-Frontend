import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HOST, USER_PROJECTS_DATA } from '@/lib/constant';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(USER_PROJECTS_DATA);
        setProjects(response.data);
      } catch (error) {
        setError('Failed to fetch projects');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-br from-white via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Portfolio</Badge>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Featured Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-6 text-center">
              <Badge variant="destructive" className="mb-4">Error</Badge>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link to={`/projects/${project._id}`} key={project._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group h-full"
                >
                  <Card className="h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={`${HOST}${project.image}`}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/600/400";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack?.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="outline" className="bg-blue-50">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;