
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Camera, DollarSign, TrendingUp } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

const StatsCards = () => {
  const stats: StatCard[] = [
    {
      title: 'Total Clients',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: <Users className="h-6 w-6 text-coral-500" />,
      description: 'from last month'
    },
    {
      title: 'Analyses Today',
      value: '18',
      change: '+4',
      changeType: 'positive',
      icon: <Camera className="h-6 w-6 text-coral-500" />,
      description: 'scans completed'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      change: '+8.2%',
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6 text-coral-500" />,
      description: 'this month'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <TrendingUp className="h-6 w-6 text-coral-500" />,
      description: 'client retention'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className="hover:shadow-lg transition-shadow duration-200 border-0 bg-white/80 backdrop-blur-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold text-navy-900">
                {stat.value}
              </div>
              <Badge 
                variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                className={
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                }
              >
                {stat.change}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
