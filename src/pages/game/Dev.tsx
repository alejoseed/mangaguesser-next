import {
  useState,
  useEffect,
  useCallback,
} from "react";
import React from "react";
import Image from "next/image"
import Head from "next/head"
import { boolean } from "zod";
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

export default function Dev(){

  const [isLoading, setIsLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [manga, setManga] = useState({
    mangaOne: "",
    mangaTwo: "",
    mangaThree: "",
    mangaFour: "",
  });
  const [mangaImageUrl, setMangaImageUrl] = useState("");

  const getManga = useCallback(async (url: string): Promise<MangaResponse | undefined> => {
    let tmpManga : MangaResponse = {} as MangaResponse;

    try {
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data: MangaResponse = await response.json() as MangaResponse;

      tmpManga = data;
      return tmpManga;

    } catch (error) {
      console.error("There was an error accessing the URL, please verify");
      throw error;
    }
  }, []);


  const getImage = useCallback(async (imgurl : string) : Promise<any> => {
    try {
      const response = await fetch(imgurl);

      const blob = await response.blob();
      
      const url : string = URL.createObjectURL(blob) || "";
      return url
    } catch (error) {
      console.error("There was an error accessing the URL, please verify");
      throw error;
    }
  }, []);

  useEffect(() => {
    const url = "http://127.0.0.1:4000/random_manga";

    getManga(url)
      .then((res: MangaResponse | undefined) => {
        if (res) {
          setManga({
            mangaOne: res.mangaNames[0] || "",
            mangaTwo: res.mangaNames[1] || "",
            mangaThree: "",
            mangaFour: "",
          });
        } else {
          // Handle the case when res is null (e.g., show an error message)
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle the error case (e.g., show an error message)
        setIsLoading(false);
      });
  }, [getManga]);


  useEffect(() => {
    const imageUrl = `http://127.0.0.1:4000/image?${Date.now()}`;

    getImage(imageUrl)
    .then(
      (res : string) => {
        setMangaImageUrl(res);
        setIsLoading(false);
      }
    ).catch (
      error => console.error("error assigning the image", error)
    );

  }, [getImage]);

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
              <button className="buttonManga w-full" style={{ backgroundColor: "#89CFF0", 
              fontSize: manga.mangaOne.length > 41 ? '12px' : 'inherit' }}>
              {manga.mangaOne}</button>
              <button className="buttonManga w-full" style={{ backgroundColor: "#E3735E",
              fontSize: manga.mangaTwo.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaTwo}</button>
            </div>
            <div className="grid grid-cols-1 gap-y-2">
              <button className="buttonManga w-full" style={{ backgroundColor: "#36454F",
              fontSize: manga.mangaThree.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaThree}</button>
              <button className="buttonManga w-full" style={{ backgroundColor: "#009e60",
              fontSize: manga.mangaFour.length > 41 ? '12px' : 'inherit'
              }}>{manga.mangaFour}</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
