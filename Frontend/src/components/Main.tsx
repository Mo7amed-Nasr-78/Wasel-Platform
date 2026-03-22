import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Main({ children, auth = false }: { children: ReactNode, auth?: boolean }) {
    return (
        <>
            <Header hideItems={auth}/>
            { children }
            <Footer />
        </>
    );
}

export default Main;