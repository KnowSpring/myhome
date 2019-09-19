import React from 'react'
import {Button,Form,TextArea,Icon} from 'semantic-ui-react'
import './ChatWindow.css'
import handle from './wsmain'
class ChatWindow extends React.Component{
  constructor(){
    super() 
    this.state = {
      list:[],
      client:'',
      msgContent: ''

    }
    this.scrolRef = React.createRef()
  }
    // 发送ajax请求，获取聊天数据
  getChatList = async () => {
    let res = await this.axios.post('chats/info', {
      from_user: this.props.chatInfo.from_user,
      to_user: this.props.chatInfo.to_user
    })
    let { meta, data } = res.data
    if (meta.status === 200) {
      this.setState({
        list: data.list
      })
    }
  }
  // 实现双向绑定
  handleChange = (e)=>{
    this.setState({
      msgContent: e.target.value
    })
  }
  sendMsg = ()=>{
    // 给服务器发送的数据包含：
    // from_user: 从谁发
    // to_user： 给谁发
    // this.state.msgContent: 发送的内容
    let sendData = {
      id: new Date().getTime(),
      from_user: this.props.chatInfo.from_user,
      to_user : this.props.chatInfo.to_user,
      avatar : this.state.avatar,
      chat_msg : this.state.msgContent
    }
    // 发送消息
    this.state.client.emitEvent('msg_text_send',JSON.stringify(sendData))
    this.scrolRef.current.scrollIntoView()
      // 重新渲染聊天列表
      let newList = [...this.state.list, sendData]
      this.setState({
        list: newList,
        msgContent: ''
      })
   
   

  }
  async componentDidMount (){
       // 获取当前用户的头像
    let res = await this.axios.post('my/info',{
      user_id: localStorage.getItem('uid')
    })
    let {meta,data} = res.data
    if( meta.status === 200 ){
        this.setState({
          avatar: data.avatar
        })
    }

    //获取聊天内容
    this.getChatList()

    let currentUser = localStorage.getItem('uid') - 0
    // 通过websocket连接服务器，得到client对象
    // 参数1： 连接聊天服务器的id
    // 参数2： 回调函数，服务器每次给发送的消息，都在data中
    // 返回值：client对象
    let client  = handle(currentUser,message =>{
      //接收对方返回的消息
      let newMessage = JSON.parse(message.content)
      let dataList = [...this.state.list,newMessage]
      //更新聊天内容
      this.setState({
        list:dataList,
      })
    })
    this.setState({
      client
    })




  }
  render(){
    let currentUser = localStorage.getItem('uid') - 0
    return(
      <div className="chat-window">
      <div className="chat-window-title">
        <Icon
          onClick = {this.props.closeChatWinow}
          name="angle left"
          className="chat-ret-btn"
          size="large"
        />
        <span>{this.props.chatInfo.username}</span>
      </div>
      <div className="chat-window-content" ref={this.scrolRef}>
        <ul>
          {this.state.list.map(item=>(
            <li key={item.id} className = {currentUser === item.from_user ? 'chat-info-right' : 'chat-info-left'}>
              <img src={item.avatar} alt="头像"/>
              <span>{item.chat_msg}</span>
              </li>
            
          ))}
         
        </ul>
      </div>
      <div className="chat-window-input">
        <Form>
          <TextArea
            placeholder="请输入内容..."
            value = {this.state.msgContent}
            onChange ={this.handleChange}
          />
          <Button onClick={this.props.closeChatWinow}>关闭</Button>
          <Button primary onClick = {this.sendMsg}>
            发送
          </Button>
        </Form>
      </div>
    </div>
    )
  }
}
export default ChatWindow