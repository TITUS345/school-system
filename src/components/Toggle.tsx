"use client";

interface SidebarToggleProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-blue-700 text-white"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
            {isOpen ? "✖" : "☰"} {/* You can also use icons */}
        </button>
    );
}
