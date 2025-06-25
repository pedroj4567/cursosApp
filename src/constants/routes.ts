export type NavLinks = {
  id: number;
  label: string;
  path: string;
};

export const routes: NavLinks[] = [
  {
    id: 1,
    label: "Inicio",
    path: "/courses",
  },
  {
    id: 2,
    label: "Mis Cursos",
    path: "/my-courses",
  },
  {
    id: 3,
    label: "Buscador",
    path: "/search",
  },
];
