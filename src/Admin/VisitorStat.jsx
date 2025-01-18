import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, RefreshCw, UserPlus, Monitor, Smartphone, Tablet } from 'lucide-react';
import axios from 'axios';
import { VISITOR_STATS } from '@/lib/constant';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const VisitorStatistics = () => {
  const [stats, setStats] = useState({
    total: 0,
    returning: 0,
    new: 0,
    locations: [],
    browsers: [],
    devices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(VISITOR_STATS, { withCredentials: true });
        
        if (response.data.success) {
          // Transform the devices array into the correct format
          const transformedDevices = response.data.data.devices.map(device => ({
            device: device.device.charAt(0).toUpperCase() + device.device.slice(1),
            users: parseInt(device.users) // Ensure users is a number
          }));

          // Transform browsers array to ensure correct format
          const transformedBrowsers = response.data.data.browsers.map(browser => ({
            browser: browser.browser || 'Unknown',
            users: parseInt(browser.users) // Ensure users is a number
          }));

          // Transform locations array
          const transformedLocations = response.data.data.locations.map(location => ({
            country: location.country || 'Unknown',
            visitors: parseInt(location.visitors) // Ensure visitors is a number
          }));

          setStats({
            total: parseInt(response.data.data.total) || 0,
            returning: parseInt(response.data.data.returning) || 0,
            new: parseInt(response.data.data.new) || 0,
            locations: transformedLocations,
            browsers: transformedBrowsers,
            devices: transformedDevices
          });

          
        } else {
          setError('Failed to fetch statistics');
        }
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
        setError('Error loading statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const DeviceIcon = ({ type, className }) => {
    switch (type.toLowerCase()) {
      case 'desktop':
        return <Monitor className={className} />;
      case 'mobile':
        return <Smartphone className={className} />;
      case 'tablet':
        return <Tablet className={className} />;
      default:
        return <Monitor className={className} />;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center text-blue-600">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Total Visitors</h3>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center text-green-600">
            <RefreshCw className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">Returning Visitors</h3>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.returning}</p>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <div className="flex items-center text-purple-600">
            <UserPlus className="w-5 h-5 mr-2" />
            <h3 className="text-sm font-medium">New Visitors</h3>
          </div>
          <p className="text-2xl font-semibold mt-2">{stats.new}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visitor Locations</h3>
          {stats.locations && stats.locations.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.locations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="visitors" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No location data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.devices.map((device) => (
              <div key={device.device} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <DeviceIcon type={device.device} className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">{device.device}</span>
                </div>
                <p className="text-xl font-semibold">{device.users}</p>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-4">Browser Distribution</h3>
          {stats.browsers && stats.browsers.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.browsers}
                    dataKey="users"
                    nameKey="browser"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {stats.browsers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, props.payload.browser]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {stats.browsers.map((browser, index) => (
                  <div key={browser.browser} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                    />
                    <span className="text-sm text-gray-600">{`${browser.browser} (${browser.users})`}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No browser data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorStatistics;