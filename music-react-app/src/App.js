import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from './components/login/register';
import Login from './components/login/login';
import {
  Home,
  MyMusic,
  Zingchart,
  Radio,
  Follow,
  NewMusic,
  TopMusic,
  Category,
  Mv,
  SongPlaying,
  Song,
  PodCast,
  Album,
  MyMusicMv,
  Search,
  MVVietNam,
  MVUSUk,
  MVHoaTau,
  MVKpop,
} from "./pages/Allpages";
import store from "./store/index";
import { Provider } from "react-redux";
import { worker } from "./mocks/browser";
import SideNav from "./components/SideNav";

function App() {
  return (
    <div className="App">
      <Provider store={store}> 
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
           <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
           <Route path="mymusic" element={<MyMusic />}>
              <Route index element={<Song />} />

              <Route path="song" element={<Song />} />
              <Route index path="podcast" element={<PodCast />} />
              <Route index path="album" element={<Album />} />
              <Route index path="mymusicmv" element={<MyMusicMv />} />
            </Route>
            <Route path="/radio" element={<Radio />} />
            <Route path="/zingchart" element={<Zingchart />} />
            <Route path="/follow" element={<Follow />} />
            <Route path="/newmusic" element={<NewMusic />} />
            <Route path="/topmusic" element={<TopMusic />} />
            <Route path="/category" element={<Category />} />
            <Route path="/mv" element={<Mv />}>
              <Route index path="/mv/vn" element={<MVVietNam />} />
              <Route path="/mv/usuk" element={<MVUSUk />} />
              <Route path="/mv/hoatau" element={<MVHoaTau />} />
              <Route path="/mv/kpop" element={<MVKpop />} />
            </Route>
            <Route path="/search" element={<Search />} />
            <Route path="/songplaying" element={<SongPlaying />} />
          </Route> 
        </Routes>
      </BrowserRouter>
        </Provider> 
    </div>
  );
}

export default App;
