import { useContext, useEffect, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { GiTShirt } from "react-icons/gi";
import { FiUpload, FiSettings } from "react-icons/fi";
import { MdOutlineTrendingUp, MdOutlineClear } from "react-icons/md";
import { LayoutContext } from "../Layout";
import axios from "axios";
import AddMusic from "../AddMusic/AddMusic";
import Popup from "../AddMusic/Popup";
import { FiLogOut } from "react-icons/fi";

const cx = classNames.bind(styles);

const Header = ({ setIsShowThemeList }) => {
  const [openPopup, setOpenPopup] = useState(false)
  const [isShowSuggest, setIsShowSuggest] = useState(false);
  const {
    songs,
    searchResult,
    setSearchResult,
    suggestList,
    setSuggestList,
    recommendList,
    setRecommendList,
    setSearchKeyword,
    user,
    setUser
  } = useContext(LayoutContext);
  const [flag,setFlag] = useState(0);
  const handleSentiment = (data) => {
    let dataSent = JSON.stringify({
      "text": data,
    });
    let config = {
      method: 'post',
      url: 'http://localhost:8082/handleSentiment',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : dataSent
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      setRecommendList(response.data);
      setFlag(flag+1);
      console.log("Flag: " + flag);
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  const [searchList, setSearchList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();
  const suggestRef = useRef();

  const headerRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      const yPosition = window.scrollY;
      if (yPosition > 80) {
        headerRef.current.style.backgroundColor = "var(--header)";
        headerRef.current.style.boxShadow = "0 0px 4px 0 rgba(0, 0, 0, 0.35)";
      } else {
        headerRef.current.style.backgroundColor = "transparent";
        headerRef.current.style.boxShadow = "unset";
      }
    });
  }, []);

  useEffect(() => {
    if (inputValue == "") {
      setSearchList([]);
    } else {
      let newList = songs.filter((song) =>
        song.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      if (newList.length > 4) {
        newList = newList.splice(0, 4);
      }
      setSearchList(newList);
    }
  }, [inputValue]);

  const handleChangeValue = (e) => {
    setIsShowSuggest(true);
    setInputValue(e.target.value);
  };

  const handleClickSearchSong = (song) => {
    setIsShowSuggest(false);
    setSearchResult(song);
    setSuggestList(searchList);
    setSearchKeyword(inputValue);
    const searchGroup = document.querySelector(`.${cx("header-search-group")}`);
    searchGroup.style.backgroundColor = "var(--background-white)";
    searchGroup.style.borderBottomLeftRadius = "20px";
    searchGroup.style.borderBottomRightRadius = "20px";
    navigate("/search");
  };

  const handleClickSuggest = (value) => {
    setInputValue(value);
    let newList = songs.filter((song) =>
      song.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResult(newList[0]);
    setIsShowSuggest(false);
    setSuggestList(newList);
    setSearchKeyword(value);
    const searchGroup = document.querySelector(`.${cx("header-search-group")}`);
    searchGroup.style.backgroundColor = "var(--background-white)";
    searchGroup.style.borderBottomLeftRadius = "20px";
    searchGroup.style.borderBottomRightRadius = "20px";
    navigate("/search");
  };

  const handleClearInput = () => {
    setInputValue("");
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (inputValue != "") {
      let newList = songs.filter((song) =>
        song.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      handleSentiment(inputValue);
      if (newList.length > 0) {
        setSearchResult(newList[0]);
        setSuggestList(newList);
      } else {
        setSuggestList([]);
      }
      setSearchKeyword(inputValue);
      setIsShowSuggest(false);
      navigate("/search");
    }
  };

  const handleClickInput = () => {
    setIsShowSuggest(true);
  };

  const handleIsOutsideClick = (e) => {
    if (
      inputRef.current.contains(e.target) ||
      suggestRef.current.contains(e.target)
    ) {
    } else {
      const searchGroup = document.querySelector(
        `.${cx("header-search-group")}`
      );
      searchGroup.style.backgroundColor = "var(--background-white)";
      searchGroup.style.borderBottomLeftRadius = "20px";
      searchGroup.style.borderBottomRightRadius = "20px";
      setIsShowSuggest(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleIsOutsideClick);
    return () => {
      document.removeEventListener("click", handleIsOutsideClick);
    };
  }, []);

  const handleFocusInput = () => {
    const searchGroup = document.querySelector(`.${cx("header-search-group")}`);
    searchGroup.style.backgroundColor = "var(--primary-background)";
    searchGroup.style.borderBottomLeftRadius = "0";
    searchGroup.style.borderBottomRightRadius = "0";
  };
  const handleOnClickTaiKhoan = () => {
    if(user != null)
    {
      navigate("/mymusic");
      console.log(user);
    }
    else {
      navigate("/login");
    }
  }

  return (
    <>
    <div ref={headerRef} className={cx("header")}>
      <div className={cx("header-left")}>
        <div className={cx("header-changePage")}>
          <button className={cx("header-backPage")}>
            <BsArrowLeft />
          </button>
          <button className={cx("header-nextPage")}>
            <BsArrowRight />
          </button>
        </div>
        <div className={cx("header-search-group")}>
          <div
            className={cx("header-suggest", `${isShowSuggest ? "show" : ""}`)}
            ref={suggestRef}
          >
            <h3 className={cx("header-suggest-title")}>Đề xuất cho bạn</h3>
            <ul className={cx("header-suggest-box")}>
              <li
                className={cx("header-suggest-item")}
                onClick={() => handleClickSuggest("anh")}
              >
                <span className="d-flex align-items-center">
                  <MdOutlineTrendingUp />
                </span>
                <span className={cx("header-suggest-text")}>anh</span>
              </li>
              <li
                className={cx("header-suggest-item")}
                onClick={() => handleClickSuggest("thương em")}
              >
                <span className="d-flex align-items-center">
                  <MdOutlineTrendingUp />
                </span>
                <span className={cx("header-suggest-text")}>thương em</span>
              </li>
              <li
                className={cx("header-suggest-item")}
                onClick={() => handleClickSuggest("yêu em")}
              >
                <span className="d-flex align-items-center">
                  <MdOutlineTrendingUp />
                </span>
                <span className={cx("header-suggest-text")}>yêu em</span>
              </li>
              <li
                className={cx("header-suggest-item")}
                onClick={() => handleClickSuggest("trọn vẹn")}
              >
                <span className="d-flex align-items-center">
                  <MdOutlineTrendingUp />
                </span>
                <span className={cx("header-suggest-text")}>trọn vẹn</span>
              </li>
            </ul>

            <div className={cx("suggestion")}>
              <ul
                className={cx(
                  "suggestion-list",
                  `${searchList.length > 0 ? "show" : ""}`
                )}
              >
                <h3 className={cx("header-suggest-title")}>Gợi ý kết quả</h3>
                {searchList.map((song) => (
                  <div
                    key={song.id}
                    className={cx("suggestion-item")}
                    onClick={() => handleClickSearchSong(song)}
                  >
                    <div className={cx("suggestion-item-image")}>
                      <img src={song.thumbnail} alt={song.name} />
                    </div>
                    <div className={cx("suggestion-item-info")}>
                      <div className={cx("suggestion-item-info-name")}>
                        {song.name}
                      </div>
                      <div className={cx("suggestion-item-info-singer")}>
                        {song.artists_names}
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
          <div className={cx("header-search-icon")}>
            <AiOutlineSearch />
          </div>
          <div className={cx("header-search-input")}>
            <form action="" onSubmit={handleSubmitSearch}>
              <input
                value={inputValue}
                onChange={handleChangeValue}
                type="text"
                placeholder="Tìm kiếm..."
                onClick={handleClickInput}
                ref={inputRef}
                onMouseUp={handleFocusInput}
                // onBlur={handleBlurInput}
              />
            </form>
          </div>
          <div
            className={cx(
              "header-search-clear",
              "d-flex",
              "align-items-center"
            )}
            style={{ display: `${inputValue == "" ? "none" : "block"}` }}
            onClick={handleClearInput}
          >
            <MdOutlineClear />
          </div>
        </div>
      </div>
      <div className={cx("header-right")}>
        <Tooltip title="Chủ đề">
          <div
            className={cx("header-icon", "header-theme")}
            onClick={() => setIsShowThemeList(true)}
          >
            <GiTShirt />
          </div>
        </Tooltip>
        <Tooltip title="Tải lên" onClick={() => {
            if(user)
            {
              setOpenPopup(true);
            }
            else{
              navigate('/login')
            }
              
            }}>
          <div className={cx("header-icon")}>
            <FiUpload />
          </div>
        </Tooltip>
        <Tooltip title="Đăng Xuất" onClick={()=>{setUser(null); navigate("/login")}}>
          <div className={cx("header-icon")}>
            <FiLogOut />
          </div>
        </Tooltip>

        <Tooltip title= {user ? user.username : "Tài Khoản"} onClick={handleOnClickTaiKhoan}>
          <div className={cx("header-login")}>
            <img src="https://avatar.talk.zdn.vn/default" alt="avartar" />
          </div>
        </Tooltip>
      </div>
    </div>
    <Popup
        title="TẢI BÀI HÁT"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddMusic />
      </Popup>
    
    </>

  );
};

export default Header;
