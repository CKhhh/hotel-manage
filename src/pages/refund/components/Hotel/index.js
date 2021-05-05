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
import * as dayjs from 'dayjs';

const statusInfo = {
  1: '已支付',
  2: '已取消',
  4: '退款中'
}

const statusColor = {
  1: 'processing',
  2: 'error',
  4: 'warning'
}

const Hotel = props => {
  const { query } = useLocation();
  const [order, setOrder] = useState({});
  const [msg, setMsg] = useState({});
  const [price, setPrice] = useState('');
  const [update, setUpdate] = useState({});

  const handleFail = () => {
    axios('/api/order/changeOrderStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        orderId: query.id,
        status: 1,
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
              msg: '您的火车票票订单退款失败，已将订单退回已支付状态'
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

  const updateMoney = () => {
    return axios('/api/user/updateMoney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('admin')
      },
      data: {
        userId: order.userId,
        money: Number(price),
      }
    })
      .then(res => res.data);
  }

  const handleRefund = () => {
    if (Number(price) > Number(order.price)) {
      message.error('退款金额大于用户支付金额');
      return;
    }
    if (Number(price) <= 0) {
      message.error('退款金额不能小于0元');
      return;
    }
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
          refund: price,
          ticket: undefined,
        })
      }
    }).then(res => res.data)
      .then(res => {
        updateMoney().then(res => {
          message.success('退款成功');
          axios('/api/order/changeOrderStatus', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'token': localStorage.getItem('admin')
            },
            data: {
              orderId: query.id,
              status: 2,
            }
          }).then(res => res.data)
            .then(res => {
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
                    msg: '您的火车票订单退款成功，退回金额为'+price+'元，退回至账户余额',
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
              console.error(err);
            })
        }).catch(err => {
          console.error('err');
          message.error('退款失败');
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
            title="民宿退款"
            subTitle="订单详情"
          />
          <Card>
            <Row style={{margin: '20px 0'}}>
              <Col span={24}>
                <Descriptions title="订单信息" layout="vertical" bordered>
                  <Descriptions.Item label="订单ID">{order.id}</Descriptions.Item>
                  <Descriptions.Item label="民宿ID">{order.houseId}</Descriptions.Item>
                  <Descriptions.Item label="入住时间">{dayjs(msg.startTime).format('YYYY-MM-DD')}</Descriptions.Item>
                  <Descriptions.Item label="离开时间">{dayjs(msg.endTime).format('YYYY-MM-DD')}</Descriptions.Item>
                  <Descriptions.Item label="创建时间">{order.createTime ? `${new Date(order.createTime)}` : '-'}</Descriptions.Item>
                  <Descriptions.Item label="更新时间" span={2}>
                    {order.updateTime ? `${new Date(order.updateTime)}` : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="订单状态" span={3}>
                    <Badge status={statusColor[order.status]} text={statusInfo[order.status]} />
                  </Descriptions.Item>
                  <Descriptions.Item label="住客姓名">{msg.name}</Descriptions.Item>
                  <Descriptions.Item label="住客身份证号">{msg.idNum}</Descriptions.Item>
                  <Descriptions.Item label="住客联系方式">{msg.tel}</Descriptions.Item>
                  <Descriptions.Item label="支付金额" style={{color: 'red'}}>&yen;{order.price}</Descriptions.Item>
                  {
                    msg.refund &&
                    <Descriptions.Item label="退款金额" style={{color: 'green'}}>&yen;{msg.refund}</Descriptions.Item>
                  }
                </Descriptions>
              </Col>
            </Row>
            <Row>
              <Col offset={6} span={10} style={{textAlign: 'right'}}>
                <Input
                  size="middle"
                  placeholder="退款金额"
                  prefix={<FileTextOutlined />}
                  aria-valuemax={Number(order.price)}
                  type={'number'}
                  value={price}
                  onChange={e => {setPrice(e.target.value)}}
                />
              </Col>
              <Col span={8} style={{textAlign: 'left'}}>
                <Popconfirm
                  title={`退款金额：${price}`}
                  onConfirm={handleRefund}
                  okText="确定"
                  cancelText="取消"
                  disabled={(order.status !== 4)}
                >
                  <Button disabled={(order.status !== 4)} type={'primary'}>退款</Button>
                </Popconfirm>
              </Col>
              <Col span={22} style={{textAlign: 'center', marginTop: '20px'}}>
                <Popconfirm
                  title="拒绝退款"
                  onConfirm={handleFail}
                  okText="确定"
                  cancelText="取消"
                  disabled={(order.status !== 4)}
                >
                  <Button disabled={(order.status !== 4)} type={'danger'}>拒绝退款</Button>
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

export default Hotel;
