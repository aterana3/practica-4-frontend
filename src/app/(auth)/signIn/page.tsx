"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {IconBrandGoogleFilled} from "@tabler/icons-react"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {useAuthStore} from "@/store/auth.store"
import {API_URL} from "@/lib/client"
import {useRedirectIfAuthenticated} from "@/hooks/useRedirectIfAuthenticated";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export default function SignInPage() {
    const router = useRouter()
    const {isAuthenticated} = useRedirectIfAuthenticated();
    const login = useAuthStore((state) => state.login)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    if (isAuthenticated) {
        return null;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await login(values)
            toast.success("Logged in successfully")
            router.push("/") // Redirect to dashboard/home
        } catch (error) {
            console.error(error)
            toast.error("Failed to login. Please check your credentials.")
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = `${API_URL}/security/auth/google`
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            Enter your email and password to access your account.
                        </CardDescription>
                    </div>
                    <Link
                        href="/"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 flex items-center justify-center">
                    <div className="w-full border-t border-gray-200"/>
                    <span className="absolute bg-white px-2 text-xs text-gray-500 dark:bg-gray-950">
                        OR
                    </span>
                </div>
                <Button
                    variant="outline"
                    type="button"
                    className="mt-4 w-full gap-2"
                    onClick={handleGoogleLogin}
                >
                    <IconBrandGoogleFilled className="h-4 w-4"/>
                    Sign in with Google
                </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/signUp" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
