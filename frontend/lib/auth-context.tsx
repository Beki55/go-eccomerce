"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut as fbSignOut } from "firebase/auth";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
    });

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            // Logic to decode token or fetch user would go here
            // For now we assume they are logged in if token exists
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
        } catch (error) {
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", { name, email, password });
        } catch (error) {
            throw error;
        }
    };

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const res = await api.post("/auth/google", { id_token: idToken });
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        fbSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
