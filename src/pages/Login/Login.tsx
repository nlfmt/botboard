import Button from "@/components/Button/Button"
import { GitHub } from "@mui/icons-material"
import c from "./Login.module.scss"
import Discord from "@/assets/discord.svg"
import Title from "@/components/Title/Title"
import Text from "@/components/Text/Text"
import { signIn } from "@/util/auth"

const Login = () => {

  return (
    <div className={c.login}>
      <Title>Login</Title>
      <Text>Login to your account to manage your bots.</Text>
      <Button
        icon={<GitHub />}
        onClick={() => signIn("github")}
      >
        Login with GitHub
      </Button>
      <Button
        icon={<Discord />}
        onClick={() => signIn("discord")}
      >
        Login with Discord
      </Button>
    </div>
  )
}

export default Login