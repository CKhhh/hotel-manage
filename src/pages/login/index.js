import React, { useState } from 'react';
import { Button, Card, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { history } from 'umi';

import './index.less';

const Login = props => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username) {
      message.warning('请填写用户名');
      return;
    }
    if (!password) {
      message.warning('请填写密码');
      return;
    }
    setLoading(true);
    axios('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username,
        password,
      }
    }).then(res => res.data)
      .then(res => {
      message.success('登录成功');
      setLoading(false);
      localStorage.setItem('admin', res.data.token);
      history.push('/');
    }).catch(err => {
      setLoading(false);
      console.error(err);
      message.error('登录失败');
    })
  }

  return (
    <Card title="管理员登录" headStyle={{textAlign: 'center', fontWeight: 'bold'}} style={{ width: 500, height: 300, borderRadius: '10px', margin: '200px auto', boxShadow: '5px 5px 10px #888888' }}>
      <Input
        className="user-input"
        size="large"
        placeholder="用户名"
        value={username}
        onChange={e => {
          setUsername(e.target.value)}}
        prefix={<UserOutlined />} />
      <Input
        className="user-input"
        size="large"
        type="password"
        placeholder="密码"
        value={password}
        onChange={e => {
          setPassword(e.target.value)}}
        prefix={<UserOutlined />} />
      <Button
        type="primary"
        loading={loading}
        style={{width: "100%", marginTop: '20px'}}
        onClick={handleLogin}>
        登录
      </Button>
    </Card>
  )
}

export default Login;
