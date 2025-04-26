import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function teachers() {
    return (
        <div className="flex flex-col w-full h-screen min-h-[203px] min-w-[200px] bg-gray-300 dark:bg-gray-800" >
            <div>
                <Navbar />
            </div>
            <div className="flex flex-col h-screen overflow-y-auto items-center mt-6 w-full">

                <div className="flex flex-row justify-center items-center rounded-4xl bg-gray-500 w-[50%] max-[491px]:w-full max-[240px]:flex-col max-[240px]:gap-3 max-[491px]:h-50 h-30 space-x-6 mt-4">
                    <Link href="/teachersDashboard"><div className="rounded-4xl border-2 border-amber-50 bg-gray-400 p-2">Timetable</div></Link>
                    <Link href="/gradesUpload"><div className="rounded-4xl border-2 border-amber-50 bg-gray-400 p-2">Upload Grades</div></Link>

                </div>

            </div>

        </div>
    )
}