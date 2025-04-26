import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function About() {
    return (
        <div>
            <div>
                <div className="max-[742px]:mt-0 absolute top-4 left-4">
                    <BackButton />
                </div>
            </div>

            <h1 className="text-gray-900 dark:text-gray-100 font-bold text-center mt-4 text-3xl">About Me</h1>
            <p className="text-center text-gray-800 dark:text-gray-100 mt-2">I'm a self-taught fullstack developer.</p>
            <p className="text-center mt-2 font-bold text-gray-800 dark:text-gray-100">My goal is to be the greatest developer of my time.</p>
            <p className="text-center mt-2 text text-gray-700 dark:text-gray-100">
                Three months of experience. If my project looks good over the experience period I have, then don't mind giving a thumbs up.
                <br />
                If much pleased and can link me with an internship or any related job, hit me up. Check my contact info in the{" "}
                <span className="text-lg text-blue-700">
                    <Link href="/navbar/contact" className="underline">"Contact"</Link>
                </span>{" "}
                page.
            </p>
        </div>
    );
}
