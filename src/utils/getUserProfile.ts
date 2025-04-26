export async function getUserProfile() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.warn("No access token — not logged in.");
        return null;
    }

    const res = await fetch("/api/auth/login", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    return await res.json();
}
