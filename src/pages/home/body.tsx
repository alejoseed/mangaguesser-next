// I honestly don't know if this is necessary but I'll keep it just for the sake of doing it
// I'll have to make more componets, format them and just render them there
import Link from 'next/link';
import Image from 'next/image'
import React from 'react'

export default function Body() {
    return(
        <div className='grid justify-items-center roll-out mb-3'>
            <h2 key={Math.random()} className="homeText roll-out">TEST YOUR MANGA SKILLS LIKE NEVER BEFORE</h2>
            <Image src="/narutosasuke.webp" alt="mangaguesser"
            className="rounded-xl shadow-xl max-w-[230px] md:max-w-[360px] pt-6" quality={70} priority={true} width={400} height={400}/>
            <div className='pt-2'>
                <div className="flex flex-col space-x-4 items-center justify-center roll-out">
                    <button className="align bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full justify-center">
                        <Link href="/game/Play">Play Now!</Link>
                        </button>
                </div>
            </div>
        </div>
    );
}
