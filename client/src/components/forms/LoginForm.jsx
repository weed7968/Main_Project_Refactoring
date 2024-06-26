import useInputs from "../../hooks/useInputs";
import { postLogin } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import * as S from "./LoginForm.styled";

const LoginForm = () => {
  const [loginInfo, onChange] = useInputs({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const AxiosLogin = (e) => {
    e.preventDefault();
    postLogin(loginInfo)
      .then((res) => {
        if (res.status === 200) {
          const authHeader = res.headers["authorization"];
          const accessToken = authHeader.split(" ")[1];
          localStorage.setItem("token", accessToken);
          localStorage.setItem("login", "true");
        }

        navigate("/");
      })
      .catch((err) => {
        if (err.response.data === "Member not found") {
          alert("이메일 또는 비밀번호를 확인하세요.");
        }
      });
  };

  return (
    <S.LoginFormContainer>
      <Input
        variant="primary"
        label="이메일"
        type="email"
        name="username"
        placeholder="이메일을 입력해주세요."
        onChange={onChange}
        color="#fff"
      ></Input>
      <Input
        variant="primary"
        label="비밀번호"
        type="password"
        name="password"
        placeholder="비밀번호를 입력해주세요."
        onChange={onChange}
        color="#fff"
      ></Input>
      <Button type="submit" onClick={AxiosLogin} formFields={loginInfo}>
        log in
      </Button>
      <div className="signup_btn">
        <p>아직 이은의 회원이 아니라면,</p>
        <S.SignupButton onClick={() => navigate("/signup")}>
          sign up
        </S.SignupButton>
      </div>
    </S.LoginFormContainer>
  );
};

export default LoginForm;
