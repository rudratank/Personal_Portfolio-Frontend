import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaTrashAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EDUCATION_UPDATE_ROUTES } from '@/lib/constant';

const AdminEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true); // Changed to true initially
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    period: '',
    description: ''
  });

  // Fetch education data
  const fetchEducation = async () => {
    try {
      const response = await axios.get(EDUCATION_UPDATE_ROUTES,{withCredentials:true});
      setEducation(response.data?.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch education data');
      setEducation([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    setLoading(true);
    if (editMode) {
      await axios.put(
        `${EDUCATION_UPDATE_ROUTES}/${currentId}`,
        formData, // Form data as the second parameter
        { withCredentials: true } // Configuration as the third parameter
      );
      
      toast.success('Education updated successfully');
    } else {
      await axios.post(EDUCATION_UPDATE_ROUTES, formData,{withCredentials:true});
      toast.success('Education added successfully');
    }
      setFormData({
        title: '',
        institution: '',
        period: '',
        description: ''
      });
      setEditMode(false);
      setCurrentId(null);
      fetchEducation();
    } catch (error) {
      console.error('Submit error:', error);
    toast.error(error.response?.data?.message || 'Something went wrong');
      
    }finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (edu) => {
    setFormData({
      title: edu.title,
      institution: edu.institution,
      period: edu.period,
      description: edu.description
    });
    setCurrentId(edu._id);
    setEditMode(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      try {
        setLoading(true);
        await axios.delete(`${EDUCATION_UPDATE_ROUTES}/${id}`,{withCredentials:true});
        toast.success('Education deleted successfully');
        fetchEducation();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete education');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {editMode ? 'Edit Education' : 'Add Education'}
          </h2>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Degree Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              value={formData.institution}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              name="period"
              placeholder="Period (e.g., 2020 - 2024)"
              value={formData.period}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              rows="4"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <FaPlusCircle className="inline mr-2" />
                {loading ? 'Processing...' : editMode ? 'Update Education' : 'Add Education'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setCurrentId(null);
                    setFormData({
                      title: '',
                      institution: '',
                      period: '',
                      description: ''
                    });
                  }}
                  className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* Education List */}
        {!loading && (
          <div className="space-y-4">
            {education.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No education entries found. Add your first one!
              </div>
            ) : (
              education.map((edu) => (
                <motion.div
                  key={edu._id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 shadow-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800">{edu.title}</h4>
                    <div className="text-sm text-gray-600">
                      <span>{edu.institution}</span> | <span>{edu.period}</span>
                    </div>
                    <p className="mt-2 text-gray-600">{edu.description}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <button
                      onClick={() => handleEdit(edu)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      disabled={loading}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(edu._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminEducation;