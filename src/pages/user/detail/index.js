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
  const [files, setFiles] = useState([]);

  const handleConfirm = status => {
    axios('/api/user/changeUserStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        id: query.id,
        status,
      }
    }).then(res => {
      message.success('提交认证结果成功');
      location.reload();
    }).catch(err => {
      console.error(err);
      message.error('提交认证结果失败');
    })
  }

  const getImage = params => {
    axios('/api/user/getImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        id: query.id,
      }
    }).then(res => res.data)
      .then(res => {
        console.log(res);
        setFiles(res.data);
        setUser(params);
      })
      .catch(err => {
        console.error(err);
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
        getImage(res.data);
      })
      .catch(err => {
        console.error(err);
        message.error('获取用户信息失败');
      })
  }, [])

  return (
    <>
      {user.id ?
        <div>
          <PageHeader
            className="site-page-header"
            title="用户认证"
            subTitle="用户详情"
          />
          <Card>
            <Row>
              <Col span={6} />
              <Col span={12}>
                <Card>
                  <h2 style={{fontWeight: 'bold'}}>认证图片</h2>
                  <Carousel autoplay style={{height: '20vw', width: '100%', overflow: 'hidden', background: '#f8f8f8'}}>
                    {
                      files.length ? files.map(item => (
                          <Image
                            width={'100%'}
                            src={item?.url}
                          />
                        )
                      ) :
                        <div>暂无认证图片</div>
                    }
                  </Carousel>
                </Card>
              </Col>
              <Col span={6} />
            </Row>
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
                </Descriptions>
              </Col>
            </Row>
            <Row>
              <Col span={11} style={{textAlign: 'center'}}>
                <Popconfirm
                  title="确定通过认证"
                  onConfirm={() => {handleConfirm(2)}}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type={'primary'}>通过认证</Button>
                </Popconfirm>
              </Col>
              <Col span={2} />
              <Col span={11} style={{textAlign: 'center'}}>
                <Popconfirm
                  title="确定认证不通过"
                  onConfirm={() => {handleConfirm(4)}}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type={'danger'}>认证不通过</Button>
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
