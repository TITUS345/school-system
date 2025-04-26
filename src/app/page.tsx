"use client";

import { useState } from "react";
import GridContainer from "@/components/GridContainer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  // Sidebar toggle state is managed here locally
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen min-h-[203px] min-w-[200px] bg-gray-300 dark:bg-gray-800">
      <div className="flex flex-row w-full h-screen">
        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-screen w-64 rounded-r-3xl bg-gray-400 text-white transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}>
          <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {/* Navbar + Main Content */}
        <div className={`flex flex-col h-screen w-full transition-all ${isSidebarOpen ? "sm:ml-64 sm:w-[calc(100vw-256px)]" : "w-full"
          }`}>
          {/* Navbar */}
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

          {/* Content Area */}
          <div className="overflow-y-scroll flex-1">
            <GridContainer />
          </div>
        </div>
      </div>
    </div>
  );
}