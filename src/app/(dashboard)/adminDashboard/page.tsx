"use client"
import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";
import Link from "next/link";

function AdminPanel() {
    return (
        <div className="flex flex-col w-full h-screen min-h-[203px] min-w-[200px] bg-gray-300 dark:bg-gray-800">

            <div className="max-[742px]:mt-0 absolute top-4 left-4">
                <BackButton />
            </div>
            <div>
                <Navbar />

            </div>
            <div className="flex flex-row justify-center items-center mt-4">
                <div className="flex flex-row bg-gray-500 h-20 mt-5 rounded-2xl items-center justify-center w-[50%] gap-4 ">
                    <div className="flex text-gray-100 font-serif ">
                        <Link href="/adminDashboard/createUnit">Create Course</Link>
                    </div>
                    <div className="h-full border-l border-gray-300"></div>

                    <div className="flex text-gray-100 font-serif ">
                        <Link href="/adminDashboard/createClass">Create Class</Link>
                    </div>

                    <div className="h-full border-l border-gray-300"></div>

                    <div className="flex text-gray-100 font-serif">
                        <Link href="/adminDashboard/createUnit">Create Unit</Link>
                    </div>
                    <div className="h-full border-l border-gray-300"></div>

                    <div className="flex text-gray-100 font-serif">
                        <Link href="/adminDashboard/createTimetable">Create timetable</Link>
                    </div>

                </div>

            </div>



            <div className="flex flex-col justify-center items-center mt-7">
                <div className="mt-7">Entities Created</div>
                <div className="flex flex-row bg-gray-300 dark:bg-gray-800 h-20 mt-5 rounded-2xl items-center justify-center w-[50%] gap-8 ">
                    <div className="rounded-full h-20 w-30 bg-white items-center dark:bg-gray-500 dark:text-gray-100 justify-center flex"><Link href="/adminDashboard/createCourse/coursesCreated/id">Courses</Link></div>
                    <div className="rounded-full h-20 w-30 bg-white items-center  dark:bg-gray-500 dark:text-gray-100 justify-center flex"><Link href="/adminDashboard/createClass/classesCreated/id"> Classes</Link></div>
                    <div className="rounded-full h-20 w-30 bg-white items-center  dark:bg-gray-500 dark:text-gray-100 justify-center flex"><Link href="/adminDashboard/createUnit/unitscreated/id"> Units</Link></div>
                    <var className="rounded-full h-20 w-30 bg-white items-center  dark:bg-gray-500 dark:text-gray-100 justify-center flex"><Link href="/adminDashboard/createTimetable/timetablesCreated/id"> Timetable</Link></var>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;