import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TiPencil } from 'react-icons/ti'
import { BsTrash } from 'react-icons/bs'
import empty from '../assets/empty.jpg'
import { setTodoList, addTodo, sortTodo, updateTodo, toggleCompleted } from './ToDoSlice'

function List() {
    const dispatch = useDispatch()
    const todoList = useSelector(state => state.todo.todoList)
    const sortCriteria = useSelector(state => state.todo.sortCriteria)
    const [showModal, setShowModal] = useState(false)
    const [currentTodo, setCurrentTodo] = useState(null)
    const [newTask, setNewTask] = useState('')

    useEffect(() => {
        if (todoList.length > 0) {
            localStorage.setItem('todoList', JSON.stringify(todoList))
        }

    }, [todoList])

    useEffect(() => {
        const localTodoList = JSON.parse(localStorage.getItem("todoList"))
        if (localTodoList) {
            dispatch(setTodoList(localTodoList))
        }

    }, [])
    const handleAddTodo = (task) => {
        if (newTask.trim().length === 0) {
            alert("Please enter a task!")
        } else {
            dispatch(addTodo({ task: task, id: Date.now() }))
            setNewTask("")
            setShowModal(true)
        }
    }
    const handleDeleteToDo = (id) => {
        const updateTodoList = todoList.filter(todo => todo.id !== id)
        dispatch(setTodoList(updateTodoList))
        localStorage.setItem('todoList', JSON.stringify(updateTodoList))
    }

    const handleUpdateTodoList = (id, task) => {
        if (task.trim().length === 0) {
            alert("Please enter a task!")
        } else {
            dispatch(updateTodo({ task: task, id: id }))
            setShowModal(false)
        }
    }

    const handleSort = (sortCriteria) => {
        dispatch(sortTodo(sortCriteria))
    }
    const handleToggleCompleted = (id) => {
        dispatch(toggleCompleted({ id }))
    }

    const sortTodoList = todoList.filter((todo) => {
        if (sortCriteria === "All") return true
        if (sortCriteria === "Completed" && todo.completed) return true
        if (sortCriteria === "Not Completed" && !todo.completed) return true
        return false
    })
     return (
        <div>
            {
                showModal && (
                    <div className='w-full   fixed left-0 right-0 h-[100vh] bg-transparentBlack flex items-center justify-center'>
                        <div className='w-full max-w-[440px] bg-white p-8 rounded-md'>
                            <input
                                type="text"
                                name="task"
                                id=""
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                className="w-full border p-2 rounded-md outline-none mb-8"
                                placeholder={currentTodo ? "Update your task here" :
                                    "Enter your task here"}
                            />
                            <div className='w-full flex justify-between'>
                                {currentTodo ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowModal(false);
                                                handleUpdateTodoList(currentTodo.id, newTask);
                                            }}
                                            className="bg-sunsetOrange text-white py-3 px-10 rounded-md"
                                        >Save</button>
                                        <button
                                            className="bg-Tangaroa rounded-md text-white py-3 px-10"
                                            onClick={() => setShowModal(false)}
                                        >Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setShowModal(false)} className='bg-Tangaroa rounded-md text-white py-3 px-10'>Cancel</button>
                                        <button
                                            onClick={() => {
                                                handleAddTodo(newTask)
                                                setShowModal(false)
                                            }}
                                            className='bg-sunsetOrange rounded-md text-white py-3 px-10'>Add</button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                )
            }
            <div className=" flex items-center justify-center flex-col">
                {todoList.length === 0 ? (
                    <div className="mb-6">
                        <div className="sm:w-[500px] sm:h-[500px] min-w-[250px] min-[250px]">
                            <img src={empty} alt="" />
                        </div>
                        <p className="text-center text-Gray">
                            You have no todo's, please add one.
                        </p>
                    </div>)
                    :
                    (
                        <div className="container mx-auto mt-6 ">
                            <div className="flex justify-center mb-6 border border-[#a1a1a1] w-[200px] p-2 rounded-md text-xl mx-auto ">
                                <select
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="p-1 outline-none text-sm"
                                >
                                    <option value="All" className="text-sm">
                                        All
                                    </option>
                                    <option value="Completed" className="text-sm">
                                        Completed
                                    </option>
                                    <option value="Not Completed" className="text-sm">
                                        Not Completed
                                    </option>
                                </select>
                            </div>
                            <div>
                                {sortTodoList.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className="flex items-center justify-between mb-6 bg-Tangaroa mx-auto w-full md:w-[75%] rounded-md p-4"
                                    >
                                        <div
                                            className={`${todo.completed
                                                ? "line-through text-greenTeal"
                                                : "text-sunsetOrange"
                                                }`}
                                            onClick={() => {
                                                handleToggleCompleted(todo.id);
                                            }}
                                        >
                                            {todo.task}
                                        </div>
                                        <div>
                                            <button
                                                className="bg-blue-500 text-white p-1 rounded-md ml-2"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setCurrentTodo(todo);
                                                    setNewTask(todo.task);
                                                }}
                                            >
                                                <TiPencil />
                                            </button>
                                            <button
                                                className="bg-sunsetOrange text-white p-1 rounded-md ml-2"
                                                onClick={() => handleDeleteToDo(todo.id)}
                                            >
                                                <BsTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

            </div>
            <div className='w-full flex justify-center'>

                <button onClick={() => setShowModal(true)} className='mx-auto bg-sunsetOrange px-10 py-3 text-center text-white rounded-md'>Add Task</button>
            </div>

        </div>
    )
}

export default List
