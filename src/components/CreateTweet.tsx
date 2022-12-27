import { type FormEvent, useState } from "react";
import { object, string } from "zod";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TextareaAutosize from "react-textarea-autosize";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const tweetSchema = object({
  text: string({
    required_error: "Threet text is required",
  })
    .min(10)
    .max(280),
});
export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useContext();
  const { data: session } = useSession();

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      setText("");
      utils.tweet.timeline.invalidate();
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await tweetSchema.parse({ text });
    } catch (e) {
      // setError(e.message);
      return;
    }

    if (text.length < 10) {
      setError("Threet must be at least 10 characters long");
      return;
    }

    mutateAsync({ text });

    // setText("");
  }

  return (
    <>
      {error && JSON.stringify(error)}
      {session ? (
        <form
          onSubmit={handleSubmit}
          className="mb-4 flex w-full flex-col rounded-md  p-4"
        >
          <div className=" flex flex-row justify-between">
            <Link href={`/${session.user?.name}`}>
              <Image
                src={session.user!.image!}
                alt={`${session.user?.name} profile picture`}
                width={68}
                height={68}
                className="rounded-full"
              />
            </Link>

            <TextareaAutosize
              className="w-full resize-none p-4 shadow"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"What's Happening?"}
              minLength={10}
              maxLength={280}
              minRows={4}
              maxRows={8}
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            {text.length > 0 ? (
              text.length === 280 ? (
                <CircularProgressbar
                  value={(text.length / 280) * 100}
                  className=" h-10 w-10 "
                  styles={{
                    root: {
                      width: "13%",
                    },
                    path: {
                      stroke: "red",
                    },
                  }}
                />
              ) : text.length > 200 ? (
                <CircularProgressbar
                  value={(text.length / 280) * 100}
                  className=" h-10 w-10 "
                  styles={{
                    root: {
                      width: "13%",
                    },
                    path: {
                      stroke: "orange",
                    },
                  }}
                />
              ) : (
                <CircularProgressbar
                  value={(text.length / 280) * 100}
                  className=" h-10 w-10 "
                  styles={{
                    root: {
                      width: "13%",
                    },
                    path: {
                      stroke: "blue",
                    },
                  }}
                />
              )
            ) : (
              <></>
            )}
            <button
              className="rounded-md bg-primary px-5 py-2 text-white"
              type="submit"
            >
              Threet
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
    </>
  );
}
