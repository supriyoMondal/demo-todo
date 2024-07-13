import * as React from "react";
import {
  Dimensions,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Info } from "~/lib/icons/Info";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import TodoList from "~/components/layout/TodoList";
import clsx from "clsx";

const { width } = Dimensions.get("window");

const data = [
  { title: "Todo 1", description: "This is a todo", color: " bg-red-500" },
  { title: "Todo 2", description: "This is a todo", color: " bg-green-500" },
  { title: "Todo 3", description: "This is a todo", color: " bg-blue-500" },
  { title: "Todo 4", description: "This is a todo", color: " bg-yellow-500" },
  { title: "Todo 5", description: "This is a todo", color: " bg-purple-500" },
  { title: "Todo 6", description: "This is a todo", color: " bg-pink-500" },
  { title: "Todo 7", description: "This is a todo", color: " bg-orange-500" },
  { title: "Todo 8", description: "This is a todo", color: " bg-gray-500" },
  { title: "Todo 9", description: "This is a todo", color: " bg-cyan-500" },
  { title: "Todo 10", description: "This is a todo", color: " bg-sky-500" },
];

export default function Screen() {
  const { width, height } = useWindowDimensions();
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const tabScrollViewRef = React.useRef<ScrollView>(null);

  const scrollX = useSharedValue(0);

  const onTabPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View className="flex-1 bg-secondary/30">
      {/* <Card className="w-full max-w-sm p-6 rounded-2xl">
        <TodoList />
      </Card> */}

      <AnimatedTabBar
        items={data.map((item) => item.title)}
        scrollX={scrollX}
        onTabPress={onTabPress}
        tabScrollViewRef={tabScrollViewRef}
      />

      <Animated.FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={scrollHandler}
        renderItem={({ item }) => {
          return (
            <View
              style={{ width }}
              className={clsx(
                "flex-1 items-center justify-center ",
                item.color
              )}
            >
              <Text className="text-2xl text-center">{item.title}</Text>
              <Text className="text-sm text-center">{item.description}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}

interface AnimatedTabBarProps {
  items: string[];
  scrollX: Animated.SharedValue<number>;
  onTabPress: (index: number) => void;
  tabScrollViewRef: React.RefObject<ScrollView>;
}

const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  scrollX,
  onTabPress,
  tabScrollViewRef,
}) => {
  return (
    <ScrollView
      ref={tabScrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ height: 50, backgroundColor: "#f0f0f0" }}
    >
      {items.map((item, index) => (
        <AnimatedTab
          key={index}
          item={item}
          index={index}
          scrollX={scrollX}
          onPress={() => onTabPress(index)}
        />
      ))}
    </ScrollView>
  );
};

interface AnimatedTabProps {
  item: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
  onPress: () => void;
}

const AnimatedTab: React.FC<AnimatedTabProps> = ({
  item,
  index,
  scrollX,
  onPress,
}) => {
  const activeIndex = useDerivedValue(() => {
    return Math.round(scrollX.value / width);
  });

  const animatedStyle = useAnimatedStyle(() => {
    const isActive = activeIndex.value === index;
    return {
      backgroundColor: withTiming(isActive ? "#3498db" : "#f0f0f0", {
        duration: 200,
      }),
    };
  });

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          animatedStyle,
        ]}
      >
        <Text style={{ color: "#333" }}>{item}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
