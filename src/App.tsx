import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { MindMap } from "./components/MindMap";
import { ViewControls } from "./components/ViewControls";
import { ReactFlowProvider } from 'reactflow';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactFlowProvider>
          <TooltipProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex-1 relative">
                <Toolbar />
                <div className="w-full h-full">
                  <MindMap />
                </div>
                <ViewControls />
                <Toaster />
                <Sonner />
              </div>
            </div>
          </TooltipProvider>
        </ReactFlowProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;