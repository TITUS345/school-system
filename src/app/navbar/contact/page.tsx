import BackButton from "@/components/BackButton";

export default function Contact() {
    return (
        <div>
            <div>
                <div className="max-[742px]:mt-0 absolute top-4 left-4">
                    <BackButton />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center dark:text-gray-100 mt-4">Contact Me</h1>
            <p className="text-center dark:text-gray-100 mt-2">If you have any questions or want to get in touch, feel free to reach out!</p>
            <p className="text-center dark:text-gray-100 mt-2">Phone:<span className="font-bold text-gray-800 dark:text-white">0713792321</span> </p>
            <p className="text-center dark:text-gray-100 mt-2">email: <a href="mailto:tituscheptarus@gmail.com" className="text-gray-900 dark:text-white font-bold">tituscheptarus@gmail.con</a></p>

        </div>

    )
}
