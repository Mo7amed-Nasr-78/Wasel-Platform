import { Link } from "react-router-dom";
import NavList from "./NavList";
import UserProfile from "./UserProfile";

function Header({ hideItems = false }: { hideItems?: boolean }) {
    return (
        <header className="absolute top-0 left-0 right-0 py-3 mt-4">
            <div className={`${!hideItems? 'justify-between': 'justify-center'} container mx-auto flex items-center`}>
                <Link to={{ pathname: "/" }}>
                    <div className="h-14">
                        <img src="/logo.svg" alt="logo" className="w-full h-full"/>
                    </div>
                </Link>
                {
                    !hideItems?
                        <>
                            <NavList />
                            <UserProfile />
                        </>
                    :
                        null
                }
            </div>
        </header>
    );
};

export default Header;