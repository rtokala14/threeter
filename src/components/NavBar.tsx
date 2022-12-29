import { useRouter } from "next/router";
import { FaAngleLeft } from "react-icons/fa";

export function NavBar() {
  const route = useRouter();

  //   console.log(route);

  return (
    <div>
      {route.asPath === "/" ? (
        <div>
          <h1 className=" ml-6 mt-3 text-2xl font-bold">Home</h1>
        </div>
      ) : (
        <div className=" mt-3 ml-3 flex flex-row items-center gap-3">
          <button onClick={() => route.back()}>
            <FaAngleLeft size={35} />
          </button>
          <h1 className=" text-2xl font-bold">{route.query.name}</h1>
          <p className=" text-sm text-gray-500">25 Tweets</p>
        </div>
      )}
    </div>
  );
}
