import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut as fbSignOut } from "firebase/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authQueryKeys = {
  user: ["user"] as const,
};

// Fetch current user
export function useUser() {
  return useQuery({
    queryKey: authQueryKeys.user,
    queryFn: async (): Promise<User> => {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }): Promise<User> => {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.user, user);
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password
    }: {
      name: string;
      email: string;
      password: string;
    }): Promise<User> => {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.user, user);
    },
  });
}

// Google login mutation
export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<User> => {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post(
        `${API_BASE_URL}/auth/google`,
        { id_token: idToken },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.user, user);
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      await fbSignOut(auth);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQueryKeys.user });
    },
  });
}