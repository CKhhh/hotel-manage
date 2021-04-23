import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const statusInfo = {
  0: '已注销',
  1: '未认证',
  2: '已认证',
  3: '待认证',
  4: '认证未通过',
}

const statusColor = {
  0: 'gray',
  1: 'black',
  2: 'green',
  3: 'orange',
  4: 'red',
}

export default function IndexPage() {
  const [userList, setUserList] = useState([]);
  const [toReview, setToReview] = useState([]);
  const [filter, setFilter] = useState('0');

  const handleFilter = ({ key }) => {
    setFilter(key);
  }

  const menu = (
    <Menu
      onClick={handleFilter}
    >
      <Menu.Item key="0">
        <a target="_blank" rel="noopener noreferrer">
          全部用户
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" rel="noopener noreferrer">
          待认证用户
        </a>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  const handleToReview = id => {
    history.push({
      pathname: '/user/detail',
      query: {
        id,
      }
    })
  }

  useEffect(() => {
    const user = localStorage.getItem('admin');
    if (!user) {
      history.push('/login');
      return;
    }

    axios('/api/user/getUserList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      }
    }).then(res => res.data)
      .then(res => {
        const toReview = res.data.filter(item => item.status === 3);
        setUserList(res.data);
        setToReview(toReview);
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取用户列表失败，请刷新重试');
      })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="用户认证"
        subTitle="用户列表"
      />
      <Card>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            筛选 <DownOutlined />
          </a>
        </Dropdown>
      </Card>
      <Card  style={{height: '70vh', overflowY: 'scroll'}}>
        <List
          itemLayout="horizontal"
          dataSource={filter === '0' ? userList : toReview}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item.id)}}>去审核</a>]}
            >
              <List.Item.Meta
                avatar={<Avatar style={{width: '50px', height: '50px'}} src={item.avatar || ''} />}
                title={<a href="https://ant.design">{item.username}</a>}
                description={`用户ID：${item.id}`}
              />
              <div style={{color: statusColor[item.status]}}>{statusInfo[item.status]}</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
