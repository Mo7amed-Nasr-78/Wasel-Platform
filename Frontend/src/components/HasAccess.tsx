import { useEffect ,useState,type ReactNode } from "react";
import { useProps } from "./PropsProvider";
import { useNavigate } from "react-router-dom";

function HasAccess({ children, role }: { children: ReactNode, role: string[] }) {
    const { user } = useProps();
    const navigate = useNavigate();
    const [ access, setAccess ] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const roles = role.map((r) => r.toUpperCase());
        if (!roles.includes(user.role)) {
            navigate("/");
            return;
        } else {
            setAccess(true);
        };
    }, [user]);
    

    return access? children : null;
}

export default HasAccess;