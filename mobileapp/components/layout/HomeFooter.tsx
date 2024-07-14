import * as React from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import { Plus } from "~/lib/icons/Plus";
import { TableProperties } from "~/lib/icons/List";
import { HorizontalThreeDot } from "~/lib/icons/HorizontalThreeDot";
import BottomSheet from "./BottomSheet";
import { Text } from "../ui/text";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useKeyboard } from "~/hooks/misc/keybaord";

const HomeFooter = ({
  createTodo,
}: {
  createTodo: (todo: { title: string; description: string }) => void;
}) => {
  const sheetRef = React.useRef<React.ElementRef<typeof BottomSheet>>(null);
  const [keypadVisible, setKeypadVisible] = React.useState(false);
  const createTodoRef =
    React.useRef<React.ElementRef<typeof CreateTodoWithRef>>(null);

  const { keyboardHeight, dismissKeyboard } = useKeyboard();

  const [bottomSheetType, setBottomSheetType] = React.useState<
    "Add" | "Edit" | "List"
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
      sheetRef.current?.scrollTo(-keyboardHeight - 200);
    }
  }, [keyboardHeight]);

  return (
    <>
      {!bottomSheetType && !keypadVisible ? (
        <Animated.View entering={FadeInDown.delay(100)} exiting={FadeInDown}>
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
          dismissKeyboard();
        }}
        ref={sheetRef}
      >
        <CreateTodoWithRef
          onCreateTodo={({ title, description }) => {
            createTodo({ title, description });
            setBottomSheetType(undefined);
            dismissKeyboard();
            sheetRef.current?.scrollTo(0);
          }}
          ref={createTodoRef}
        />
      </BottomSheet>
    </>
  );
};

const CreateTodoView = (
  {
    onCreateTodo,
  }: {
    onCreateTodo: (todo: { title: string; description: string }) => void;
  },
  ref: React.ForwardedRef<{
    focusInput: () => void;
  }>
) => {
  const [inputText, setInputText] = React.useState("");

  const inputRef = React.useRef<React.ElementRef<typeof Input>>(null);

  const focusInput = React.useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  React.useImperativeHandle(ref, () => ({ focusInput }), []);

  return (
    <View className="flex-1  flex-row gap-4 p-4">
      <Input
        placeholder="Add new todo"
        className=" flex-grow"
        ref={inputRef}
        onChangeText={(text) => {
          setInputText(text);
        }}
        value={inputText}
        onSubmitEditing={() => {
          onCreateTodo({
            title: inputText,
            description: "",
          });
          setInputText("");
        }}
      />
      <Button
        disabled={!inputText}
        onPress={() => {
          onCreateTodo({
            title: inputText,
            description: "",
          });
          setInputText("");
        }}
      >
        <Text>Save</Text>
      </Button>
    </View>
  );
};

const CreateTodoWithRef = React.forwardRef(CreateTodoView);

export default React.memo(HomeFooter);
