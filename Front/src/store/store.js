import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { login_reducer } from '../reducers/login'
import { thread_reducer } from '../reducers/thread'
import { comment_reducer } from '../reducers/comment'
import { category_reducer } from '../reducers/category'



let rootReducers = combineReducers( { login_reducer, thread_reducer, comment_reducer, category_reducer } )
export default createStore(rootReducers, applyMiddleware(thunk));