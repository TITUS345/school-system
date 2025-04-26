// "use client";

// import { useState } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar"; // ← your reusable sidebar component

// export default function HomePageWrapper() {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     return (
//         <div className="flex">
//             <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(false)} />
//             <div className="flex-1">
//                 <Navbar
//                     isOpen={isSidebarOpen}
//                     onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
//                     onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//                 />

//                 {/* Direct homepage content here */}
//                 <main className="p-6">
//                     <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
//                     <p className="mt-4">Manage your school programs, students, and more!</p>
//                     {/* Add any additional sections, links, etc. */}
//                 </main>
//             </div>
//         </div>
//     );
// }
