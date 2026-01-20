import { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit, Trash2, Calendar, User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General', priority: 'normal', _id: null });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data.announcements || response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await api.put(`/announcements/${formData._id}`, {
          title: formData.title,
          content: formData.content,
          category: formData.category,
          priority: formData.priority
        });
        toast.success('Announcement updated successfully');
      } else {
        await api.post('/announcements', {
          title: formData.title,
          content: formData.content,
          category: formData.category || 'General',
          priority: formData.priority || 'normal'
        });
        toast.success('Announcement created successfully');
      }
      setShowModal(false);
      setFormData({ title: '', content: '', category: 'General', priority: 'normal', _id: null });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content || announcement.message,
      category: announcement.category || 'General',
      priority: announcement.priority || 'normal',
      _id: announcement._id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-emerald-500"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-t-4 border-teal-300" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="text-gray-600 mt-2">Manage community announcements and updates</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', content: '', category: 'General', priority: 'normal', _id: null });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:scale-110 transition-transform duration-300">
                <Megaphone className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors duration-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(announcement._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
              {announcement.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{announcement.content || announcement.message}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-4 h-4" />
                {announcement.author?.name || 'Admin'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {announcements.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Megaphone className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-600 mb-6">Create your first announcement to engage with the community</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            Create Announcement
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {formData._id ? 'Edit Announcement' : 'New Announcement'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium resize-none"
                  placeholder="Enter announcement message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                  >
                    <option value="General">General</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Event">Event</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Update">Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  {formData._id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
