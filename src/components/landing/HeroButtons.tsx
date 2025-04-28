import Button from "./Button";

const HeroButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <PrimaryButton />
      <SecondaryButton />
    </div>
  );
};

const PrimaryButton = () => (
  <Button
    styles={
      "bg-white text-cyan-700 hover:bg-cyan-50 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
    }
    text={"Explorar Cursos"}
  />
);

const SecondaryButton = () => (
  <Button
    styles="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-700 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
    text="Acerca de Nosotros"
  />
);

export default HeroButtons;
