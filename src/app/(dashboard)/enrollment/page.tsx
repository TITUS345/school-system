'use client'
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
    const [user, setUser] = useState({
        _id: "",
        name: "",
        email: "",
        enrolled: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [courses, setCourses] = useState<{ _id: string; name: string }[]>([]);
    const [classes, setClasses] = useState<{ _id: string; name: string }[]>([]);
    const [units, setUnits] = useState<{ _id: string; name: string }[]>([]);

    const [enrollmentData, setEnrollmentData] = useState({
        userId: "",
        courseId: "",
        classId: "",
        units: [] as string[],
        term: "Term1",  // Default term
    });

    useEffect(() => {
        fetchUserData();
        fetchCourses(); // Fetch courses when the component is mounted
    }, []);

    useEffect(() => {
        if (enrollmentData.courseId) {
            fetchClasses(enrollmentData.courseId);
            fetchUnits(enrollmentData.courseId);
        }
    }, [enrollmentData.courseId]);

    // Fetch user data
    const fetchUserData = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) throw new Error("Missing access token.");

            const response = await fetch("/api/auth/login", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!response.ok) throw new Error("Failed to fetch user data.");

            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Could not load user data. Please log in again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses
    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/admin/create-course");
            if (!res.ok) throw new Error("Failed to load courses");

            const data = await res.json();
            console.log("Courses fetched:", data);
            setCourses(data);
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Error fetching courses");
        }
    };

    const fetchClasses = async (courseId: string) => {
        if (!courseId) {
            console.warn("No courseId provided, skipping class fetch.");
            return;
        }

        try {
            const res = await fetch(`/api/admin/create-class?courseId=${courseId}`);
            if (!res.ok) throw new Error(`Failed to load classes: ${res.status} ${res.statusText}`);

            const data = await res.json();
            console.log("Classes fetched:", data);

            // Ensure data.classes is always an array before setting state
            setClasses(Array.isArray(data.classes) ? data.classes : []);
        } catch (err) {
            console.error("Error fetching classes:", err);
            setError("Error fetching classes. Please try again.");
            setClasses([]); // Ensure classes is reset to an empty array on failure
        }
    };

    const fetchUnits = async (courseId: string) => {
        if (!courseId) {
            console.error("Missing courseId for fetching units!");
            return;
        }

        console.log("Fetching units for courseId:", courseId);

        try {
            const res = await fetch(`/api/admin/create-unit?courseId=${courseId}`);
            console.log("API Response Status:", res.status);

            if (!res.ok) throw new Error(`Failed to load units - Status: ${res.status}`);

            const data = await res.json();
            console.log("Units Fetched:", data);

            if (!Array.isArray(data)) throw new Error("Invalid response format");

            setUnits(data);
        } catch (err) {
            console.error("Error fetching units:", err);
            setError("Error fetching units");
        }
    };

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user._id) {
            alert("User ID is missing!");
            return;
        }

        if (!enrollmentData.courseId || !enrollmentData.classId || enrollmentData.units.length === 0) {
            alert("Please select a Course, Class, and at least one Unit before enrolling!");
            return;
        }

        const enrollmentPayload = {
            userId: user._id,
            courseId: enrollmentData.courseId,
            classId: enrollmentData.classId,
            units: enrollmentData.units,
            term: enrollmentData.term,  // Ensure term is included here!
        };

        console.log("Enrollment Payload:", enrollmentPayload);

        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) throw new Error("Missing access token.");

            const res = await fetch("/api/enrollment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(enrollmentPayload),
            });

            const data = await res.json();
            console.log("Enrollment Response:", data);

            if (res.ok) {
                alert("Enrollment Successful!");
                setUser((prev) => ({ ...prev, enrolled: true }));
                window.location.href = "/timetable"; // Redirect to timetable page after successful enrollment
            } else {
                alert(`Enrollment failed: ${data.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Enrollment Error:", error);
            alert("Failed to enroll. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="absolute top-4 left-4">
                <BackButton />
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
                {loading && <p>Loading your dashboard...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
                        <p>Email: {user.email}</p>

                        {!user.enrolled ? (
                            <form onSubmit={handleEnroll} className="mt-4 space-y-4">
                                <select
                                    className="w-full p-2 border rounded"
                                    value={enrollmentData.courseId}
                                    onChange={(e) => {
                                        const selectedCourseId = e.target.value;
                                        setEnrollmentData({ ...enrollmentData, courseId: selectedCourseId, classId: "", units: [] });
                                    }}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="w-full p-2 border rounded"
                                    id="classId"
                                    value={enrollmentData.classId}
                                    onChange={(e) => {
                                        setEnrollmentData({ ...enrollmentData, classId: e.target.value, units: [] });
                                    }}
                                    disabled={!enrollmentData.courseId}
                                >
                                    <option value="">Select Class</option>
                                    {Array.isArray(classes) && classes.length > 0 ? (
                                        classes.map((classItem) => (
                                            <option key={classItem._id} value={classItem._id}>
                                                {classItem.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No classes available</option>
                                    )}
                                </select>

                                <select
                                    className="w-full p-2 border rounded"
                                    multiple
                                    value={enrollmentData.units}
                                    onChange={(e) => {
                                        const selectedUnits = Array.from(e.target.selectedOptions, (option) => option.value);
                                        setEnrollmentData((prev) => ({ ...prev, units: selectedUnits }));
                                    }}
                                    disabled={!enrollmentData.courseId || units.length === 0}
                                >
                                    {units.map((unit) => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Term Select Dropdown */}
                                <select
                                    className="w-full p-2 border rounded"
                                    value={enrollmentData.term}
                                    onChange={(e) => setEnrollmentData({ ...enrollmentData, term: e.target.value })}
                                >
                                    <option value="Term1">Term 1</option>
                                    <option value="Term2">Term2</option>
                                    <option value="Term3">Term 3</option>
                                </select>

                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Enroll
                                </button>
                            </form>
                        ) : (
                            <p className="text-green-600 mt-4">You are successfully enrolled!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
