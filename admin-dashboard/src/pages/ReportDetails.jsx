import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', remarks: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reports/${id}`);
      const reportData = response.data.data || response.data.report || response.data;
      console.log('Report data:', reportData);
      setReport(reportData);
      setStatusUpdate({ 
        status: reportData?.status || 'pending', 
        assignedAgency: reportData?.assignedAgency || null,
        remarks: '' 
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report details');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/reports/${id}/status`, {
        status: statusUpdate.status,
        assignedAgency: statusUpdate.assignedAgency,
        adminNotes: statusUpdate.remarks
      });
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      fetchReportDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await api.delete(`/reports/${id}`);
      toast.success('Report deleted successfully');
      navigate('/reports');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'from-teal-500 to-emerald-500',
      'in-progress': 'from-blue-500 to-indigo-500',
      resolved: 'from-emerald-600 to-teal-600',
      rejected: 'from-red-500 to-red-600'
    };
    return colors[status] || 'from-emerald-500 to-teal-500';
  };

  const getStatusIcon = (status, size = 'w-5 h-5') => {
    const icons = {
      pending: Clock,
      'in-progress': AlertCircle,
      resolved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className={size} />;
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

  if (!report) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
        <p className="text-gray-600 mb-6">The report you're looking for doesn't exist</p>
        <button
          onClick={() => navigate('/reports')}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
            <p className="text-gray-600 mt-1 font-mono">Report ID: #{report._id.slice(-8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
          >
            <AlertCircle className="w-4 h-4" />
            Update Status
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className={`bg-gradient-to-r ${getStatusColor(report.status)} rounded-2xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold opacity-90 uppercase tracking-wide">Current Status</p>
                <p className="text-3xl font-black mt-2 flex items-center gap-3">
                  {getStatusIcon(report.status, 'w-8 h-8')}
                  {report.status.toUpperCase().replace('-', ' ')}
                </p>
              </div>
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {getStatusIcon(report.status, 'w-10 h-10')}
              </div>
            </div>
          </div>

          {/* Photos */}
          {report.photos && report.photos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">Photos</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {report.photos.map((photo, idx) => {
                  const imageUrl = getImageUrl(photo.path);
                  console.log('Photo URL:', imageUrl); // Debug log
                  return (
                  <div key={idx} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Report photo ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 group-hover:border-emerald-500 transition-all duration-300"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        handleImageError(e, 'Image Not Found');
                      }}
                      onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => {
                          setSelectedImage(imageUrl);
                          setSelectedImageIndex(idx);
                          setShowImageModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-all duration-300"
                      >
                        View Full
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Report Timeline</h2>
            </div>
            {report.statusHistory && report.statusHistory.length > 0 ? (
              <div className="space-y-6">
                {report.statusHistory.slice().reverse().map((history, index) => {
                  const isLast = index === report.statusHistory.length - 1;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(history.status)} flex items-center justify-center text-white shadow-lg`}>
                          {getStatusIcon(history.status, 'w-6 h-6')}
                        </div>
                        {!isLast && (
                          <div className="w-0.5 h-full bg-gray-300 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-lg font-bold uppercase tracking-wide text-transparent bg-gradient-to-r ${getStatusColor(history.status)} bg-clip-text`}>
                            {history.status.replace('-', ' ')}
                          </h3>
                          <p className="text-sm font-semibold text-gray-500">
                            {new Date(history.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {history.remarks && (
                          <p className="text-gray-700 leading-relaxed mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            {history.remarks}
                          </p>
                        )}
                        {history.assignedAgency && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full font-semibold">
                              📋 {history.assignedAgency}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getStatusColor(report.status)} flex items-center justify-center text-white`}>
                      {getStatusIcon(report.status)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      Current Status: <span className={`text-transparent bg-gradient-to-r ${getStatusColor(report.status)} bg-clip-text`}>
                        {report.status.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Created: {new Date(report.createdAt).toLocaleString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reporter Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-bold text-gray-900">{report.reporter?.name || 'Anonymous'}</p>
                </div>
              </div>
              {report.reporter?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-gray-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-bold text-gray-900 text-sm">{report.reporter.email}</p>
                  </div>
                </div>
              )}
              {report.reporter?.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-bold text-gray-900">{report.reporter.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Location Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-bold text-gray-900">{report.location?.address || 'No address provided'}</p>
                </div>
              </div>
              {report.location?.coordinates && (
                <>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Coordinates</p>
                    <p className="text-sm font-mono text-gray-900">
                      Lat: {report.location.coordinates[1]?.toFixed(6)}
                    </p>
                    <p className="text-sm font-mono text-gray-900">
                      Lng: {report.location.coordinates[0]?.toFixed(6)}
                    </p>
                  </div>
                  
                  {/* Map View */}
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200" style={{ height: '300px' }}>
                    <MapContainer
                      center={[report.location.coordinates[1], report.location.coordinates[0]]}
                      zoom={16}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[report.location.coordinates[1], report.location.coordinates[0]]}>
                        <Popup>
                          <div className="p-2">
                            <p className="font-bold text-gray-900">{report.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{report.location.address}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {report.location.coordinates[1]?.toFixed(6)}, {report.location.coordinates[0]?.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="bg-gradient-to-br from-teal-500 to-gray-500 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm font-semibold opacity-90">Category</p>
            <p className="text-2xl font-black mt-2">{report.category}</p>
          </div>

          {/* Assigned Agency */}
          {report.assignedAgency && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-sm font-semibold opacity-90">Assigned To</p>
              <p className="text-xl font-black mt-2">{report.assignedAgency}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Update Report Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Agency</label>
                <select
                  value={statusUpdate.assignedAgency || ''}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, assignedAgency: e.target.value || null })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium"
                >
                  <option value="">Not Yet Assigned</option>
                  <option value="Barangay Maintenance Team">Barangay Maintenance Team</option>
                  <option value="Sanitation Department">Sanitation Department</option>
                  <option value="Traffic Management">Traffic Management</option>
                  <option value="Engineering Office">Engineering Office</option>
                  <option value="Health Services">Health Services</option>
                  <option value="Peace and Order">Peace and Order</option>
                  <option value="Social Welfare">Social Welfare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={statusUpdate.remarks}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 font-medium resize-none"
                  placeholder="Add remarks about this status change..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <XCircle className="w-6 h-6" />
            </button>

            {/* Image counter */}
            {report.photos && report.photos.length > 1 && (
              <div className="absolute top-4 left-4 z-10 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg">
                {selectedImageIndex + 1} / {report.photos.length}
              </div>
            )}

            {/* Navigation buttons */}
            {report.photos && report.photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : report.photos.length - 1;
                    setSelectedImageIndex(newIndex);
                    const photo = report.photos[newIndex];
                    setSelectedImage(getImageUrl(photo.path || photo));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = selectedImageIndex < report.photos.length - 1 ? selectedImageIndex + 1 : 0;
                    setSelectedImageIndex(newIndex);
                    const photo = report.photos[newIndex];
                    setSelectedImage(getImageUrl(photo.path || photo));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-all duration-300 shadow-lg rotate-180"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt="Full size report photo"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => handleImageError(e, 'Image Not Found')}
              />
            </div>

            {/* Download button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href={selectedImage}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-lg flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageIcon className="w-5 h-5" />
                Open Original
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
