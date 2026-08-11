import { useProps } from "./PropsProvider";

function HasRole({ children, roles }: { children: React.ReactNode, roles: string[] }) {
    const { user } = useProps();
    const currentRole = user?.role || '';

    return roles.map((role) => (role.toUpperCase())).includes(currentRole)? children : null;
}

export default HasRole;