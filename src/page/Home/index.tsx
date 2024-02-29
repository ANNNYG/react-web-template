import React from 'react';
import { styled } from 'styled-components';
import { useSelector } from 'react-redux';

import { globalSlice, selectUserId } from '@/store/globalSelector';

const HomeDiv = styled.div`
  width: 100%;
`;

const Home: React.FC = () => {
  const global = useSelector(globalSlice);
  const userId = useSelector(selectUserId);

  return (
    <HomeDiv>
      Home,userId: {global.userId}&{userId}
    </HomeDiv>
  );
};

export default Home;
