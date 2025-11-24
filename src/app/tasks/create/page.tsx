"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {useProtectedRoute} from "@/hooks/useProtectedRoute";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["pending", "in-progress", "completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function CreateTaskPage() {
    const { isAuthenticated } = useProtectedRoute();

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            status: "pending",
        },
    });

    const onSubmit = async (data: TaskFormValues) => {
        setLoading(true);
        try {
            await client.post("/task/tasks", data);
            toast.success("Task created successfully");
            router.push("/tasks/list");
        } catch (error) {
            console.error("Failed to create task", error);
            toast.error("Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Link href="/tasks/list" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Tasks
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                    <CardDescription>Add a new task to your list.</CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Task title"
                                {...form.register("title")}
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Task description"
                                {...form.register("description")}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                onValueChange={(value) => form.setValue("status", value as any)}
                                defaultValue={form.getValues("status")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.status && (
                                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Link href="/tasks/list">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
