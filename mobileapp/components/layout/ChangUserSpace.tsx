import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import useUserSpacesList from "~/hooks/state/useUserSpacesList";
import useCurrentUserSpace from "~/hooks/state/useCurrentUserSpace";
import clsx from "clsx";
import { Input } from "../ui/input";
import { Plus } from "~/lib/icons/Plus";
import useAddUserSpace from "~/hooks/mutations/useAddUserSpace";

const tailwindBackgroundColorOnCharCodeSum = (name: string) => {
  const charCodeSum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return charCodeSum % 4 === 0
    ? "bg-pink-500"
    : charCodeSum % 7 === 0
    ? "bg-sky-500"
    : charCodeSum % 5 === 0
    ? "bg-blue-500"
    : charCodeSum % 4 === 0
    ? "bg-yellow-500"
    : charCodeSum % 3 === 0
    ? "bg-purple-500"
    : "bg-green-500";
};

const ChangeWorkSpace = () => {
  const insets = useSafeAreaInsets();
  const userSpaceId = useCurrentUserSpace((state) => state.spaceId);
  const setUserSpaceId = useCurrentUserSpace((state) => state.setSpaceId);

  const { data: userSpaces } = useUserSpacesList();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex mx-auto items-center justify-center rounded-md">
        <Avatar name={userSpaceId} />
      </ContextMenuTrigger>

      <ContextMenuContent align="start" insets={contentInsets} className="w-64">
        {userSpaces.map((space) => (
          <UserSpaceItem
            space={space}
            key={space}
            setUserSpaceId={setUserSpaceId}
            checked={space === userSpaceId}
          />
        ))}

        <AddNewUserSpace />
      </ContextMenuContent>
    </ContextMenu>
  );
};

const AddNewUserSpace = () => {
  const [inputText, setInputText] = React.useState("");
  const setUserSpaceId = useCurrentUserSpace((state) => state.setSpaceId);
  const addSpace = useAddUserSpace();

  return (
    <View className="flex-1 items-center gap-4 flex-row justify-between m-1">
      <Input
        placeholder="Add new space"
        className=" flex-grow"
        onChangeText={(text) => {
          setInputText(text);
        }}
        value={inputText}
        onSubmitEditing={() => {
          setUserSpaceId(inputText);
          setInputText("");
        }}
      />
      <TouchableOpacity
        onPress={() => {
          addSpace.mutate(inputText);
          setInputText("");
        }}
        className=" bg-foreground/20 px-3 rounded-md h-full items-center justify-center"
        disabled={addSpace.isPending || inputText.length === 0}
      >
        {addSpace.isPending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Plus className="text-2xl text-center text-foreground" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const UserSpaceItem = ({
  checked,
  space,
  setUserSpaceId,
}: {
  setUserSpaceId: (index: string) => void;
  checked: boolean;
  space: string;
}) => {
  return (
    <ContextMenuCheckboxItem
      checked={checked}
      onCheckedChange={() => {
        setUserSpaceId(space);
      }}
      closeOnPress
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 90,
          gap: 10,
        }}
      >
        <MemoizedAvatar name={space} size="small" />
        <Text>{space}</Text>
      </View>
    </ContextMenuCheckboxItem>
  );
};

const Avatar = ({
  name,
  size = "default",
}: {
  name: string;
  size?: "default" | "small";
}) => {
  return (
    <View
      className={clsx(
        tailwindBackgroundColorOnCharCodeSum(name),
        "rounded-full flex items-center justify-center",
        size === "default" ? "h-10 w-10" : "!h-8 !w-8"
      )}
    >
      <Text
        className={clsx(
          size === "default" ? "text-2xl" : "text-md",
          "capitalize"
        )}
      >
        {name.charAt(0)}
      </Text>
    </View>
  );
};

const MemoizedAvatar = React.memo(Avatar);

export default ChangeWorkSpace;
