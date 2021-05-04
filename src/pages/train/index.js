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

export default function Flight() {
  const [list, setList] = useState([]);

  const handleToReview = id => {
    history.push({
      pathname: '/train/detail',
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

    axios('/api/order/getOrderByTypeAndStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      },
      data: {
        type: 3,
        status: 1,
      }
    }).then(res => res.data)
      .then(res => {
        setList(res.data.filter(item => !JSON.parse(item.msg).ticket));
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取订单列表失败，请刷新重试');
      })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="交通票出票"
        subTitle="火车票"
      />
      <Card  style={{height: '70vh', overflowY: 'scroll'}}>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item.id)}}>去出票</a>]}
            >
              <List.Item.Meta
                title={<a>{JSON.parse(item.msg).orderName}</a>}
                description={
                  <>
                    <div>订单ID：{item.id}</div>
                    <div>出发时间：{JSON.parse(item.msg).date} {JSON.parse(item.msg).startTime}</div>
                  </>
                }
              />
              <div style={{color: 'green'}}>待出票</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
