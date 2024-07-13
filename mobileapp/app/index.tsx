import * as React from "react";
import { Dimensions, TouchableOpacity, View, ScrollView } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Text } from "~/components/ui/text";
import clsx from "clsx";
import { Separator } from "~/components/ui/saperator";
import HomeFooter from "~/components/layout/HomeFooter";
import AnimatedTabBar from "~/components/Home/AnimatedtabBar";

const { width } = Dimensions.get("window");

const data = [
  { title: "Supriyo", description: "This is a todo", color: " bg-red-500" },
  { title: "Amit", description: "This is a todo", color: " bg-green-500" },
  { title: "Dinesh", description: "This is a todo", color: " bg-blue-500" },
  { title: "Rahul", description: "This is a todo", color: " bg-yellow-500" },
  { title: "Nitin", description: "This is a todo", color: " bg-purple-500" },
  { title: "Prateek", description: "This is a todo", color: " bg-pink-500" },
  { title: "Ankit", description: "This is a todo", color: " bg-orange-500" },
  { title: "Harsh", description: "This is a todo", color: " bg-gray-500" },
  { title: "Vikas", description: "This is a todo", color: " bg-cyan-500" },
  { title: "Shubham", description: "This is a todo", color: " bg-sky-500" },
];

export default function Screen() {
  const scrollViewRef = React.useRef<Animated.FlatList<{}>>(null);
  const tabScrollViewRef = React.useRef<ScrollView>(null);

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onTabPress = React.useCallback((index: number) => {
    scrollViewRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  return (
    <View className="flex-1 bg-secondary/30">
      <AnimatedTabBar
        items={data.map((item) => item.title)}
        scrollX={scrollX}
        onTabPress={onTabPress}
        tabScrollViewRef={tabScrollViewRef}
      />
      <Separator />
      <Animated.FlatList
        data={data}
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={scrollHandler}
        renderItem={({ item }) => {
          return (
            <View
              style={{ width }}
              className={clsx(
                "flex-1 items-center justify-center  bg-secondary/30"
              )}
            >
              <Text className="text-2xl text-center">{item.title}</Text>
              <Text className="text-sm text-center">{item.description}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.title}
      />
      <HomeFooter />
    </View>
  );
}
