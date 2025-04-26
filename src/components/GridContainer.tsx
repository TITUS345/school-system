export default function GridContainer() {
    return (
        <div className="flex flex-col bg-gray-300 dark:bg-gray-800 overflow-y-scroll h-screen w-full min-w-[200px] sm:max-w-screen ">
            <div className="flex flex-col items-center  h-screen w-full bg-gray-300 dark:bg-gray-800">
                <div className="flex flex-col gap-4 p-4">
                    <h1 className=" text-gray-950 dark:text-gray-100 text-4xl">You need a lecture to learn better !!</h1>
                    <p className="text-gray-700 dark:text-gray-100 "> For self lerning you can check on YuTube tutorials.</p>

                    <h1 className="text-bold text-2xl text-gray-900 dark:text-gray-100"> Some good learnig sites for you are here.</h1>
                    <div>
                        <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
                            <li className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">Coursera</li>
                            <li className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">Udemy</li>
                            <li className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">edX</li>
                            <li className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">Khan Academy</li>
                            <li className="text-gray-900 dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-500">Skillshare</li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
}