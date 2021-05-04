import React, { useState, useEffect } from 'react';
import './index.less';
import { history } from 'umi';
import axios from 'axios';
import { List, message, Avatar, Card, Menu, Dropdown, PageHeader, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function Feedback() {
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
    setLoading(true);
    axios('/api/feedback/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        id: info.id,
        status: 1,
      }
    }).then(res => res.data)
      .then(res => {
        console.log(res);
        setLoading(false);
        setShow(false);
        setUpdate({});
        message.success('处理成功');
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        message.error('处理失败');
      })
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

    axios('/api/feedback/getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': user
      },
    }).then(res => res.data)
      .then(res => {
        setList(res.data.filter(item => (item.type === 0 && item.status === 0)));
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('获取反馈申请列表失败，请刷新重试');
      })
  }, [update])

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="用户反馈"
        subTitle="反馈列表"
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
                title={<a>用户ID：{item.userId}</a>}
                description={
                  <>
                    <div>反馈编号：{item.id}</div>
                    <div>反馈内容：{item.msg}</div>
                  </>
                }
              />
              <div style={{color: 'green'}}>待处理</div>
            </List.Item>
          )}
        />
      </Card>
      <Modal title="反馈详情" visible={show} onOk={handleOk} onCancel={handleCancel} cancelText={'取消'} okText={'已处理'} confirmLoading={loading}>
        <p>用户ID：{info.userId}</p>
        <p>反馈编号：{info.id}</p>
        <p>相关订单：{info.orderId || '未填写'}</p>
        <p>联系方式：{info.tel || '未填写'}</p>
        <p>反馈内容：{info.msg}</p>
      </Modal>
    </div>
  );
}
