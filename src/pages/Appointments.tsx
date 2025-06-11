
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, User } from 'lucide-react';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock appointment data
  const appointments = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      service: 'Facial Analysis + Treatment',
      time: '10:00 AM',
      duration: '60 min',
      status: 'confirmed',
      date: '2024-06-11'
    },
    {
      id: '2',
      clientName: 'Emily Davis',
      service: 'Skin Consultation',
      time: '2:00 PM',
      duration: '30 min',
      status: 'pending',
      date: '2024-06-11'
    },
    {
      id: '3',
      clientName: 'Jessica Wilson',
      service: 'Follow-up Treatment',
      time: '4:30 PM',
      duration: '45 min',
      status: 'confirmed',
      date: '2024-06-11'
    }
  ];

  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-playfair font-bold text-navy-900">
            Appointments
          </h1>
          <Button className="bg-coral-500 hover:bg-coral-600 text-white">
            <Plus size={20} className="mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Date Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" size={20} />
              Schedule for {new Date(selectedDate).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="grid gap-4">
          {todayAppointments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No appointments scheduled for this date</p>
              </CardContent>
            </Card>
          ) : (
            todayAppointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-coral-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-900">{appointment.clientName}</h3>
                        <p className="text-gray-600">{appointment.service}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {appointment.time}
                        </span>
                        <span>({appointment.duration})</span>
                      </div>
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                      >
                        {appointment.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
