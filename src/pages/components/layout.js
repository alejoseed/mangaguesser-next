import React from "react"
import NavBar from "./navBar";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function Layout({ children }) {
    return <div>
        <NavBar />
        {children}
        </div>;
}