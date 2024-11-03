"use client"
import React, { useEffect } from "react";
import { useState } from "react";
import { checkAnswer, getMangaImage, getMangaNames } from "./actions";
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

  useEffect(() => {
    const prepareGame = async () => {
      const mangas : MangasResponse | null = await getMangaNames();
      const image : Blob | null = await getMangaImage();
      console.log(image);
      if (!mangas || !image) {
        return null;
      }

      const imageUrl = URL.createObjectURL(image);      
      setMangas(mangas.mangas);
      console.log(imageUrl);
      setMangaUrl(imageUrl);
      setIsLoading(!isLoading);
    }
    prepareGame();
  }, [])

  function handleAnswer(answer: number) {
    const serverAct = async () => {
      const response = await checkAnswer(answer);
      console.log(response);
      
      if (response === true) {
        setPopUp(true); 
    
        setTimeout(() => {
          setPopUp(false);
          location.reload();
        }, 1000);  
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


      <div className="w-svw flex justify-center items-center p-4">
        <div className="relative w-full max-w-[600px] aspect-square">
          <Image className="object-contain" src={mangaUrl} 
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, (max-width:1400) 90vw"
          priority
          alt="No Manga Found" />
        </div>
      </div>

      <footer className="p-2">
          <div className="grid gap-x-4 grid-cols-2 items-center pt-3">
                <div className="grid grid-cols-1 gap-y-2">
                    <button className="buttonManga w-full" style={getButtonStyle(0, mangas[0] || "")} onClick={() => handleAnswer(0)}>{mangas[0]}</button>
                    <button className="buttonManga w-full" style={getButtonStyle(1, mangas[1] || "")} onClick={() => handleAnswer(1)}>{mangas[1]}</button>
                </div>
                <div className="grid grid-cols-1 gap-y-2">
                <button className="buttonManga w-full" style={getButtonStyle(2, mangas[2] || "")} onClick={() => handleAnswer(2)}>{mangas[2]}</button>
                <button className="buttonManga w-full" style={getButtonStyle(3, mangas[3] || "")} onClick={() => handleAnswer(3)}>{mangas[3]}</button>
                </div>
            </div>
      </footer>
    
    </div>
  );
}
