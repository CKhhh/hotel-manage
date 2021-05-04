import { Layout, Menu, Breadcrumb, message } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  LogoutOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useLocation, history } from 'umi';
import './index.css';
import axios from 'axios';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const menuInfo = {
  '/': '民宿审核',
  '/user': '用户审核',
}

const BasicLayout = props => {
  const { pathname } = useLocation();

  const handleJump = path => {
    history.push(path);
  }

  const handleLogout = () => {
    axios('/api/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      }
    }).then(res => {
      message.success('退出成功');
      localStorage.removeItem('admin');
      history.push('/login');
    }).catch(err => {
      console.error(err);
      message.success('退出成功');
      localStorage.removeItem('admin');
      history.push('/login');
    })
  }

  const getUser = () => {
    const user = localStorage.getItem('admin');

    if (!user) {
      history.push('/login');
      return <></>;
    }

    return (
      <span style={{float: 'right'}}>
        <UserOutlined /> admin
        <LogoutOutlined
          style={{marginLeft: '20px', cursor: 'pointer'}}
          onClick={handleLogout}
        />
      </span>
    );
  }

  return (
    pathname === '/login' ?
      <div style={{height: '100vh', width: '100vw', background: '#f8f8f8', overflow: 'hidden'}}>
        {props.children}
      </div> :
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">民宿审核系统</Menu.Item>
          {
            getUser()
          }
          {/*<Menu.Item key="2">nav 2</Menu.Item>*/}
          {/*<Menu.Item key="3">nav 3</Menu.Item>*/}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>{menuInfo[pathname]}</Breadcrumb.Item>
        </Breadcrumb>
        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
            >
              <SubMenu key="sub1" icon={<LaptopOutlined />} title="民宿审核">
                <Menu.Item key="1" onClick={() => {handleJump('/')}}>民宿审核</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<UserOutlined />} title="用户审核">
                <Menu.Item key="5" onClick={() => {handleJump('/user')}}>用户审核</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<FileTextOutlined />} title="交通票出票">
                <Menu.Item key="6" onClick={() => {handleJump('/train')}}>火车票</Menu.Item>
                <Menu.Item key="7" onClick={() => {handleJump('/flight')}}>机票</Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" icon={<CreditCardOutlined />} title="用户资金">
                <Menu.Item key="8" onClick={() => {handleJump('/cashout')}}>提现申请</Menu.Item>
                <Menu.Item key="9" onClick={() => {handleJump('/refund')}}>退款申请</Menu.Item>
                <Menu.Item key="10" onClick={() => {handleJump('/debt')}}>欠款用户</Menu.Item>
              </SubMenu>
              <SubMenu key="sub5" icon={<CommentOutlined />} title="用户反馈">
                <Menu.Item key="11" onClick={() => {handleJump('/feedback')}}>用户反馈</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: '74vh' }}>{props.children}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>民宿审核系统 ©2021</Footer>
    </Layout>
  );
}

export default BasicLayout;
