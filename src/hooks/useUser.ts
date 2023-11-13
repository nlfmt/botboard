import api from "@/util/api";

const useUser = () => {
  const { data: user, isLoading, isError  } = api.user.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return { user, isLoading, isError };
}

export default useUser;
