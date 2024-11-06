import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toolbar } from "./components/Toolbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { MindMap } from "./components/MindMap";
import { ReactFlowProvider } from 'reactflow';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ReactFlowProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 relative">
            <Toolbar />
            <div className="w-full h-full">
              <MindMap />
            </div>
            <Toaster />
            <Sonner />
          </div>
        </div>
      </ReactFlowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;