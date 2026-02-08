import { Header } from "@/components/ui/Header";
import { GridSizeSelector } from "../components/GridSizeSelector";
import Image from "next/image";
import background from "@/public/background.jpg"

export default function Home() {
  return (
    <>
      <div className="relative h-screen w-screen">
        {/* Background Image */}
        <Image
          src={background}
          alt="Background"
          quality={100}
          fill // makes the image fill the parent element
          className="bg-cover dark:hidden"
          // Add priority if the image is above the fold (LCP element)
          priority
        />

        {/* Content Overlay */}
        <div className="relative z-10">
          <Header onMarketingPage={true} />
          <div className="min-h-screen flex items-center justify-center">
            <GridSizeSelector />
          </div>
        </div>
      </div >
    </>

  );
}
