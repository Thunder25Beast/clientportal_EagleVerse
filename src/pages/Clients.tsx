
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Phone, Mail, Calendar, User } from 'lucide-react';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock client data
  const clients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      lastVisit: '2024-06-10',
      totalVisits: 5,
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 234-5678',
      lastVisit: '2024-06-08',
      totalVisits: 3,
      status: 'active',
      avatar: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Jessica Wilson',
      email: 'jessica@example.com',
      phone: '+1 (555) 345-6789',
      lastVisit: '2024-05-15',
      totalVisits: 8,
      status: 'inactive',
      avatar: '/placeholder.svg'
    }
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-playfair font-bold text-navy-900">
            Client Management
          </h1>
          <Button className="bg-coral-500 hover:bg-coral-600 text-white">
            <Plus size={20} className="mr-2" />
            Add New Client
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Client List */}
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-coral-500 text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-navy-900">{client.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Mail size={14} className="mr-1" />
                          {client.email}
                        </span>
                        <span className="flex items-center">
                          <Phone size={14} className="mr-1" />
                          {client.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-sm">
                      <p className="text-gray-600">Last Visit: {client.lastVisit}</p>
                      <p className="text-gray-600">Total Visits: {client.totalVisits}</p>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <User size={16} className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar size={16} className="mr-1" />
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
