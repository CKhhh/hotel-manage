import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const statusInfo = {
  0: '待审核',
  1: '通过审核',
  2: '已下架',
  3: '已预订',
  4: '审核未通过',
}

const statusColor = {
  0: 'orange',
  1: 'green',
  2: 'gray',
  3: 'black',
  4: 'red',
}

export default function IndexPage() {
  const [hotelList, setHotelList] = useState([]);
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
          全部民宿
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" rel="noopener noreferrer">
          待审核民宿
        </a>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  const handleToReview = id => {
    history.push({
      pathname: '/hotel',
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

    axios('/api/hotel/getAllByAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      }
    }).then(res => res.data)
      .then(res => {
        const toReview = res.data.filter(item => item.status === 0);
        setHotelList(res.data);
        setToReview(toReview);
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取民宿列表失败，请刷新重试');
      })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="民宿审核"
        subTitle="民宿列表"
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
        dataSource={filter === '0' ? hotelList : toReview}
        renderItem={item => (
          <List.Item
            actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item.id)}}>去审核</a>]}
          >
            <List.Item.Meta
              avatar={<Avatar style={{width: '50px', height: '50px'}} src={item.imgs?.length ? item.imgs[0].url : ''} />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={item.info}
            />
            <div style={{color: statusColor[item.status]}}>{statusInfo[item.status]}</div>
          </List.Item>
        )}
      />
      </Card>
    </div>
  );
}
