import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import StyledBox from '../../Style/styledBox';
import MyPageButton from '../../Style/MyPageButton';
import MyPageInput from '../../Style/MyPageInput';
import MyPageTitle from '../../Style/MyPageTitle';

const Alert = styled.p`
  color: #757575;
  font-size: 12px;
  font-weight: normal;
  line-height: 18px;
  margin-top: 16px;
`;

function WithDrawal({history}) {
  const [CurrentPassword, setCurrentPassword] = useState("");
  const userFrom = localStorage.getItem('userId');
  const onChangeHandler = (e) => {
    setCurrentPassword(e.currentTarget.value);
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    let body = {
      _id: userFrom,
      password: CurrentPassword
    }
    axios.post('/user/withdrawal', body)
      .then((response) => {
        if(!response.data.changeSuccess) {
          alert(response.data.message);
        } else {
          if(response.data.changeSuccess) {
            alert("회원탈퇴가 완료되었습니다.");
            history.push("/");
          } else {
            alert("회원탈퇴에 실패했습니다.")
          }
        }
      })
    }
    
  return (
    <>
      <Header title='회원탈퇴' link="/board" backbutton={true}/>
      <StyledBox>
        <form onSubmit={onSubmitHandler}>
          <MyPageTitle>계정 비밀번호</MyPageTitle>
          <MyPageInput 
              type="password"
              placeholder="계정 비밀번호" 
              value={CurrentPassword} 
              onChange={onChangeHandler} 
          />
          <MyPageButton type="submit">회원탈퇴</MyPageButton>
        </form>
      </StyledBox>
      <Footer/>
    </>
  )
}

export default withRouter(WithDrawal);
