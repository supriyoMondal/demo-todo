import * as React from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import { Separator } from "../ui/saperator";
import useHomeTabIndex from "~/hooks/state/useHomeTabIndex";
import { Star } from "~/lib/icons/Star";
import useCurrentUserSpace from "~/hooks/state/useCurrentUserSpace";
import useWorkSpaceList from "~/hooks/state/useWorkSpaceList";
import { Card } from "../ui/card";
import { Plus } from "~/lib/icons/Plus";
import { useNavigation } from "expo-router";
import Animated from "react-native-reanimated";

const ManageTabs = ({
  hideSheet,
  scrollViewRef,
}: {
  hideSheet: () => void;
  scrollViewRef: React.RefObject<Animated.FlatList<{}>>;
}) => {
  const tabIndex = useHomeTabIndex((state) => state.homeTabIndex);

  const spaceId = useCurrentUserSpace((state) => state.spaceId);
  const { data: workspaces } = useWorkSpaceList(spaceId);

  const navigation = useNavigation();

  return (
    <View className="p-4 pt-2">
      <Separator />
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row gap-2 py-2 items-center"
        onPress={() => {
          hideSheet();

          scrollViewRef.current?.scrollToIndex({ index: 0 });
        }}
      >
        {tabIndex === 0 ? (
          <Star size={20} className="text-amber-400" strokeWidth={2} />
        ) : (
          <Star size={20} className="text-muted-foreground" strokeWidth={2} />
        )}
        <Text>Fav</Text>
      </TouchableOpacity>
      <Separator />
      <View className="flex-row gap-2 py-2 items-center flex-wrap h-36">
        {workspaces
          .filter((workspace) => workspace.name !== "Fav")
          .map((workspace, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={workspace.name}
              onPress={() => {
                hideSheet();
                // +1 because of Fav
                scrollViewRef.current?.scrollToIndex({ index: index + 1 });
              }}
            >
              <Card
                key={workspace.name}
                className="flex-row gap-2 py-1 px-4 items-center"
              >
                <Text className=" underline">{workspace.name}</Text>
              </Card>
            </TouchableOpacity>
          ))}
      </View>
      <Separator />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          hideSheet();
          navigation.navigate("add-tab");
        }}
        className="flex-row gap-2 py-2 items-center"
      >
        <Plus size={20} className="text-foreground" strokeWidth={2} />
        <Text>Add new list</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManageTabs;
