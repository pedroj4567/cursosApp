import HeroButtons from "./HeroButtons";

export type HeroContentProps = {
  title: string;
  description: string;
};
const HeroContent = ({ title, description }: HeroContentProps) => {
  return (
    <div className="relative z-10 container mx-auto px-6 pt-24 pb-32 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-cyan-50 mb-8 max-w-2xl mx-auto">
        {description}
      </p>
      <HeroButtons />
    </div>
  );
};

export default HeroContent;
