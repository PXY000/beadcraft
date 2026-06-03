import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GeneratorSection } from "@/components/sections/generator-section";
import { ShowcaseSection } from "@/components/sections/showcase-section";
import { AboutSection } from "@/components/sections/about-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <GeneratorSection />
        <FeaturesSection />
        <ShowcaseSection />
        <AboutSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
