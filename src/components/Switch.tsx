import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"



export const SwitchTheme = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <div className="flex items-center rounded-3xl space-x-2">
            <Label htmlFor="theme-toggle" className=" rounded-4xl text-gray-800  dark:text-white ">
                {isChecked ? "Dark " : "Light "}
            </Label>
            <Switch id="theme-toggle" checked={isChecked} onCheckedChange={handleToggle} className="rounded-4xl" />
        </div>
    );
};
