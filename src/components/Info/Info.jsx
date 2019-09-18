import React from 'react'
import {Tab,Item,Icon} from 'semantic-ui-react'
import Tloader from 'react-touch-loader'
import './Info.css'
class Info extends React.Component{
  constructor(){
    super();
    this.state ={
      list:[]
    } 
  }


  
  render(){
    const panes = [
      { menuItem: '资讯', render: () => <Tab.Pane><M1></M1></Tab.Pane> },
      { menuItem: '头条', render: () => <Tab.Pane><M2></M2></Tab.Pane> },
      { menuItem: '问答', render: () => <Tab.Pane><M3></M3></Tab.Pane> },
    ]
    return (
      <div className='find-container'>
        <div className="find-topbar">资讯</div>
        <div className="find-content">
          <Tab panes={panes} />
        </div>
      </div>
    )
  }
}
export default Info

function M1() {
  return <Loader type="1" />
}
function M2() {
  return <Loader type="2" />
}
function M3() {
  return <Loader type="3" />
}

// 定义Message组件
function Message({ data }) {
  console.log(data)
  return (
    <Item.Group unstackable>
      {data.map(item => (
        <Item key={item.id}>
          <Item.Image size="small" src="http://47.96.21.88:8086/public/1.png" />
          <Item.Content verticalAlign="middle">
            <Item.Header className="info-title">{item.info_title}</Item.Header>
            <Item.Meta>
              <span className="price">$1200</span>
              <span className="stay">1 Month</span>
            </Item.Meta>
          </Item.Content>
        </Item>
      ))}
    </Item.Group>
  )
}

// 定义问答组件
function AskAnswer({ data }) {
  console.log(data)
  return (
    <ul className="info-ask-list">
      {data.map(item => (
        <li key={item.question_id}>
          <div className="title">
            <span className="cate">
              <Icon color="green" name="users" size="small" />
              思维
            </span>
            <span>
             {item.question_name}
            </span>
          </div>
          <div className="user">
            <Icon circular name="users" size="mini" />
            {item.username}
          </div>
          <div className="info">
            {item.answer_content}
          </div>
          <div className="tag">
            {item.question_tag.split(',').map( tagname => (
              <span key={tagname}>{tagname}</span>
            ) )}
            <span>{item.atime}回答</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

//定义touch-loader组件
class Loader extends React.Component{
  constructor(){
    super();
    this.state = {
      hasMore: false,
      initializing: 1,
      total: 0,
      pagenum:0,
      pagesize: 2,
      list:[]
    }
  }
  // 加载数据
  loaderData = ()=>{
    console.log('dd')
   return this.axios.post('infos/list', {
      type: this.props.type,
      pagenum: this.state.pagenum,
      pagesize: this.state.pagesize
    })
    .then(res => {
      let { meta, data } = res.data
      if (meta.status === 200) {
        return  data.list
     
      }
    })
  }
  async componentDidMount(){
    let res = await this.loaderData()
    let newNum = this.state.pagenum + this.state.pagesize
    let {total,data} = res
    //重置状态
    this.setState({
      pagenum:  newNum,
      initializing: 2,
      list: data,
      total: total,
      hasMore: newNum < total
    })
  }
  // 上拉刷新
  refresh = async (resolve,reject)=>{
      // 重置初始的条数
    // react的setState是异步的，通过setState修改react内部的数据，不是立即更新的
    // 如果就想获取立即更新的数据
    this.setState({
      pagenum: 0
    })
    setTimeout(async ()=>{
      let res = await this.loaderData()
      let newNum = this.state.pagenum + this.state.pagesize
        this.setState({
          pagenum:  newNum,
          list: res.data,
          hasMore: newNum< res.total
        })
        resolve()

    },0)
   
  }
  // 下拉加载
  loadMore = async (resolve,reject)=>{
    let res = await this.loaderData()
    let newNum = this.state.pagenum + this.state.pagesize
    let newList = [...this.state.list,...res.data]
      this.setState({
        pagenum:  newNum,
        list: newList,
        hasMore: newNum< res.total
      })
      resolve()


  }
  render(){
    let {list,initializing,hasMore} = this.state
    let {type} = this.props
    return(
      <div className="view">
        <Tloader
          className="main"
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          hasMore={hasMore}
          initializing={initializing}
        >
          {type === '3' ? <AskAnswer data={list} /> : <Message data={list} />}
        </Tloader>
    </div>
    )
  }
} 