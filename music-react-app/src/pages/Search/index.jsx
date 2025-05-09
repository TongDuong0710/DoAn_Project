import { useContext, useState } from "react";
import { LayoutContext } from "../../components/Layout";
import SongItem from "../../components/SongItem";
import "./Search.scss";

const Search = () => {
  const { searchResult, suggestList, searchKeyword, recommendList } =
    useContext(LayoutContext);

  if (suggestList.length == 0) {
    return (
      <div className="search home">
        <h3 className="search-title">Gợi ý bài hát theo cảm xúc theo phương pháp học sâu</h3>
        {recommendList.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}


        <h2 className="h2-heading">
          Không có kết quả được tìm kiếm "{searchKeyword}"
        </h2>
        {
          console.log(recommendList)
        }
        
      </div>
    );
  }

  return (
    <div className="search home">
      <h3 className="search-title">Gợi ý bài hát theo cảm xúc theo phương pháp học sâu </h3>
        {recommendList.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}

      <h2 className="h2-heading">Kết quả tìm kiếm "{searchKeyword}"</h2>
      <h3 className="search-title">Top kết quả</h3>
      <SongItem key={searchResult.id} song={searchResult} />

      <h3 className="search-title">Tất cả kết quả</h3>
      {suggestList.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
      
    </div>
  );
};

export default Search;
