import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const typeInfo = {
  0: '民宿',
  1: '景区',
  2: '机票',
  3: '火车票',
}

export default function Flight() {
  const [list, setList] = useState([]);
  const [type, setType] = useState(0);

  const handleFilter = ({ key }) => {
    setType(Number(key));
  }

  const menu = (
    <Menu
      onClick={handleFilter}
    >
      <Menu.Item key="0">
        <a target="_blank" rel="noopener noreferrer">
          民宿
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" rel="noopener noreferrer">
          景区
        </a>
      </Menu.Item>
      <Menu.Item key="2">
        <a target="_blank" rel="noopener noreferrer">
          机票
        </a>
      </Menu.Item>
      <Menu.Item key="3">
        <a target="_blank" rel="noopener noreferrer">
          火车票
        </a>
      </Menu.Item>
      <Menu.Divider />
    </Menu>
  );

  const handleToReview = id => {
    history.push({
      pathname: '/refund/detail',
      query: {
        id,
        type,
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
        type,
        status: 4,
      }
    }).then(res => res.data)
      .then(res => {
        setList(res.data);
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取订单列表失败，请刷新重试');
      })
  }, [type])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="退款处理"
        subTitle="待退款列表"
      />
      <Card>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            筛选 <DownOutlined />
          </a>
        </Dropdown>
        <span style={{marginLeft: '10px'}}>
          {typeInfo[type]}
        </span>
      </Card>
      <Card  style={{height: '70vh', overflowY: 'scroll'}}>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item.id)}}>去退款</a>]}
            >
              <List.Item.Meta
                title={<a>{JSON.parse(item.msg).orderName}</a>}
                description={
                  <>
                    <div>订单ID：{item.id}</div>
                  </>
                }
              />
              <div style={{color: 'green'}}>待退款</div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
