import Button from "@/components/Button/Button"
import { GitHub } from "@mui/icons-material"
import c from "./Login.module.scss"
import DiscordLogo from "@/assets/discord.svg"
import TwitchLogo from "@/assets/twitch.svg"
import Title from "@/components/Title/Title"
import Text from "@/components/Text/Text"
import { signIn } from "@/util/auth"
import { useSearchParams } from "react-router-dom"
import Error from "@/components/Error/Error"

const Login = () => {

  const [params] = useSearchParams()
  const error = params.get("error")

  return (
    <div className={c.loginPage}>
      <div className={c.login}>
        <Title>
          <span className={c.green}>Bot</span>
          <span className={c.purple}>Board</span>
        </Title>
        <Text size="large" className={c.text}>Login to your account to start managing applications!</Text>
        {error && (
          <Error size="medium" className={c.text}>
            {error}
            {": "}
            {params.get("error_description") ?? "An error occurred while logging in. Please try again."}
          </Error>
        )}
        <div className={c.providers}>
          <Button
            icon={<GitHub />}
            onClick={() => signIn("github")}
          >
            Login with GitHub
          </Button>
          <Button
            icon={<DiscordLogo />}
            onClick={() => signIn("discord")}
          >
            Login with Discord
          </Button>
          <Button
            icon={<TwitchLogo />}
            onClick={() => signIn("twitch")}
          >
            Login with Twitch
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Login