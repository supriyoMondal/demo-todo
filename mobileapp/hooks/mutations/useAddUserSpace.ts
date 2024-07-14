import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "~/config/constants";
import { queryClient } from "~/config/queryClient";

const useAddUserSpace = () => {
  return useMutation({
    mutationKey: ["addUserSpace"],
    mutationFn: async (spaceId: string) => {
      const res = await fetch(`${BASE_URL}/space/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spaceID: spaceId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create user space");
      }
    },
    onMutate: (newSpace) => {
      const prevSpaces = queryClient.getQueryData(["userSpacesList"]) ?? [];
      if (Array.isArray(prevSpaces)) {
        queryClient.setQueryData(["userSpacesList"], [...prevSpaces, newSpace]);
      }
    },
  });
};

export default useAddUserSpace;
