"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
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

export default function DeleteTaskPage() {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Link href="/tasks/list" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Tasks
            </Link>

            <Card className="border-red-200">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-red-600">Delete Task</CardTitle>
                    </div>
                    <CardDescription>
                        This action cannot be undone. This will permanently delete the task.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Title:</span>
                            <p className="font-medium">{task.title}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Description:</span>
                            <p className="text-sm">{task.description}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Status:</span>
                            <p className="text-sm capitalize">{task.status.replace("-", " ")}</p>
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> Are you sure you want to delete this task? This action is permanent and cannot be reversed.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-6">
                    <Link href="/tasks/list">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                        {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                        Delete Task
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
