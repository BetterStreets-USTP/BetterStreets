import { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keywords: '',
    color: '#10b981',
    _id: null
  });

  const colorOptions = [
    { name: 'Emerald', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Indigo', value: '#6366f1' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories if API fails
      setCategories([
        { _id: '1', name: 'Road Damage', description: 'Potholes, cracks, uneven surfaces', keywords: ['pothole', 'crack', 'road'], color: '#ef4444' },
        { _id: '2', name: 'Street Lighting', description: 'Broken or non-functional street lights', keywords: ['light', 'street lamp', 'dark'], color: '#f59e0b' },
        { _id: '3', name: 'Garbage/Waste', description: 'Uncollected garbage and waste issues', keywords: ['garbage', 'trash', 'waste'], color: '#10b981' },
        { _id: '4', name: 'Drainage/Flooding', description: 'Clogged drains and flooding', keywords: ['drain', 'flood', 'water'], color: '#3b82f6' },
        { _id: '5', name: 'Sidewalk Issues', description: 'Damaged or obstructed sidewalks', keywords: ['sidewalk', 'pathway', 'walkway'], color: '#8b5cf6' },
        { _id: '6', name: 'Public Property Damage', description: 'Vandalism and property damage', keywords: ['vandalism', 'graffiti', 'damage'], color: '#ec4899' },
        { _id: '7', name: 'Illegal Dumping', description: 'Unauthorized waste disposal', keywords: ['dump', 'illegal', 'waste'], color: '#dc2626' },
        { _id: '8', name: 'Other', description: 'Other community issues', keywords: ['other', 'misc'], color: '#6b7280' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
    
    try {
      if (formData._id && !formData._id.match(/^\d+$/)) {
        await api.put(`/categories/${formData._id}`, {
          name: formData.name,
          description: formData.description,
          keywords,
          color: formData.color
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', {
          name: formData.name,
          description: formData.description,
          keywords,
          color: formData.color
        });
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setFormData({ name: '', description: '', keywords: '', color: '#10b981', _id: null });
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      keywords: Array.isArray(category.keywords) ? category.keywords.join(', ') : '',
      color: category.color || '#10b981',
      _id: category._id
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
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
            Categories & Keywords
          </h1>
          <p className="text-gray-600 mt-2">Manage report categories and auto-classification keywords</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', description: '', keywords: '', color: '#10b981', _id: null });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${category.color}20`, border: `3px solid ${category.color}` }}
              >
                <FolderTree className="w-8 h-8" style={{ color: category.color }} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors duration-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text transition-all duration-300">
              {category.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {category.description || 'No description'}
            </p>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-gray-700">Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(category.keywords) && category.keywords.length > 0 ? (
                  category.keywords.slice(0, 3).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        color: category.color
                      }}
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500 italic">No keywords</span>
                )}
                {Array.isArray(category.keywords) && category.keywords.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                    +{category.keywords.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {formData._id && !formData._id.match(/^\d+$/) ? 'Edit Category' : 'New Category'}
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                  placeholder="e.g., Road Damage"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium resize-none"
                  placeholder="Brief description of this category"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                  placeholder="e.g., pothole, crack, damage"
                />
                <p className="text-xs text-gray-500 mt-1">Used for auto-classification of reports</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-full h-12 rounded-xl transition-all duration-300 ${
                        formData.color === color.value 
                          ? 'ring-4 ring-offset-2 scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: color.value,
                        ringColor: color.value
                      }}
                      title={color.name}
                    />
                  ))}
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
                  {formData._id && !formData._id.match(/^\d+$/) ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
