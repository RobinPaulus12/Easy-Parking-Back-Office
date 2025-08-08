import { configureStore } from '@reduxjs/toolkit'
import formReducer from './slice/form.js';


export default configureStore({
    reducer: {
        form: formReducer,
    }
})