import React from "react"
import NavBar from "./navBar";

// @ts-ignore
export default function Layout({ children }) {
    return <div>
        <NavBar />
        {children}
        </div>;
}