import React from "react"
import NavBar from "./navBar";
import { Suspense } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function Layout({ children }) {
    return (
    <div>
        <NavBar />
        <Suspense fallback={<p>loading...</p>}>
            {children}
        </Suspense>
    </div>
    );
}