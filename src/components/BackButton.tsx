"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    const [canGoBack, setCanGoBack] = useState(false);

    // Check if there's a history to go back to
    useEffect(() => {
        const checkCanGoBack = () => {
            // `window.history.length` tells if there's a history entry to go back to
            setCanGoBack(window.history.length > 1);
        };

        checkCanGoBack();

        // Optional: Add event listener to re-check when user navigates manually
        window.addEventListener("popstate", checkCanGoBack);

        return () => {
            window.removeEventListener("popstate", checkCanGoBack);
        };
    }, []);

    const handleBack = () => {
        if (canGoBack) {
            router.back(); // Go to the previous page
        }
    };

    return (
        <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`${!canGoBack ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } text-3xl text-gray-900 dark:text-gray-100 hover:bg-gray-300 transition duration-200`}
        >
            ← {/* Arrow symbol */}
        </button>
    );
}
