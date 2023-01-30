import LandingPage from "@/components/LandingPage";
import { useColorMode } from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import { useRouter } from "next/router";

export default function Home() {
  const { colorMode } = useColorMode();

  const router = useRouter();

  return (
    <>
      <NextSeo
        title="Pectra Protocol"
        description="Pair trading made easy."
        openGraph={{
          title: "Pectra Protocol",
          description: "Pair trading made easy.",
          images: [
            {
              url: "https://www.spectraprotocol.com/spectra-protocol.png",
              width: 800,
              height: 600,
              alt: "Pectra Protocol",
            },
          ],
        }}
      />
      <LandingPage />
    </>
  );
}