import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Save, AlertCircle, FileText, X } from 'lucide-react';
import axios from 'axios';
import { ABOUT_UPDATE_ROUTE, GET_ABOUT_DATA, HOST } from '@/lib/constant';


const AdminAbout = () => {
  const [formData, setFormData] = useState({
    description: '',
    projectsCompleted: '',
    experience: '',
    support: '',
    image: '',
    resume: ''
  });

  const [files, setFiles] = useState({
    imageFile: null,
    resumeFile: null
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const [previewImage, setPreviewImage] = useState('');
  const [selectedResume, setSelectedResume] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setStatus({ loading: true, error: null, success: false });
        const response = await axios.get(GET_ABOUT_DATA, {
          withCredentials: true
        });

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch data');
        }

        const data = response.data.data;

        setFormData({
          description: data.description || '',
          projectsCompleted: data.projectsCompleted || '',
          experience: data.experience || '',
          support: data.support || '',
          image: data.image || '',
          resume: data.resume || ''
        });

        // Handle image preview
        if (data.image) {
          const imageUrl = data.image.startsWith('http') 
            ? data.image 
            : `${HOST}${data.image}`;
          setPreviewImage(imageUrl);
        }

        if (data.resume) {
          setSelectedResume(data.resume.split('/').pop());
        }

        setStatus({ loading: false, error: null, success: false });
      } catch (error) {
        console.error('Error fetching about data:', error);
        setStatus({
          loading: false,
          error: error.response?.data?.message || 'Failed to load data. Please try again later.',
          success: false
        });
      }
    };

    fetchAboutData();
  }, []);


  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.projectsCompleted) {
      newErrors.projectsCompleted = 'Projects completed is required';
    } else if (isNaN(formData.projectsCompleted)) {
      newErrors.projectsCompleted = 'Must be a number';
    }
    if (!formData.experience) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(formData.experience)) {
      newErrors.experience = 'Must be a number';
    }
    if (!formData.support?.trim()) {
      newErrors.support = 'Support hours are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleFileChange = useCallback((e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageFile: 'Please upload an image file' }));
        return;
      }
      // For new file uploads, create a local preview URL
      setPreviewImage(URL.createObjectURL(file));
      setFiles(prev => ({ ...prev, imageFile: file }));
      setFormData(prev => ({ ...prev, image: file.name }));
    } else if (type === 'resume') {
      if (!file.type.includes('pdf')) {
        setErrors(prev => ({ ...prev, resumeFile: 'Please upload a PDF file' }));
        return;
      }
      setFiles(prev => ({ ...prev, resumeFile: file }));
      setFormData(prev => ({ ...prev, resume: file.name }));
      setSelectedResume(file.name);
    }
  }, []);


  const clearFile = useCallback((type) => {
    if (type === 'image') {
      setPreviewImage('');
      setFiles(prev => ({ ...prev, imageFile: null }));
      setFormData(prev => ({ ...prev, image: '' }));
    } else if (type === 'resume') {
      setFiles(prev => ({ ...prev, resumeFile: null }));
      setFormData(prev => ({ ...prev, resume: '' }));
      setSelectedResume('');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus({ loading: true, error: null, success: false });

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && key !== 'resume') {
          formDataToSend.append(key, value);
        }
      });

      // Append files
      if (files.imageFile) {
        formDataToSend.append('image', files.imageFile);
      }
      if (files.resumeFile) {
        formDataToSend.append('resume', files.resumeFile);
      }

      const response = await axios.put(ABOUT_UPDATE_ROUTE, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }

      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Error updating profile',
        success: false
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
        <p className="text-gray-600 mt-1">Update your profile information</p>
      </div>

      {status.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-4 w-4 mr-2" />
          <p>{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
          <p>Profile updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-start space-x-6">
          <div className="relative w-40 h-40">
        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
          {previewImage ? (
            <>
              <img 
                src={previewImage}
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', previewImage);
                  e.target.onerror = null; // Prevent infinite loop
                  setPreviewImage('');
                }}
              />
              <button
                type="button"
                onClick={() => clearFile('image')}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>
      </div>
            <div className="flex-1">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </label>
              {formData.image && (
                <p className="text-sm text-gray-500 mt-2">
                  Selected: {formData.image}
                </p>
              )}
              {errors.imageFile && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.imageFile}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'resume')}
              className="hidden"
            />
            <label
              htmlFor="resumeUpload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2" />
              Choose Resume
            </label>
            {selectedResume && (
              <div className="flex items-center">
                <span className="text-sm text-gray-500">
                  {selectedResume}
                </span>
                <button
                  type="button"
                  onClick={() => clearFile('resume')}
                  className="ml-2 text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {errors.resumeFile && (
            <p className="text-sm text-red-500 mt-2">
              {errors.resumeFile}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Write about yourself..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Cetificate
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.experience ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 5"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.experience}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Projects Completed
              </label>
              <input
                type="number"
                name="projectsCompleted"
                value={formData.projectsCompleted}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.projectsCompleted ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 50"
              />
              {errors.projectsCompleted && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.projectsCompleted}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                name="support"
                value={formData.support}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.support ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 24/7"
              />
              {errors.support && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.support}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status.loading}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            {status.loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAbout;