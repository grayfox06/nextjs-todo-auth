import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from 'react-query';

const fetchTodos = async () => {
  const response = await fetch('/api/todos');
  const data = await response.json();
  return data;
};

const addTodo = async (text) => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  return data;
};

const deleteTodo = async (id) => {
  const response = await fetch(`/api/todos?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

const TodoList = () => {
  const [inputEvent, setInputEvent] = useState('');
  const dispatch = useDispatch();

  const { data: todos, refetch } = useQuery('todos', fetchTodos);

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: (newTodo) => {
      refetch(); // Refresh the todos after adding a new todo
    },
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      refetch(); // Refresh the todos after deleting a todo
    },
  });

  const handleSubmit = () => {
    if (inputEvent.trim() === '') return;
    addTodoMutation.mutate(inputEvent);
    setInputEvent('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  return (
    <div className='flex flex-col gap-4 p-8 rounded-lg shadow-lg space-y-8'>
      <h2 className='flex justify-center font-bold text-orange-300 text-xl'>
        TODO
      </h2>
      <div className='space-x-4'>
        <input
          type='text'
          onChange={(e) => setInputEvent(e.target.value)}
          onKeyDown={handleKeyDown}
          value={inputEvent}
          placeholder='Add new todo'
          className='pl-4 p-3 border-2 border-orange-200 w-96 rounded-md outline-orange-200'
        />
      </div>

      {todos &&
        todos.map((item) => {
          return (
            <div
              key={item.id}
              className='flex justify-between border-b border-orange-100 !mt-3'
            >
              <p className='font-normal italic'>{item.text}</p>
              <button
                onClick={() => handleDeleteTodo(item.id)}
                className='px-3 rounded-md text-grey hover:text-orange-400'
              >
                X
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default TodoList;
