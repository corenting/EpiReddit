import React from 'react'
import { Provider } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import RootComponent from './components/RootComponent'
import store from './store/store'

const App = () => (
    <Provider store={store}>
      <RootComponent/>
    </Provider>
)
export default App