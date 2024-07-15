import * as React from "react";
import { Dimensions, View, ScrollView } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Separator } from "~/components/ui/saperator";
import HomeFooter from "~/components/Home/HomeFooter";
import AnimatedTabBar from "~/components/Home/AnimatedtabBar";
import useWorkSpaceList from "~/hooks/state/useWorkSpaceList";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "~/hooks/useRiplecache";
import { listTodos, TodoItem } from "shared-mutations";
import TodoItemList from "~/components/Home/TodoItemList";
import { generateRandomString } from "~/components/layout/TodoList";
import useCurrentUserSpace from "~/hooks/state/useCurrentUserSpace";
import useHomeTabIndex from "~/hooks/state/useHomeTabIndex";

const { width } = Dimensions.get("window");

export default function Screen() {
  const scrollViewRef = React.useRef<Animated.FlatList<{}>>(null);
  const tabScrollViewRef = React.useRef<ScrollView>(null);
  const currentUserSpaceId = useCurrentUserSpace((store) => store.spaceId);
  const { data: workspaces } = useWorkSpaceList(currentUserSpaceId);
  const tabIndex = useHomeTabIndex((store) => store.homeTabIndex);

  const rep = useReplicache();

  // @ts-expect-error complex ts error
  const todos = useSubscribe(rep, listTodos, [], [rep]);

  const updateTodo = React.useCallback(
    (todo: TodoItem) => {
      rep.mutate.updateTodo({
        ...todo,
        key: todo.id?.replace("todo/", ""),
        id: todo.key?.replace("todo/", ""),
      });
    },
    [rep]
  );

  const createTodo = React.useCallback(
    (todo: { title: string; description: string }) => {
      const id = generateRandomString(8);
      const todoBody = {
        title: todo.title,
        description: todo.description,
        id,
        key: id,
        userSpaceId: currentUserSpaceId,
        workSpace: workspaces[tabIndex].name,
        favorite: tabIndex === 0,
      } as any;

      rep.mutate.createTodo(todoBody);
    },
    [rep, currentUserSpaceId, workspaces, tabIndex]
  );

  const workSpaceTodos = React.useMemo(() => {
    // const processedTodosSet: Record<string, boolean> = {};

    const map: Record<string, TodoItem[]> = {
      "My Todos": [],
      Fav: [],
    };

    todos.sort((a, b) => b.sort - a.sort);

    for (const todo of todos) {
      if (!map[todo.workSpace]) {
        map[todo.workSpace] = [];
      }

      if (todo.favorite) {
        map.Fav.push(todo);
      }
      if (!todo.workSpace) {
        map["My Todos"].push(todo);
      } else if (todo.workSpace !== "Fav") {
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
    }) => (
      <TodoItemList
        todos={workSpaceTodos[item.name] || []}
        updateTodo={updateTodo}
      />
    ),
    [workSpaceTodos]
  );

  return (
    <View className="flex-1 bg-secondary/40">
      <AnimatedTabBar
        items={workspaces}
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
        keyExtractor={(item) => item.id}
      />
      <HomeFooter createTodo={createTodo} scrollViewRef={scrollViewRef} />
    </View>
  );
}
