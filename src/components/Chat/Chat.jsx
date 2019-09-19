import React from 'react'
import moment from 'moment'
import './Chat.css'
import ChatWindow from './ChatWindow'
class Chat extends React.Component{
  constructor(){
    super()
    this.state = {
      list:[],
      chatInfo:{},
      isShow: false
    }
  }
 async componentDidMount(){
  //  挂载之后请求聊天列表数据
    let res = await this.axios.post('chats/list')
    let { meta, data } = res.data
    console.log(data)
    if (meta.status === 200) {
      this.setState({
        list: data.list
      })
    }
  }
    // 打开聊天窗口,将聊天相关数据保存起来，用来传给聊天组件
  toChat = (item)=>{
    this.setState({
      isShow: true,
      chatInfo:{
        from_user: item.from_user,
        to_user: item.to_user,
        avatar: item.avatar,
        username: item.username
      }
    })
  }
  // 关闭聊天组件，方法传给组件，由父组件管理
  closeChatWinow = ()=>{
    this.setState({
      isShow: false
    })
  }
  render(){
    return (
        <div className="chat-container">
        {this.state.isShow && (
          <ChatWindow 
            closeChatWinow = {this.closeChatWinow}
            chatInfo={this.state.chatInfo}>
          </ChatWindow>
          ) } 
          <div className="chat-title">聊天</div>
          <div className="chat-list">
            <ul>
             {this.state.list.map(item =>(
               <li key={item.id} onClick = {this.toChat.bind(this,item)}>
                  <div className="avarter">
                    <img src={item.avatar} alt="avarter" />
                    <span className="name">{item.username}</span>
                    <span className="info">{item.chat_msg}</span>
                    <span className="time">
                     {moment(item.ctime).format('YYYY-MM-DD HH:MM:SS')}
                    </span>
                  </div>
                </li>
             ))}
              
            </ul>
          </div>
        </div>
      )
  }

}
export default Chat