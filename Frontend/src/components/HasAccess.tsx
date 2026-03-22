import { useEffect ,useState,type ReactNode } from "react";
import { useProps } from "./PropsProvider";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function HasAccess({ children, role }: { children: ReactNode, role: string[] }) {
    const { user, isLoading } = useProps();
    const navigate = useNavigate();
    const [ access, setAccess ] = useState<boolean>(false);


    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        };

        const roles = role.map((r) => r.toUpperCase());
        if (!roles.includes(user.role)) {
            setAccess(false);
        } else {
            setAccess(true);
        };
    }, [user]);
    
    if (isLoading) 
        return <Loader />

    return access? children : null;
}

export default HasAccess;