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
  message, Input,
} from 'antd';
import { history, useLocation } from 'umi';
import axios from 'axios';
import { FileTextOutlined, UserOutlined } from '@ant-design/icons';

const statusInfo = {
  1: '待出票',
  2: '出票失败',
  4: '退款中'
}

const statusColor = {
  1: 'processing',
  2: 'error',
  4: 'warning'
}

const TrainInfo = props => {
  const { query } = useLocation();
  const [order, setOrder] = useState({});
  const [msg, setMsg] = useState({});
  const [ticket, setTicket] = useState('');
  const [update, setUpdate] = useState({});

  const handleFail = () => {
    axios('/api/order/cancelOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        orderId: query.id,
        userId: order.userId,
      }
    }).then(res => res.data)
      .then(res => {
        message.success('提交成功');
        axios('/api/notify/addNotify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('admin')
          },
          data: {
            orderId: query.id,
            userId: order.userId,
            msg: JSON.stringify({
              type: 3,
              msg: '您的火车票订单出票失败，预计在1~5个工作日内退款到账户余额'
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
      })
      .catch(err => {
        message.error('提交失败');
      })
  }

  const handleTicket = () => {
    axios('/api/order/editOrderMsg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        orderId: query.id,
        msg: JSON.stringify({
          ...msg,
          ticket,
        })
      }
    }).then(res => res.data)
      .then(res => {
        message.success('出票成功');
        axios('/api/notify/addNotify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('admin')
          },
          data: {
            orderId: query.id,
            userId: order.userId,
            msg: JSON.stringify({
              type: 3,
              msg: '您的火车票订单出票成功，取票号为'+ticket,
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
      })
      .catch(err => {
        message.error('提交失败');
      })
  }

  useEffect(() => {
    axios('/api/order/getOrderById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        orderId: query.id,
      }
    }).then(res => {
      return res.data;
    })
      .then(res => {
        console.log(res);
        setMsg(JSON.parse(res.data.msg));
        setOrder(res.data);
      })
      .catch(err => {
        console.error(err);
        message.error('获取订单信息失败');
      })
  }, [update])

  return (
    <>
      {order.id ?
        <div>
          <PageHeader
            className="site-page-header"
            title="火车票出票"
            subTitle="订单详情"
          />
          <Card>
            <Row style={{margin: '20px 0'}}>
              <Col span={24}>
                <Descriptions title="订单信息" layout="vertical" bordered>
                  <Descriptions.Item label="订单ID">{order.id}</Descriptions.Item>
                  <Descriptions.Item label="车次">{msg.orderName.split('——')[0]}</Descriptions.Item>
                  <Descriptions.Item label="座位类型">{msg.orderName.split('——')[1]}</Descriptions.Item>
                  <Descriptions.Item label="出发地">{msg.start}</Descriptions.Item>
                  <Descriptions.Item label="目的地">{msg.end}</Descriptions.Item>
                  <Descriptions.Item label="出发日期" style={{color: 'red', fontWeight: 'bold'}}>{msg.date}</Descriptions.Item>
                  <Descriptions.Item label="出发时间">{msg.startTime}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{order.createTime ? `${new Date(order.createTime)}` : '-'}</Descriptions.Item>
                  <Descriptions.Item label="更新时间" span={2}>
                    {order.updateTime ? `${new Date(order.updateTime)}` : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="出票状态" span={msg.ticket ? 2 : 3}>
                    <Badge status={statusColor[order.status]} text={msg.ticket ? '已出票' : statusInfo[order.status]} />
                  </Descriptions.Item>
                  {
                    msg.ticket &&
                    <Descriptions.Item label="取票号">{msg.ticket}</Descriptions.Item>
                  }
                  <Descriptions.Item label="乘车人姓名">{msg.username}</Descriptions.Item>
                  <Descriptions.Item label="乘车人身份证号">{msg.id}</Descriptions.Item>
                  <Descriptions.Item label="联系方式">{msg.tel}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Row>
              <Col offset={6} span={10} style={{textAlign: 'right'}}>
                <Input
                  size="middle"
                  placeholder="火车票取票号"
                  prefix={<FileTextOutlined />}
                  value={ticket}
                  onChange={e => {setTicket(e.target.value)}}
                />
              </Col>
              <Col span={8} style={{textAlign: 'left'}}>
                <Popconfirm
                  title={`取票号为：${ticket}`}
                  onConfirm={handleTicket}
                  okText="确定"
                  cancelText="取消"
                  disabled={(order.status !== 1 || msg.ticket)}
                >
                  <Button disabled={(order.status !== 1 || msg.ticket)} type={'primary'}>出票</Button>
                </Popconfirm>
              </Col>
              <Col span={22} style={{textAlign: 'center', marginTop: '20px'}}>
                <Popconfirm
                  title="出票失败"
                  onConfirm={handleFail}
                  okText="确定"
                  cancelText="取消"
                  disabled={(order.status !== 1 || msg.ticket)}
                >
                  <Button disabled={(order.status !== 1 || msg.ticket)} type={'danger'}>出票失败</Button>
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

export default TrainInfo;
