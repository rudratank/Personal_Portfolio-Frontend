import { useState } from 'react';
import { Instagram, Mail, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { CREATE_MESSAGE_ROUTES } from '@/lib/constant';
import { FaWhatsapp, FaWhatsappSquare } from 'react-icons/fa';
import { AiFillInstagram, AiTwotoneMail } from 'react-icons/ai';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.project) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CREATE_MESSAGE_ROUTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          project: ''
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='contact' className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header with subtle animation */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Get in touch
          </h2>
          <p className="text-gray-500 text-lg">Let's discuss your project</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column - Contact Cards */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Reach out through
            </h3>
            
            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Email Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gray-50 rounded-full mb-4">
                    <AiTwotoneMail className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Email</h4>
                  <p className="text-gray-500 text-sm mb-4">rudratank07@gmail.com</p>
                  <a
                    href="mailto:rudratank07@gmail.com"
                    className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 group"
                  >
                    Write me 
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gray-50 rounded-full mb-4">
                    <FaWhatsappSquare className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">WhatsApp</h4>
                  <p className="text-gray-500 text-sm mb-4">+919313364682</p>
                  <a
                    href="https://wa.me/+919313364682"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 group"
                  >
                    Write me
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>

              {/* Messenger Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gray-50 rounded-full mb-4">
                    <AiFillInstagram className="w-6 h-6 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Messenger</h4>
                  <p className="text-gray-500 text-sm mb-4">rudra_tank07</p>
                  <a
                    href="https://instagram.com/direct/t/rudra_tank07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-2 group"
                  >
                    Write me
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="mt-8 lg:mt-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Tell me about your project
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Insert your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Insert your email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-gray-600 mb-2">
                  Project Details
                </label>
                <textarea
                  id="project"
                  value={formData.project}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write about your project"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400 resize-y min-h-[120px]"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;