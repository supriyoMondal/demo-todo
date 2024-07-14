import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "~/config/constants";

const useWorkSpaceList = (userSpaceId: string) => {
  return useQuery({
    queryKey: ["workSpaceList", userSpaceId],
    initialData: [
      { name: "Fav", id: -1 },
      { name: "My Todos", id: -2 },
    ],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/workSpace/list/${userSpaceId}`);
      const workspaces: { name: string; id: number }[] = await res.json();
      return workspaces;
    },
  });
};

export default useWorkSpaceList;
