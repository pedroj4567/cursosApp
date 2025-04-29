import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import Button from "../buttons/Button";

const HeroButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <PrimaryButton />
      <SecondaryButton />
    </div>
  );
};

const PrimaryButton = () => (
  <Link
    to="categorySection"
    smooth={true}
    className={
      "bg-white text-cyan-700 hover:bg-cyan-50 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
    }
  >
    Explorar Cursos
  </Link>
);

const SecondaryButton = () => {
  const navigator = useNavigate();

  return (
    <Button
      styles="bg-transparent border-2 border-white text-white hover:bg-white hover:text-cyan-700 font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 cursor-pointer"
      text="Acerca de Nosotros"
      nextPage={() => {
        navigator("/auth");
      }}
    />
  );
};

export default HeroButtons;
