import { FormEvent, useState } from "react";
import { object, string, ZodError } from "zod";
import { trpc } from "../utils/trpc";

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

  const { mutateAsync } = trpc.tweet.create.useMutation();

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
  }

  return (
    <>
      {error && JSON.stringify(error)}
      <form
        onSubmit={handleSubmit}
        className="mb-4 flex w-full flex-col rounded-md border-2 p-4"
      >
        <textarea
          className="w-full p-4 shadow"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-md bg-primary px-4 py-2 text-white"
            type="submit"
          >
            Threet
          </button>
        </div>
      </form>
    </>
  );
}
