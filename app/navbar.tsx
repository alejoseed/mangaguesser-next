import HamNavBar from "./hamNav";
import logo from "../public/logo.svg";
import Link from "next/link";
import Image from "next/image"

function NavBarItems() {
  return (
    <div className="font-link">
      <ul className="flex md:static text-[#3894a3] font-sans text-lg">
        <li>
          <Link href="/"
            className="mx-4 hover:text-[#EEEEEE] duration-30"
            aria-current="page"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/play"
            className="mx-4 hover:text-neutral-200 duration-30"
          >
            Play
          </Link>
        </li>
        <li>
          <Link
            href="/login"
            className="mx-4 hover:text-neutral-200 duration-30"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="mx-4 hover:text-neutral-200 duration-30"
          >
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}

function NavBar() {
  return (
    <>
      <nav className="bg-[#303841] border-gray-200 shadow-lg px-2 sm:px-4 py-2.5 z-0">
        <div className="flex items-center">
          <a href={"/"} className="flex items-center">
            <Image
              src={logo as string}
              alt="logo"
              className="text-yellow-300 wmr-3 h-9 sm:h-9"
            />
            <span className="text-[#3894a3] text-2xl font-light">MangaGuesser</span>
          </a>

          <div className="hidden ml-auto w-full md:flex md:flex-row md:w-auto">
            <NavBarItems />
          </div>
          <HamNavBar />
        </div>
      </nav>
    </>
  );
}

export default NavBar;
