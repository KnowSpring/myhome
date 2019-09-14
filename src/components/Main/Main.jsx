import React from 'react'
import {Grid,Icon, Input,Item,Button,Dimmer,Loader} from 'semantic-ui-react'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import "./Main.css"
class Main extends React.Component{
  constructor(prop){
    super(prop)
    this.state={
      imagesList:[],
      menuList:[],
      infoList:[],
      faqList:[],
      houseList:[],
      loading: true
    }
  }
//   // 获取轮播图数据
//   getImagesList= async ()=>{
//     let res =  await this.axios.post('homes/swipe')
//     let {meta,data} = res.data
//     if(meta.status === 200){
//       this.setState({
//         imagesList: data.list
//       })
//     }
//   }
//   // 获取菜单栏数据
//   getMenuList= async ()=>{
//     let res =  await this.axios.post('homes/menu')
//     let {meta,data} = res.data
//     if(meta.status === 200){
//       this.setState({
//         menuList: data.list
//       })
//     }
//   }
//   // 获取咨询信息
//   getInfoList = async () => {
//     let res = await this.axios.post('homes/info')
//     let { meta, data } = res.data
//     if (meta.status === 200) {
//       this.setState({
//         infoList: data.list
//       })
//     }
//   }
//    // 获取问答数据
//    getFaqList = async () => {
//      let res = await this.axios.post('homes/faq')
//      console.log(res)
//      let { meta, data } = res.data
//      if (meta.status === 200) {
//        this.setState({
//          faqList: data.list
//        })
//      }
//    }
//  // 获取房屋数据
//  getHouseList = async () => {
//   let res = await this.axios.post('homes/house')
//   let { meta, data } = res.data
//   if (meta.status === 200) {
//     this.setState({
//       houseList: data.list
//     })
//   }
// }
getRequestTypeList = async (url,typeList)=>{
  let res = await this.axios.post(url)
    let { meta, data } = res.data
    if (meta.status === 200) {
      this.setState({
        [typeList]: data.list
      })
    }

}
  render(){
    return (
      <div className="main">
        {/* 加载框 */}
          <Dimmer inverted active={this.state.loading} page>
            <Loader>Loading</Loader>
          </Dimmer>
        {/* 搜索框 */}
        <div className="main_search"><Input fluid placeholder='搜房源...' /></div>
        <div className="main_content">
          {/* 轮播图 */}
          <ImageGallery showFullscreenButton={false} showPlayButton = {false} 
          showThumbnails={false} autoPlay={true} showBullets={true} 
          items={this.state.imagesList} />
          {/* 菜单部分 */}
          <MenuList data={this.state.menuList}></MenuList>
          {/* 咨询部分 */}
          <InfoList data={this.state.infoList}></InfoList>
          {/* 问答部分 */}
          <FaqList data={this.state.faqList}></FaqList>
          {/* 房屋信息部分 */}
          <HouseList data={this.state.houseList}></HouseList>
        </div>
      </div> 
     
      )}
 componentDidMount= async ()=> {
    await Promise.all([
      this.getRequestTypeList('homes/swipe','imagesList') ,
      this.getRequestTypeList('homes/menu', 'menuList'),
      this.getRequestTypeList('homes/info', 'infoList'),
      this.getRequestTypeList('homes/faq', 'faqList'),
      this.getRequestTypeList('homes/house', 'houseList')
    ])
    this.setState({
      loading:false
    })

  }
  


}
export default Main
// 中间菜单栏组件
function MenuList(prop){
  return (
    <Grid className="main_menu"  divided padded >
      <Grid.Row columns={4} >
        {prop.data.map(item => (
            <Grid.Column key={item.id} >
            <div className="home-menu-item">
              <Icon name="home" size="big" />
            </div>
            <div>{item.menu_name}</div>
          </Grid.Column>
         ))}
      </Grid.Row>
    </Grid>)
}
// 租房咨询组件
function InfoList(prop){
  return(
    <div className="home-msg">
      <Item.Group unstackable>
      <Item >
        <Item.Image size='tiny'  src={'http://47.96.21.88:8086/public/zixun.png'} />
        <Item.Content >
          {prop.data.map(item =>(<Item.Header key={item.id}>
            <span>限购 ●</span>
            <span>{item.info_title}</span>
          </Item.Header>))}
          <div className="home-msg-more">
              <Icon name="angle right" size="big" />
          </div>
        </Item.Content>
      </Item>
      </Item.Group>
    </div>
  )
}
// 问答组件
function FaqList(prop){
  return (
    <div className="home-ask">
      <div className="home-ask-title">好客问答</div>
      <ul>
        {prop.data.map(item => (
          <li key={item.question_id}>
            <div>
              <Icon color="green" name="question circle outline" />
              <span>{item.question_name}</span>
            </div>
            <div>
              {item.question_tag.split(',').map(
                tag=>(<Button key={tag} basic color="green" size="mini">{tag}</Button>))}
             
              <div>
                {item.atime} ● <Icon name="comment alternate outline" />{' '}
                {item.qnum}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
// 房屋组件
function HouseList({ data }) {
  let newHouse = []
  let oldHouse = []
  let hireHouse = []
  data.forEach(item => {
    // 用变量把模板装起来
    let temp = (
      <Item key={item.id}>
        <Item.Image src="http://47.96.21.88:8086/public/home.png" />
        <Item.Content>
          <Item.Header>{item.home_name}</Item.Header>
          <Item.Meta>
            <span className="cinema">{item.home_desc}</span>
          </Item.Meta>
          <Item.Description>
            {item.home_tags.split(',').map(tag => (
              <Button key={tag} basic color="green" size="mini">
                {tag}
              </Button>
            ))}
          </Item.Description>
          <Item.Description>{item.home_price}</Item.Description>
        </Item.Content>
      </Item>
    )
    if (item.home_type === 1) {
      newHouse.push(temp)
    }else if (item.home_type === 2) {
      oldHouse.push(temp)
    } else {
      hireHouse.push(temp)
    }
  })
  return (
    <div>
      <div>
        <div className="home-hire-title">最新开盘</div>
        <Item.Group divided unstackable>
          {/* 数组里面存的是模板 */}
          {newHouse}
        </Item.Group>
      </div>
      <div>
        <div className="home-hire-title">二手精选</div>
        <Item.Group divided unstackable>
          {oldHouse}
        </Item.Group>
      </div>
      <div>
        <div className="home-hire-title">组一个家</div>
        <Item.Group divided unstackable>
          {hireHouse}
        </Item.Group>
      </div>
    </div>
  )
}
