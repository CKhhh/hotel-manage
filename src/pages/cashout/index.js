import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function Flight() {
  const [list, setList] = useState([]);

  const handleToReview = (id, account, tel) => {
    history.push({
      pathname: '/cashout/detail',
      query: {
        id,
        account,
        tel
      }
    })
  }

  useEffect(() => {
    const user = localStorage.getItem('admin');
    if (!user) {
      history.push('/login');
      return;
    }

    axios('/api/feedback/getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      },
    }).then(res => res.data)
      .then(res => {
        setList(res.data.filter(item => (item.type && item.status === 0)));
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取提现申请列表失败，请刷新重试');
      })
  }, [])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="用户资金"
        subTitle="提现申请"
      />
      <Card  style={{height: '70vh', overflowY: 'scroll'}}>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item.userId, item.msg, item.tel)}}>去审核</a>]}
            >
              <List.Item.Meta
                title={<a>用户ID：{item.userId}</a>}
                description={
                  <>
                    <div>申请编号：{item.id}</div>
                    <div>PayPal账号：{item.msg}</div>
                  </>
                }
              />
              <div style={{color: 'green'}}>待审核</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
