import React from "react";
import Image from "next/image"

// @ts-ignore
export default function Custom404() {
    return (
        <div>
            <div className="flex flex-col h-screen">
                <div className="flex items-center  pt-10 justify-center">
                    <Image src="/raw.png" alt="Error 404" className="rounded-xl shadow" width={500} height={500}/>
                </div>
                <div className="flex flex-col items-center justify-center m-3">
                    <h1>ERROR 404</h1>
                    <h2>Oh Oh! - Seems like you're lost. Try going back to the home page.</h2>
                </div>
            </div>
        </div>
    );
}