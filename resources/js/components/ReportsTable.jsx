import React, { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { Link, router } from "@inertiajs/react";
import { Calendar, Eye, Pencil, Trash2, List } from "lucide-react";
import Swal from "sweetalert2";

export default function ReportsTable({ reports }) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const route = (name, params) => {
        const routes = {
            "reports.show": (id) => `/reports/${id}/view-ctr-report`,
        };
        return routes[name] ? routes[name](params) : "#";
    };

    // Format multiple names with proper grammar
    const formatNamesGrammatically = (names) => {
        const count = names.length;

        if (count === 0) return '';
        if (count === 1) return names[0];
        if (count === 2) return `${names[0]} and ${names[1]}`;

        // 3 or more names: use Oxford comma
        const allButLast = names.slice(0, count - 1);
        const last = names[count - 1];

        return allButLast.join(', ') + ', and ' + last;
    };

    // === Define table columns ===
    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => {
                    const r = row.original;
                    // Check if this is grouped data with displayParty
                    if (r.displayParty) {
                        const p = r.displayParty;
                        return `${p.last_name || ""}, ${p.first_name || ""}`;
                    }
                    // Check for transaction.parties (many-to-many relationship)
                    if (r.transactions?.length > 0) {
                        const transaction = r.transactions[0];
                        if (transaction.parties && transaction.parties.length > 0) {
                            // Display all parties with proper grammar
                            const partyNames = transaction.parties.map(p =>
                                `${p.last_name || ""}, ${p.first_name || ""}`
                            );
                            return formatNamesGrammatically(partyNames);
                        }
                    }
                    // Show report info if no party data available
                    return (
                        <span className="text-gray-400 italic text-xs">
                            Report #{r.id} - No party data
                        </span>
                    );
                },
            },
            {
                accessorKey: "submission_date",
                header: "Submission Date",
                cell: ({ getValue }) => (
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-[#002868] mr-2" />
                        <span>{new Date(getValue()).toLocaleDateString()}</span>
                    </div>
                ),
            },
            {
                accessorKey: "created_at",
                header: "Created",
                cell: ({ getValue }) =>
                    new Date(getValue()).toLocaleDateString(),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    // Get the first party ID from the row to pass to view page
                    const firstPartyId = row.original.transactions?.[0]?.parties?.[0]?.id;
                    const viewUrl = firstPartyId
                        ? `${route("reports.show", row.original.id)}?party_id=${firstPartyId}`
                        : route("reports.show", row.original.id);

                    return (
                    <div className="flex items-center gap-2">
                        {/* View */}
                        <Link
                            href={viewUrl}
                            className="inline-flex items-center px-3 py-1.5 bg-[#002868] hover:bg-[#001a4d] text-white rounded-md transition-colors text-sm"
                        >
                            <Eye className="w-4 h-4 mr-1" /> View
                        </Link>

                        {/* Edit */}
                        <Link
                            href={`/reports/${row.original.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                        >
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Link>

                        {/* Edit Transactions */}
                        <Link
                            href={`/reports/${row.original.id}/edit-transactions`}
                            className="inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors text-sm"
                        >
                            <List className="w-4 h-4 mr-1" /> Edit Transactions
                        </Link>

                        {/* Delete */}
                        <button
                            onClick={() => {
                                Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#002868",
                                    cancelButtonColor: "#6b7280",
                                    confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        router.delete(
                                            `/reports/${row.original.id}`,
                                            {
                                                onSuccess: () => {
                                                    Swal.fire({
                                                        icon: "success",
                                                        title: "Deleted!",
                                                        text: "Report has been deleted.",
                                                        timer: 2000,
                                                        showConfirmButton: false,
                                                        toast: true,
                                                        position: "top-end",
                                                    });
                                                },
                                            }
                                        );
                                    }
                                });
                            }}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                        >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </button>
                    </div>
                    );
                },
            },
        ],
        []
    );

    const dedupedReports = useMemo(() => {
        const latestReportByPartyCombo = new Map();
        const reportsWithoutParty = [];

        (reports || []).forEach((report) => {
            const parties = report.transactions?.[0]?.parties || [];

            if (parties.length === 0) {
                reportsWithoutParty.push(report);
                return;
            }

            // Create unique key based on ALL party IDs (sorted)
            const partyIds = parties.map(p => p.id).sort((a, b) => a - b);
            const partyComboKey = partyIds.join('-');

            const existing = latestReportByPartyCombo.get(partyComboKey);
            if (!existing) {
                latestReportByPartyCombo.set(partyComboKey, report);
                return;
            }

            const reportDate = new Date(
                report.submission_date || report.created_at || 0
            );
            const existingDate = new Date(
                existing.submission_date || existing.created_at || 0
            );

            if (reportDate > existingDate) {
                latestReportByPartyCombo.set(partyComboKey, report);
            }
        });

        return [...latestReportByPartyCombo.values(), ...reportsWithoutParty];
    }, [reports]);

    // === Initialize react-table ===
    const globalFilterFn = (row, columnId, filterValue) => {
        const r = row.original;

        // Check if this is grouped data with displayParty
        let fullName;
        let type;

        if (r.displayParty) {
            fullName = `${r.displayParty.last_name || ""} ${
                r.displayParty.first_name || ""
            }`.toLowerCase();
            type =
                r.displayTransaction?.transaction_code?.ca_sa?.toLowerCase() ||
                "";
        } else {
            // Check for transaction.parties (many-to-many relationship)
            // Combine all party names for search
            const parties = r.transactions?.[0]?.parties || [];
            fullName = parties.map(p =>
                `${p.last_name || ""} ${p.first_name || ""}`
            ).join(" ").toLowerCase();
            type =
                r.transactions?.[0]?.transaction_code?.ca_sa?.toLowerCase() ||
                "";
        }

        const date = r.submission_date?.toLowerCase?.() || "";

        return (
            fullName.includes(filterValue.toLowerCase()) ||
            type.includes(filterValue.toLowerCase()) ||
            date.includes(filterValue.toLowerCase())
        );
    };

    const table = useReactTable({
        data: dedupedReports,
        columns,
        state: { sorting, globalFilter, pagination },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn,
    });

    // === Return table UI ===
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* 🔍 Search bar */}
            <div className="flex items-center justify-between p-4 border-b">
                <input
                    type="text"
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search reports..."
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-1/3 focus:ring-[#002868] focus:border-[#002868]"
                />
                <span className="text-sm text-gray-600">
                    Showing {table.getFilteredRowModel().rows.length} reports
                </span>
            </div>

            {/* 📋 Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer select-none"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {
                                            {
                                                asc: " 🔼",
                                                desc: " 🔽",
                                            }[
                                                header.column.getIsSorted() ??
                                                    null
                                            ]
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔢 Pagination */}
            <div className="flex items-center justify-center gap-4 p-4 text-sm border-t">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
