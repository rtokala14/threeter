import { useRouter } from "next/router";
import { Timeline } from "../components/Timeline";
import { Sidebar } from "../components/Sidebar";

export default function UserPage() {
  const router = useRouter();

  const name = router.query.name as string;

  return (
    <div>
      <div className=" flex w-full flex-row justify-center">
        <Sidebar />
        <Timeline
          where={{
            author: {
              name,
            },
          }}
        />
      </div>
    </div>
  );
}
