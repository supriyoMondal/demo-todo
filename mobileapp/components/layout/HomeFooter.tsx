import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { Plus } from "~/lib/icons/Plus";
import { TableProperties } from "~/lib/icons/List";
import { HorizontalThreeDot } from "~/lib/icons/HorizontalThreeDot";
import BottomSheet from "./BottomSheet";
import { Text } from "../ui/text";

const HomeFooter = () => {
  const sheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);

  const [bottomSheetType, setBottomSheetType] = React.useState<
    "Add" | "Edit" | "List"
  >();

  return (
    <>
      <View className="bg-card p-4 items-center flex-row gap-8">
        <TouchableOpacity>
          <TableProperties className="text-2xl text-center text-foreground" />
        </TouchableOpacity>
        <TouchableOpacity>
          <HorizontalThreeDot className="text-2xl text-center text-foreground" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className=" ml-auto bg-foreground/20 p-4 rounded-md"
          onPress={() => {
            sheetRef.current?.scrollTo(-200);
          }}
        >
          <Plus className="text-2xl text-center text-foreground" />
        </TouchableOpacity>
      </View>
      <BottomSheet ref={sheetRef}>
        <Text>Hello</Text>
      </BottomSheet>
    </>
  );
};

export default React.memo(HomeFooter);
