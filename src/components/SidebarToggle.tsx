interface SidebarToggleProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
    return (
        <button
            onClick={onToggle}
            className="p-2 rounded hover:bg-gray-700"
            aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
        >
            {isOpen ? "✖" : "☰"}
        </button>
    );
}
