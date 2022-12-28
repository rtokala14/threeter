import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaTwitter,
  FaHome,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCode,
} from "react-icons/fa";

export function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className=" mr-6 w-16 xl:w-64" aria-label="Sidebar">
      <div className="overflow-y-auto rounded py-4 px-3 ">
        <ul className="flex flex-col items-start justify-start gap-3 space-y-3">
          <Link href={"/"}>
            <li className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7">
              <FaTwitter
                size={45}
                style={{
                  padding: "2px",
                  color: "blue",
                }}
              />
              <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
                Threeter
              </h1>
            </li>
          </Link>
          <Link href={"/"}>
            <li className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100 xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7">
              <FaHome
                size={35}
                style={{
                  padding: "2px",
                }}
              />
              <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
                Home
              </h1>
            </li>
          </Link>
          <li className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100  xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7">
            <FaSearch
              size={35}
              style={{
                padding: "2px",
              }}
            />
            <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
              Search
            </h1>
          </li>
          <Link href={`/${session?.user?.name}`}>
            <li className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100  xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7">
              <FaUser
                size={35}
                style={{
                  padding: "2px",
                }}
              />
              <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
                Profile
              </h1>
            </li>
          </Link>
          {session ? (
            <button
              className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100  xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7"
              onClick={() => signOut()}
            >
              <FaSignOutAlt
                size={35}
                style={{
                  padding: "2px",
                }}
              />
              <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
                Sign Out
              </h1>
            </button>
          ) : (
            <></>
          )}
          <li>
            <hr className="h-1 w-9 rounded-3xl border-0 bg-gray-200 xl:w-56" />
          </li>
          <a href="https://github.com/rtokala14/threeter" target={"_blank"}>
            <li className=" flex h-10 w-10 items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100  xl:h-auto xl:w-auto xl:rounded-3xl xl:p-2 xl:pr-7">
              <FaCode
                size={35}
                style={{
                  padding: "2px",
                }}
              />
              <h1 className=" ml-4 hidden text-lg font-semibold xl:block">
                GitHub
              </h1>
            </li>
          </a>
        </ul>
      </div>
    </aside>
  );
}
