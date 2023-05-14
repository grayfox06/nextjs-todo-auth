let todos = [];

export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(todos);
      break;
    case 'POST':
      const newTodo = {
        id: Date.now(),
        text: req.body.text,
      };
      todos.push(newTodo);
      res.status(201).json(newTodo);
      break;
    case 'DELETE':
      const idToDelete = parseInt(query.id);
      const todoIndex = todos.findIndex((todo) => todo.id === idToDelete);
      if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.status(200).json({ message: 'Todo deleted successfully' });
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
