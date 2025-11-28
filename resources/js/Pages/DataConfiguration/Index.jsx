import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import Swal from 'sweetalert2';
import { X, Plus, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { cn } from '@/lib/utils';

export default function Index({ transactionCodes, idTypes, sourceOfFunds, cities, countryCodes, partyFlags, modeOfTransactions, participatingBanks, nameFlags }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('transactionCodes');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentTable, setCurrentTable] = useState('transactionCodes');
    const [formData, setFormData] = useState({});

    const tables = {
        transactionCodes: { title: 'Transaction Codes', data: transactionCodes, columns: [{ accessorKey: 'ca_sa', header: 'Code' }, { accessorKey: 'transaction_title', header: 'Title' }, { accessorKey: 'trans_definition', header: 'Definition' }], fields: ['ca_sa', 'transaction_title', 'trans_definition'], routePrefix: 'transaction-codes' },
        idTypes: { title: 'ID Types', data: idTypes, columns: [{ accessorKey: 'id_code', header: 'Code' }, { accessorKey: 'title', header: 'Title' }], fields: ['id_code', 'title'], routePrefix: 'id-types' },
        sourceOfFunds: { title: 'Source of Funds', data: sourceOfFunds, columns: [{ accessorKey: 'sof_code', header: 'Code' }, { accessorKey: 'title', header: 'Title' }], fields: ['sof_code', 'title'], routePrefix: 'source-of-funds' },
        cities: { title: 'Cities', data: cities, columns: [{ accessorKey: 'ccode', header: 'Code' }, { accessorKey: 'name_of_city', header: 'City Name' }], fields: ['ccode', 'name_of_city'], routePrefix: 'cities' },
        countryCodes: { title: 'Country Codes', data: countryCodes, columns: [{ accessorKey: 'value', header: 'Code' }, { accessorKey: 'country_name', header: 'Country Name' }], fields: ['value', 'country_name'], routePrefix: 'country-codes' },
        partyFlags: { title: 'Party Flags', data: partyFlags, columns: [{ accessorKey: 'par_code', header: 'Code' }, { accessorKey: 'details', header: 'Details' }], fields: ['par_code', 'details'], routePrefix: 'party-flags' },
        modeOfTransactions: { title: 'Mode of Transactions', data: modeOfTransactions, columns: [{ accessorKey: 'mod_code', header: 'Code' }, { accessorKey: 'mode_of_transaction', header: 'Mode' }, { accessorKey: 'description', header: 'Description' }], fields: ['mod_code', 'mode_of_transaction', 'description'], routePrefix: 'mode-of-transactions' },
        participatingBanks: { title: 'Participating Banks', data: participatingBanks, columns: [{ accessorKey: 'bank_code', header: 'Code' }, { accessorKey: 'bank', header: 'Bank Name' }], fields: ['bank_code', 'bank'], routePrefix: 'participating-banks' },
        nameFlags: { title: 'Name Flags', data: nameFlags, columns: [{ accessorKey: 'name_flag_code', header: 'Code' }, { accessorKey: 'description', header: 'Description' }], fields: ['name_flag_code', 'description'], routePrefix: 'name-flags' },
    };

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({ icon: 'success', title: 'Success!', text: flash.success, timer: 2000, showConfirmButton: false, toast: true, position: 'top-end' });
        }
    }, [flash]);

    const handleOpenModal = (tableName, item = null) => {
        setCurrentTable(tableName);
        if (item) {
            setEditingItem(item);
            const initialData = {};
            tables[tableName].fields.forEach(field => { initialData[field] = item[field] || ''; });
            setFormData(initialData);
        } else {
            setEditingItem(null);
            const initialData = {};
            tables[tableName].fields.forEach(field => { initialData[field] = ''; });
            setFormData(initialData);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        setCurrentTable('transactionCodes');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const table = tables[currentTable];
        if (editingItem) {
            router.put(`/data-configuration/${table.routePrefix}/${editingItem.id}`, formData, {
                onSuccess: () => {
                    handleCloseModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: `${table.title} has been updated successfully.`,
                        timer: 2000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                }
            });
        } else {
            router.post(`/data-configuration/${table.routePrefix}`, formData, {
                onSuccess: () => {
                    handleCloseModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Created!',
                        text: `${table.title} has been created successfully.`,
                        timer: 2000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                }
            });
        }
    };

    const handleDelete = (tableName, item) => {
        const table = tables[tableName];
        const codeField = table.fields[0];
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${item[codeField]}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#002868',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/data-configuration/${table.routePrefix}/${item.id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: `${table.title} has been deleted successfully.`,
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    }
                });
            }
        });
    };

    const DataTable = ({ tableName }) => {
        const tableConfig = tables[tableName];
        const [sorting, setSorting] = useState([]);
        const [columnFilters, setColumnFilters] = useState([]);
        const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
        const [globalFilter, setGlobalFilter] = useState('');

        const columns = [
            ...tableConfig.columns.map(col => ({ ...col, cell: ({ getValue }) => <span className="font-medium">{getValue()}</span> })),
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(tableName, row.original)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#002868] text-white rounded hover:bg-[#003580] transition-colors text-sm font-medium">
                            <Pencil className="w-3 h-3" />Edit
                        </button>
                        <button onClick={() => handleDelete(tableName, row.original)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium">
                            <Trash2 className="w-3 h-3" />Delete
                        </button>
                    </div>
                ),
            },
        ];

        const table = useReactTable({
            data: tableConfig.data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onPaginationChange: setPagination,
            state: { sorting, columnFilters, globalFilter, pagination },
        });

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <input type="text" placeholder="Search..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent w-1/3" />
                    <button onClick={() => handleOpenModal(tableName)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#002868] to-[#003580] text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                        <Plus className="w-4 h-4" />Add New
                    </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#002868] text-white">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-4 py-3 text-left text-sm font-semibold">
                                            {header.isPlaceholder ? null : (
                                                <div className={cn('flex items-center gap-2', header.column.getCanSort() ? 'cursor-pointer select-none' : '')} onClick={header.column.getToggleSortingHandler()}>
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && <ArrowUpDown className="w-4 h-4" />}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="border-b hover:bg-[#D4AF37]/10 transition-colors">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-4 py-3 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                        {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{' '}
                        of {table.getFilteredRowModel().rows.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AppLayout>
            <Head title="Data Configuration" />
            <div className="p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
                    <h1 className="text-3xl font-bold text-[#002868]">Data Configuration</h1>
                    <p className="text-gray-600 mt-1">Manage system reference data and configuration tables</p>
                </motion.div>
                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Tabs.List className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
                        {Object.entries(tables).map(([key, config]) => (
                            <Tabs.Trigger key={key} value={key} className={cn('px-4 py-2 text-sm font-medium transition-all rounded-t-lg', activeTab === key ? 'bg-gradient-to-r from-[#002868] to-[#003580] text-white border-b-2 border-[#D4AF37]' : 'text-gray-700 hover:bg-gray-100')}>
                                {config.title}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                    {Object.entries(tables).map(([key]) => (
                        <Tabs.Content key={key} value={key} className="mt-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                <DataTable tableName={key} />
                            </motion.div>
                        </Tabs.Content>
                    ))}
                </Tabs.Root>
            </div>
            <Dialog.Root open={showModal} onOpenChange={setShowModal}>
                <Dialog.Portal>
                    <Dialog.Overlay asChild>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                    </Dialog.Overlay>
                    <Dialog.Content asChild>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50"
                        >
                            <div className="bg-gradient-to-r from-[#002868] to-[#003580] text-white px-6 py-4 flex justify-between items-center">
                                <div>
                                    <Dialog.Title className="text-xl font-bold">
                                        {editingItem ? 'Edit' : 'Add New'} {tables[currentTable]?.title}
                                    </Dialog.Title>
                                    <Dialog.Description className="text-sm text-gray-200 mt-1">
                                        {editingItem ? 'Update the information below' : 'Fill in the information below to create a new entry'}
                                    </Dialog.Description>
                                </div>
                                <Dialog.Close className="text-white hover:text-[#D4AF37] transition-colors">
                                    <X className="w-6 h-6" />
                                </Dialog.Close>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {tables[currentTable]?.fields.map((field, index) => (
                                    <motion.div
                                        key={field}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                                            {field.replace(/_/g, ' ')} <span className="text-red-500">*</span>
                                        </label>
                                        {field.includes('definition') || field.includes('details') || field.includes('description') ? (
                                            <textarea value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent" required={field !== 'description'} />
                                        ) : (
                                            <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002868] focus:border-transparent" required />
                                        )}
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className="flex gap-3 justify-end pt-4"
                                >
                                    <button type="button" onClick={handleCloseModal} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-gradient-to-r from-[#002868] to-[#003580] text-white rounded-lg hover:shadow-lg transition-all font-semibold">{editingItem ? 'Update' : 'Create'}</button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </AppLayout>
    );
}
