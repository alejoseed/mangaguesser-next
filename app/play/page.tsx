"use client"
import React, { useEffect } from "react";
import { useState } from "react";
import { checkAnswer, getMangaNames } from "./actions";
import { MangasResponse } from "Mangaguesser";
import Image from "next/image";

const buttonStyles = [
  { backgroundColor: "#89CFF0" }, // Light Blue
  { backgroundColor: "#E3735E" }, // Salmon
  { backgroundColor: "#36454F" }, // Charcoal
  { backgroundColor: "#009e60" }  // Green
];

const getButtonStyle = (index: number, title: string) => ({
  ...buttonStyles[index],
  fontSize: title.length > 41 ? '12px' : 'inherit'
});

export default function Play(){
  const [isLoading, setIsLoading] = useState(true);
  const [mangas, setMangas] = useState<string[]>(["", "", "", ""]);
  const [mangaUrl, setMangaUrl] = useState<string>("");
  const [popUp, setPopUp] = useState<boolean>(false);
  const [clickedButton, setClickedButton] = useState<number | null>(null);

  useEffect(() => {
    const prepareGame = async () => {
      const mangaData : MangasResponse | null = await getMangaNames();
      if (!mangaData) {
        return null;
      }

      setMangas(mangaData.mangas);
      setMangaUrl(mangaData.imageUrl);
      setIsLoading(!isLoading);
    }
    prepareGame();
  }, [])

  function handleAnswer(answer: number) {
    setClickedButton(answer);
    
    const serverAct = async () => {
      const response = await checkAnswer(answer);

      if (response === true) {
        setPopUp(true); 
    
        setTimeout(() => {
          setPopUp(false);
          location.reload();
        }, 1000);  
      } else {
        // Reset clicked state after wrong answer
        setTimeout(() => {
          setClickedButton(null);
        }, 300);
      }
    }
    serverAct();
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
    <div className="grid grid-flow-row grid-rows-[1fr_auto] h-full w-full justify-center">
      {popUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="font-link bg-cyan-400 rounded-2xl w-[320px] p-8 shadow-2xl 
                          animate-[scale-in_0.3s_ease-out] flex flex-col items-center gap-4">
            <div className="text-4xl">🎉</div>
            <div className="text-2xl font-bold text-center">
              <p>You are correct!</p>
              <p className="text-3xl text-green-700 mt-2">+10HP!</p>
            </div>
          </div>
        </div>
      )}


      <div className="w-svw flex justify-center items-center p-4">
        <div className="relative w-full max-w-[600px] aspect-square">
          <Image className="object-contain" src={mangaUrl} 
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, (max-width:1400) 90vw"
          priority
          alt="No Manga Found" />
        </div>
      </div>

    <footer className="flex gap-2 p-2 w-full"> 
      <div className="flex flex-col gap-2 flex-1">
        <button 
          className={`w-full h-20 rounded-md px-4 text-sm font-semibold 
                    grid place-items-center text-center 
                    transition-all duration-100
                    leading-tight
                    ${clickedButton === 0 
                      ? 'scale-95 animate-pulse' 
                      : 'hover:-translate-y-3 active:scale-95'}`}
          style={buttonStyles[0]} 
          onClick={() => handleAnswer(0)}
          disabled={clickedButton !== null}>
            {mangas[0]}
        </button>
        <button 
          className={`w-full h-20 rounded-md px-4 text-sm font-semibold 
                    grid place-items-center text-center 
                    transition-all duration-100
                    leading-tight
                    ${clickedButton === 1 
                      ? 'scale-95 animate-pulse' 
                      : 'hover:-translate-y-3 active:scale-95'}`}
          style={buttonStyles[1]} 
          onClick={() => handleAnswer(1)}
          disabled={clickedButton !== null}>
            {mangas[1]}
        </button>
      </div>
      
      <div className="flex flex-col gap-2 flex-1">
        <button 
          className={`w-full h-20 rounded-md px-4 text-sm font-semibold 
                    grid place-items-center text-center 
                    transition-all duration-100
                    leading-tight
                    ${clickedButton === 2 
                      ? 'scale-95 animate-pulse' 
                      : 'hover:-translate-y-3 active:scale-95'}`}
          style={buttonStyles[2]}
          onClick={() => handleAnswer(2)}
          disabled={clickedButton !== null}>
            {mangas[2]}
        </button>
        <button 
          className={`w-full h-20 rounded-md px-4 text-sm font-semibold 
                    grid place-items-center text-center 
                    transition-all duration-100
                    leading-tight
                    ${clickedButton === 3 
                      ? 'scale-95 animate-pulse' 
                      : 'hover:-translate-y-3 active:scale-95'}`}
          style={buttonStyles[3]}
          onClick={() => handleAnswer(3)}
          disabled={clickedButton !== null}>
            {mangas[3]}
        </button>
      </div>
    </footer>

    </div>
  );
}
