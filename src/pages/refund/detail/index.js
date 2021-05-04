import React from 'react';
import { useLocation } from 'umi';
import Flight from '../components/Flight';
import { Button, Col, Row } from 'antd';
import Train from '../components/Train';

const Detail = props => {
  const { query: {type, id} } = useLocation();

  return (
    <div>
      {
        type === 2 && <Flight />
      }
      {
        type === 3 && <Train />
      }
    </div>
  );
}

export default Detail;
