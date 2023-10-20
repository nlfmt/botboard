import c from "./Button.module.scss"

export interface ButtonProps {
    children: string
    icon: React.ReactNode
}

const Button = (props: ButtonProps) => {
    return (
        <button className={c.button}>
            { props.icon && props.icon }
            { props.children }
        </button>
    )
}

export default Button