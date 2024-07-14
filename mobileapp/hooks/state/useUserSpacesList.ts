import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "~/config/constants";

const useUserSpacesList = () => {
  return useQuery({
    queryKey: ["userSpacesList"],
    initialData: ["default"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/space/list`);
      if (!res.ok) {
        return ["default"];
      }
      const userSpaces: string[] = await res.json();
      return userSpaces;
    },
  });
};

export default useUserSpacesList;
