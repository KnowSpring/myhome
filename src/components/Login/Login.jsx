import React from 'react'
import {Form} from 'semantic-ui-react'
import './Login.css'
// 要进行编程式导航要导入with
import {withRouter} from 'react-router-dom'
class Login extends React.Component{
  constructor(){
    super()
    this.state ={
      uname:'',
      pwd:''
    }
  }
  render(){
    return(
      <div className="login_contaniner">
        <div className="login_title">登录</div>
        <div className="login_form">
          <Form>
            <Form.Field>
              <Form.Input size='big'  icon='user' iconPosition='left'  placeholder='请输入用户名...' name="uname" autoComplete= 'off' value={this.state.uname} onChange={this.handleChange}/>
            </Form.Field>
            <Form.Field>
              <Form.Input size='big' icon='lock' iconPosition='left' placeholder='请输入密码...' name='pwd' autoComplete='off' value={this.state.pwd}  onChange={this.handleChange} />
            </Form.Field>
            <Form.Field>
              <Form.Button size='big'  positive fluid onClick={this.login}>登录</Form.Button>
            </Form.Field>
          </Form>
        </div>
      </div>
    )
  }
  // 用于处理受控组件
  handleChange = (e)=>{
    let {name,value} = e.target
    this.setState({
      [name] : value
    })
  }
  // 进行登录功能
  login=async()=>{
    let {uname,pwd} =this.state
    let res = await this.axios.post('users/login',{
      uname,
      pwd
    })
    let {meta,data} =res.data
    if(meta.status === 200 ){
      // 把token给保存到浏览器本地
      localStorage.setItem('token',data.token)
      //把userid存储起来
      localStorage.setItem('uid',data.uid)
      this.setState({
        uname:'',
        pwd:''
      })
      // 成功跳转首页
      this.props.history.push('/home')
      
    }
  

  }

}
export default withRouter(Login)