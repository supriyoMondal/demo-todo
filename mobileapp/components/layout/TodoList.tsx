import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSubscribe } from "replicache-react";
import { listTodos } from "shared-mutations";
import { useReplicache } from "~/hooks/useRiplecache";
import { bootCryptoPolyfill } from "~/crypto-polyfill";
import { Button } from "../ui/button";

bootCryptoPolyfill();

export function generateRandomString(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

const TodoList = () => {
  const rep = useReplicache("supriyo");
  // @ts-expect-error
  const todos = useSubscribe(rep, listTodos, [], [rep]);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 10,
        paddingTop: 36,
      }}
    >
      <Text>TodoList</Text>
      {todos.map((todo) => (
        <View
          key={todo.id}
          style={{
            backgroundColor: "red",
            padding: 10,
            margin: 10,
            borderRadius: 10,
          }}
        >
          <Text>{todo.title}</Text>
          <Text>{todo.description}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <Button
              title="Update"
              onPress={() => {
                rep.mutate.updateTodo({
                  ...todo,
                  key: todo.id?.replace("todo/", ""),
                  id: todo.key?.replace("todo/", ""),
                  description: `${todo.description}-updated`,
                });
              }}
            />
            <Button
              title="Delete"
              onPress={() => {
                rep.mutate.deleteTodo(todo.id.replace("todo/", ""));
              }}
            />
          </View>
        </View>
      ))}
      <Button
        onPress={() => {
          const id = generateRandomString(8);
          rep.mutate.createTodo({
            title: `${Platform.OS}-${id}`,
            description: "hello-2",
            id,
          });
        }}
      >
        <Text>Add Todo</Text>
      </Button>
    </ScrollView>
  );
};

export default TodoList;

const styles = StyleSheet.create({});
