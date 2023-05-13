import React from "react";
import { useState } from "react";
import Link from "next/link";


function HamNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
        <div className="font-link ml-auto md:hidden">

            <button className="space-y-2 flex flex-col" onClick={() => setIsOpen(!isOpen)} aria-label="Menu button">
                <div className="w-8 h-[3px] bg-black"></div>
                <div className="w-8 h-[3px] bg-black"></div>
                <div className="w-8 h-[3px] bg-black"></div>
            </button>


            {isOpen && (
                <div
                className="absolute right-0 z-10 mt-[15px]
                flex h-auto w-auto flex-col rounded bg-[#3894a3]
                    pb-[1rem] pl-[3.5rem] pr-[1.5rem]"
                >
                    <li className="flex flex-col items-end space-y-8 self-end pt-3 text-xl text-[black] ">
                        <Link href="/" className="duration-[30ms] hover:text-neutral-200" onClick={() => setIsOpen(!isOpen)}>
                            Home
                        </Link>
                        <Link href="/game/Play" className="duration-[30ms] hover:text-neutral-200" onClick={() => setIsOpen(!isOpen)}>
                            Play
                        </Link>
                        <Link href="/login" className="duration-[30ms] hover:text-neutral-200" onClick={() => setIsOpen(!isOpen)}>
                            Login
                        </Link>
                        <Link href="/contact" className="duration-[30ms] hover:text-neutral-200" onClick={() => setIsOpen(!isOpen)}>
                            Contact
                        </Link>
                    </li>
                </div>

            )}

        </div>
    </>
    
  );
}

export default HamNavBar;
