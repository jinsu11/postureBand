import React, {useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import Posture_side from '../components/Posture_side';
import Posture_front from '../components/Posture_front';

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const RecordContainer2 = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border-width: 4px;
  border-color: #rgba(75, 121, 161, 0.6);
  background-color: #f8f8f8;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const TouchableOpacity = styled.TouchableOpacity`
  height: 6%;
  width: 30%;
  position: absolute;
  top: 5%;
`;

const Text = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: #333333;
`;

const PostureImg = () => {
  const [imgDisplay, setImgDisplay] = useState(['flex', 'none']);
  return (
    <>
      <Container>
        <TouchableOpacity
          onPress={() => setImgDisplay(['flex', 'none'])}
          style={{
            left: '18%',
          }}>
          <RecordContainer2>
            <Text>측면 자세</Text>
          </RecordContainer2>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setImgDisplay(['none', 'flex'])}
          style={{
            right: '18%',
          }}>
          <RecordContainer2>
            <Text>정면 자세</Text>
          </RecordContainer2>
        </TouchableOpacity>
        <View style={{display: imgDisplay[1]}}>
          <Posture_front />
        </View>
        <View style={{display: imgDisplay[0]}}>
          <Posture_side />
        </View>
      </Container>
    </>
  );
};

export default PostureImg;
