export const addTodo = (data) => {
  return {
    type: Add_Todo,
    payload: {
      data: data,
      id: new Date().getTime().toString(),
    },
  };
};

export const removeTodo = (id) => {
  return {
    type: Delete_Todo,
    id,
  };
};

export const Add_Todo = 'Add_Todo';
export const Delete_Todo = 'Delete_Todo';
