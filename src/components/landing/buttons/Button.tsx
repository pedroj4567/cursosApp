export type ButtonProps = {
  styles: string;
  text: string;
  children?: React.ReactNode;
  nextPage?(): void;
};

const Button = ({ styles, text, children, nextPage }: ButtonProps) => (
  <button className={styles} onClick={nextPage}>
    {text}
    {children}
  </button>
);

export default Button;
