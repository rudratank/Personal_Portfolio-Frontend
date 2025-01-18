import React, { useState, useEffect } from 'react';
import axios from 'axios';import { AiOutlineAppstore } from 'react-icons/ai';
import { toast } from "sonner";
import { SKILLS_ROUTES } from '@/lib/constant';
import { SiDotnet } from 'react-icons/si'
import { 
  FaHtml5, 
  FaCss3Alt, 
  FaReact, 
  FaBootstrap, 
  FaNodeJs, 
  FaDatabase, 
  FaPython 
} from 'react-icons/fa';
import {  
  SiJavascript, 
  SiMongodb, 
  SiMysql, 
  SiPostgresql, 
  SiTailwindcss 
} from 'react-icons/si';


const AVAILABLE_ICONS = [
  { name: 'HTML', icon: FaHtml5, color: 'text-red-500' },
  { name: 'CSS', icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', icon: SiJavascript, color: 'text-yellow-400' },
  { name: 'React', icon: FaReact, color: 'text-blue-400' },
  { name: 'Bootstrap', icon: FaBootstrap, color: 'text-purple-500' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-teal-400' },
  { name: 'Node.js', icon: FaNodeJs, color: 'text-green-500' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-600' },
  { name: 'MySQL', icon: SiMysql, color: 'text-blue-600' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-indigo-600' },
  { name: 'Database', icon: FaDatabase, color: 'text-blue-700' },
  { name: 'Python', icon: FaPython, color: 'text-blue-500' },
  { name: 'ASP.NET', icon: SiDotnet, color: 'text-blue-500' },
  { name: 'C#', icon: SiDotnet, color: 'text-purple-600' },
  { name: 'Other', icon: AiOutlineAppstore, color: 'text-teal-500' }
];


const SkillModal = ({ isOpen, onClose, skill, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    level: 'Basic',
    icon: AVAILABLE_ICONS[0].name,
    iconColor: AVAILABLE_ICONS[0].color,
    category: 'frontend'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level,
        icon: skill.icon,
        iconColor: skill.iconColor,
        category: skill.category
      });
    }
  }, [skill]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (!formData.name || !formData.level || !formData.icon || !formData.iconColor || !formData.category) {
            return toast.error('All fields are required.');
          }
          
      if (skill?._id) {
        await axios.put(`${SKILLS_ROUTES}/${skill._id}`, formData,{withCredentials:true});
        toast.success('Skill updated successfully');
      } else {
        await axios.post(`${SKILLS_ROUTES}`, formData,{withCredentials:true});
        toast.success('Skill added successfully');
      }
      onSave();
      onClose();
    } catch (error) {
        console.log('Skill ID:', skill?._id);
console.log('Form Data:', formData);

      toast.error(error.response?.data?.message || 'Error saving skill');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      level: value >= 75 ? 'Advanced' : value >= 40 ? 'Intermediate' : 'Basic'
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">
          {skill ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Skill Name</label>
            <input
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border rounded"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Skill Level: {formData.level}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full"
              value={formData.level === 'Advanced' ? 100 : formData.level === 'Intermediate' ? 60 : 20}
              onChange={handleLevelChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((iconData) => (
                <button
                  key={iconData.name}
                  type="button"
                  className={`p-3 rounded-lg flex items-center justify-center ${
                    formData.icon === iconData.name ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setFormData({
                    ...formData,
                    icon: iconData.name,
                    iconColor: iconData.color
                  })}
                >
                  <iconData.icon className={`text-2xl ${iconData.color}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SkillCard = ({ skill, onEdit, onDelete }) => {
  const IconComponent = AVAILABLE_ICONS.find(i => i.name === skill.icon)?.icon || AiOutlineAppstore;
  
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-all">
      <IconComponent className={`text-2xl ${skill.iconColor}`} />
      
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800">{skill.name}</h4>
        <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ 
              width: `${skill.level === 'Advanced' ? '100%' : skill.level === 'Intermediate' ? '60%' : '30%'}` 
            }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{skill.level}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(skill)}
          className="text-blue-500 hover:text-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(skill)}
          className="text-red-500 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default function Skills() {
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const fetchSkills = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${SKILLS_ROUTES}`,{withCredentials:true});
          setSkills(response.data.data || []); // Handle empty data case
          setInitialLoad(false);
        } catch (error) {
          console.error('Error details:', error);
          // Don't show error toast on initial load with no data
          if (!initialLoad) {
            toast.error('Failed to fetch skills');
          }
        } finally {
          setLoading(false);
        }
      };
  useEffect(() => {
    fetchSkills();
  }, []);

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (skill) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`${SKILLS_ROUTES}/${skill._id}`,{withCredentials:true});
        toast.success('Skill deleted successfully');
        fetchSkills();
      } catch (error) {
        toast.error('Error deleting skill');
      }
    }
  };

  if (loading && initialLoad) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  


  const frontendSkills = skills.filter(skill => skill.category === 'frontend');
  const backendSkills = skills.filter(skill => skill.category === 'backend');

  return (
    <div className="max-w-6xl mx-auto p-6">
    <h2 className="text-3xl font-bold text-center mb-12">My Skills</h2>
    
    {skills.length === 0 ? (
      // Show this when no skills exist
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">No skills added yet</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Your First Skill
        </button>
      </div>
    ) : (
      // Existing grid layout for when skills exist
      <div className="grid md:grid-cols-2 gap-8">
        {/* Frontend section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Frontend Development</h3>
            <button
              onClick={() => {
                setEditingSkill(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Skill
            </button>
          </div>
          
          {frontendSkills.length > 0 ? (
            frontendSkills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onEdit={() => {
                  setEditingSkill(skill);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(skill)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No frontend skills added yet</p>
          )}
        </div>

        {/* Backend section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Backend Development</h3>
            <button
              onClick={() => {
                setEditingSkill(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Skill
            </button>
          </div>
          
          {backendSkills.length > 0 ? (
            backendSkills.map((skill) => (
              <SkillCard
                key={skill._id}
                skill={skill}
                onEdit={() => {
                  setEditingSkill(skill);
                  setIsModalOpen(true);
                }}
                onDelete={() => handleDelete(skill)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No backend skills added yet</p>
          )}
        </div>
      </div>
    )}

    <SkillModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setEditingSkill(null);
      }}
      skill={editingSkill}
      onSave={fetchSkills}
    />
  </div>
);
}