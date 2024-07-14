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
import { useStorage } from "~/hooks/useStorage";
import useWorkSpaceList from "~/hooks/state/useWorkSpaceList";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "~/hooks/useRiplecache";
import { listTodos, TodoItem } from "shared-mutations";
import useCurrentUserSpace from "~/hooks/state/useCurrentUserSpace";
import TodoItemList from "~/components/Home/TodoItemList";

const { width } = Dimensions.get("window");

export default function Screen() {
  const scrollViewRef = React.useRef<Animated.FlatList<{}>>(null);
  const tabScrollViewRef = React.useRef<ScrollView>(null);

  const [currentUserSpaceId] = useStorage("userSpaceId");

  const { data: workspaces } = useWorkSpaceList(currentUserSpaceId);
  const spaceId = useCurrentUserSpace((store) => store.spaceId);
  const rep = useReplicache(spaceId);
  // @ts-expect-error complex ts error
  const todos = useSubscribe(rep, listTodos, [], [rep]);

  const workSpaceTodos = React.useMemo(() => {
    const map = workspaces.reduce(
      (acc, workspace) => {
        acc[workspace.name] = [];
        return acc;
      },
      { "My Todos": [] } as Record<string, TodoItem[]>
    );

    for (const todo of todos) {
      if (todo.favorite) {
        map.Fab.push(todo);
      }
      if (!todo.workSpace) {
        map["My Todos"].push(todo);
      } else {
        map[todo.workSpace].push(todo);
      }
    }

    return map;
  }, [todos, workspaces]);

  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onTabPress = React.useCallback((index: number) => {
    scrollViewRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  const renderItem = React.useCallback(
    ({
      item,
    }: {
      item: {
        name: string;
        id: number;
      };
    }) => <TodoItemList todos={workSpaceTodos[item.name]} />,
    [workSpaceTodos]
  );

  return (
    <View className="flex-1 bg-secondary/30">
      <AnimatedTabBar
        items={workspaces.map((item) => item.name)}
        scrollX={scrollX}
        onTabPress={onTabPress}
        tabScrollViewRef={tabScrollViewRef}
      />
      <Separator />
      <Animated.FlatList
        data={workspaces}
        horizontal
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={scrollHandler}
        extraData={workSpaceTodos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <HomeFooter />
    </View>
  );
}
