import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import Routers from "./routers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Mobile connections are slow and metered — don't refetch on every focus.
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: 1,
      // React Query's default pauses everything until the browser reports a
      // connection, which would leave an observer who opened the installed app
      // offline staring at a placeholder that never resolves.
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
        <Toaster position="top-center" richColors toastOptions={{ className: "font-sans" }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
