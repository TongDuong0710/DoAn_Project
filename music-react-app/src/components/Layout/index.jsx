import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Header";
import PlayerControl from "../PlayerControl";
import SideNav from "../SideNav";
import SidePlayList from "../SidePlayList";
import Theme from "../Theme";
import "./Layout.css";
import axios from "axios";
import Login from "../login/login";
import { useLocation } from "react-router-dom";
export const LayoutContext = createContext();

const Layout = () => {
  const [songs, setSongs] = useState([]);
  const [user, setUser] = useState(null);
  const [showPlaylist, setShowPlayList] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShowThemeList, setIsShowThemeList] = useState(false);
  const [themeId, setThemeId] = useState(1);
  const [searchResult, setSearchResult] = useState({});
  const [suggestList, setSuggestList] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [songsPlayList,setSongsPlayList] = useState([]);
  document.title = "Zing Mp3 | Nghe nhạc chất";
 
  const {state} = useLocation();
  let username = null;
  if(state)
  {
    username = state;
  }
 

  useEffect(() => {
   if(username)
   {
    setUser(username);
   }
  
    
    let config = {
      method: 'get',
      url: 'http://localhost:8082/findAllSong',
      headers: { 
        'Content-Type': 'application/json'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data);
      setSongs(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    // fetch("/songs")
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log(res);
    //     setSongs(res);
    //   })
    //   .catch((error) => console.log(error));

  }, []);

  const nextSong = () => {
    //let currentIndex = songs.findIndex((song) => song.id == currentSong.id);
    if (currentIndex == songs.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const prevSong = () => {
     //let currentIndex = songs.findIndex((song) => song.id == currentSong.id);
    if (currentIndex == 0) {
      setCurrentIndex(songs.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const randomSong = () => {
  // let currentIndex = songs.findIndex((song) => song.id == currentSong.id);
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex == currentIndex);
    setCurrentIndex(randomIndex);
  };

  useEffect(() => {
    let currentItems = document.querySelectorAll(".song-item.active");

    currentItems.forEach((currentItem) => {
      currentItem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [currentIndex]);

  if (songs.length == 0) {
    return (
      <div style={{ textAlign: "center", fontSize: "48px" }}>Loading...</div>
    );
  }

  return (
    <LayoutContext.Provider
      value={{
        currentIndex,
        setCurrentIndex,
        nextSong,
        prevSong,
        randomSong,
        songs,
        setSongs,
        themeId,
        setThemeId,
        searchResult,
        setSearchResult,
        suggestList,
        setSuggestList,
        recommendList,
        setRecommendList,
        searchKeyword,
        setSearchKeyword,
        songsPlayList,
        setSongsPlayList,
        user,
        setUser
      }}
    >
       <div
        className={`wrapper ${
          themeId == 1 ? "" : themeId == 2 ? "zingAwards" : "jack"
        }`}
      >
         <SideNav />
          <Header setIsShowThemeList ={setIsShowThemeList } />
         
        <Theme
          isShowThemeList={isShowThemeList}
          setIsShowThemeList ={setIsShowThemeList }
        /> 
        
        <SidePlayList
          songs={songs}
          showPlaylist={showPlaylist}
          setShowPlayList={setShowPlayList}
          songsPlayList ={songsPlayList}
        />
        
        <div className="outlet">
          <Outlet />
        </div>
        
        <PlayerControl
          setShowPlayList={setShowPlayList}
          showPlaylist={showPlaylist}
          songs={songs}
        />
         
        <ToastContainer
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          autoClose={1000}
          position="bottom-right"
          toastClassName="toastClassName"
          bodyClassName="grow-font-size"
          progressClassName="fancy-progress-bar"
        />
       </div>
     </LayoutContext.Provider>
  );
};

export default Layout;
