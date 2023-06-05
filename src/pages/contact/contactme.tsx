import Head from "next/head"
import Image from "next/image"
import linkedin from "public/linkedinlogo.svg"
import github from "public/githubicon.svg"
import Link from "next/link"
import { Electrolize } from "next/font/google"

const electrolize = Electrolize({
    subsets: ['latin'],
    variable: '--font-electrolize',
    weight: "400"
});

export default function Contact(){
    return (
        <div className={electrolize.className}>
            <Head>
                <title>MangaGuesser - Play</title>
                <meta name="description" content="Showcase your manga skills!" />
                <link rel="icon" href="/logo.svg" />
                <link rel="preconnect" href="https://mangaguesser.up.railway.app" />

                <meta property="og:title" content="MangaGuesser | Play Page" />
                <meta property="og:description" content="Get a bunch of random manga and try to guess the correct one!" />
                <meta property="og:image" content="https://mangaguesser.up.railway.app/mangaguesser-vercel-app-480x800phone.webp" />
                <meta property="og:url" content="https://mangaguesser.vercel.app" />
                <meta property="og:type" content="website" />
            </Head>

            
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
