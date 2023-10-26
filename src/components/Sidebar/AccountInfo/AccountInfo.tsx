import { User } from "lucia"
import c from "./AccountInfo.module.scss"

interface AccountInfoProps {
  user: User
}

const AccountInfo = ({ user }: AccountInfoProps) => {
  return (
    <div className={c.info}>
      {user ? (
        <>
          {user.avatar ? (
            <img className={c.profilePicture} src={user.avatar} alt="Profile" />
          ) : (
            <div className={c.profilePictureReplacement}>
              {user.name[0]}
            </div>
          )}
          <div className={c.text}>
            <p className={c.name}>{user.name}</p>
            <p className={c.email}>{user.email}</p>
          </div>
        </>
      ) : (
        <div className={c.loading}>Loading...</div>
      )}
    </div>
  )
}

export default AccountInfo