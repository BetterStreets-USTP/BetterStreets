import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { MapPin, Filter, Layers } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';
import api from '../services/api';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Heatmap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [center] = useState([8.4542, 124.6319]); // Cagayan de Oro City coordinates

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports', { params: { limit: 1000 } });
      const data = response.data.data || response.data.reports || response.data || [];
      const reportsWithCoords = Array.isArray(data) 
        ? data.filter(r => r.location?.coordinates && r.location.coordinates.length === 2)
        : [];
      setReports(reportsWithCoords);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load map data');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const getMarkerColor = (status) => {
    const colors = {
      pending: '#14B8A6',
      'in-progress': '#06B6D4',
      resolved: '#10b981',
      rejected: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const customIcon = (status) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${getMarkerColor(status)};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
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
            Heatmap Visualization
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Geographic distribution of community reports
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent border-none focus:ring-0 font-semibold text-gray-900"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-3xl font-black mt-1">{reports.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-gray-100"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">In Progress</p>
              <p className="text-3xl font-black mt-1">{reports.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-teal-300"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Resolved</p>
              <p className="text-3xl font-black mt-1">{reports.filter(r => r.status === 'resolved').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Rejected</p>
              <p className="text-3xl font-black mt-1">{reports.filter(r => r.status === 'rejected').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredReports.map((report) => (
            <Marker
              key={report._id}
              position={[report.location.coordinates[1], report.location.coordinates[0]]}
              icon={customIcon(report.status)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.category}</p>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                    report.status === 'in-progress' ? 'bg-cyan-100 text-cyan-700' :
                    report.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Legend</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-white shadow"></div>
            <span className="text-sm font-medium text-gray-700">Pending</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow"></div>
            <span className="text-sm font-medium text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
            <span className="text-sm font-medium text-gray-700">Resolved</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"></div>
            <span className="text-sm font-medium text-gray-700">Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
