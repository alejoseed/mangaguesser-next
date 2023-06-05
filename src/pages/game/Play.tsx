import {
  useState,
  useEffect,
} from "react";
import React from "react";
import Image from "next/image"
import Head from "next/head"

interface MangaResponse {
  mangaNames: string[];
  correctNum: number,
  mangaId : string,
}

async function getManga() {
  try {
    const response = await fetch("http://localhost:4000/random_manga");
    
    if (!response.ok) throw new Error("Can't get manga...");
    
    const data: MangaResponse = await response.json() as MangaResponse;
    
    return data;

  } catch (error) {
    console.error("There was an error accessing the URL, please verify");
    throw error;
  }
}


async function getImage() {
  try {
    const response = await fetch(`http://localhost:4000/image?${Date.now()}`);

    if (!response.ok) throw new Error("Can't get image...");
    
    const data: Blob = await response.blob();

    const image: string = URL.createObjectURL(data)

    //setMangaImageUrl(image);
    //setIsLoading(false);
    return image;

  } catch (error) {
    console.error("There was an error accessing the URL, please verify");
    throw error;
  }
}

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

  const prepareGame = async () => {
    setIsLoading(true);

    try {
      const mangaResponse = await getManga();
      const imageResponse = await getImage();

      setManga({
        mangaOne: mangaResponse.mangaNames[0] || "",
        mangaTwo: mangaResponse.mangaNames[1] || "",
        mangaThree: mangaResponse.mangaNames[2] || "",
        mangaFour: mangaResponse.mangaNames[3] || "",
      });

      setMangaImageUrl(imageResponse);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    void prepareGame()
  }, []);

  function handleAnswer(answer: number) {
    fetch(`http://127.0.0.1:4000/answer?number=${answer}`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          setScore((prevScore) => prevScore + 1);
          setPopUp(true);
          if (score >= streak) {
            setStreak(score);
          }
          hp + 10 > 100 ? setHp(100) : setHp((prevHp) => prevHp + 10);
  
          setTimeout(() => {
            setPopUp(false);
            void prepareGame()
          }, 1000);
        } else {
          if (score > 0) {
            setScore((prevScore) => prevScore - 1);
            hp - 10 < 0 ? setHp(0) : setHp((prevHp) => prevHp - 10);
          }
  
          if (hp <= 0) {
            setScore(0);
            setStreak(0);
            setHp(100);
          }
        }
      })
      .catch((error) => {
        console.log("There was an error getting the answer", error);
      });
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

          <img src={mangaImageUrl} alt="NO MANGA FOUND" className="rounded-xl shadow-xl max-w-[330px] md:max-w-[360px]" width={500} height={500}/>
          
          <div className="mt-4 rounded-xl shadow-xl backdrop-blur bg-sky-300 font-link">
            <p>Current streak:   {streak}</p>
            <p>Current score:    {score} </p>
            <p>Current HP:       {hp}    </p>
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
