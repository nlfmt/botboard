import c from "./Button.module.scss"

export interface ButtonProps {
  children?: string
  icon?: React.ReactNode
  onClick?: () => void
  type?: "primary" | "success" | "danger"
}

const Button = (props: ButtonProps) => {
  return (
    <button className={c.button} onClick={props.onClick} data-type={props.type}>
      {props.icon && props.icon}
      {props.children}
    </button>
  )
}

export default Button