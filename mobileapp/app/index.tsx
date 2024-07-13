import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TodoList from "@/components/layouts/TodoList";

const index = () => {
  return (
    <View className="flex-1 p-6">
      <TodoList />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
