import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Map,
  Megaphone,
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', gradient: 'from-emerald-500 to-teal-500' },
    { icon: FileText, label: 'Reports', path: '/reports', gradient: 'from-teal-500 to-emerald-500' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', gradient: 'from-teal-500 to-emerald-600' },
    { icon: Map, label: 'Heatmap', path: '/heatmap', gradient: 'from-emerald-500 to-teal-600' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements', gradient: 'from-teal-600 to-emerald-600' },
    { icon: FolderTree, label: 'Categories', path: '/categories', gradient: 'from-teal-500 to-emerald-500' },
    { icon: Settings, label: 'Settings', path: '/settings', gradient: 'from-emerald-600 to-teal-600' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-40 transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        } border-r border-gray-200`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="BetterStreets" 
                className="w-10 h-10 rounded-xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  BetterStreets
                </h1>
                <p className="text-xs text-gray-600 font-semibold">Admin Dashboard</p>
              </div>
            </div>
          ) : (
            <img 
              src="/logo.png" 
              alt="BetterStreets" 
              className="w-10 h-10 rounded-xl object-cover shadow-lg mx-auto"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="py-6 px-3 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  active
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-105'
                }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-transform duration-300 ${
                    active ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />
                {sidebarOpen && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="font-bold text-sm">{item.label}</span>
                    {active && <ChevronRight className="w-4 h-4 animate-pulse" />}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-bold ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-6 h-6" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'ml-72' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="h-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300 transform hover:scale-110"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-emerald-600" />
            ) : (
              <Menu className="w-6 h-6 text-emerald-600" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
