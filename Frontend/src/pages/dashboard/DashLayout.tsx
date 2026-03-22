import { useState, type ReactNode } from "react";
import DashSidebar from "./components/DashSidebar";
import DashHeader from "./components/DashHeader";

function DashLayout({ children }: { children: ReactNode }) {
    const [ closeSidebar, setCloseSidebar ] = useState(false);

    return (
        <section className="h-screen flex items-center justify-center bg-(--bg-color)">
            <DashSidebar closeSidebar={closeSidebar} setCloseSidebar={setCloseSidebar} />
            <div className={`${closeSidebar? "w-full" : "w-4/5"} h-full duration-300 p-5`}>
                <DashHeader />
                { children }
            </div>
        </section>
    )
} 

export default DashLayout;