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
    const response = await fetch("https://mangaguesser.up.railway.app/random_manga");
    
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
    const response = await fetch(`https://mangaguesser.up.railway.app/image?${Date.now()}`);

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
    fetch(`https://mangaguesser.up.railway.app/answer?number=${answer}`, {
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
    <div className="flex flex-col h-full w-full lg:justify-center">

        {popUp && (
        <div className="font-link flex h-full w-full z-50 absolute opacity-80 bg-black justify-items-center">
          <dialog open={true}
            className="self-center text-center bg-cyan-400 rounded-lg w-[300px] h-[200px] flex justify-center items-center"
          >
            <div className="text-2xl ">
              <p>You are correct! +10HP!</p>
            </div>
          </dialog>
        </div>
        )}


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

      <div className="md:w-[660px] w-[360px] flex self-center mt-10">
        <img className="w-full md:h-[660px] h-[360px] object-contain self-center text-center" src={mangaImageUrl} alt="No Manga Found" />
      </div>

      <div className="max-w-[130px] mt-4 rounded-xl shadow-xl backdrop-blur self-center bg-sky-300 font-link text-center justify-center">
        <p>Current streak:   {streak}</p>
        <p>Current score:    {score} </p>
        <p>Current HP:       {hp}    </p>
      </div>

      <footer className="grid grid-cols-2 gap-x-2 p-3 w-full fixed bottom-0">
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
                }}>{manga.mangaThree}
              </button>
              
              <button className="buttonManga w-full" onClick={() => handleAnswer(3)} style={{ backgroundColor: "#009e60",
                fontSize: manga.mangaFour.length > 41 ? '12px' : 'inherit'
                }}>{manga.mangaFour}
              </button>
            </div>

      </footer>
    
    </div>
  );
}
