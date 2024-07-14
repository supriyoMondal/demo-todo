import { X } from "~/lib/icons/X";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "~/components/ui/input";
import { useNavigation } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import useAddUserWorkSpace from "~/hooks/mutations/useAddUserWorkSpace";
import useCurrentUserSpace from "~/hooks/state/useCurrentUserSpace";

export default function AddTabScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [inputText, setInputText] = React.useState("");
  const spaceId = useCurrentUserSpace((state) => state.spaceId);
  const addTabMutation = useAddUserWorkSpace(spaceId);

  return (
    <View
      className="flex-1 bg-secondary/30 p-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row gap-4 items-center mb-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <X size={22} className="text-foreground mt-0.5" strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-xl text-foreground">Add new list</Text>

        <Button
          disabled={!inputText || addTabMutation.isPending}
          onPress={() => {
            addTabMutation.mutate({ name: inputText });
            navigation.goBack();
          }}
          size="sm"
          variant="outline"
          className="ml-auto"
        >
          <Text className="text-xl">Save</Text>
        </Button>
      </View>
      <Input
        autoFocus
        onChangeText={(text) => {
          setInputText(text);
        }}
        value={inputText}
        onSubmitEditing={() => {
          addTabMutation.mutate({ name: inputText });
          navigation.goBack();
        }}
      />
    </View>
  );
}
