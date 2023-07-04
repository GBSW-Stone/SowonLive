import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Common/Header";
import StyledBox from "../components/Style/styledBox";
import StyledContainer from "../components/Style/styledContainer";
import CheckIdButton from "../components/Register/ChcekIdButton";
import RegisterInput from "../components/Register/RegisterInput";
import LimitOnLength from "../components/Register/LimitOnLength";
import RegisterButton from "../components/Register/RegisterButton";
import RegisterSelect from "../components/Register/RegisterSelect";
import SchoolSearchResult from "../components/Register/SchoolSearchResult";
import { useDispatch } from "react-redux";
import { registerUser } from "../_actions/user_actions";
import { withRouter } from "react-router-dom";

const SCHOOL_ARR = [
  "1학년1반",
  "1학년2반",
  "1학년3반",
  "1학년4반",
  "2학년1반",
  "2학년2반",
  "2학년3반",
  "2학년4반",
  "3학년1반",
  "3학년2반",
  "3학년3반",
  "3학년4반",


].sort();

const entranceYearArray = [];
for (let i = 2021; i < 2025; i++) {
  entranceYearArray.push(i);
}

function Register({ history }) {
  const dispatch = useDispatch();
  const [inputs, setInput] = useState({
    userId: "",
    userPw: "",
    userEmail: "",
    userNickname: "",
    usableId: false,
  });

  const { userId, userPw, userEmail, userNickname, usableId } = inputs;
  const [option, setOption] = useState("2021");
  const [schoolInput, setSchoolInput] = useState("");
  const [searchResult, setSearchResult] = useState(SCHOOL_ARR);
  const [showSchoolList, setShowSchoolList] = useState(true);
  const [overIdLength, setOverIdLength] = useState(false);
  const [overPwLength, setOverPwLength] = useState(false);

  const onChange = (e) => {
    const { value, name } = e.target;
    setInput({
      ...inputs,
      [name]: value,
      usableId: usableId,
    });

    if (inputs.userId.length > 8) {
      setOverIdLength(true);
    } else {
      setOverIdLength(false);
    }

    if (inputs.userPw.length > 12) {
      setOverPwLength(true);
    } else {
      setOverPwLength(false);
    }
  };

  const checkId = (e) => {
    e.preventDefault();
    if (overIdLength) {
      return;
    }
    axios
      .post(`/register/checkId/${userId}`, { id: userId })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setInput({
            ...inputs,
            usableId: true,
          });
          alert("사용가능한 아이디입니다.");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("다른 아이디를 입력해주세요");
      });
  };

  const handleOption = (e) => {
    setOption(e.target.value);
  };

  const handleSearch = (e) => {
    setShowSchoolList(true);
    setSchoolInput(e.target.value);
    const result = SCHOOL_ARR.filter((school) => {
      return school.includes(e.target.value);
    });
    setSearchResult(result);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setSchoolInput(e.target.textContent);
    setShowSchoolList(false);
  };

  const SignUp = (e) => {
    e.preventDefault();
    let body = {
      id: userId,
      password: userPw,
      email: userEmail,
      nickname: userNickname,
      entranceYear: option,
      school: schoolInput,
    };
    if (overIdLength || overPwLength) {
      return;
    } else if (!userId || !userPw || !userEmail || !userNickname) {
      alert("필수 항목을 작성해주세요");
      return;
    } else if (!SCHOOL_ARR.includes(schoolInput)) {
      alert("학번 선택해주세요");
      return;
    } else if (usableId === false) {
      alert("아이디 중복확인을 해주세요");
      return;
    } else {
      dispatch(registerUser(body))
      .then((response) => {
        if (response.payload.success) {
          alert("회원가입을 완료했습니다.");
          history.push("./");
        } else {
          alert("회원가입에 실패했습니다.");
        }
      })
      .catch((error) => console.log(error));
    }
  };
  return (
    <StyledContainer>
      <div>
        <Header link={"./"} title="회원가입" backbutton={true} />
        <StyledBox padding="18px 16px" lineHeight="20px">
          <form onSubmit={checkId}>
            <RegisterInput
              labelName="아이디"
              name="userId"
              type="text"
              placeholder="아이디"
              onChange={onChange}
              value={userId}
            />
            {overIdLength && (
              <LimitOnLength>아이디를 8자 이내로 입력해주세요</LimitOnLength>
            )}
            <CheckIdButton onClick={checkId}>중복체크</CheckIdButton>
          </form>
          <form onSubmit={SignUp}>
            <RegisterInput
              labelName="비밀번호"
              name="userPw"
              type="password"
              placeholder="비밀번호"
              onChange={onChange}
              value={userPw}
            />
            {overPwLength && (
              <LimitOnLength>비밀번호를 12자 이내로 입력해주세요</LimitOnLength>
            )}
            <RegisterInput
              labelName="이메일"
              name="userEmail"
              type="email"
              placeholder="이메일"
              onChange={onChange}
              value={userEmail}
            />
            <RegisterInput
              labelName="이름"
              name="userNickname"
              type="text"
              placeholder="이름"
              onChange={onChange}
              value={userNickname}
            />
            <RegisterSelect
              labelName="입학년도"
              handleOption={handleOption}
              option={option}
              dataArr={entranceYearArray}
            />
            <RegisterInput
              labelName="학번선택"
              name="userSchool"
              type="text"
              placeholder="학번을 검색하세요  ex) 1학년 1반"
              onChange={handleSearch}
              value={schoolInput}
            />

            {schoolInput && showSchoolList && (
              <SchoolSearchResult
                datas={searchResult}
                handleSearchClick={handleSearchClick}
              />
            )}
            <RegisterButton type="submit">회원가입</RegisterButton>
          </form>
        </StyledBox>
      </div>
    </StyledContainer>
  );
}

export default withRouter(Register);
