"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "sonner"

function GoogleCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const setToken = useAuthStore((state) => state.setToken)
    const setUser = useAuthStore((state) => state.setUser)

    useEffect(() => {
        const token = searchParams.get("token")
        const userParam = searchParams.get("user")

        if (token) {
            setToken(token)
            if (userParam) {
                try {
                    const user = JSON.parse(userParam)
                    setUser(user)
                } catch (e) {
                    console.error("Failed to parse user data", e)
                }
            }
            toast.success("Successfully logged in with Google")
            router.push("/")
        } else {
            toast.error("Google authentication failed")
            router.push("/signIn")
        }
    }, [searchParams, router, setToken, setUser])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Processing Login...</h2>
                <p className="text-gray-500">Please wait while we redirect you.</p>
            </div>
        </div>
    )
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleCallbackContent />
        </Suspense>
    )
}
