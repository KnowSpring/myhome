import React from 'react'
import {Grid,Icon,Button,Modal} from 'semantic-ui-react'
import AvatarEditor from 'react-avatar-editor'
import "./My.css"
class My extends React.Component{
  constructor(){
    super()
    this.state = {
      avatar:'',
      username:'',
      isShowSelect:false,
      // 是否显示裁剪组件
      isShowCrop: false,
      // 保存文件图片
      fileImg:''
    }

  }
  async componentDidMount(){
    // 获取用户信息
    let res = await this.axios.post('my/info', {
      user_id: localStorage.getItem('uid')
    })
    let {meta,data} = res.data
    if(meta.status =200){
      this.setState({
        avatar: data.avatar,
        username:data.username
      })
    }

  }
  // 显示图片选择弹出框
  showSelect = ()=>{
    this.setState({
      isShowSelect: true
    })
  }
  // 由父组件管理状态给子组件传方法 保存图片，裁剪图片显示，关闭选择组件
  showCrop = (fileImg)=>{
    this.setState({
      fileImg,
      isShowCrop: true,
      isShowSelect:false
    })
  }
    // 关闭裁剪模态框，更改图片
    closeCrop = (avatar)=>{
      this.setState({
        isShowCrop: false,
        avatar
      })
    }
    
  render(){
    return (
      <div className="my-container">
        {/* 选择图片组件 */}
      <SelectAvatar open={this.state.isShowSelect} showCrop = {this.showCrop}></SelectAvatar>
        {/*裁剪图片组件  */}
        <CropAvatar open={this.state.isShowCrop} fileImg ={this.state.fileImg} closeCrop={this.closeCrop}></CropAvatar>
        <div className="my-title">
          <img src={'http://127.0.0.1:9999/public/my-bg.png'} alt="me" />
          <div className="info">
            <div className="myicon">
              {/* 给头像注册点击事件，显示选择头像的弹窗 */}
              <img
                src={this.state.avatar}
                alt="icon"
                onClick={this.showSelect}
              />
            </div>
            <div className="name">{this.state.username}</div>
            <Button color="green" size="mini">
              已认证
            </Button>
            <div className="edit">编辑个人资料</div>
          </div>
        </div>
        <Grid padded className="my-menu">
          <Grid.Row columns={3}>
            <Grid.Column>
              <Icon name="clock outline" size="big" />
              <div>看房记录</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="yen sign" size="big" />
              <div>我的订单</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="bookmark outline" size="big" />
              <div>我的收藏</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="user outline" size="big" />
              <div>个人资料</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="home" size="big" />
              <div>身份认证</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name="microphone" size="big" />
              <div>联系我们</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="my-ad">
          <img src={'http://127.0.0.1:9999/public/ad.png'} alt="" />
        </div>
      </div>
    )
  }
}
export default My
// 选择图片组件
class SelectAvatar extends React.Component{
  constructor(){
    super()
    // 用非受控组件,操作input
    this.fileRef = React.createRef()
  }
  submitFile = ()=>{
    // 按确定保存图片
    let file = this.fileRef.current.files[0]
    this.props.showCrop(file)
   
    
  }
  render(){
    let { open } = this.props
    return (
      <div>
        {/* 弹窗组件 */}
        <Modal size="small" open={open}>
          <Modal.Header>选择图片</Modal.Header>
          <Modal.Content>
            <input type="file" ref={this.fileRef} />
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="确定"
              onClick = {this.submitFile}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
// 裁剪图片组件
class CropAvatar extends React.Component{
  constructor(){
    super()
    this.state = {
      scale: 1
    }
  }
  // 设置编辑的ref
  setEditorRef = (editor) => this.editor = editor 
  // 变成受控组件
  handleRange = (e)=>{
    console.log(e.target)
    this.setState({
      scale: e.target.value
    })
  }
  // 提交裁剪后的图片进行保存
  submitAvatar = async () =>{
    // 得到裁剪后的图片
    let avatar =  this.editor.getImageScaledToCanvas().toDataURL()
    // 进行数据库更新
    let res = await this.axios.post('my/avatar', {
      avatar: avatar
    })
    let { meta } = res.data
    if( meta.status === 200 ){
      // 调用父组件方法，更改状态
      this.props.closeCrop(avatar)
    }
    
  }
  render(){
    let {open,fileImg} = this.props
    return (
      <div>
        <Modal size="small" open={open}>
          <Modal.Header>上传头像</Modal.Header>
          <Modal.Content>
            <AvatarEditor
              ref={this.setEditorRef}
              borderRadius={100}
              image={fileImg}
              width={200}
              height={200}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              rotate={0}
              scale ={this.state.scale}
            />
            <div>
              <span className="avatar-zoom">缩放:</span>
              <input
                value={this.state.scale}
                onChange = {this.handleRange}
                name="scale"
                type="range"
                min="1"
                max="2"
                step="0.01"
              />
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="确定"
              onClick={this.submitAvatar}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}