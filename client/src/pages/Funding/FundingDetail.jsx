import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import Modal from "../../components/SubPage/Funding/Modal";
import {
  GridWrapper,
  MaxWidthContainer,
  ThumbnailImg,
} from "../../styles/CommonStyle";
import { getUpcycleData, getUserData } from "../../api/getDatas";
import { deleteUpcycle } from "../../api/deleteApi";

const FundingDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundingRate, setFundingRate] = useState();
  const [profile, setprofile] = useState("");

  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    getUpcycleData(id).then((response) => {
      setData(response.data.data);

      getUserData(response.data.data.memberId).then((res) => {
        setprofile(res.data.data.thumbNailImage);
      });
    });
  }, []);

  useEffect(() => {
    if (data.totalReceivedQuantity === 0) {
      setFundingRate("00");
    } else if (data.totalQuantity && data.totalReceivedQuantity) {
      setFundingRate(
        ((data.totalReceivedQuantity / data.totalQuantity) * 100).toFixed(1)
      );
    }
  }, [data.totalQuantity, data.totalReceivedQuantity]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  const deleteFunding = () => {
    const shouldDelete = window.confirm("정말로 삭제하시겠습니까?");

    if (shouldDelete) {
      handleDelete();
    }
  };

  const handleDelete = () => {
    deleteUpcycle(id).then(() => {
      navigate("/funding");
      alert("삭제되었습니다.");
    });
  };

  return (
    <MaxWidthContainer>
      <GridWrapper>
        <div className="FundingD__left_wrap">
          <ThumbnailImg src={data.thumbNailImage} alt="img" />
          <MaterierBox>
            <MaterierGroup>
              {[
                "IconCloth",
                "IconWood",
                "IconPlastic",
                "IconSteel",
                "IconGlass",
                "IconEtc",
              ].map((obj, idx) => (
                <Materials image={obj} categoryId={data.categoryId} idx={idx} />
              ))}
            </MaterierGroup>
            <p>
              "{data.categoryName}" 자재가 있다면 펀딩해주세요!
              <br />
              <br />
              이은 펀딩은 단순히 제품을 펀딩하는 것이 아닌 업사이클링 제품을
              위한 펀딩 과정을 지원해요.
            </p>
          </MaterierBox>
        </div>
        <RightArea>
          <Userbox>
            <Userinf>
              {profile !== null ? (
                <Userprofile src={profile} alt="유저 프로필" />
              ) : (
                <Userprofile
                  src={`${process.env.PUBLIC_URL}/image/profile.webp`}
                  alt="기본 프로필"
                />
              )}
              <Upcycler>{data.displayName}</Upcycler>
            </Userinf>
            {userData.memberId === data.memberId ? (
              <ButtonContainer>
                <Button onClick={deleteFunding}>삭제</Button>
                <LinkEdit to={`/fundingedit/${data.upcyclingId}`}>
                  <Button>수정</Button>
                </LinkEdit>
              </ButtonContainer>
            ) : null}
          </Userbox>
          <Subbox>
            <WrapperTitle>🎁 펀딩</WrapperTitle>
            <ViewCount>조회수 {data.viewCount}</ViewCount>
          </Subbox>
          <Title>{data.title}</Title>
          <IntroduceBox>{data.content}</IntroduceBox>
          <AmountBox>
            <WrapperText>{data.deadline} </WrapperText>
            <div>부로 펀딩이 마감됩니다. </div>
          </AmountBox>
          <Fundingpercent>
            <WrapperText>
              {data.totalReceivedQuantity <= 0 ? "00%" : `${fundingRate}%`}
            </WrapperText>
            <div>달성했습니다.</div>
          </Fundingpercent>
          {localStorage.getItem("token") &&
            userData.memberId !== data.memberId && (
              <CreateButton onClick={handleOpenModal}>펀딩하기</CreateButton>
            )}

          {!localStorage.getItem("token") && (
            <Link to="/login">
              <CreateButton>로그인 이후 펀딩 가능합니다</CreateButton>
            </Link>
          )}
        </RightArea>
      </GridWrapper>
      <Footer />
      {isModalOpen && (
        <Modal
          id={id}
          data={data}
          userData={userData}
          setIsModalOpen={setIsModalOpen}
          fundingRate={fundingRate}
          setFundingRate={setFundingRate}
        />
      )}
    </MaxWidthContainer>
  );
};

export default FundingDetail;

const MaterierBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgb(249, 250, 251);
  border-radius: 5px;
  padding: 1rem;
  & > p {
    font-size: 12px;
  }
`;
const RightArea = styled.div`
  /* padding: 1rem; */
  & p {
    margin-top: 5px;
    font-size: 14px;
    color: rgb(221, 106, 106);
  }
`;

const MaterierGroup = styled.div`
  display: flex;
  justify-content: space-around;
  /* margin: 20px 0; */
`;

const Materials = styled.div`
  display: block;
  appearance: none;
  width: 40px;
  height: 40px;
  padding: 0;
  margin: 5px 15px;
  border: 2px solid transparent;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: ${(props) => `url(/icon/${props.image}.webp)`};
  background-size: cover;
  &:focus {
    outline: none;
  }
  ${(props) =>
    props.categoryId === props.idx + 1 &&
    css`
      border-color: #6e934d;
      background-color: #fff;
      border-radius: 5px;
    `};
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const Userbox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 0.8px solid rgb(236, 236, 238);
`;

const Userinf = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Userprofile = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Upcycler = styled.div`
  margin-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const LinkEdit = styled(Link)`
  outline: none;
  text-decoration: none;
  color: black;
`;

const Button = styled.button`
  background-color: #6e934d;
  border: none;
  border-radius: 10px;
  height: 30px;
  width: 50px;
  text-align: center;
  cursor: pointer;
  color: #fff;
  margin-left: 10px;
  &:hover {
    background-color: #6e934d91;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const Subbox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ViewCount = styled.div`
  font-size: 13px;
`;

const Title = styled.div`
  width: 100%;
  height: 50px;
  font-size: 17px;
  resize: none;
  font-family: Arial, Helvetica, sans-serif;
  white-space: pre-line;
  word-break: break-all;
  margin-bottom: 10px;
`;

const WrapperTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
`;

const WrapperText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #6e934d;
  margin-right: 5px;
`;

const IntroduceBox = styled.div`
  width: 100%;
  height: 300px;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 25px;
  font-family: Arial, Helvetica, sans-serif;
  resize: none;
  white-space: pre-line;
  word-break: break-all;
`;

const AmountBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  padding-top: 15px;
  margin-bottom: 10px;
  border-top: 0.8px solid rgb(236, 236, 238);
`;

const Fundingpercent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: right;
  margin-bottom: 20px;
`;

const CreateButton = styled.button`
  width: 100%;
  height: 50px;
  font-size: 17px;
  font-weight: 400;
  border: none;
  background-color: #6e934d;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #6e934d91;
    border-radius: 10px;
    cursor: pointer;
  }
`;

const Footer = styled.button`
  height: 60px;
`;
