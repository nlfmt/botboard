import { Link } from "react-router-dom"
import c from "./NotFoundPage.module.scss"

const Error = () => {
  return (
    <div className={c.page}>
      <div className={c.content}>
        <h1 className={c.heading}>404</h1>
        <p className={c.text}>
          You seem to be lost,
          wanna go <Link className={c.link} to="/">back home</Link>?
        </p>
      </div>
    </div>
  )
}

export default Error