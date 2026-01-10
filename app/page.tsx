import Image from "next/image";
import { Metadata } from 'next'
import Link from "next/link";
export const metadata: Metadata = {
  title: 'MangaGuesser - Guess every time',
  description: `Showcase your manga skills!`,
  icons: "/logo.svg",
  openGraph: {
    title: "MangaGuesser | Main Page",
    description: "Try to guess the correct manga!",
    images: "https://mangaguesser.up.railway.app/mangaguesser-vercel-app-480x800phone.webp",
    type: "website",
  }
}

export default function Home() {
  return (
    <div>
      <main className="">
        <div className='grid justify-items-center roll-out mb-3'>
            <h2 className="flex pt-5 justify-center text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center italic roll-out">TEST YOUR MANGA SKILLS LIKE NEVER BEFORE</h2>
            <Image src="/narutosasuke.webp" alt="mangaguesser"
            className="rounded-xl shadow-xl max-w-[230px] md:max-w-[360px] pt-6" quality={70} priority={true} width={400} height={400}/>
            <div className='pt-2'>
                <button className="flex flex-col space-x-4 items-center justify-center roll-out">
                    <Link href="/play" className="align bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full justify-center">Play Now!</Link>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
