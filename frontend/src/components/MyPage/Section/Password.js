import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import Header from '../../Common/Header';
import Footer from '../../Common/Footer';
import StyledBox from '../../Style/styledBox';
import MyPageTitle from '../../Style/MyPageTitle';
import MyPageInput from '../../Style/MyPageInput';
import MyPageButton from '../../Style/MyPageButton';

const Titlebox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Subtitle = styled.p`
  color: #ccc;
  font-size: 12px;
  font-weight: normal;
  line-height: 24px;
  padding-right: 4px;
  margin-top: 10px;
`;

const Warning = styled.strong`
  color: #c62917;
  margin-left: 4px;
  font-weight: normal;
`;

const Alert = styled.p`
  color: #999;
  font-size: 12px;
  line-height: 18px;
  margin-top: 20px;
`;

function Password({history}) {
  const [inputs, setInput] = useState({
    currentPassword: "",
    checkPassword: "",
    newPassword: "",
  });
  const { currentPassword, checkPassword, newPassword } = inputs;
  const userFrom = localStorage.getItem('userId');

  const onChangeHandler = (e) => {
    const { value, name } = e.currentTarget;
    setInput({
      ...inputs,
      [name]: value,
    });
  }

    const onSubmitHandler = (e) => {
      e.preventDefault();
      let body = {
        _id: userFrom,
        oldPassword: currentPassword,
        newPassword: newPassword
      }
      if(newPassword !== checkPassword) {
        alert("새 비밀번호를 확인해주세요.")
      } else {
        axios.post('/user/update/password', body)
        .then((response) => {
          if(!response.data.changeSuccess) {
            alert(response.data.message);
          } else {
            if(response.data.changeSuccess) {
              history.push("/mypage");
              alert("비밀번호가 변경되었습니다.")
            } else {
              alert("비밀번호 변경에 실패했습니다.")
            }
          }
        })
      }
    }

    return (
      <>
        <Header title="비밀번호 변경" link="/board" backbutton={true} />
        <form onSubmit={onSubmitHandler}>
          <StyledBox>
            <Titlebox>
              <MyPageTitle>새 비밀번호</MyPageTitle>
              <Subtitle>4~20자</Subtitle>
            </Titlebox>
            <MyPageInput 
              type="password"
              name="newPassword"
              placeholder="새 비밀번호" 
              value={newPassword} 
              onChange={onChangeHandler}
            />
            <MyPageInput 
              type="password"
              name="checkPassword"
              placeholder="새 비밀번호 확인" 
              value={checkPassword} 
              onChange={onChangeHandler}
            />
            <MyPageTitle>계정 비밀번호</MyPageTitle>
            <MyPageInput
              type="password"
              name="currentPassword"
              placeholder="현재 비밀번호" 
              value={currentPassword} 
              onChange={onChangeHandler}
            />
            <MyPageButton>비밀번호 변경</MyPageButton>
          </StyledBox> 
        </form>
        <Footer/>
      </>
  )
}

export default withRouter(Password);
