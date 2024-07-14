import * as React from "react";
import { Input } from "../ui/input";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

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
    <View className="flex-1  flex-row gap-4 p-4 pt-2">
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

export default CreateTodoWithRef;
