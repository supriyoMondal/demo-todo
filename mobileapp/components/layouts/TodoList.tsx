import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useReplicache } from "@/hooks/useRiplecache";

const TodoList = () => {
  const rep = useReplicache("supriyo");

  return (
    <View>
      <Text>TodoList</Text>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({});
