import React, { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Briefcase,
  Phone,
  Settings,
  LogOut,
  Menu,
  Layout,
  BarChart,
  ChevronRight,
  Mail,
  Eye,
  Code,
  Award,
  EyeClosed
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminHome from './AdminHome';
import AdminAbout from './AdminAbout';
import Skills from './AdminSkills';
import AdminEducation from './AdminEducation';
import AdminProjects from './AdminProjects';
import { AdminCertificates } from './AdminCertificate';
import { DASHBOARD_STAT } from '@/lib/constant';
import AdminMessages from './AdminMessages';
import axios from 'axios';
import AnalyticsDashboard from './AdminViews';
import VisitorStatistics from './VisitorStat';

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalViews: 0,
    projectCount: 0,
    messageCount: 0,
    skillCount: 0,
    recentMessages: [],
    viewsData: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handlelogout = async()=>{
    try {
      const response=await axios.post(a)
        .catch(err => console.error(err));
    } catch (error) {
      
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(DASHBOARD_STAT, { withCredentials: true });
      const data = response.data; // Access the parsed JSON data directly
      console.log(data);
      setDashboardStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
    
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'home', label: 'Home', icon: User },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Briefcase },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'project', label: 'Projects', icon: Code },
    { id: 'certificate', label: 'Certificates', icon: Award },
    {id: 'views',label: 'views', icon: Eye},
    {id: 'visitor',label: 'visitor', icon: EyeClosed},
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{((dashboardStats.totalViews / 1000) * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalViews}</p>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Code className="w-5 h-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Projects</h3>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{dashboardStats.projectCount}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{dashboardStats.projectCount}</p>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-yellow-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Messages</h3>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{dashboardStats.messageCount}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{dashboardStats.messageCount}</p>
        </div>

        <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Skills</h3>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{dashboardStats.skillCount}
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{dashboardStats.skillCount}</p>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Page Views Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardStats.viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-4">
          {dashboardStats.recentMessages.map((message, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{message.name}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardContent />;
      
      case 'home':
        return <AdminHome />;
      case 'about':
        return <AdminAbout />;
      case 'skills':
        return <Skills />;
      case 'education':
        return <AdminEducation />;
      case 'project':
        return <AdminProjects />;
      case 'certificate':
        return <AdminCertificates/>;
      case 'messages':
        return <AdminMessages />;
      case 'views':
        return <AnalyticsDashboard />
      case 'visitor':
        return <VisitorStatistics />
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Portfolio Admin
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r transition-all duration-300 ease-in-out
          ${isHovered ? 'w-64' : 'w-16'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`
            px-4 py-4 border-b transition-all duration-300
            ${isHovered ? 'items-start' : 'items-center'}
          `}>
            {isHovered ? (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio Admin
              </h1>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600" />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`
                    w-full flex items-center px-3 py-2 mx-2 rounded-lg text-sm
                    ${activeMenu === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                    transition-colors duration-150 whitespace-nowrap
                  `}
                >
                  <Icon className="w-5 h-5 min-w-[20px]" />
                  <span className={`
                    ml-3 transition-all duration-300
                    ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                  `}>
                    {item.label}
                  </span>
                  {isHovered && (
                    <ChevronRight className={`
                      w-4 h-4 ml-auto transition-transform
                      ${activeMenu === item.id ? 'rotate-90' : ''}
                    `} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t p-4">
            <button className={`
              flex items-center text-red-600 hover:bg-red-50 rounded-lg p-2 w-full
              ${isHovered ? 'justify-start' : 'justify-center'}
            `}>
              <LogOut className="w-5 h-5" />
              <span className={`
                ml-3 transition-all duration-300
                ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
              `}onClick={handlelogout}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isHovered ? 'lg:ml-64' : 'lg:ml-16'}
        ${isMobileMenuOpen ? 'ml-0' : 'ml-0'}
      `}>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => item.id === activeMenu)?.label}
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your portfolio content and settings
            </p>
          </div>
          {renderContent()}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default AdminDashboard;