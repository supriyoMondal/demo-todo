import * as React from "react";
import { TodoItem } from "shared-mutations";
import { Text } from "../ui/text";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle } from "~/lib/icons/Circle";
import { Star } from "~/lib/icons/Star";
import clsx from "clsx";
import { Separator } from "~/components/ui/saperator";
import { useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { Check } from "~/lib/icons/Check";
import { useReplicache } from "~/hooks/useRiplecache";

const { width } = Dimensions.get("window");

const TodoItemList = ({
  todos,
  updateTodo,
}: {
  todos: TodoItem[];
  updateTodo: (todo: TodoItem) => void;
}) => {
  const { completed, notCompleted } = useMemo(() => {
    const completed: TodoItem[] = [];
    const notCompleted: TodoItem[] = [];
    todos.forEach((todo) => {
      if (todo.completed) {
        completed.push(todo);
      } else {
        notCompleted.push(todo);
      }
    });

    return {
      completed,
      notCompleted,
    };
  }, [todos]);

  return (
    <FlatList
      data={notCompleted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TodoListItem onUpdateTodo={updateTodo} todo={item} />
      )}
      style={{ flex: 1, width }}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center h-[70vh]">
          <Image
            source={require("../../assets/placeholder/no-todo.webp")}
            style={{ width: width * 0.5, height: width * 0.5 }}
            resizeMode="contain"
          />
        </View>
      }
      ListFooterComponent={
        todos.length === 0 ? null : (
          <View>
            <Separator />
            <CompletedTodos completedTodos={completed} />
          </View>
        )
      }
    />
  );
};

const CompletedTodos = ({ completedTodos }: { completedTodos: TodoItem[] }) => {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <Collapsible className="px-3" onOpenChange={setCollapsed}>
      <CollapsibleTrigger className="flex-row justify-between py-2">
        <Text className="text-lg">
          Completed{` (${completedTodos.length})`}
        </Text>
        {collapsed ? (
          <ChevronDown className="text-2xl text-foreground/70" />
        ) : (
          <ChevronUp className="text-2xl text-foreground/70" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {completedTodos.map((todo) => (
          <Animated.View key={todo.id} entering={FadeInUp} exiting={FadeOutUp}>
            <View className=" flex-row items-center py-2 gap-4">
              <Check className=" text-blue-400" strokeWidth={3} />
              <Text className="text-lg line-through">{todo.title}</Text>
            </View>
          </Animated.View>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const TodoListItem = ({
  todo,
  onUpdateTodo,
}: {
  todo: TodoItem;
  onUpdateTodo: (todo: TodoItem) => void;
}) => {
  return (
    <View key={todo.id} className="p-3 px-1 flex-row items-start  gap-3">
      <TouchableOpacity
        onPress={() => {
          onUpdateTodo({
            ...todo,
            completed: true,
          });
        }}
        className="p-2 rounded-full"
      >
        <Circle className="text-foreground/70" />
      </TouchableOpacity>
      <View className=" flex-shrink flex-grow pt-1.5">
        <Text className="text-lg">{todo.title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          onUpdateTodo({
            ...todo,
            favorite: !todo.favorite,
          });
        }}
        className="p-2 rounded-full"
      >
        <Star
          className={clsx(
            todo.favorite ? "!text-amber-400" : "text-muted-foreground"
          )}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TodoItemList;
