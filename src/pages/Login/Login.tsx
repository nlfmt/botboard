import Button from "@/components/Button/Button"
import { GitHub } from "@mui/icons-material"
import c from "./Login.module.scss"
import DiscordLogo from "@/assets/discord.svg"
import TwitchLogo from "@/assets/twitch.svg"
import Title from "@/components/Title/Title"
import Text from "@/components/Text/Text"
import { signIn } from "@/util/auth"
import { useNavigate, useSearchParams } from "react-router-dom"
import Error from "@/components/Error/Error"
import useUser from "@/hooks/useUser"
import { useEffect } from "react"

const Login = () => {

  const navigate = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    if (user) navigate("/")
  }, [user, navigate])

  const [params] = useSearchParams()
  const error = params.get("error")

  return (
    <div className={c.loginPage}>
      <div className={c.login}>
        <Title align="center">
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
          <div className={c.divider}>OAuth Providers</div>
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
          <div className={c.divider}>(C) 2023 Tom F.</div>
        </div>
        {/* <Text align="center">(C) 2023 Tom F.<br />Made with &lt;3</Text> */}
      </div>
    </div>
  )
}

export default Login