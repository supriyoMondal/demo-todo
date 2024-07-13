import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useReplicache } from "@/hooks/useRiplecache";
import { useSubscribe } from "replicache-react";
import { listTodos } from "shared-mutations";

const TodoList = () => {
  const rep = useReplicache("supriyo");
  const todos = useSubscribe(rep, listTodos, [], [rep]);

  console.log(todos);

  return (
    <View>
      <Text>TodoList</Text>
      <Button
        title="Add Todo"
        onPress={() => {
          console.log("hello");
          rep.mutate.createTodo({ title: "hello" });
        }}
      />
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({});
