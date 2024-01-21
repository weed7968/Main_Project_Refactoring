import styled from "styled-components";

export const LoginFormContainer = styled.form`
  display: grid;
  grid-gap: 1.8rem;

  .signup_btn {
    & > p {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      color: #fff;
    }
  }
`;
export const SignupButton = styled.button`
  padding: 10px;
  width: 100%;
  color: var(--color-main);
  background: #ffffff;
  border-radius: 5px;
  border: solid 1px var(--color-main);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: var(--shadow-btn);

  &:hover {
    box-shadow: var(--shadow-btn-hover);
  }

  &:active {
    box-shadow: var(--shadow-btn-active);
  }

  /* &:active {
    box-shadow: 1px 1px 3px rgba(107, 107, 107, 0.288);
  } */
`;
