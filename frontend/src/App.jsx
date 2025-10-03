// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "./components/navbar/Navbar"; // ✅ Common Navbar
import Footer from "./components/footer/Footer"; // ✅ Common Footer
import AppRoutes from "./routes/AppRoutes"; // ✅ Page routes

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,             // retry failed requests once
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar always visible */}
          <Navbar />

          {/* Page content changes here */}
          <main className="flex-grow">
            <AppRoutes />
          </main>

          {/* Footer at the bottom */}
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
