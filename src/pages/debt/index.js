import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function Debt() {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState({});
  const [update, setUpdate] = useState({});
  const [loading, setLoading] = useState(false);

  const handleToReview = item => {
    setInfo(item);
    setShow(true);
  }

  const handleOk = () => {
    setShow(false);
  }

  const handleCancel = () => {
    setShow(false);
  }

  useEffect(() => {
    const user = localStorage.getItem('admin');
    if (!user) {
      history.push('/login');
      return;
    }

    axios('/api/user/getUserInDebt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      },
    }).then(res => res.data)
      .then(res => {
        setList(res.data);
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取用户列表失败，请刷新重试');
      })
  }, [update])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="用户资金"
        subTitle="欠款用户"
      />
      <Card  style={{height: '70vh', overflowY: 'scroll'}}>
        <List
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" onClick={() => {handleToReview(item)}}>查看</a>]}
            >
              <List.Item.Meta
                title={<a>用户名：{item.id}</a>}
                description={
                  <>
                    <div>账户余额：{item.money}</div>
                  </>
                }
              />
              <div style={{color: 'green'}}>待还款</div>
            </List.Item>
          )}
        />
      </Card>
      <Modal title="反馈详情" visible={show} onOk={handleOk} onCancel={handleCancel} cancelText={'取消'} okText={'确定'} confirmLoading={loading}>
        <p>用户ID：{info.id}</p>
        <p>用户名：{info.username}</p>
        <p>账户余额：{info.money}</p>
        <p>联系方式：{info.tel}</p>
      </Modal>
    </div>
  );
}
