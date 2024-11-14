import { useState, useEffect, useRef } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
  const [todo, setTodo] = useState("")
  const [taskstodo, setTaskstodo] = useState([])
  const [finished, setFinished] = useState([])
  const [state, setState] = useState(true)
  let myRef = useRef('');
  // change the state and styling of the elements
  const change = (e) => {
    if (e === 0) {
      setState(true)
      myRef.current.children[0].style.textDecoration = 'underline'
      myRef.current.children[1].style.textDecoration = 'none'
    }
    else {
      setState(false)
      myRef.current.children[0].style.textDecoration = 'none'
      myRef.current.children[1].style.textDecoration = 'underline'
    }
  };
  // get the tasks from the localstorage & display them
  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("taskstodo"));
    const b = JSON.parse(localStorage.getItem("finished"));
    if (a) {
      setFinished(b)
    } if (b) {
      setTaskstodo(a);
    }
  }, []);
  // save all the data to the localstorage
  const save = () => {
    localStorage.setItem("taskstodo", JSON.stringify(taskstodo));
    localStorage.setItem("finished", JSON.stringify(finished));
  }
  // identifies the tasks if they are completed or not & divide them
  const identify = (e) => {
    let a = e.filter(item => {
      return item.iscompleted === true
    })
    setFinished(a)
    let b = e.filter(item => {
      return item.iscompleted === false
    })
    setTaskstodo(b)
  }
  const newtask = (e) => {
    setTodo(e.target.value)
  }
  // add the new task to the list
  const addtask = () => {
    setTaskstodo([...taskstodo, { id: uuidv4(), todo, iscompleted: false }]);
    setTodo("");
  };
  // delete the task from the list
  const Delete = (id) => {
    let arry = [...taskstodo, ...finished]
    let newtasks = arry.filter(item => {
      return item.id !== id
    })
    identify(newtasks)
  }
  // mark the task as completed
  const togle = (id) => {
    let newtasks = [...taskstodo, ...finished]
    let index = newtasks.findIndex(item => {
      return item.id === id
    })
    newtasks[index].iscompleted = !newtasks[index].iscompleted
    identify(newtasks)
  }
  // edit the tasks 
  const Edit = (id) => {
    let arry = [...taskstodo, ...finished]
    let newtodo = arry.filter(item => {
      return item.id === id
    })
    setTodo(newtodo[0].todo)
    Delete(id)
  }
  // return the element to display the finished & unfinished tasks
  const returns = (prop, text) => {
    let a = <div className='h-5/6 mt-5 overflow-y-auto'>
      {prop.length === 0 && <div className='mt-40 dark:text-gray-600 text-lg flex justify-center'>{text}</div>}
      {prop.map(items => {
        return <div key={items.id} className='flex justify-center items-center gap-6 p-2'>
          <input onChange={() => togle(items.id)} type="checkbox" name='check' id={items.id} checked={items.iscompleted} className='mr-6 h-4 w-4 cursor-pointer' />
          <div className={items.iscompleted ? 'line-through w-4/5 text-lg dark:text-gray-400 ' : 'w-4/5   te dark:text-gray-400'}>{items.todo}</div>
          <button onClick={() => { Edit(items.id) }} className='text-2xl dark:text-gray-400'>
            <FaRegEdit />
          </button>
          <button onClick={() => { Delete(items.id) }} className='text-2xl dark:text-gray-400'>
            <MdDelete />
          </button>
        </div>
      })}
    </div>
    return a
  }
  return (
    <>
      <div className="container flex justify-center">
        <div className="mt-8 h-5/6 w-3/4">
          <div className="h-1/6 bg-zinc-900 rounded-xl flex">
            <div className='h1 flex justify-center items-center text-lg lg:text-4xl lg:w-1/5 cursor-pointer'>Todo List</div>
            <div className="flex justify-center items-center gap-1 w-4/5">
              <input onChange={newtask} value={todo} className='p-4 h-2/5 w-4/5 border-2 border-white rounded-3xl bg-zinc-900 cursor-text text-sm dark:placeholder-gray-400 dark:text-gray-400' type="text" name='input' placeholder="Add a new task" />
              <button onClick={addtask} disabled={todo.length < 1} className='text-5xl dark:text-violet-400 rounded-3xl'>
                <IoIosAddCircle />
              </button>
              <button onClick={save} className='h-2/5 w-20 rounded-3xl text-white bg-violet-400'>
                Save
              </button>
            </div>
          </div>
          <div className="mt-1 h-5/6 bar bg-zinc-900 rounded-xl">
            <ol ref={myRef} className='pt-2 dark:text-gray-400 text-xl flex justify-center gap-10 md:gap-80'>
              <li onClick={() => { change(0) }} className='cursor-pointer hover:underline'>Task to do</li>
              <li onClick={() => { change(1) }} className='cursor-pointer hover:underline'>Finished task</li>
            </ol>
            {state === true ? returns(taskstodo, "No Tasks to Display") : returns(finished, "No Finished Tasks to Display")}
          </div>
        </div>
      </div>
    </>
  )
}
export default App
