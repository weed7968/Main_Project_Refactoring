import React, { useState, useEffect, useContext } from "react";
import Header from "../../components/Header/Header";
import style from "./StoreDetail.module.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserDataContext } from "../../contexts/UserDataContext";

const StoreDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [profile,setprofile] = useState("");
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    axios({
      url: `/sells/${id}`,
      method: "get",
    })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`/members/${data.memberId}`)
      .then((res) => {
        console.log(res);
        setprofile(res.data.data.thumbNailImage)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.memberId]);

  const handleChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleOpenModal = () => {
    if (quantity) {
      setIsModalOpen(true);
      axios({
        url: `/orders`,
        method: "post",
        data: {
          memberId: userData.memberId,
          orderSells: [
            {
              sellId: data.sellId,
              quantity: quantity,
            },
          ],
        },
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setQuantity(0);
  };

  const navigate = useNavigate();

  const deleteStore = () => {
    axios({
      url: `/sells/${id}`,
      method: "delete",
    })
      .then((response) => {
        console.log(response);
        navigate("/store");
      })
      .catch((err) => console.log(err));
  };

  const formatPriceWithCommas = (price) => {
    if (price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return "수량을 선택해주세요!";
  };

  return (
    <div id={style.AllContainer}>
      <Header />
      <div id={style.AllWrapper}>
        <div id={style.leftWrapper}>
          <div id={style.imgContainer}>
            <img id={style.thumimg} src={data.thumbNailImage} alt="img"/>
          </div>
          <div id={style.MaterierBox}>
            <div className={style.materiarblank}></div>
            <div className={style.materiartext}>판매자가 작성한 제품에 사용된 업사이클링 품목입니다.</div>
            <div className={style.materiartext}>이은 스토어는 단순히 수익성 제품을 판매하는 것이 아닌 업사이클링 제품을 판매하는 과정을 지원해요.</div>
            <hr id={style.materiarhr}></hr>
            <div id={style.materialcontext}>{data.material}</div>
            <div className={style.materiarblank}></div>
          </div>
        </div>
        <div id={style.rightWrapper}>
          <div id={style.userbox}>
            <div id={style.userinf}>
              {profile !== null ? (
                <img id={style.userprofile} src={profile} alt="펀딩 이미지 미리보기" />
              ) : (
                <img id={style.userprofile} src={`${process.env.PUBLIC_URL}/image/profile.jpeg`} alt="기본 프로필"/>
              )}              
              <div id={style.upcycler}>{data.displayName}</div>
            </div>
            <div id={style.useroption}>
              {userData.memberId === data.memberId ? (
                <div id={style.buttonContainer}>
                  <button className={style.button} onClick={deleteStore}>
                    삭제
                  </button>
                  <Link to={`/storeedit/${data.sellId}`} className={style.link}>
                    <button className={style.button}>수정</button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          <h3 className={style.h3}>업사이클러</h3>
            <div id={style.upcycler}>{data.displayName}</div>
          <div id={style.NameInput}>
            <h3>{data.title}</h3>
          </div>
          <div id={style.IntroduceBox}>{data.content}</div>
          <div className={style.AmountBox}>
            <div>
              <h2>판매 가격</h2>
            </div>
            <div>
              <h2>{formatPriceWithCommas(data.price)}원</h2>
            </div>
          </div>
          <div className={style.AmountBox}>
            <div>
              <h2>수량</h2>
            </div>
            <div>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">수량</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={quantity}
                    label="quantity"
                    onChange={handleChange}
                  >
                    <MenuItem value={1}>1개</MenuItem>
                    <MenuItem value={2}>2개</MenuItem>
                    <MenuItem value={3}>3개</MenuItem>
                    <MenuItem value={4}>4개</MenuItem>
                    <MenuItem value={5}>5개</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <div className={style.AmountBox}>
            <div>
              <h2>총 합계금액</h2>
            </div>
            <div>
              {quantity ? <h2>{formatPriceWithCommas(data.price * quantity)}원</h2>:
                <h2>{formatPriceWithCommas(data.price * quantity)}</h2>
              }
            </div>
          </div>
          {localStorage.getItem("token") ? (
            <button id={style.CreateButton} onClick={handleOpenModal}>
              구매하기
            </button>
          ) : (
            <Link to="/login">
              <button id={style.CreateButton}>
                로그인 이후 구매 가능합니다
              </button>
            </Link>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <button className={style.closeButton} onClick={handleCloseModal}>
              <CloseIcon />
            </button>
            <div className={style.modalBody}>
              <h3>구매해 주셔서 감사합니다!!</h3>

              <div className={style.modaltext}>제품명 : {data.title}</div>
              <div className={style.modaltext}>수량 : {quantity}</div>
              <div className={style.modaltext}>
                총 금액 : {data.price * quantity}원
              </div>
              <div id={style.stoerButton}>
                <Link to="/mypage">
                  <button className={style.fundingButton}>
                    구매 내역 보러가기
                  </button>
                </Link>
                <Link to="/store">
                  <button className={style.fundingButton}>
                    다른 상품 보러가기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id={style.info}>
        <h1 id={style.infoTitle}>제품 상세 설명</h1>
        <img
          src={data.contentImage}
          alt="img"
          style={{
            maxWidth: "70vw",
          }}
        />
      </div>
    </div>
  );
};

export default StoreDetail;
