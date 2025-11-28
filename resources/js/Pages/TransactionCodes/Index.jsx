import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import AppLayout from '@/Layouts/AppLayout';

export default function Index({ transactionCodes }) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingCode, setEditingCode] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        ca_sa: '',
        transaction_title: '',
        trans_definition: '',
    });

    // Show success message
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            });
        }
    }, [flash]);

    const handleOpenModal = (code = null) => {
        if (code) {
            setEditingCode(code);
            setFormData({
                ca_sa: code.ca_sa,
                transaction_title: code.transaction_title,
                trans_definition: code.trans_definition,
            });
        } else {
            setEditingCode(null);
            setFormData({
                ca_sa: '',
                transaction_title: '',
                trans_definition: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCode(null);
        setFormData({
            ca_sa: '',
            transaction_title: '',
            trans_definition: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCode) {
            router.put(`/transaction-codes/${editingCode.id}`, formData, {
                onSuccess: () => handleCloseModal(),
            });
        } else {
            router.post('/transaction-codes', formData, {
                onSuccess: () => handleCloseModal(),
            });
        }
    };

    const handleDelete = (code) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete transaction code "${code.ca_sa}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#002868',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/transaction-codes/${code.id}`);
            }
        });
    };

    const columns = [
        {
            name: 'CA/SA Code',
            selector: (row) => row.ca_sa,
            sortable: true,
            width: '150px',
            cell: (row) => (
                <span className="font-semibold text-[#002868]">{row.ca_sa}</span>
            ),
        },
        {
            name: 'Transaction Title',
            selector: (row) => row.transaction_title,
            sortable: true,
            width: '300px',
        },
        {
            name: 'Definition',
            selector: (row) => row.trans_definition,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Actions',
            width: '150px',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenModal(row)}
                        className="px-3 py-1 bg-[#002868] text-white rounded hover:bg-[#003580] transition-colors text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const filteredData = transactionCodes.filter(
        (item) =>
            item.ca_sa.toLowerCase().includes(searchText.toLowerCase()) ||
            item.transaction_title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.trans_definition.toLowerCase().includes(searchText.toLowerCase())
    );

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#002868',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
        rows: {
            style: {
                fontSize: '13px',
                '&:hover': {
                    backgroundColor: '#D4AF37',
                    color: '#002868',
                    cursor: 'pointer',
                },
            },
        },
        pagination: {
            style: {
                borderTop: '2px solid #002868',
            },
        },
    };

    return (
        <AppLayout>
            <Head title="Transaction Codes Configuration" />

            <div className="p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#002868]">Transaction Codes Configuration</h1>
                            <p className="text-gray-600 mt-1">Manage CA/SA transaction codes and definitions</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="px-6 py-3 bg-gradient-to-r from-[#002868] to-[#003580] text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Add New Code
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-[#D4AF37]">
                        <input
                            type="text"
                            placeholder="Search by code, title, or definition..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover
                        responsive
                        striped
                    />
                </motion.div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="bg-gradient-to-r from-[#002868] to-[#003580] text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                {editingCode ? 'Edit Transaction Code' : 'Add New Transaction Code'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-white hover:text-[#D4AF37] transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    CA/SA Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ca_sa}
                                    onChange={(e) => setFormData({ ...formData, ca_sa: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent"
                                    placeholder="e.g., CDEPC"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Transaction Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.transaction_title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, transaction_title: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent"
                                    placeholder="e.g., Deposit - Cash"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Transaction Definition <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.trans_definition}
                                    onChange={(e) =>
                                        setFormData({ ...formData, trans_definition: e.target.value })
                                    }
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent"
                                    placeholder="Enter the transaction definition..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-[#002868] to-[#003580] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                >
                                    {editingCode ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AppLayout>
    );
}
