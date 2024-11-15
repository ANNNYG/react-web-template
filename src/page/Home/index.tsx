import React from 'react';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';

import { globalSlice, selectUserId } from '@/store/globalSelector';

import { fetchGame, fetchGame2 } from './apis';

const HomeDiv = styled.div`
  width: 100%;
`;

const controller = new AbortController();

const Home: React.FC = () => {
  const global = useSelector(globalSlice);
  const userId = useSelector(selectUserId);

  const handleSendRequest = async () => {
    // const res = await fetchGame({}, controller.signal);
    const res = await fetchGame2({ name: '原神' });
    console.log(res);
  };

  const handleCancelRequest = () => {
    controller.abort();
  };

  return (
    <HomeDiv>
      Home,userId: {global.userId}&{userId}
      <button onClick={handleSendRequest}>发送请求</button>
      <button onClick={handleCancelRequest}>取消请求</button>
    </HomeDiv>
  );
};

export default Home;
