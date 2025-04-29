import AboutProjectSection from "../../components/landing/AboutProjectSection";
import CategorySection from "../../components/landing/CategorySection";
import ContentCourseSection from "../../components/landing/ContentCourseSection";
import Footer from "../../components/landing/Footer";
import HeroContent from "../../components/landing/HeroContent";
import HeroSection from "../../components/landing/HeroSection";
import LandingNav from "../../components/landing/LandingNav";
import { Element } from "react-scroll";

const LandingPage = () => {
  return (
    <main className="relative w-full overflow-hidden">
      <HeroSection>
        <LandingNav />
        <HeroContent
          title="Aprende con los Mejores"
          description="Cursos especializados en tecnología con enfoque práctico y moderno"
        />
      </HeroSection>
      <Element name="contentCourseSection">
        <ContentCourseSection />
      </Element>
      <Element name="aboutProjectSection">
        <AboutProjectSection />
      </Element>
      <Element name="categorySection">
        <CategorySection />
      </Element>

      <Footer />
    </main>
  );
};

export default LandingPage;
