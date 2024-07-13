import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const GITHUB_AVATAR_URI = "https://github.com/mrzachnugent.png";

const ChangeWorkSpace = () => {
  return (
    <Avatar alt="Zach Nugent's Avatar">
      <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />

      <AvatarFallback>
        <Text>ZN</Text>
      </AvatarFallback>
    </Avatar>
  );
};

export default ChangeWorkSpace;

const styles = StyleSheet.create({});
