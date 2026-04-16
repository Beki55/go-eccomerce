"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AuthPage() {
    const { login, register, googleLogin, user, loading } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Don't render if authenticated
    if (user) {
        return null;
    }

    // Form states
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(loginData.email, loginData.password);
            toast.success("Logged in successfully!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(registerData.name, registerData.email, registerData.password);
            toast.success("Registration successful! Please login.");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await googleLogin();
            toast.success("Logged in with Google!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error("Google login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white text-center">Authentication</CardTitle>
                        <CardDescription className="text-zinc-400 text-center">
                            Welcome to our platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1">
                            <Button
                                variant="outline"
                                className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 h-11"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Sign in with Google
                            </Button>
                        </div>
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0c0c0e] px-2 text-zinc-500">Or continue with</span>
                            </div>
                        </div>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 h-10 p-1">
                                <TabsTrigger value="login" className="rounded-sm data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">Login</TabsTrigger>
                                <TabsTrigger value="register" className="rounded-sm data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">Register</TabsTrigger>
                            </TabsList>
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            className="border-zinc-800 bg-zinc-900/50 text-white focus:ring-zinc-700 h-11"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Password</Label>
                                            <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot password?</a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            className="border-zinc-800 bg-zinc-900/50 text-white focus:ring-zinc-700 h-11"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 h-11 transition-all duration-200 font-semibold" type="submit" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>
                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            required
                                            className="border-zinc-800 bg-zinc-900/50 text-white focus:ring-zinc-700 h-11"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email" className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email Address</Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="name@company.com"
                                            required
                                            className="border-zinc-800 bg-zinc-900/50 text-white focus:ring-zinc-700 h-11"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password" className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Password</Label>
                                        <Input
                                            id="reg-password"
                                            type="password"
                                            required
                                            className="border-zinc-800 bg-zinc-900/50 text-white focus:ring-zinc-700 h-11"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        />
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 h-11 transition-all duration-200 font-semibold" type="submit" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <p className="px-8 text-center text-xs text-zinc-500 leading-relaxed">
                            By continuing, you agree to our{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Terms of Service</a> and{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Privacy Policy</a>.
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
