import dayjs from "dayjs";
import Image from "next/image";
import { type RouterOutputs, trpc, type RouterInputs } from "../utils/trpc";
import { CreateTweet } from "./CreateTweet";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import {
  InfiniteData,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import Link from "next/link";
import { NavBar } from "./NavBar";
import { useRouter } from "next/router";

const LIMIT = 10;

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  function handleScroll() {
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const scrolled = (winScroll / height) * 100;

    setScrollPosition(scrolled);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}

function updateCache({
  client,
  variables,
  data,
  action,
  input,
}: {
  client: QueryClient;
  variables: {
    tweetId: string;
  };
  data: {
    userId: string;
  };
  action: "like" | "unlike";
  input: RouterInputs["tweet"]["timeline"];
}) {
  client.setQueryData(
    [
      ["tweet", "timeline"],
      {
        input,
        type: "infinite",
      },
    ],
    (oldData) => {
      // console.log(oldData);

      const newData = oldData as InfiniteData<
        RouterOutputs["tweet"]["timeline"]
      >;

      const value = action === "like" ? 1 : -1;

      const newTweets = newData.pages.map((page) => {
        return {
          tweets: page.tweets.map((tweet) => {
            if (tweet.id === variables.tweetId) {
              return {
                ...tweet,
                likes: action === "like" ? [data.userId] : [],
                _count: {
                  likes: tweet._count.likes + value,
                },
              };
            }

            return tweet;
          }),
        };
      });

      return {
        ...newData,
        pages: newTweets,
      };
    }
  );
}

function Tweet({
  tweet,
  client,
  input,
}: {
  tweet: RouterOutputs["tweet"]["timeline"]["tweets"][number];
  client: QueryClient;
  input: RouterInputs["tweet"]["timeline"];
}) {
  const likeMutation = trpc.tweet.like.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, input, action: "like" });
    },
  }).mutateAsync;
  const unLikeMutation = trpc.tweet.unlike.useMutation({
    onSuccess: (data, variables) => {
      updateCache({ client, data, variables, input, action: "unlike" });
    },
  }).mutateAsync;

  const hasLiked = tweet.likes.length > 0;

  return (
    <div className="mb-4 border-b-2 border-gray-100">
      <div className="flex p-2">
        {tweet.author.image && (
          <Image
            src={tweet.author.image}
            alt={`${tweet.author.name} profile picture`}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}

        <div className="ml-2">
          <div className="flex items-center">
            <p className="font-bold">
              <Link href={`/${tweet.author.name}`}>{tweet.author.name}</Link>
            </p>
            <p className="text-sm text-gray-400">
              {"   -  "}
              {dayjs(tweet.createdAt).fromNow()}
            </p>
          </div>
          <div>{tweet.text}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center p-2">
        <AiFillHeart
          color={hasLiked ? "red" : "gray"}
          size={"1.5rem"}
          onClick={() => {
            if (hasLiked) {
              unLikeMutation({ tweetId: tweet.id });
              return;
            }

            likeMutation({
              tweetId: tweet.id,
            });
          }}
        />
        <span className="text-sm text-gray-500">{tweet._count.likes}</span>
      </div>
    </div>
  );
}

export function Timeline({
  where = {},
}: {
  where?: RouterInputs["tweet"]["timeline"]["where"];
}) {
  const scrollPosition = useScrollPosition();

  // console.log(scrollPosition);

  const { data, hasNextPage, fetchNextPage, isFetching } =
    trpc.tweet.timeline.useInfiniteQuery(
      {
        limit: LIMIT,
        where,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const client = useQueryClient();

  const tweets = data?.pages.flatMap((page) => page.tweets) ?? [];

  useEffect(() => {
    if (scrollPosition > 90 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [scrollPosition, hasNextPage, isFetching, fetchNextPage]);

  const route = useRouter();

  // console.log("tweets", tweets);

  return (
    <div className=" w-3/4 border-l-2 border-r-2 border-gray-100">
      {/* {session ? (
        <button
          onClick={() => signOut()}
          className=" self-center text-center text-gray-600"
        >
          Log Out
        </button>
      ) : (
        <></>
      )} */}
      {/* <h1 className=" pl-4 pt-3 text-2xl font-bold">Home</h1> */}
      <NavBar />
      {route.asPath === "/" ? <CreateTweet /> : <></>}
      {/* {JSON.stringify(data)} */}
      <div className=" border-t-2 border-gray-100">
        {tweets.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              client={client}
              input={{
                where,
                limit: LIMIT,
              }}
            />
          );
        })}

        {/* {!hasNextPage && <p>End of available tweets</p>} */}
      </div>
    </div>
  );
}
