"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {useRouter, useParams} from "next/navigation";
import { Loader2, ArrowLeft, Trash2, Calendar, Clock } from "lucide-react";
import Link from "next/link";
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

export default function TaskDetailPage() {
    const { isAuthenticated } = useProtectedRoute();

    const router = useRouter();
    const params = useParams();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await client.get(`/task/tasks/${params.taskId}`);
                setTask(res.data.task);
            } catch (error) {
                console.error("Failed to fetch task", error);
                toast.error("Failed to load task");
                router.push("/tasks/list");
            } finally {
                setLoading(false);
            }
        };

        if (params.taskId) {
            fetchTask();
        }
    }, [params.taskId, router]);

    if (!isAuthenticated) {
        return null;
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        setDeleting(true);
        try {
            await client.delete(`/task/tasks/${params.taskId}`);
            toast.success("Task deleted successfully");
            router.push("/tasks/list");
        } catch (error) {
            console.error("Failed to delete task", error);
            toast.error("Failed to delete task");
            setDeleting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "in-progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <Link href="/tasks/list" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Tasks
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">{task.title}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)} capitalize`}>
                            {task.status.replace("-", " ")}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                        <p className="whitespace-pre-wrap">{task.description}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-6">
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Delete Task
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
