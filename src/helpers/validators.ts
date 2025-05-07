export const validateEmail = (email: string) => {
  if (!email) return "El correo es obligatorio";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return "Correo inválido";
  }
  return undefined;
};

export const validatePassword = (password: string) => {
  if (!password) return "La contraseña es obligatoria";
  if (password.length < 6) return "Mínimo 6 caracteres";
  return undefined;
};
