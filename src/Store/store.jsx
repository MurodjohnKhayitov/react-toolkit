import { configureStore } from "@reduxjs/toolkit";
import TodoReducer from '../components/ToDoSlice'
const store = configureStore({
    reducer: {
        todo: TodoReducer
    }
})
export default store