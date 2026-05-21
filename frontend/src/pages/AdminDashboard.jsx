import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { LogOut, ExternalLink, Building2, FlaskConical, FileText, Users, Newspaper, Inbox, Youtube } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LabInfoTab from '../components/admin/LabInfoTab';
import ResearchFocusTab from '../components/admin/ResearchFocusTab';
import PublicationsTab from '../components/admin/PublicationsTab';
import LabMembersTab from '../components/admin/LabMembersTab';
import NewsTab from '../components/admin/NewsTab';
import SubmissionsTab from '../components/admin/SubmissionsTab';
import VideosTab from '../components/admin/VideosTab';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lab-info');

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const tabs = [
    { value: 'lab-info', label: 'Lab Info', icon: Building2, component: LabInfoTab },
    { value: 'research', label: 'Research', icon: FlaskConical, component: ResearchFocusTab },
    { value: 'publications', label: 'Publications', icon: FileText, component: PublicationsTab },
    { value: 'members', label: 'Members', icon: Users, component: LabMembersTab },
    { value: 'videos', label: 'Videos', icon: Youtube, component: VideosTab },
    { value: 'news', label: 'News', icon: Newspaper, component: NewsTab },
    { value: 'submissions', label: 'Inbox', icon: Inbox, component: SubmissionsTab },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
                <FlaskConical className="text-white" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-sm sm:text-base">Admin Dashboard</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Laboratory for Multiscale Innovative Technologies</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')} data-testid="view-site-button">
                <ExternalLink className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">View Site</span>
              </Button>
              <div className="hidden md:block text-right">
                <p className="text-xs text-slate-500">Signed in as</p>
                <p className="text-sm font-medium text-slate-700">{admin?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="logout-button" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                <LogOut className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto bg-white border border-gray-200 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  data-testid={`tab-${tab.value}`}
                  className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
