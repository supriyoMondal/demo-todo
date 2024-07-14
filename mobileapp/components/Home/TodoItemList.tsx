import { View } from "lucide-react-native";
import { TodoItem } from "shared-mutations";
import { Text } from "../ui/text";

const TodoItemList = ({ todos }: { todos: TodoItem[] }) => {
  return (
    <>
      {todos.map((todo) => (
        <View key={todo.id} className="bg-card p-3 w-full bg-slate-600">
          <Text>{todo.title}</Text>
        </View>
      ))}
    </>
  );
};

export default TodoItemList;
