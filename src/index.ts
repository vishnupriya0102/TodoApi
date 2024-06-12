import { Hono } from 'hono'

type Todo = {
  id: string;
  task:string;
  description: string;
  is_completed:boolean;
};

type Bindings = {
  KV : KVNamespace;
  
};

const app = new Hono<{Bindings: Bindings}>();
//await will wait not execute
app.post('/todos/new',async (c)=>{
  const{id, task, description, is_completed } = await c.req.json()
  const newTodo: Todo={
    id:id,
    task:task,
    description:description,
    is_completed:is_completed
  }
  await c.env.KV.put('todo:${newTodo.id}',
  JSON.stringify(newTodo))
  return c.text('Todo Created')
})

app.post('/todos/new', async(c)=>{
  return c.text('Todo Created')
})

app.get('/get-all-todos', async(c)=>{
  const all_todos = await c.env.KV.list({prefix: "todo"})
  const todos = [];
  
for(let key of all_todos.keys){
  const todo=await c.env.KV.get(key.name);
  todos.push(todo);
}
return c.json({all_todos});
})

app.get('/get-all-todos-fast', async(c)=>{
  const all_todos = await c.env.KV.list({prefix: "todo:"})
  const todoPromise = all_todos.keys.map(key=>c.env.KV.get(key.name));
  const todos = await Promise.all(todoPromise);
return c.json({todos});
})

app.delete('/delete/:id', async(c)=>{
  await c.env.KV.delete ('todo:${newTodo.id}');
  return c.text('Deleted')
})
//todo:${newTodo.id}
app.post('/random',async (c)=>{
  const random =Math.random();
  await c.env.KV.put('random',random.toString());
})

app.get('/', async(c) => {
 
})

//get all nodes
//app.get('/', (c) => {return c.text('Hello Hono!')})
//app.get('/name', (c) => {return c.text('Hello vp')})

app.get('/todos', async(c) => {})

//create a new node

app.post('/todos/new', async(c) => {})

//update a todo by id

app.put('/todo/:id', async (c) => {})

//delete a todo by id

app.delete('/todo/:id', async(c) => {})

// app.get('/todo/:id', async (c) => {
//   const id = c.req.param('id');

//   try {
//     const rawData = await c.env.KV.get(id);

//     // Check if the data exists before attempting to parse
//     if (rawData) {
//       const todo = JSON.parse(rawData);
//       return c.json(todo);
//     } else {
//       return c.json({ error: 'Food not found' });
//     }
//   } catch (error) {
//     console.error('Error retrieving food details:', error);
//     // return c.status(500).json({ error: 'Internal server error' });
//   }
// });



app.get('/todos/:id', async(c) => {
  const id = c.req.param('id')
  const todo = await c.env.KV.get(id);
  if (todo) {
    return c.json(JSON.parse(todo)); // Parse and return only if data exists
  } else {
    return c.text('Todo not found'); // Return message if no data
  }
  return c.json(todo)
})
export default app
