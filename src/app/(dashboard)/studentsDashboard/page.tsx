
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function StudentsDashboard() {
    return (
        <div className="flex flex-col w-full h-screen  bg-gray-300 dark:bg-gray-800" >


            <div className=" fixed left-0 top-0 w-screen">

                <Navbar />

            </div>
            <div className="flex flex-col h-screen overflow-y-auto items-center justify-center  w-full">
                <div className="mb-6">
                    <p>If you are not enrolled yet, you can enroll here:</p>
                    <span className="font-extrabold text-blue-500 underline">
                        <Link href="enrollment">Enroll</Link>
                    </span>
                </div>




                <div className="flex flex-row gap-5 items-center justify-center rounded-4xl w-[50%] h-30 bg-gray-400 dark:bg-gray-600">

                    <Link href="/timetable"><div className="text-gray-900 dark:text-gray-200">Timetable</div></Link>

                    <div className="h-full border-l border-gray-900 dark:border-gray-200 "></div>

                    <div className="text-gray-900 dark:text-gray-200">Grades</div>


                </div>
            </div>



        </div>
    )
}