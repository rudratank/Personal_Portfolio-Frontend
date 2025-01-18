import React, { useState, useEffect } from 'react';
import { X, Save, Image } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { HOST } from '@/lib/constant';

export const CertificateForm = ({ certificate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(certificate || {
    title: '',
    platform: '',
    date: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (certificate?.image) {
      setImagePreview(`${HOST}${certificate.image}`);
    }
  }, [certificate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData({ ...formData, image: file });
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
      
      if (!formData.title || !formData.platform || !formData.date) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('platform', formData.platform.trim());
      formDataToSend.append('date', formData.date.trim());
      
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit certificate');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {certificate ? 'Edit Certificate' : 'Add New Certificate'}
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Platform</label>
          <input
            type="text"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="month"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Certificate Image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="certificate-image"
            />
            <label
              htmlFor="certificate-image"
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
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : certificate ? 'Save Changes' : 'Add Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
};