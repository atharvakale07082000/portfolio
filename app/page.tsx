import Hero from "@/components/home/Hero";
import AboutScene from "@/components/home/AboutScene";
import Services from "@/components/home/Services";
import Works from "@/components/home/Works";
import Reviews from "@/components/home/Reviews";
import Skills from "@/components/home/Skills";
import PendingGlide from "@/components/home/PendingGlide";
import { testimonials } from "@/lib/content";

export default function Home() {
    return (
        <>
            <PendingGlide />
            <Hero />
            <AboutScene />
            <Services />
            <Works />
            {testimonials.length > 0 && <Reviews />}
            <Skills />
        </>
    );
}
