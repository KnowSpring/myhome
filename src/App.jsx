import React from 'react';
import Login from './components/Login/Login'
import Home from './components/Home/Home.jsx'
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'

class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
       <Switch>
        <Redirect path="/" to="/login" exact ></Redirect>
         <Route path="/login" component={Login}></Route>
         <Route path="/home" component={Home}></Route>
       </Switch>
      </BrowserRouter>
    )
  }

}

export default App;
