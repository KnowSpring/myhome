import React from 'react'
import {Grid, Icon} from 'semantic-ui-react'
import {NavLink,Route,Switch} from 'react-router-dom'
import Main from '../Main/Main'
import Info from '../Info/Info'
import Chat from '../Chat/Chat'
import My from '../My/My'
import './Home.css'
class Home extends React.Component{
  render(){
    return(
      <div className="home"> 
        <div className="home_content">
          {/* 一个BrowserRouter够了 */}
           <Switch>
             <Route exact path="/home" component={Main}></Route>
             <Route path="/home/info" component={Info}></Route>
             <Route path="/home/chat" component={Chat}></Route>
             <Route path="/home/my" component={My}></Route>
           </Switch>
        </div>
        <div className="home_menu">
          <Grid>
            <Grid.Row columns={4}>
              <Grid.Column>
               <NavLink to="/home" exact>
                  <Icon name="home"></Icon>
                  <p>首页</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/info">
                  <Icon name="paper plane"></Icon>
                  <p>资讯</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/chat">
                  <Icon name="chat"></Icon>
                  <p>聊天</p>
                </NavLink>
              </Grid.Column>
              <Grid.Column>
                <NavLink to="/home/my">
                  <Icon name="user"></Icon>
                  <p>我的</p>
                </NavLink>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        </div>
     

    )
  }
}
export default Home