import React, { useEffect, useState } from 'react';
import { X, Edit2, Trash2, Plus, Image, ExternalLink, Github, Save } from 'lucide-react';
import axios from 'axios';
import { HOST, PROJECT_ADD_ROUTE, PROJECT_DELETE_ROUTE, PROJECT_GET_ROUTE, PROJECT_UPDATE_ROUTE } from '@/lib/constant';
import { toast } from 'sonner';

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(project || {
    title: '',
    category: '',
    description: '',
    features: [''],
    techStack: [''],
    image: '',
    liveLink: '',
    codeLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleArrayInput = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length === 1) return; // Keep at least one input field
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };
    

    
    // Set initial image preview when editing
    useEffect(() => {
      if (project?.image) {
        setImagePreview(`${HOST}${project.image}`);
      }
    }, [project]);
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }
        
        setFormData({ ...formData, image: file });
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
    
      try {
        setIsSubmitting(true);
        
        // Validate required fields
        if (!formData.title || !formData.category || !formData.description) {
          toast.error('Please fill in all required fields');
          return;
        }
    
        // Filter out empty values from arrays
        const features = formData.features.filter(f => f.trim());
        const techStack = formData.techStack.filter(t => t.trim());
        
        if (features.length === 0 || techStack.length === 0) {
          toast.error('Please add at least one feature and technology');
          return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('category', formData.category.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('features', JSON.stringify(features));
        formDataToSend.append('techStack', JSON.stringify(techStack));
        formDataToSend.append('liveLink', formData.liveLink?.trim() || '');
        formDataToSend.append('codeLink', formData.codeLink?.trim() || '');
    
        // Only append image if it's a new file or being updated
        if (formData.image instanceof File) {
          formDataToSend.append('image', formData.image);
        }
    
        await onSubmit(formDataToSend);
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to submit form');
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {project ? 'Edit Project' : 'Add New Project'}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Features</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayInput(index, e.target.value, 'features')}
                className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'features')}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('features')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tech Stack</label>
          {formData.techStack.map((tech, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={tech}
                onChange={(e) => handleArrayInput(index, e.target.value, 'techStack')}
                className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Add technology"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'techStack')}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('techStack')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add Technology
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Project Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="project-image"
            />
            <label
              htmlFor="project-image"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer"
            >
              <Image className="w-5 h-5" />
              Choose Image
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Live Demo Link</label>
            <input
              type="url"
              value={formData.liveLink}
              onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Code Repository Link</label>
            <input
              type="url"
              value={formData.codeLink}
              onChange={(e) => setFormData({ ...formData, codeLink: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {project ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [imgSrc, setImgSrc] = useState(project.image || '/api/placeholder/400/300');
  const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(`${HOST}${project.image}`);
      }
    };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img
          src={imgSrc}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <span className="text-sm font-medium">{project.category}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        
        <div className="space-y-2">
          {project.liveLink && (
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="w-4 h-4" />
              <a 
                href={project.liveLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                Live Demo
              </a>
            </div>
          )}
          {project.codeLink && (
            <div className="flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" />
              <a 
                href={project.codeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                View Code
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(project._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(PROJECT_GET_ROUTE, {
        withCredentials: true
      });

      if (response.data.success) {
        setProjects(response.data.data);
      } else {
        toast.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error loading projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('category', projectData.category);
      formData.append('description', projectData.description);
      formData.append('features', JSON.stringify(projectData.features));
      formData.append('techStack', JSON.stringify(projectData.techStack));
      formData.append('liveLink', projectData.liveLink);
      formData.append('codeLink', projectData.codeLink);
      if (projectData.image) {
        formData.append('image', projectData.image);
      }

      const response = await axios.post(PROJECT_ADD_ROUTE, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Project added successfully');
        await fetchProjects(); // Refresh the projects list
        setIsFormOpen(false);
      } else {
        toast.error('Error adding project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveEdit = async (projectData) => {
    try {
      if (!editingProject?._id) {
        toast.error('Invalid project ID');
        return;
      }

      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        if (key === 'features' || key === 'techStack') {
          formData.append(key, JSON.stringify(projectData[key].filter(item => item.trim())));
        } else if (projectData[key] !== null && projectData[key] !== undefined) {
          formData.append(key, projectData[key]);
        }
      });

      const response = await axios.put(`${PROJECT_UPDATE_ROUTE}/${editingProject._id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Project updated successfully');
        await fetchProjects();
        setEditingProject(null);
        setIsFormOpen(false);
      } else {
        toast.error(response.data.message || 'Error updating project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    }
  };


  const handleDeleteProject = async (projectId) => {
    if (!projectId) {
      toast.error('Invalid project ID');
      return;
    }
  
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await axios.delete(`${PROJECT_DELETE_ROUTE}/${projectId}`, {
          withCredentials: true
        });
  
        if (response.data.success) {
          toast.success('Project deleted successfully');
          await fetchProjects();
        } else {
          toast.error(response.data.message || 'Error deleting project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleSaveEdit : handleAddProject}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingProject(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    </div>
  </div>
);
}