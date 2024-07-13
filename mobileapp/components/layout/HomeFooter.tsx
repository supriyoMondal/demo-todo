import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Plus } from "~/lib/icons/Plus";
import { TableProperties } from "~/lib/icons/List";
import { HorizontalThreeDot } from "~/lib/icons/HorizontalThreeDot";
import BottomSheet from "./BottomSheet";
import { Text } from "../ui/text";
import Animated, { FadeInDown } from "react-native-reanimated";

const HomeFooter = () => {
  const sheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);

  const [bottomSheetType, setBottomSheetType] = React.useState<
    "Add" | "Edit" | "List"
  >();

  return (
    <>
      {!bottomSheetType ? (
        <Animated.View entering={FadeInDown.delay(50)} exiting={FadeInDown}>
          <View className="bg-card h-24 px-4 items-center flex-row gap-8">
            <TouchableOpacity
              onPress={() => {
                setBottomSheetType("List");
                sheetRef.current?.scrollTo(-200);
              }}
            >
              <TableProperties className="text-2xl text-center text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetType("Edit");
                sheetRef.current?.scrollTo(-200);
              }}
            >
              <HorizontalThreeDot className="text-2xl text-center text-foreground" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className=" ml-auto bg-foreground/20 p-4 rounded-md"
              onPress={() => {
                setBottomSheetType("Add");
                sheetRef.current?.scrollTo(-200);
              }}
            >
              <Plus className="text-2xl text-center text-foreground" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <View className="h-24 bg-secondary/30" />
      )}
      <BottomSheet
        onClose={() => {
          setBottomSheetType(undefined);
        }}
        ref={sheetRef}
      >
        <Text>Hello</Text>
      </BottomSheet>
    </>
  );
};

export default React.memo(HomeFooter);
