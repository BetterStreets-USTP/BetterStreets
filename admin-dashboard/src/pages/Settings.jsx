import { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Mail, Globe, Key, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [settings, setSettings] = useState({
    siteName: 'BetterStreets Camaman-an',
    siteEmail: 'admin@betterstreets.local',
    notificationsEnabled: true,
    emailNotifications: true,
    autoAssignment: false,
    maintenanceMode: false,
    dataRetentionDays: 365,
    maxPhotoSize: 5,
    maxPhotosPerReport: 5
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    // Implement save logic with API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {isAdmin ? 'System Settings' : 'My Settings'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Configure system preferences and options' : 'Manage your profile and preferences'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker Profile - Only for non-admins */}
        {!isAdmin && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-600">View your account details</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900">
                    {user?.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <div className="px-4 py-3 bg-teal-50 border-2 border-teal-200 rounded-xl font-bold text-teal-700">
                    Barangay Staff
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-medium text-gray-900">
                    {user?.phone || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Settings - Admin Only */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
              <Globe className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">General</h2>
              <p className="text-sm text-gray-600">Basic system configuration</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Disable public access temporarily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>
        )}

        {/* Notifications */}
        {isAdmin && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100">
              <Bell className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-500 to-gray-500 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div>
                <p className="font-bold text-gray-900">Auto-Assignment</p>
                <p className="text-sm text-gray-600">Automatically assign reports to workers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoAssignment}
                  onChange={(e) => setSettings({ ...settings, autoAssignment: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-100"></div>
              </label>
            </div>
          </div>
        </div>
        )}

        {/* Data Management */}
        {isAdmin && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-gray-500">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Management</h2>
              <p className="text-sm text-gray-600">Configure data retention policies</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Data Retention (days)</label>
              <input
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-300 focus:ring-2 focus:ring-purple-200 transition-all duration-300 font-medium"
              />
              <p className="text-xs text-gray-500 mt-1">Reports older than this will be archived</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-teal-500 to-gray-500 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-gray-900">Database Size</p>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">2.4 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-gray-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Upload Settings */}
        {isAdmin && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
              <Mail className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Settings</h2>
              <p className="text-sm text-gray-600">Configure file upload limits</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Max Photo Size (MB)</label>
              <input
                type="number"
                value={settings.maxPhotoSize}
                onChange={(e) => setSettings({ ...settings, maxPhotoSize: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-300 focus:ring-2 focus:ring-amber-200 transition-all duration-300 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Max Photos Per Report</label>
              <input
                type="number"
                value={settings.maxPhotosPerReport}
                onChange={(e) => setSettings({ ...settings, maxPhotosPerReport: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-300 focus:ring-2 focus:ring-amber-200 transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Security Section */}
      {isAdmin && (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
            <Shield className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Security</h2>
            <p className="text-sm text-gray-600">Manage security and access controls</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors duration-300">
              <Key className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your admin password</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
            <div className="p-3 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 transition-colors duration-300">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Two-Factor Auth</p>
              <p className="text-sm text-gray-600">Enable 2FA for extra security</p>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* System Info */}
      {isAdmin && (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-4">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm opacity-90">Version</p>
            <p className="text-2xl font-black mt-1">1.0.0</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Uptime</p>
            <p className="text-2xl font-black mt-1">99.8%</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-2xl font-black mt-1">245</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Total Reports</p>
            <p className="text-2xl font-black mt-1">1,234</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
