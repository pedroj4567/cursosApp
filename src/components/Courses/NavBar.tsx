import { Dropdown, DropdownItem } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../constants/routes";

const Navbar = () => {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <nav className=" bg-blue-700  text-white p-4 shadow-md z-50 absolute w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">FrostAcademy</div>

        <div className="hidden md:flex space-x-6">
          {routes.map((route) => {
            return (
              <Link
                key={route.id}
                to={route.path}
                className={`hover:text-cyan-100 transition ${
                  pathname == route.path ? "border-b-2  border-white" : ""
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center transition-all ">
          <Dropdown
            label="Opciones"
            dismissOnClick={true}
            className="cursor-pointer"
          >
            <DropdownItem className="text-red-600 " onClick={() => logout()}>
              Cerrar Sesion
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
