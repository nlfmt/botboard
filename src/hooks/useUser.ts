import api from "@/util/api";

const useUser = () => {
  const { data: user, isLoading } = api.user.me.useQuery();

  return { user, isLoading };
}

export default useUser;
