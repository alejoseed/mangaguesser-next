import {
  useState,
  useEffect,
  useCallback,
} from "react";
import React from "react";
import Image from "next/image"
import Head from "next/head"

export interface Root {
  result: string
  response: string
  data: Data
}
export interface Data {
  attributes: Attributes
}
export interface Attributes {
  title: Title
  altTitles: AltTitle[]
}
export interface AltTitle {
  ja?: string
  "ja-ro"?: string
}
export interface Title {
  en: string
}
export interface Chapter {
  hash: string
  data: string[]
  dataSaver: string[]
}
export interface playColors {
  colorOne: string
  colorTwo: string
  colorThree: string
  colorFour: string
}
interface MangaResponse {
  mangaNames: string[];
  correctNum: number,
  mangaId : string,
}
interface Answer {
  answer: boolean;
}

let popOpTime : any = null;

export default function Dev(){

  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [streak, setStreak] = useState(0);
  const [popUp, setPopUp] = useState(false);
  const [manga, setManga] = useState({
    mangaOne: "",
    mangaTwo: "",
    mangaThree: "",
    mangaFour: "",
  });
  const [mangaImageUrl, setMangaImageUrl] = useState("");

  const getManga = async () => {
    try {
      const response = await fetch("http://localhost:4000/random_manga");
      
      if (!response.ok) throw new Error("Can't get manga...");
      
      const data: MangaResponse = await response.json() as MangaResponse;
      
      setManga({
        mangaOne: data.mangaNames[0] || "",
        mangaTwo: data.mangaNames[1] || "",
        mangaThree: data.mangaNames[2] || "",
        mangaFour: data.mangaNames[3] || "",
      });

    } catch (error) {
      console.error("There was an error accessing the URL, please verify");
      throw error;
    }
  };

  const getImage = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:4000/image?${Date.now()}`);

      if (!response.ok) throw new Error("Can't get image...");
      
      const data: Blob = await response.blob() as Blob;

      let image: string = URL.createObjectURL(data)

      setMangaImageUrl(image);
      setIsLoading(false);
    } catch (error) {
      console.error("There was an error accessing the URL, please verify");
      throw error;
    }
  };

  
  useEffect(() => {
    getManga(); 
    getImage();
  }, [isLoading]);

  async function handleAnswer(answer : number) {
    await fetch(`http://127.0.0.1:4000/answer?number=${answer}`, {
      method: 'POST',
      body: JSON.stringify({ answer })
      }).then(response => response.json() as Promise<boolean>)
      .then(response => {
        if (response === true) {
          setScore(score + 1);
          setPopUp(true);
          if (score >= streak)
            setStreak(score);
          hp + 10 > 100 ? setHp(100) : setHp(hp + 10);
          
          popOpTime = setTimeout(() => {
            setPopUp(false);
            setIsLoading(true);
          }, 1000);
        }
        else {
          if(score > 0) {
            setScore(score - 1);
            hp - 10 < 0 ? setHp(0) : setHp(hp - 10);  
          }

          if (hp <= 0) {
            setScore(0);
            setStreak(0);      
            setHp(100);
          }
        }
        }).catch(error => {
          console.log("There was an error getting the answer", error);
      })
  }

  if (isLoading) {
    return <div>
      <div className="flex flex-col items-center justify-center max-h-full pt-14">
        <video autoPlay loop muted playsInline className="rounded-lg shadow-lg max-w-[360px] md:max-w-lg">
          <source src="/deku.webm" type="video/webm"/>
        </video>
        <div className="lds-ring pt-3"><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  }

  return ( 
    

    <div className="font-link">

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

      <div className="mx-2">
        <div className="flex flex-col space-x-4 items-center justify-center pt-4">
          
          {popUp && (
            <>
              <dialog open={popUp} 
                      className="grid absolute z-10 opacity-100 bg-slate-500 w-96 h-48 justify-center items-center shadow-lg rounded-lg"
                      >
                <h1 className="text-white text-2xl">You are correct! +10 HP</h1>
              </dialog>
            </>
          )}

          <Image src={mangaImageUrl} alt="NO MANGA FOUND" className="rounded-xl shadow-xl max-w-[330px] md:max-w-[360px]" width={500} height={500}/>
          
          <div className="mt-4 rounded-xl shadow-xl backdrop-blur bg-sky-300 font-link">
            <p>Current streak:   0</p>
            <p>Current score:    0</p>
            <p>Current HP:       0</p>
          </div>
        </div>
        <footer>
          <div className="grid gap-x-4 grid-cols-2 items-center pt-3">
          <div className="grid grid-cols-1 gap-y-2">
              <button className="buttonManga w-full" onClick={() => handleAnswer(0)} style={{ backgroundColor: "#89CFF0", 
              fontSize: manga.mangaOne.length > 41 ? '12px' : 'inherit' }}>
              {manga.mangaOne}</button>
              <button className="buttonManga w-full" onClick={() => handleAnswer(1)} style={{ backgroundColor: "#E3735E",
              fontSize: manga.mangaTwo.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaTwo}</button>
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <button className="buttonManga w-full" onClick={() => handleAnswer(2)} style={{ backgroundColor: "#36454F",
              fontSize: manga.mangaThree.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaThree}</button>
              <button className="buttonManga w-full" onClick={() => handleAnswer(3)} style={{ backgroundColor: "#009e60",
              fontSize: manga.mangaFour.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaFour}</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
