import { useMutation } from "@tanstack/react-query";
import { generateRandomString } from "~/components/layout/TodoList";
import { BASE_URL } from "~/config/constants";
import { queryClient } from "~/config/queryClient";

const useAddUserWorkSpace = (spaceId: string) => {
  return useMutation({
    mutationKey: ["addUserWorkSpace"],
    mutationFn: async ({ name }: { name: string }) => {
      const res = await fetch(`${BASE_URL}/workSpace/create/${spaceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error("Failed to create user space");
      }
    },
    onMutate: (newSpace) => {
      const prevSpaces =
        queryClient.getQueryData(["workSpaceList", spaceId]) ?? [];
      if (Array.isArray(prevSpaces)) {
        queryClient.setQueryData(
          ["workSpaceList", spaceId],
          [
            ...prevSpaces,
            {
              name: newSpace.name,
              id: generateRandomString(4),
            },
          ]
        );
      }
    },
  });
};

export default useAddUserWorkSpace;
