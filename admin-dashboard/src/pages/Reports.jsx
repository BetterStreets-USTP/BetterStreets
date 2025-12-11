import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MapPin, 
  Calendar,
  User,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Road Damage',
    'Street Lighting',
    'Garbage/Waste',
    'Drainage/Flooding',
    'Sidewalk Issues',
    'Public Property Damage',
    'Illegal Dumping',
    'Other'
  ];

  const statuses = ['pending', 'in-progress', 'resolved', 'rejected'];

  useEffect(() => {
    fetchReports();
  }, [filters, page]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sort: '-createdAt'
      };
      
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await api.get('/reports', { params });
      const data = response.data.data || response.data.reports || response.data || [];
      const pagination = response.data.pagination || {};
      
      setReports(Array.isArray(data) ? data : []);
      setTotalPages(pagination.pages || response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border border-teal-300',
      'in-progress': 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-300',
      resolved: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-400',
      rejected: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-300'
    };
    return badges[status] || 'bg-emerald-50 text-emerald-700';
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', category: '' });
    setPage(1);
  };

  const handleExport = () => {
    toast.success('Exporting reports...');
    // Implement export logic
  };

  const statsData = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Reports Management
          </h1>
          <p className="text-gray-600 mt-2">Monitor and manage all community reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchReports()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-semibold opacity-90">Total Reports</p>
          <p className="text-3xl font-black mt-2">{statsData.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-semibold opacity-90">Pending</p>
          <p className="text-3xl font-black mt-2">{statsData.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-semibold opacity-90">In Progress</p>
          <p className="text-3xl font-black mt-2">{statsData.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p className="text-sm font-semibold opacity-90">Resolved</p>
          <p className="text-3xl font-black mt-2">{statsData.resolved}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        {(filters.search || filters.status || filters.category) && (
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm font-semibold text-gray-600">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                  Search: {filters.search}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, search: '' })} />
                </span>
              )}
              {filters.status && (
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                  Status: {filters.status}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, status: '' })} />
                </span>
              )}
              {filters.category && (
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                  Category: {filters.category}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters({ ...filters, category: '' })} />
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500"></div>
              <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-teal-300" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No reports found</p>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Reporter</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {report.photos && report.photos.length > 0 ? (
                            <img
                              src={getImageUrl(report.photos[0].path)}
                              alt="Report"
                              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-200 group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => handleImageError(e, 'No Image')}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-emerald-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors duration-300">
                              {report.title}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">#{report._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                            {report.reporter?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {report.reporter?.name || 'Anonymous'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-700">{report.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 text-xs font-black rounded-full ${getStatusBadge(report.status)}`}>
                          {report.status.toUpperCase().replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span className="truncate max-w-[150px] font-medium">
                            {report.location?.address || 'No address'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-semibold">
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/reports/${report._id}`)}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-semibold transform hover:scale-105"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium">
                Showing page <span className="font-bold text-gray-900">{page}</span> of{' '}
                <span className="font-bold text-gray-900">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
