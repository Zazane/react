import { useEffect, useState } from "react"
import { TodoForm } from "./TodoForm"
import { TodoList } from "./TodoList"
import "./styles.css"

export default function App() { // empty tag (fragment) for returning multiple components in one function
  
  // setNewItem("abc") runs application all over again, it calls the function in an infinite loop
  // const [todos, setTodos] = useState([]) - does not load from storage
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEMS")
    if (localValue == null) return []

    return JSON.parse(localValue)
  })

  // for local storage - every time todos change we want to run this code
  // cannot put them in ifs, loops, returns, they need to be at top
  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(todos))
  }, [todos])

  function addTodo(title) {
    // cannot call this twice in a row, because it will always have the empty array, not the array with the new item at the end
    // second call overrides the first one
    //setTodos([...todos, { id: crypto.randomUUID(), title: newItem, completed: false}])
    //setTodos([...todos, { id: crypto.randomUUID(), title: newItem, completed: false}])

    setTodos((currentTodos) => {
      return [
        ...currentTodos,
        { id: crypto.randomUUID(), title, completed: false}
      ]
    })
  }

  // when dealing with a state you can't change it, so you have to make a new state object with ...
  function toggleTodo(id, completed) {
    setTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id == id) {
          return {...todo, completed}
        }

        return todo
      })
    })
  }

  // returns all but the selected id
  function deleteTodo(id) {
    setTodos(currentTodos => {
      return currentTodos.filter(todo => todo.id !== id)
    })
  }

  // for key best to not use index, in case we delete
  // key is needed for each item to know which one we are looking at
  // short circuiting - a JS concept {todos.length === 0 && "No Todos"} - if first part is true, it evaluates the second, if want to use false, then have to use ||
  return (
    <>
      <TodoForm onSubmit={addTodo}/>
      <h1 className="header">Todo List</h1>
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo}/>
    </>
  )
}