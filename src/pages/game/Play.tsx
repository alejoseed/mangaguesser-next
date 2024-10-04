import {
  useState,
  useEffect,
} from "react";
import React from "react";
import Head from "next/head"

interface MangaResponse {
  mangas: string[];
  CurrentStoredMangaId: string,
}

async function getManga() {
  try {
    const response = await fetch("https://www.alejoseed.com/mangaguesser/random_manga");
    console.log(response)
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
    const response = await fetch(`https://www.alejoseed.com/mangaguesser/image?${Date.now()}`);
    console.log(response);
    if (!response.ok) throw new Error("Can't get image...");
    
    const data: Blob = await response.blob();

    const image: string = URL.createObjectURL(data)

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

  async function prepareGame() {
    setIsLoading(true);
    debugger;
    try {
      const mangaResponse = await getManga();

      setManga({
        mangaOne: mangaResponse.mangas[0] || "",
        mangaTwo: mangaResponse.mangas[1] || "",
        mangaThree: mangaResponse.mangas[2] || "",
        mangaFour: mangaResponse.mangas[3] || "",
      });
      
      const imageResponse = await getImage();
      setMangaImageUrl(imageResponse);

    } catch (error) {
      console.error(`${error} in the prepareGame function`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    prepareGame()
  }, []);

  function handleAnswer(answer: number) {
    fetch(`https://www.alejoseed.com/mangaguesser/answer?number=${answer}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          setScore((prevScore) => prevScore + 1);
          setPopUp(true);
          if (score >= streak) {
            setStreak(score);
          }

          if (hp + 10 > 100) {
            setHp(100)
          }
          else {
            setHp((prevHp) => prevHp + 10);
          }

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
    <div className="grid grid-flow-row grid-rows-[auto_1fr_auto] h-full w-full justify-center">

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
        {/* md:w-[660px] w-[360px] flex mt-10 items-center */}
      <div className="text-center">
        {/* w-full md:h-[660px] h-[360px] object-contain text-center */}
        <img className="md:h-[40vw] md:w-[40vw] lg:h-[30vw] lg:w-[30vw] sm:h-[40vw] sm:w-[40vw] h-[90vw] w-[90vw] object-contain " src={mangaImageUrl} alt="No Manga Found" />
      </div>

      <div className="justify-self-center 
                      m-4 
                      rounded-xl 
                      shadow-xl
                      backdrop-blur 
                      bg-sky-300
                      text-center 
                      justify-center">
        <div className="font-sans text-lg">Current streak:   {streak}</div>
        <div className="font-sans text-lg">Current score:    {score} </div>
        <div className="font-sans text-lg">Current HP:       {hp}    </div>
      </div>
      

      <footer className="absolute grid grid-cols-2 gap-x-2 p-3 w-full inset-x-0 bottom-0">
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
