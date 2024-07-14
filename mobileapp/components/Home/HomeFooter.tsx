import * as React from "react";
import { Keyboard, Platform, TouchableOpacity, View } from "react-native";
import { Plus } from "~/lib/icons/Plus";
import { TableProperties } from "~/lib/icons/List";
import { HorizontalThreeDot } from "~/lib/icons/HorizontalThreeDot";
import BottomSheet from "../layout/BottomSheet";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useKeyboard } from "~/hooks/misc/keybaord";
import clsx from "clsx";
import CreateTodoWithRef from "./CreateTodoForm";
import ManageTabs from "./ManageTabs";

const ADD_TODO_FORM_HEIGHT = Platform.OS === "android" ? 180 : 220;
const MANAGE_TABS_HEIGHT = Platform.OS === "android" ? 360 : 400;

const HomeFooter = ({
  createTodo,
}: {
  createTodo: (todo: { title: string; description: string }) => void;
}) => {
  const sheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);
  const [keypadVisible, setKeypadVisible] = React.useState(false);
  const createTodoRef =
    React.useRef<React.ElementRef<typeof CreateTodoWithRef>>(null);

  const { keyboardHeight, dismissKeyboard } = useKeyboard(
    Platform.OS === "ios" ? { eventType: "willShow" } : { eventType: "didShow" }
  );

  const [bottomSheetType, setBottomSheetType] = React.useState<
    "Add" | "Edit" | "Tabs"
  >();

  React.useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setKeypadVisible(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setBottomSheetType(undefined);
      setKeypadVisible(false);
    });

    return () => {
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  React.useEffect(() => {
    const isActive = sheetRef.current?.isActive();
    if (isActive) {
      sheetRef.current?.scrollTo(-keyboardHeight - ADD_TODO_FORM_HEIGHT);
    }
  }, [keyboardHeight]);

  return (
    <>
      {!bottomSheetType && !keypadVisible ? (
        <Animated.View entering={FadeInDown.delay(100)} exiting={FadeInDown}>
          <View
            className={clsx(
              "bg-card px-4 items-center flex-row gap-8",
              Platform.OS === "android" ? "h-24" : "h-28"
            )}
          >
            <TouchableOpacity
              onPress={() => {
                setBottomSheetType("Tabs");
                sheetRef.current?.scrollTo(-MANAGE_TABS_HEIGHT);
              }}
            >
              <TableProperties className="text-2xl text-center text-foreground" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBottomSheetType("Edit");
                sheetRef.current?.scrollTo(-ADD_TODO_FORM_HEIGHT);
              }}
            >
              <HorizontalThreeDot className="text-2xl text-center text-foreground" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className=" ml-auto bg-foreground/20 p-4 rounded-md"
              onPress={() => {
                setBottomSheetType("Add");
                sheetRef.current?.scrollTo(-ADD_TODO_FORM_HEIGHT);
              }}
            >
              <Plus className="text-2xl text-center text-foreground" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        <View
          className={clsx(
            " bg-secondary/30",
            Platform.OS === "android" ? "h-24" : "h-28"
          )}
        />
      )}

      <BottomSheet
        onClose={() => {
          setBottomSheetType(undefined);
          dismissKeyboard();
        }}
        ref={sheetRef}
      >
        {bottomSheetType === "Add" && (
          <CreateTodoWithRef
            onCreateTodo={({ title, description }) => {
              createTodo({ title, description });
              setBottomSheetType(undefined);
              dismissKeyboard();
              sheetRef.current?.scrollTo(0);
            }}
            ref={createTodoRef}
          />
        )}
        {bottomSheetType === "Tabs" && (
          <ManageTabs
            hideSheet={() => {
              sheetRef.current?.scrollTo(0);
            }}
          />
        )}
      </BottomSheet>
    </>
  );
};

export default React.memo(HomeFooter);
