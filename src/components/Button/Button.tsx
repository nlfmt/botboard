import c from "./Button.module.scss"

export interface ButtonProps {
    children?: string
    icon?: React.ReactNode
    onClick?: () => void
}

const Button = (props: ButtonProps) => {
    return (
        <button className={c.button} onClick={props.onClick}>
            { props.icon && props.icon }
            { props.children }
        </button>
    )
}

export default Button