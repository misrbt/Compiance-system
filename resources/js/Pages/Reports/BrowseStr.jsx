import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FileText, Plus, Calendar, CheckCircle, XCircle, Clock, Filter, X, Eye } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';

const route = (name, params) => {
    const routes = {
        'reports.show': (id) => `/reports/${id}/view-ctr-report`,
    };
    return routes[name] ? routes[name](params) : '#';
};

export default function BrowseStr({ reports, filters }) {
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');

    const getStatusBadge = (status) => {
        const badges = {
            draft: { color: 'bg-gray-500', icon: Clock, text: 'Draft' },
            submitted: { color: 'bg-blue-500', icon: FileText, text: 'Submitted' },
            approved: { color: 'bg-green-500', icon: CheckCircle, text: 'Approved' },
            rejected: { color: 'bg-red-500', icon: XCircle, text: 'Rejected' },
        };

        const badge = badges[status] || badges.draft;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${badge.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {badge.text}
            </span>
        );
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleFilter = () => {
        router.get('/reports/browse-str', {
            date_from: dateFrom,
            date_to: dateTo,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setStatusFilter('');
        router.get('/reports/browse-str', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = dateFrom || dateTo || statusFilter;

    return (
        <AppLayout>
            <Head title="Browse STR Reports" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-bold text-[#DC2626]">STR Reports</h1>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#DC2626] text-white text-sm font-medium">
                                Suspicious Transaction Report
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">View and manage your STR submissions</p>
                    </div>
                    <Link
                        href="/reports/select-transaction-type?type=STR"
                        className="inline-flex items-center px-4 py-2 bg-[#DC2626] hover:bg-[#001a4d] text-white rounded-md transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Submit New STR
                    </Link>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex items-center mb-3">
                        <Filter className="w-5 h-5 text-[#DC2626] mr-2" />
                        <h3 className="text-lg font-semibold text-[#DC2626]">Filter by Submission Date</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date From
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date To
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Clear Filters
                            </button>
                        )}
                        <button
                            onClick={handleFilter}
                            className="inline-flex items-center px-4 py-2 bg-[#DC2626] hover:bg-[#001a4d] text-white rounded-md transition-colors"
                        >
                            <Filter className="w-4 h-4 mr-1" />
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Reports Table */}
                {reports.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No STR reports found</h3>
                        <p className="text-gray-500 mb-6">
                            {hasActiveFilters ? 'Try adjusting your filters or clear them to see all reports' : 'Get started by submitting your first STR report'}
                        </p>
                        <Link
                            href="/reports/select-transaction-type?type=STR"
                            className="inline-flex items-center px-4 py-2 bg-[#DC2626] hover:bg-[#001a4d] text-white rounded-md transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Submit New STR
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-medium text-gray-900">{reports.length}</span> STR {reports.length === 1 ? 'report' : 'reports'}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submission Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transactions
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 text-[#DC2626] mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {formatDate(report.submission_date)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.transactions?.length || 0} transaction(s)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(report.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('reports.show', report.id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-md transition-colors text-sm"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Link>
                                                    {report.status === 'draft' && (
                                                        <button
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: 'Are you sure?',
                                                                    text: "You won't be able to revert this!",
                                                                    icon: 'warning',
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: '#DC2626',
                                                                    cancelButtonColor: '#6b7280',
                                                                    confirmButtonText: 'Yes, delete it!'
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        router.delete(`/reports/${report.id}`, {
                                                                            onSuccess: () => {
                                                                                Swal.fire({
                                                                                    icon: 'success',
                                                                                    title: 'Deleted!',
                                                                                    text: 'Report has been deleted.',
                                                                                    timer: 2000,
                                                                                    showConfirmButton: false,
                                                                                    toast: true,
                                                                                    position: 'top-end'
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }}
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
