'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"; // ShadCN UI components
import { Loader } from "@/components/ui/loader"; // Custom Loader component
import { Alert } from "@/components/ui/alert"; // Custom Alert component
import { useRouter } from 'next/navigation'; // For redirection in case of missing studentId
import BackButton from '@/components/BackButton';

// Define the types for the timetable data
type TimetableEntry = {
    unit: string;
    teacher: string;
    date: string;
    time: string;
};

type TimetableResponse = {
    name: string;
    email: string;
    class: string;
    course: string;
    units: string[];
    timetables: TimetableEntry[];
};

const TimetablePage = () => {
    const [timetableData, setTimetableData] = useState<TimetableResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // To handle navigation/redirects

    useEffect(() => {
        const fetchTimetable = async () => {
            // Dynamically retrieve studentId from localStorage
            const studentId = localStorage.getItem("userId");
            console.log("Retrieved studentId from localStorage:", studentId); // Debugging log

            if (!studentId) {
                setError("Student ID not found. Redirecting to login.");
                setLoading(false);
                // Redirect user to the login page or home
                setTimeout(() => router.push('/auth/logIn'), 2000); // Adjust the redirection as needed
                return;
            }

            try {
                // Fetch data from the API dynamically using the retrieved studentId
                const response = await fetch(`/api/studentDashboard?studentId=${studentId}`);
                console.log("API Response:", response); // Log the response for debugging
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Fetch Error:", response.status, errorText);
                    throw new Error("Failed to fetch timetable data");
                }

                const data = await response.json();
                console.log("Timetable Data:", data); // Log the data for debugging
                setTimetableData(data.student); // Assuming API response includes "student" data
            } catch (err) {
                console.error("Error fetching timetable:", err);
                setError("Could not fetch timetable data. Please try again later.");
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchTimetable(); // Trigger the fetch function
    }, [router]); // Add `router` to the dependency array

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader text="Fetching timetable..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Alert variant="destructive">
                    <p className="text-red-600 font-semibold">{error}</p>
                </Alert>
            </div>
        );
    }

    if (!timetableData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Alert variant="destructive">
                    <p className="text-yellow-600 font-semibold">No timetable data found for this student.</p>
                </Alert>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className='shadow-lg rounded-lg border border-gray-200 bg-white dark:bg-gray-800'>
                    <div className="absolute top-4 left-4">
                        <BackButton />
                    </div>

                    <CardHeader className="bg-blue-500 dark:bg-gray-500 text-white p-6 rounded-t-lg">
                        <h1 className="text-2xl font-bold">Your Timetable</h1>
                        <p>{`Welcome, ${timetableData.name}`}</p>
                        <p>{`Email: ${timetableData.email}`}</p>
                        <p>{`Class: ${timetableData.class}`}</p>
                        <p>{`Course: ${timetableData.course}`}</p>
                    </CardHeader>
                    <CardContent className="bg-white dark:bg-gray-700 p-6">
                        <h2 className="text-lg font-semibold mt-4 text-gray-900 dark:text-gray-100">Units:</h2>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200">
                            {timetableData.units.map((unit, index) => (
                                <li key={index}>{unit}</li>
                            ))}
                        </ul>

                        <h2 className="text-lg font-semibold mt-6 text-gray-900 dark:text-gray-100">Timetable:</h2>
                        {timetableData.timetables.length > 0 ? (
                            timetableData.timetables.map((entry, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-400 p-4 rounded-lg shadow-md mt-4 border border-gray-200">
                                    <p>
                                        <strong>Unit:</strong> {entry.unit}
                                    </p>
                                    <p>
                                        <strong>Teacher:</strong> {entry.teacher}
                                    </p>
                                    <p>
                                        <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Time:</strong> {entry.time}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-100 mt-4">No timetable entries available.</p>
                        )}
                    </CardContent>
                    <CardFooter className="bg-blue-100 text-blue-900 p-4 rounded-b-lg">
                        <p className="text-sm font-medium">Keep checking here for updates to your timetable.</p>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
};

export default TimetablePage;