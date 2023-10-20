import c from "./AccountInfo.module.scss"


const AccountInfo = () => {
  const user = {
    name: "John Doe",
    email: "test@test.de",
    profilePicture: null//"https://i.pravatar.cc/150?img=7"
  }

  return (
    <div className={c.info}>
      {user.profilePicture ? (
        <img className={c.profilePicture} src={user.profilePicture} alt="Profile" />
      ) : (
        <div className={c.profilePictureReplacement}>
          {user.name[0]}
        </div>
      )}
      <div className={c.text}>
        <p className={c.name}>{user.name}</p>
        <p className={c.email}>{user.email}</p>
      </div>
    </div>
  )
}

export default AccountInfo