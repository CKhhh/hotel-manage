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

import './index.less';
import dayjs from 'dayjs';

const statusInfo = {
  0: '待审核',
  1: '通过审核',
  2: '已下架',
  3: '已预订',
  4: '审核未通过',
}

const statusColor = {
  0: 'warning',
  1: 'success',
  2: 'default',
  3: 'processing',
  4: 'error',
}

const Hotel = props => {
  const { query } = useLocation();
  const [hotel, setHotel] = useState({});
  const [info, setInfo] = useState({});
  const [update, setUpdate] = useState({});

  const handleConfirm = status => {
    axios('/api/hotel/changeStatus', {
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
      axios('/api/notify/addNotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('admin')
        },
        data: {
          userId: hotel.owner,
          msg: JSON.stringify({
            type: 0,
            msg: status !== 4 ? '您的民宿（'+ hotel.name +'）已通过审核' : '您的民宿（'+ hotel.name +'）未通过审核'
          })
        }
      }).then(res => res.data)
        .then(res => {
          console.log(res);
          message.success('提交审核结果成功');
          setUpdate({});
        })
        .catch(err => {
          console.error('err');
        })
    }).catch(err => {
      console.error(err);
      message.error('提交审核结果失败');
    })
  }

  useEffect(() => {
    axios('/api/hotel/detail', {
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
        setHotel(res.data);
        let msg = {};
        try {
          msg = JSON.parse(res.data.info);
        } catch (e) {
          msg = {
            info: res.data.info,
          };
        }
        setInfo(msg);
      })
      .catch(err => {
        console.error(err);
      })
  }, [update])

  return (
    <>
    {hotel.id ?
    <div>
      <PageHeader
        className="site-page-header"
        title="民宿审核"
        subTitle="民宿详情"
      />
      <Card>
        <Row>
          <Col span={11}>
            <Card>
              <h2 style={{fontWeight: 'bold'}}>民宿图片</h2>
              <Carousel autoplay style={{height: '20vw', width: '100%', overflow: 'hidden', background: '#f8f8f8'}}>
                {
                  hotel.imgs?.filter(item => item.type === 1).length ?
                    hotel.imgs?.filter(item => item.type === 1).map(item => (
                      <Image
                        width={'100%'}
                        src={item.url}
                      />
                    )) :
                    <div>暂无民宿图片</div>
                }
              </Carousel>
            </Card>
          </Col>
          <Col span={1} />
          <Col span={11}>
            <Card>
              <h2 style={{fontWeight: 'bold'}}>房产证图片</h2>
              <Carousel autoplay style={{height: '20vw', width: '100%', overflow: 'hidden', background: '#f8f8f8'}}>
                {
                  hotel.imgs?.filter(item => item.type === 2).length ?
                    hotel.imgs?.filter(item => item.type === 2).map(item => (
                      <Image
                        width={'100%'}
                        src={item.url}
                      />
                    )) :
                    <div>暂无房产证</div>
                }
              </Carousel>
            </Card>
          </Col>
        </Row>
        <Row style={{margin: '20px 0'}}>
          <Col span={24}>
            <Descriptions title="民宿信息" layout="vertical" bordered>
              <Descriptions.Item label="民宿名称">{hotel.name}</Descriptions.Item>
              <Descriptions.Item label="民宿城市">{hotel.city}</Descriptions.Item>
              <Descriptions.Item label="民宿地址">{hotel.address}</Descriptions.Item>
              <Descriptions.Item label="起租时间">{hotel.startTime ? `${dayjs(new Date(hotel.startTime)).format('YYYY-MM-DD')}` : '-'}</Descriptions.Item>
              <Descriptions.Item label="截止时间" span={2}>
                {hotel.endTime ? `${dayjs(new Date(hotel.endTime)).format('YYYY-MM-DD')}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="民宿状态" span={3}>
                <Badge status={statusColor[hotel.status]} text={statusInfo[hotel.status]} />
              </Descriptions.Item>
              <Descriptions.Item label="民宿价格">&yen;{hotel.price}/晚</Descriptions.Item>
              <Descriptions.Item label="发布时间">{hotel.publishTime ? `${dayjs(new Date(hotel.publishTime)).format('YYYY-MM-DD')}` : '-'}</Descriptions.Item>
              <Descriptions.Item label="民宿ID">{hotel.id}</Descriptions.Item>
              <Descriptions.Item label="民宿简介">
                {info.info}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Row>
          <Col span={11} style={{textAlign: 'center'}}>
            <Popconfirm
              title="确定通过审核"
              onConfirm={() => {handleConfirm(1)}}
              okText="确定"
              cancelText="取消"
            >
              <Button type={'primary'}>通过审核</Button>
            </Popconfirm>
          </Col>
          <Col span={2} />
          <Col span={11} style={{textAlign: 'center'}}>
            <Popconfirm
              title="确定审核不通过"
              onConfirm={() => {handleConfirm(4)}}
              okText="确定"
              cancelText="取消"
            >
              <Button type={'danger'}>审核不通过</Button>
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
