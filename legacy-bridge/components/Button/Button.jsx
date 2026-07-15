import { globalStyles } from "../../styles/global.style";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const variants = {
  primary: globalStyles.primaryButton,
  secondary: globalStyles.secondaryButton,
  danger: globalStyles.dangerButton,
  success: globalStyles.successButton,
};

export default function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(globalStyles.buttonBase, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
