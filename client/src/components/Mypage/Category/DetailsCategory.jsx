import { getDetailDatas } from "../../../api/getDatas";
import * as S from "./DetailsCategory.styled";
import { useNavigate } from "react-router-dom";
import { detailsInfo } from "../../../constants/detailsInfo";

const DetailsCategory = ({
  userData,
  currentCategory,
  getUserDetails,
  setCurrentPage,
}) => {
  const navigate = useNavigate();

  const detailData = Object.keys(detailsInfo).map((key) => detailsInfo[key]);
  const handleCategoryClick = (data) => {
    setCurrentPage(1);
    getDetailDatas(userData.memberId, data.category).then((res) => {
      getUserDetails(data.category, res.data.data);
    });

    navigate(`/mypage/${data.category}`);
  };

  return (
    <S.CategoryContainer>
      <hr />
      {userData.memberRole === "MEMBER_USER" ? (
        <ul>
          {detailData.slice(0, 2).map((data, index) => (
            <S.CategoryList
              key={index}
              className={
                currentCategory === data.category
                  ? "selected"
                  : "underline-effect"
              }
              onClick={() => handleCategoryClick(data)}
            >
              {data.title}
            </S.CategoryList>
          ))}
        </ul>
      ) : (
        <ul>
          {detailData.map((data, index) => (
            <S.CategoryList
              key={index}
              className={
                currentCategory === data.category
                  ? "selected"
                  : "underline-effect"
              }
              onClick={() => {
                handleCategoryClick(data);
              }}
            >
              {data.title}
            </S.CategoryList>
          ))}
        </ul>
      )}
    </S.CategoryContainer>
  );
};

export default DetailsCategory;
