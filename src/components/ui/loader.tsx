import React from "react";

export const Loader: React.FC<{ text?: string }> = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            {text && <p className="mt-2 text-gray-600">{text}</p>}
        </div>
    );
};