import { type NextPage } from "next";
import Head from "next/head";

import { Timeline } from "../components/Timeline";
import { Sidebar } from "../components/Sidebar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Threeter</title>
        <meta
          name="description"
          content="Threeter: A clone of Twitter by Rohit Reddy Tokala"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" flex w-full flex-row justify-center">
        <Sidebar />
        <Timeline />
      </div>
    </>
  );
};

export default Home;
