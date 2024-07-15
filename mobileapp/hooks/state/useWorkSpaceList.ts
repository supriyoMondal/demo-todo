import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "~/config/constants";
import useCurrentUserSpace from "./useCurrentUserSpace";

const useWorkSpaceList = () => {
  const userSpaceId = useCurrentUserSpace((store) => store.spaceId);

  return useQuery({
    queryKey: ["workSpaceList", userSpaceId],
    initialData: [
      { name: "Fav", id: "fab" },
      { name: "My Todos", id: "my-todos" },
    ],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/workSpace/list/${userSpaceId}`);
      const workspaces: { name: string; id: string }[] = await res.json();

      return workspaces;
    },
  });
};

export default useWorkSpaceList;
