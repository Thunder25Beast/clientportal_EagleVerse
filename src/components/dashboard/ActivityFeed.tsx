
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'analysis' | 'appointment' | 'payment' | 'client';
  title: string;
  description: string;
  clientName: string;
  clientAvatar?: string;
  timestamp: Date;
  value?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const ActivityFeed = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Skin Analysis Completed',
      description: 'Full facial analysis with treatment recommendations',
      clientName: 'Emma Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'completed',
      value: '$85'
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Facial Treatment Scheduled',
      description: 'Hydrating facial treatment appointment',
      clientName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'pending'
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: 'Acne treatment package payment',
      clientName: 'Michael Chen',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      status: 'completed',
      value: '$245'
    },
    {
      id: '4',
      type: 'client',
      title: 'New Client Registration',
      description: 'Profile created and initial consultation booked',
      clientName: 'Jessica Davis',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      status: 'completed'
    },
    {
      id: '5',
      type: 'analysis',
      title: 'Follow-up Analysis',
      description: 'Progress tracking scan after treatment',
      clientName: 'Robert Wilson',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      status: 'completed',
      value: '$60'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis':
        return '🔬';
      case 'appointment':
        return '📅';
      case 'payment':
        return '💳';
      case 'client':
        return '👤';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="h-[600px] overflow-hidden bg-white/80 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="font-playfair text-navy-900">Recent Activity</CardTitle>
        <CardDescription>
          Latest client interactions and business updates
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[500px] space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50/50 transition-colors"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={activity.clientAvatar} />
              <AvatarFallback className="bg-coral-100 text-coral-700">
                {activity.clientName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                  <h4 className="text-sm font-medium text-navy-900 truncate">
                    {activity.title}
                  </h4>
                </div>
                {activity.value && (
                  <span className="text-sm font-medium text-coral-600">
                    {activity.value}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-navy-700">
                    {activity.clientName}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
