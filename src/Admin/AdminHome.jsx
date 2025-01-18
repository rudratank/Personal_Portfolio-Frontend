import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { GET_HOME_DATA, HOME_UPDATE_ROUTE, HOME_UPLOAD_ROUTE, HOST } from '@/lib/constant';

// Constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const SOCIAL_VALIDATIONS = {
  facebook: {
    regex: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.]+/,
    message: 'Invalid Facebook URL format'
  },
  twitter: {
    regex: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+/,
    message: 'Invalid Twitter/X URL format'
  },
  linkedin: {
    regex: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/,
    message: 'Invalid LinkedIn URL format'
  }
};

// Axios instance with default config
const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const initialFormState = {
  name: '',
  title: '',
  description: '',
  image: '',
  facebook: '',
  twitter: '',
  linkedin: ''
};

const initialStatus = {
  isLoading: false,
  isSubmitting: false,
  success: '',
  error: ''
};

const AdminHome = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [status, setStatus] = useState(initialStatus);
  const [previewImage, setPreviewImage] = useState(null);

  const resetStatus = () => setStatus(prev => ({ ...prev, success: '', error: '' }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    resetStatus();
  };

  const validateImageFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };
    
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { isValid: false, error: 'Please upload only JPG, PNG or WebP images' };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return { isValid: false, error: 'Image size should be less than 5MB' };
    }

    return { isValid: true, error: null };
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      setStatus(prev => ({ ...prev, error: validation.error }));
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      setStatus(prev => ({ ...prev, isSubmitting: true, error: '' }));
      
      // Important: Remove the Content-Type header for FormData
      const response = await axios.post(HOME_UPLOAD_ROUTE, formData, {
        withCredentials: true,
        headers: {
          // Let the browser set the Content-Type with boundary for FormData
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          image: response.data.filepath
        }));
        setPreviewImage(URL.createObjectURL(file));
        setStatus(prev => ({ 
          ...prev, 
          success: 'Image uploaded successfully', 
          isSubmitting: false 
        }));
      }
    } catch (error) {
      console.error('Upload error:', error.response || error);
      setStatus(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.response?.data?.message || 
              error.message || 
              'Failed to upload image'
      }));
    }
  };

  const validateForm = () => {
    const { name, title, description } = formData;
    
    if (!name.trim() || !title.trim() || !description.trim()) {
      setStatus(prev => ({ ...prev, error: 'Please fill out all required fields.' }));
      return false;
    }

    // Validate social links if provided
    for (const [platform, validation] of Object.entries(SOCIAL_VALIDATIONS)) {
      const url = formData[platform];
      if (url && !validation.regex.test(url)) {
        setStatus(prev => ({ ...prev, error: validation.message }));
        return false;
      }
    }

    return true;
  };

  const fetchData = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: '' }));
      const response = await axiosInstance.get(GET_HOME_DATA);
      const { data } = response.data;
      
      setFormData({
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        facebook: data.socialLinks?.facebook || '',
        twitter: data.socialLinks?.twitter || '',
        linkedin: data.socialLinks?.linkedin || ''
      });

      if (data.image) {
        setPreviewImage(`${HOST}${data.image}`);
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error.response?.status === 401
          ? 'Please log in to view this page'
          : 'Failed to load initial data. Please try again.'
      }));
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetStatus();

    if (!validateForm()) return;

    try {
      setStatus(prev => ({ ...prev, isSubmitting: true }));
      const response = await axiosInstance.put(HOME_UPDATE_ROUTE, formData);
      
      setStatus(prev => ({
        ...prev,
        success: response.data.message || 'Data saved successfully!',
        isSubmitting: false
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.response?.status === 401
          ? 'Please log in to update data'
          : error.response?.data?.message || 'Failed to save data. Please try again.'
      }));
    }
  };

  useEffect(() => {
    fetchData();
    // Cleanup preview image URL on component unmount
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  if (status.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {status.success && (
            <Alert className="mb-6 bg-green-50">
              <AlertDescription>{status.success}</AlertDescription>
            </Alert>
          )}

          {status.error && (
            <Alert className="mb-6 bg-red-50">
              <AlertDescription className="text-red-600">{status.error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex flex-col items-center gap-4">
                {(previewImage || formData.image) && (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src={previewImage || formData.image}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    accept={ALLOWED_IMAGE_TYPES.join(',')}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image').click()}
                    disabled={status.isSubmitting}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
                maxLength={1000}
              />
            </div>

            <div className="space-y-4">
              <Label>Social Links (Optional)</Label>
              <div className="space-y-2">
                <Input
                  type="url"
                  name="facebook"
                  placeholder="Facebook URL (e.g., https://facebook.com/username)"
                  value={formData.facebook}
                  onChange={handleInputChange}
                />
                <Input
                  type="url"
                  name="twitter"
                  placeholder="Twitter/X URL (e.g., https://twitter.com/username)"
                  value={formData.twitter}
                  onChange={handleInputChange}
                />
                <Input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn URL (e.g., https://linkedin.com/in/username)"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={status.isSubmitting}
              className="w-full sm:w-auto"
            >
              {status.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;