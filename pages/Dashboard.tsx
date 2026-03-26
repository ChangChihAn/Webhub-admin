import React from 'react';
import { Users, LayoutGrid, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Apps" value="1,248" icon={LayoutGrid} color="bg-blue-500" />
        <StatCard title="Pending Reviews" value="12" icon={Clock} color="bg-amber-500" />
        <StatCard title="Active Developers" value="843" icon={Users} color="bg-indigo-500" />
        <StatCard title="Approved Today" value="45" icon={CheckCircle2} color="bg-green-500" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">App "SuperTask" submitted for review</p>
                      <p className="text-xs text-slate-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">API Latency</span>
                <span className="text-green-600 font-medium">45ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Storage Usage</span>
                <span className="text-slate-900 font-medium">45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pending Jobs</span>
                <span className="text-slate-900 font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;