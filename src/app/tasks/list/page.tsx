"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Loader2, ArrowUpDown, Eye, Trash2, Pencil } from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";

interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function TaskListPage() {
    const { isAuthenticated } = useProtectedRoute();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sorting, setSorting] = useState<SortingState>([]);
    const limit = 10;

    const fetchTasks = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await client.get(`/task/tasks?page=${pageNumber}&limit=${limit}`);
            setTasks(res.data.tasks);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    if (!isAuthenticated) {
        return null;
    }

    const getStatusBadge = (status: string) => {
        const colors = {
            completed: "bg-green-500/10 text-green-500 border-green-500/20",
            "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
            pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]} capitalize`}>
                {status.replace("-", " ")}
            </span>
        );
    };

    const columns: ColumnDef<Task>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted"
                    >
                        Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="max-w-md truncate text-muted-foreground">
                    {row.getValue("description")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => getStatusBadge(row.getValue("status")),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="h-8 px-2 hover:bg-muted"
                    >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return new Date(row.getValue("createdAt")).toLocaleDateString();
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const task = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/tasks/${task._id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/tasks/${task._id}/edit`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href={`/tasks/${task._id}/delete`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        manualPagination: true,
        pageCount: pagination?.totalPages ?? 0,
    });

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (pagination && page < pagination.totalPages) setPage(page + 1);
    };

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your tasks efficiently.</p>
                </div>
                <Link href="/tasks/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-20 border rounded-lg bg-muted/10 border-dashed">
                    <h3 className="text-lg font-medium">No tasks found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Get started by creating your first task.</p>
                    <Link href="/tasks/create">
                        <Button variant="outline">Create Task</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} tasks
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium min-w-[3rem] text-center">
                                    Page {page} of {pagination.totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNext}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
