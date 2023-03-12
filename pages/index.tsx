import LandingPage from "@/components/landing";
import { NextSeo } from "next-seo";

export default function Home() {

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
              url: "https://www.spectra.garden/spectra-protocol.svg",
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
