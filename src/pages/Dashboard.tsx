
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCards from '@/components/dashboard/StatsCards';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'New Skin Analysis',
      description: 'Start a comprehensive skin analysis',
      icon: Camera,
      action: () => navigate('/scanning'),
      color: 'bg-coral-500 hover:bg-coral-600'
    },
    {
      title: 'Add Client',
      description: 'Register a new client',
      icon: Users,
      action: () => navigate('/clients'),
      color: 'bg-navy-600 hover:bg-navy-700'
    },
    {
      title: 'Schedule Appointment',
      description: 'Book new appointment',
      icon: Calendar,
      action: () => navigate('/appointments'),
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'View Analytics',
      description: 'Business performance metrics',
      icon: TrendingUp,
      action: () => navigate('/analytics'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-700 rounded-xl p-8 text-white">
          <h1 className="text-3xl font-playfair font-bold mb-2">
            Welcome to your Salon Dashboard
          </h1>
          <p className="text-navy-200 text-lg">
            Manage your clients, perform skin analyses, and grow your business
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="font-playfair text-navy-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  onClick={action.action}
                  className={`${action.color} text-white p-6 h-auto flex flex-col items-start space-y-2 transition-all duration-200 hover:transform hover:scale-105`}
                >
                  <action.icon size={24} />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
