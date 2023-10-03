import reactLogo from "../public/react.svg"
import viteLogo from "../public/vite.svg"
import c from "./App.module.scss"
import { classes } from "./util/util"
import { useState } from "react"
import api from "./util/api"

const Showcase = () => {
  const [count, setCount] = useState(0)

  const res = api.test.useQuery("Tom")
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={c.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={classes(c.logo, c.react)}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className={c.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={c.readTheDocs}>{res.data ? (
        res.data.map(item => {
            return <span key={item.id}>{item.title} - {item.body}</span>
        })
      ) : "loading"}</p>
    </>
  )
}

export default Showcase
