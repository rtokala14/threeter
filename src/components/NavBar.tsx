import { useRouter } from "next/router";
import { FaAngleLeft } from "react-icons/fa";
import { trpc } from "../utils/trpc";

export function NavBar() {
  const route = useRouter();
  const { isFetched, data: count } = trpc.tweet.countTweets.useQuery({
    author: { name: `${route.query.name}` },
  });
  console.log(count);

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
          {isFetched ? (
            <p className=" text-sm text-gray-500">{`${count?._count.id} Tweets`}</p>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
