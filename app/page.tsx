import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeaturedProducts from "@/components/FeaturedProducts";

// Lazy load below-fold components to reduce initial JS bundle
const AboutSection = dynamic(() => import("@/components/AboutSection"));
const ProductCatalog = dynamic(() => import("@/components/ProductCatalog"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const CTABanner = dynamic(() => import("@/components/CTABanner"));
const Newsletter = dynamic(() => import("@/components/Newsletter"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <FeaturedProducts />
        <AboutSection />
        <ProductCatalog />
        <Testimonials />
        <CTABanner />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
