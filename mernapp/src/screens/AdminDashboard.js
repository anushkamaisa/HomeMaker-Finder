/* src/screens/AdminDashboard.js */
import React, { useState, useEffect } from "react";
import { Users, ChefHat, Utensils, TrendingUp, AlertCircle, ShieldCheck, Trash2, Search, Mail, Phone, MapPin } from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalHomemakers: 0,
        totalFoodItems: 0
    });
    const [homemakers, setHomemakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleting, setIsDeleting] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, hmRes] = await Promise.all([
                axios.post(`${BASE_URL}/api/admin/stats`),
                axios.get(`${BASE_URL}/api/admin/homemakers`)
            ]);
            setStats(statsRes.data);
            setHomemakers(hmRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHomemaker = async (id) => {
        if (!window.confirm("Are you sure you want to delete this homemaker? This will also delete all their dishes.")) {
            return;
        }

        try {
            setIsDeleting(id);
            await axios.delete(`${BASE_URL}/api/admin/homemaker/${id}`);
            // Refresh data
            fetchData();
        } catch (error) {
            console.error("Error deleting homemaker:", error);
            alert("Failed to delete homemaker");
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredHomemakers = homemakers.filter(hm => 
        hm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hm.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '20px', backgroundColor: 'white' }}>
            <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-4" style={{ backgroundColor: `${color}15`, color: color }}>
                    <Icon size={32} />
                </div>
                <div>
                    <p className="text-muted mb-1 fw-medium" style={{ fontSize: '0.9rem' }}>{label}</p>
                    <h3 className="mb-0 fw-bold" style={{ color: '#111827' }}>{value}</h3>
                </div>
            </div>
            <div className="mt-3 pt-3 border-top d-flex align-items-center gap-2 text-success" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                <TrendingUp size={14} />
                <span>+12% from last month</span>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard-page" style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '3rem 1.5rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-3 bg-dark text-white">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="fw-800 mb-0" style={{ fontSize: '2rem', letterSpacing: '-1px' }}>Admin Dashboard</h1>
                            <p className="text-muted mb-0">Platform performance and overview</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Row */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <StatCard icon={Users} label="Total Customers" value={stats.totalUsers} color="#3B82F6" />
                            </div>
                            <div className="col-md-4">
                                <StatCard icon={ChefHat} label="Total Cooks" value={stats.totalHomemakers} color="#F97316" />
                            </div>
                            <div className="col-md-4">
                                <StatCard icon={Utensils} label="Total Dishes" value={stats.totalFoodItems} color="#10B981" />
                            </div>
                        </div>

                        {/* Homemaker Management Section */}
                        <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: '24px', backgroundColor: 'white' }}>
                            <div className="card-body p-4">
                                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                                    <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Homemaker Management</h2>
                                    <div className="position-relative" style={{ minWidth: '300px' }}>
                                        <Search className="position-absolute text-muted" size={18} style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input 
                                            type="text" 
                                            className="form-control ps-5 border-0 bg-light" 
                                            placeholder="Search by name or email..." 
                                            style={{ borderRadius: '12px', padding: '10px' }}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 px-4 py-3" style={{ borderRadius: '12px 0 0 12px' }}>Homemaker Details</th>
                                                <th className="border-0 py-3">Contact Info</th>
                                                <th className="border-0 py-3 text-center">Dishes Count</th>
                                                <th className="border-0 py-3">Status</th>
                                                <th className="border-0 px-4 py-3 text-end" style={{ borderRadius: '0 12px 12px 0' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="border-top-0">
                                            {filteredHomemakers.length > 0 ? filteredHomemakers.map((hm) => (
                                                <tr key={hm._id}>
                                                    <td className="px-4 py-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                                                <ChefHat size={22} className="text-secondary" />
                                                            </div>
                                                            <div>
                                                                <h6 className="fw-bold mb-0">{hm.name}</h6>
                                                                <small className="text-muted">ID: {hm._id.slice(-6).toUpperCase()}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex flex-column gap-1">
                                                            <div className="d-flex align-items-center gap-2 small text-muted">
                                                                <Mail size={14} /> {hm.email}
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2 small text-muted">
                                                                <Phone size={14} /> {hm.phone || "N/A"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success fw-bold px-3 py-2">
                                                            {hm.dishCount} Dishes
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-bold px-3 py-2">
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td className="px-4 text-end">
                                                        <button 
                                                            className="btn btn-light text-danger rounded-3 p-2 border-0"
                                                            style={{ transition: '0.2s' }}
                                                            onClick={() => handleDeleteHomemaker(hm._id)}
                                                            disabled={isDeleting === hm._id}
                                                            title="Delete Homemaker"
                                                        >
                                                            {isDeleting === hm._id ? (
                                                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                                            ) : (
                                                                <Trash2 size={20} />
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <ChefHat size={48} className="mb-3 opacity-25" />
                                                            <p className="mb-0">No homemakers found matching your search.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notice */}
                        <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3 p-4" style={{ borderRadius: '20px', backgroundColor: 'white' }}>
                            <AlertCircle className="text-info" size={24} />
                            <div>
                                <h5 className="mb-1 fw-bold">Admin Notice</h5>
                                <p className="mb-0 text-muted">All management actions are logged. Deleting a homemaker is permanent and will remove all their published dishes from the platform.</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
