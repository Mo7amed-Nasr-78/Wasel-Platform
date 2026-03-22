import React from "react";
// import { useProps } from "./PropsProvider"

function HasPermission({ children }: { children: React.ReactNode }) {

    // const { user } = useProps();

    return <>{ children }</>
}

export default HasPermission