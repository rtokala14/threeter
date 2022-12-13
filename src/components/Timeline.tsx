import { signOut, useSession } from "next-auth/react";
import { CreateTweet } from "./CreateTweet";

export function Timeline() {
  const { data: session } = useSession();
  return (
    <div>
      {session ? <button onClick={() => signOut()}>Log Out</button> : <></>}
      <CreateTweet />
    </div>
  );
}
