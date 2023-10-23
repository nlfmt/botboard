import Button from "@/components/Button/Button"
import { GitHub } from "@mui/icons-material"
import c from "./Login.module.scss"
import Discord from "@/assets/discord.svg"
import { useNavigate } from "react-router-dom"
import Title from "@/components/Title/Title"
import Text from "@/components/Text/Text"

const Login = () => {

  const navigate = useNavigate()

  const redirectToOAuth = (provider: string) => {
    if (import.meta.env.DEV) {
      window.location.href = `http://localhost:3000/api/login/${provider}`
    } else {
      navigate(`/api/login/${provider}`)
    }
  }

  return (
    <div className={c.login}>
      <Title>Login</Title>
      <Text>Login to your account to manage your bots.</Text>
      <Button
        icon={<GitHub />}
        onClick={() => redirectToOAuth("github")}
      >
        Login with GitHub
      </Button>
      <Button
        icon={<Discord />}
        onClick={() => redirectToOAuth("discord")}
      >
        Login with Discord
      </Button>
    </div>
  )
}

export default Login