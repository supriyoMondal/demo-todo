import * as React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Text } from "../ui/text";
import useHomeTabIndex from "~/hooks/state/useHomeTabIndex";
import { Star } from "~/lib/icons/Star";
import clsx from "clsx";

const calculateWithByCharCount = (str: string) => {
  return str.length * 8 + 20;
};

const TAB_BAR_HEIGHT = 36;
const WIDTH_BUFFER = 10;

const { width } = Dimensions.get("window");

interface AnimatedTabBarProps {
  items: { name: string; id: number }[];
  scrollX: Animated.SharedValue<number>;
  onTabPress: (index: number) => void;
  tabScrollViewRef: React.RefObject<ScrollView>;
}

// Width of each tab

const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  scrollX,
  onTabPress,
  tabScrollViewRef,
}) => {
  const tabPositions = items.reduce((acc, item, i) => {
    acc.push(
      i === 0 ? 0 : calculateWithByCharCount(items[i - 1].name) + acc[i - 1]
    );
    return acc;
  }, [] as number[]);

  const setHomeTabIndex = useHomeTabIndex((state) => state.setHomeTabIndex);

  const inputRange = tabPositions.map((_, i) => i * width);

  const tabWidths = items.reduce((acc, item) => {
    acc.push(calculateWithByCharCount(item.name) - WIDTH_BUFFER * 2);
    return acc;
  }, [] as number[]);

  const activeTabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            interpolate(scrollX.value, inputRange, tabPositions, "clamp"),
            { duration: 300, easing: Easing.linear }
          ),
        },
      ],
      width: withTiming(
        interpolate(scrollX.value, inputRange, tabWidths, "clamp"),
        { duration: 300, easing: Easing.linear }
      ),
    };
  }, []);

  const scrollTabBar = React.useCallback((index: number) => {
    if (tabScrollViewRef.current) {
      const maxScroll =
        tabPositions[tabPositions.length - 1] +
        tabWidths[tabWidths.length - 1] -
        width +
        WIDTH_BUFFER * 2;

      const scrollTo = Math.max(
        0,
        Math.min(
          tabPositions[index] - width / 2 + tabWidths[index] / 2,
          maxScroll
        )
      );

      setHomeTabIndex(index);
      tabScrollViewRef.current.scrollTo({
        x: scrollTo,
        animated: true,
      });
    }
  }, []);

  useAnimatedReaction(
    () => Math.round(scrollX.value / width),
    (index) => {
      runOnJS(scrollTabBar)(index);
    },
    [scrollTabBar]
  );

  return (
    <ScrollView
      ref={tabScrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-card"
      style={{ maxHeight: TAB_BAR_HEIGHT }}
    >
      {items.map((item, index) => (
        <Tab
          key={index}
          item={item.name}
          onPress={() => onTabPress(index)}
          index={index}
        />
      ))}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: WIDTH_BUFFER,
            height: 3,
            borderTopEndRadius: 3,
            borderTopStartRadius: 3,
            backgroundColor: "#3498db",
          },
          activeTabStyle,
        ]}
      />
    </ScrollView>
  );
};

interface TabProps {
  item: string;
  onPress: () => void;
  index: number;
}

const Tab: React.FC<TabProps> = ({ item, onPress, index }) => {
  const isSelectedTab = useHomeTabIndex(
    (state) => state.homeTabIndex === index
  );

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View
        style={{
          height: TAB_BAR_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          width: calculateWithByCharCount(item),
        }}
      >
        {item == "Fav" ? (
          <Star
            className={clsx(
              isSelectedTab ? " text-amber-400" : "text-muted-foreground"
            )}
            size={20}
            strokeWidth={2}
          />
        ) : (
          <Text
            className={clsx(
              isSelectedTab ? "text-foreground" : " text-muted-foreground"
            )}
          >
            {item}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedTabBar;
