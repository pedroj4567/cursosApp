export type ButtonProps = {
  styles: string;
  text: string;
};

const Button = ({ styles, text }: ButtonProps) => (
  <button className={styles}>{text}</button>
);

export default Button;
