import Head from "next/head";
import ContentView from "@/components/ContentView";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chatfi</title>
        <meta name="description" content="Query Coinbase's latest 10-Q" />
      </Head>
      <ContentView />
    </>
  );
}
