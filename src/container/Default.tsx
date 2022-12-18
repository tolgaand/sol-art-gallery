import SidebarWithHeader from "components/Sidebar";
import Head from "next/head";
import { PropsWithChildren } from "react";

export const DefaultContainer = (props: PropsWithChildren<{}>) => {
  const { children } = props;
  return (
    <>
      <Head>
        <title>Solart.place</title>
        <meta
          name="description"
          content="Solart.place, a place to share your generated art(with openai) on the Solana blockchain."
        />
        <meta
          name="keywords"
          content="solana, openai, art, blockchain, arweave, free generate art, web3, web3 art"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SidebarWithHeader>
        <main>{children}</main>
      </SidebarWithHeader>
    </>
  );
};
