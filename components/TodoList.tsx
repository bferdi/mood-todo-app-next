"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  mood: string;
  completed: boolean;
}

const moods = [
  { value: 'excited', emoji: '😃', label: 'Excited' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [mood, setMood] = useState('neutral');

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, mood, completed: false }]);
      setNewTodo('');
      setMood('neutral');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
          className="flex-grow"
        />
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent>
            {moods.map(mood => (
              <SelectItem key={mood.value} value={mood.value}>
                {mood.emoji} {mood.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addTodo}>Add Todo</Button>
      </div>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ul className="space-y-2">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggle={toggleTodoCompletion}
              />
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="completed">
          <ul className="space-y-2">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggle={toggleTodoCompletion}
              />
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TodoItem({ todo, onDelete, onToggle }: { todo: Todo; onDelete: (id: number) => void; onToggle: (id: number) => void }) {
  return (
    <li className="flex items-center justify-between bg-secondary p-3 rounded-md">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
        />
        <label
          htmlFor={`todo-${todo.id}`}
          className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
        >
          {todo.text} {getMoodEmoji(todo.mood)}
        </label>
      </div>
      <Button variant="destructive" size="icon" onClick={() => onDelete(todo.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

function getMoodEmoji(mood: string) {
  const selectedMood = moods.find(m => m.value === mood);
  return selectedMood ? selectedMood.emoji : '😐';
}