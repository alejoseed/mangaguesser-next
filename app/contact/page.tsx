import Image from "next/image"
import linkedin from "@/public/linkedinlogo.svg"
import github from "@/public/githubicon.svg"
import Link from "next/link"
import { Electrolize } from "next/font/google"
import { Metadata } from "next"

const electrolize = Electrolize({
    subsets: ['latin'],
    variable: '--font-electrolize',
    weight: "400"
});

export const metadata: Metadata = {
    title: 'MangaGuesser - Guess every time',
    description: `Showcase your manga skills!`,
    icons: "/logo.svg",
    openGraph: {
      title: "MangaGuesser | Contact Page",
      description: "Try to guess the correct manga!",
      images: "https://mangaguesser.up.railway.app/mangaguesser-vercel-app-480x800phone.webp",
      type: "website",
    }
  }

  
export default function Contact(){
    return (
        <div className={electrolize.className}>            
            <div className="text-center flex flex-col justify-center content-center" style={{height: "80svh"}}>
                
                <div className="text-center p-8">
                    My name is Alejandro Palmar
                </div>
                
                <p>About me:</p>
                <p>I am a Software Developer currently majoring in Computer Science at the University of Central Florida</p>
                <p>I am passionate about sports (it is called football), martial arts, software and cars</p>
                <p>You can find me on LinkedIn</p>
                <p>You can also visit my Github, you might find some more interesting stuff in there</p>
            </div>

            <div className="grid grid-flow-col justify-center gap-8">
                <Link href={"https://www.linkedin.com/in/alejandropalmar/"}>
                    <Image
                        src={linkedin as string}
                        alt="logo"
                        className="h-9 sm:h-9"
                    />
                </Link>
                <Link href={"https://github.com/alejoseed"}>
                    <Image
                    src={github as string}
                    alt="logo"
                    className="h-9 sm:h-9"
                    />
                </Link>

            </div>

        </div>
    );
}
