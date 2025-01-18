import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Calendar, Users, Eye, Clock, MousePointer, Monitor, Smartphone, Tablet, Globe, Chrome } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DASHBOARD_STATS } from '@/lib/constant';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    viewsData: [],
    deviceData: [],
    pagePerformance: [],
    visitorStats: {
      locations: [],
      browsers: [],
      returning: 0,
      new: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setLoading(true);
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
    
        const options = {
          headers,
          credentials: 'include',
          mode: 'cors' // Explicitly set CORS mode
        };
    
        const [dashboardRes, visitorRes, pageViewsRes] = await Promise.all([
          fetch(`${DASHBOARD_STATS}`, options),
          fetch(`${DASHBOARD_STATS}`, options),
          fetch(`${DASHBOARD_STATS}?range=${timeRange}`, options)
        ]);
        // Rest of your code...
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
    const interval = setInterval(fetchAllStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center text-blue-600">
                  <Eye className="w-5 h-5 mr-2" />
                  <h3 className="text-sm font-medium">Total Views</h3>
                </div>
                <p className="text-2xl font-semibold mt-2">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center text-green-600">
                  <Users className="w-5 h-5 mr-2" />
                  <h3 className="text-sm font-medium">Unique Visitors</h3>
                </div>
                <p className="text-2xl font-semibold mt-2">
                  {stats.visitorStats.new + stats.visitorStats.returning}
                </p>
                <div className="flex text-sm text-gray-500 mt-1">
                  <span className="mr-2">New: {stats.visitorStats.new}</span>
                  <span>Returning: {stats.visitorStats.returning}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center text-yellow-600">
                  <MousePointer className="w-5 h-5 mr-2" />
                  <h3 className="text-sm font-medium">Bounce Rate</h3>
                </div>
                <p className="text-2xl font-semibold mt-2">{stats.bounceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center text-purple-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <h3 className="text-sm font-medium">Avg. Session</h3>
                </div>
                <p className="text-2xl font-semibold mt-2">{formatTime(stats.avgSessionDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic">
        <TabsList>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#0088FE" name="Views" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.deviceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.visitorStats.browsers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="browser" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.visitorStats.locations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Page Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Page</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3">Avg. Duration</th>
                  <th className="pb-3">Bounce Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.pagePerformance.map((page) => (
                  <tr key={page.page} className="border-b">
                    <td className="py-3">{page.page}</td>
                    <td>{page.views}</td>
                    <td>{formatTime(page.avgDuration)}</td>
                    <td>{page.bounceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;