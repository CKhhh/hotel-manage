import React, { useState, useEffect } from 'react';
import {
  Card,
  Carousel,
  Image,
  List,
  PageHeader,
  Row,
  Col,
  Descriptions,
  Badge,
  Button,
  Popconfirm,
  message,
} from 'antd';
import { history, useLocation } from 'umi';
import axios from 'axios';

const statusInfo = {
  0: '已注销',
  1: '未认证',
  2: '已认证',
  3: '待认证',
  4: '认证未通过',
}

const statusColor = {
  0: 'default',
  1: 'processing',
  2: 'success',
  3: 'warning',
  4: 'error',
}

const UserInfo = props => {
  const { query } = useLocation();
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState({});

  const handleConfirm = () => {
    axios('/api/feedback/changeUserFeedbackStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        userId: query.id,
        type: 1,
        status: 1,
      }
    }).then(res => {
      message.success('提交提现结果成功');
      axios('/api/notify/addNotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('admin')
        },
        data: {
          userId: query.id,
          msg: JSON.stringify({
            type: 5,
            msg: `您的提现申请已处理，收款账号为${query.account}，提现金额为${user.money}元，请注意查收`
          })
        }
      }).then(res => res.data)
        .then(res => {
          console.log(res);
          setUpdate({});
        })
        .catch(err => {
          console.error('err');
        })
    }).catch(err => {
      console.error(err);
      message.error('提交提现结果失败');
    })
  }

  useEffect(() => {
    axios('/api/user/getUserById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        id: query.id,
      }
    }).then(res => {
      console.log(res);
      return res.data;
    })
      .then(res => {
        console.log(res);
        setUser(res.data);
      })
      .catch(err => {
        console.error(err);
        message.error('获取用户信息失败');
      })
  }, [update])

  return (
    <>
      {user.id ?
        <div>
          <PageHeader
            className="site-page-header"
            title="提现申请"
            subTitle="用户详情"
          />
          <Card>
            <Row style={{margin: '20px 0'}}>
              <Col span={24}>
                <Descriptions title="用户信息" layout="vertical" bordered>
                  <Descriptions.Item label="用户名称">{user.username}</Descriptions.Item>
                  <Descriptions.Item label="用户电话">{user.tel}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{user.createTime ? `${new Date(user.createTime)}` : '-'}</Descriptions.Item>
                  <Descriptions.Item label="更新时间" span={2}>
                    {user.updateTime ? `${new Date(user.updateTime)}` : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="用户状态" span={3}>
                    <Badge status={statusColor[user.status]} text={statusInfo[user.status]} />
                  </Descriptions.Item>
                  <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
                  <Descriptions.Item label="用户余额" style={{color: 'red'}}>&yen;{user.money}</Descriptions.Item>
                  <Descriptions.Item label="PayPal账号">{query.account}</Descriptions.Item>
                  <Descriptions.Item label="提现联系方式">{query.tel}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{textAlign: 'center'}}>
                <Popconfirm
                  title="已处理提现申请"
                  onConfirm={handleConfirm}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type={'primary'}>已处理</Button>
                </Popconfirm>
              </Col>
            </Row>
          </Card>
        </div> :
        <div />
      }
    </>
  );
}

export default UserInfo;
