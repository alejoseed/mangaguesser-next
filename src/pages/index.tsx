import { type NextPage } from "next";
import Head from "next/head";
import Body from "./home/body"
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>MangaGuesser - Guess every time</title>
        <meta name="description" content="Showcase your manga skills!" />
        <link rel="icon" href="/logo.svg" />

        <meta property="og:title" content="MangaGuesser | Main Page" />
        <meta property="og:description" content="Get a bunch of random manga and try to guess the correct one!" />
        <meta property="og:image" content="https://mangaguesser.up.railway.app/mangaguesser-vercel-app-480x800phone.webp" />
        <meta property="og:url" content="https://mangaguesser.vercel.app" />
        <meta property="og:type" content="website" />
      </Head>
      
      <main className="">
          <Body />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
