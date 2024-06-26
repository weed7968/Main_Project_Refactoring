import React, { useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMemberId } from "../../hooks/useGetMemberId";
import { axiosInstance } from "../../api/axiosInstance";
import SideBar from "../../components/SubPage/SideBar";
import SortButton from "../../components/SubPage/SortButton";
import List from "../../components/SubPage/Funding/List";
import { getUserData } from "../../api/getDatas";

const FundingPage = () => {
  const { getMemberId } = useGetMemberId();
  const userData = useSelector((state) => state.userData);

  const [sort, setSort] = useState("descending");
  const [kategorie, setKategorie] = useState(0);
  const [fundingList, setFundingList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoding, setIsLoding] = useState(false);
  const [role, setrole] = useState("");

  const searchParam = useSelector((state) => state.search.searchWord);

  useEffect(() => {
    if (searchParam) {
      axiosInstance({
        url: `/upcyclings/search?page=1&size=8&searchKeyword=${searchParam}`,
        method: "get",
      })
        .then((response) => {
          setFundingList(response.data.data);
          setIsLoding(true);
        })
        .catch((error) => {
          console.error("요청에 실패했습니다:", error);
        });
    } else {
      axiosInstance({
        url: "/upcyclings/descending?page=1&size=16",
        method: "get",
      })
        .then((response) => {
          setIsLoding(true);
        })
        .catch((error) => {
          console.error("요청에 실패했습니다:", error);
        });
    }

    getMemberId();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("login") && userData.memberId)
      getUserData(userData.memberId).then((res) => {
        setrole(res.data.data.memberRole);
      });
  }, [userData.memberId]);

  useEffect(() => {
    setIsLoding(false);
    setPage(1);
    if (searchParam) {
      if (kategorie === 0) {
        axiosInstance({
          url: `/upcyclings/search?page=1&size=8&sort=${sort}&searchKeyword=${searchParam}`,
          method: "get",
        })
          .then((response) => {
            setFundingList(response.data.data);
            setIsLoding(true);
          })
          .catch((error) => {
            console.error("요청에 실패했습니다:", error);
          });
      } else {
        axiosInstance({
          url: `/upcyclings/search?page=1&size=8&sort=${sort}&categoryId=${kategorie}&searchKeyword=${searchParam}`,
          method: "get",
        })
          .then((response) => {
            setFundingList(response.data.data);
            setIsLoding(true);
          })
          .catch((error) => {
            console.error("요청에 실패했습니다:", error);
          });
      }
    } else {
      if (kategorie === 0) {
        axiosInstance({
          url: `/upcyclings/${sort}?page=1&size=16`,
          method: "get",
        })
          .then((response) => {
            setFundingList(response.data.data);
            setIsLoding(true);
          })
          .catch((error) => {
            console.error("요청에 실패했습니다:", error);
          });
      } else {
        axiosInstance({
          url: `/upcyclings/${sort}/categories/${kategorie}?page=1&size=16`,
          method: "get",
        })
          .then((response) => {
            setFundingList(response.data.data);
            setIsLoding(true);
          })
          .catch((error) => {
            console.error("요청에 실패했습니다:", error);
          });
      }
    }
  }, [sort, kategorie, searchParam]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      if (searchParam) {
        if (kategorie === 0) {
          axiosInstance({
            url: `/upcyclings/search?page=${page}&size=16&sort=${sort}&searchKeyword=${searchParam}`,
            method: "get",
          })
            .then((response) => {
              setFundingList((prev) => [...prev, ...response.data.data]);
            })
            .catch((error) => {
              console.error("요청에 실패했습니다:", error);
            });
        } else {
          axiosInstance({
            url: `/upcyclings/search?page=${page}&size=16&sort=${sort}&categoryId=${kategorie}&searchKeyword=${searchParam}`,
            method: "get",
          })
            .then((response) => {
              setFundingList((prev) => [...prev, ...response.data.data]);
            })
            .catch((error) => {
              console.error("요청에 실패했습니다:", error);
            });
        }
      } else {
        if (kategorie === 0) {
          axiosInstance({
            url: `/upcyclings/${sort}?page=${page}&size=16`,
            method: "get",
          })
            .then((response) => {
              setFundingList((prev) => [...prev, ...response.data.data]);
            })
            .catch((error) => {
              console.error("요청에 실패했습니다:", error);
            });
        } else {
          axiosInstance({
            url: `/upcyclings/${sort}/categories/${kategorie}?page=${page}&size=8`,
            method: "get",
          })
            .then((response) => {
              setFundingList((prev) => [...prev, ...response.data.data]);
            })
            .catch((error) => {
              console.error("요청에 실패했습니다:", error);
            });
        }
      }
    }
  }, [page]);

  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return (
    <Container>
      <SideBar
        kategorie={kategorie}
        setKategorie={setKategorie}
        menu={["All", "천", "목재", "플라스틱", "철제", "유리", "기타"]}
      />
      <ContainerBottom>
        <h1>Funding</h1>

        <SortButton
          sort={sort}
          setSort={setSort}
          role={role}
          param="/funding"
          // link="/fundingcreate"
        />
        <Funding>{isLoding ? fundingList.map((obj, index) => <List key={index} {...obj} />) : null}</Funding>
      </ContainerBottom>
    </Container>
  );
};

export default FundingPage;

const Container = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 2rem; */
  display: grid;
  grid-template-columns: 15% 85%;
  max-width: 1000px;
  margin: auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr 3fr;
  }
`;

const ContainerBottom = styled.div`
  border-left: 1px solid var(--color-gray-30);
  padding-left: 3rem;
  height: 100%;
  margin-bottom: calc(90vh - 400px);
  & > h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-main);
    margin: 1rem 0;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Funding = styled.div`
  /* float: right; */
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
