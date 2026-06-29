import { Nav } from "@/components/velvet/Nav";
import { ScrollProgress } from "@/components/velvet/ScrollProgress";
import { Hero } from "@/components/velvet/Hero";
import { Manifesto } from "@/components/velvet/Manifesto";
import { NightNotes } from "@/components/velvet/NightNotes";
import { Network } from "@/components/velvet/Network";
import { CreativeDispatch } from "@/components/velvet/CreativeDispatch";
import { EditorialArchive } from "@/components/velvet/EditorialArchive";
import { Coordinates } from "@/components/velvet/Coordinates";
import { IndexSection } from "@/components/velvet/IndexSection";
import { Film } from "@/components/velvet/Film";
import { Footer } from "@/components/velvet/Footer";
import { SoundProvider } from "@/components/velvet/SoundEngine";

export default function Home() {
  return (
    <SoundProvider>
      <main className="relative grain bg-ink text-bone min-h-screen flex flex-col overflow-x-hidden">
        <ScrollProgress />
        <Nav />
        <Hero />
        <Manifesto />
        <NightNotes />
        <Network />
        <CreativeDispatch />
        <EditorialArchive />
        <Coordinates />
        <IndexSection />
        <Film />
        <Footer />
      </main>
    </SoundProvider>
  );
}
