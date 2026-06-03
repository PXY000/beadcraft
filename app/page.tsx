import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GeneratorSection } from "@/components/sections/generator-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <GeneratorSection />
        <ShowcaseSection />
      </main>
      <Footer />
    </>
  );
}
