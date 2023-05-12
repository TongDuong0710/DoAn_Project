package com.example.Musicappbackend.Service;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.Song;

import java.util.List;

public interface SongService {
    List<SongDTO> findAll();
    SongDTO findOneByID(int id);
    List<SongDTO> findAllBySongName(String songName);
    SongDTO save(Song song);
    SongDTO createSong(SongDTO songDTO);
    List<SongDTO> findAllByAuthor(UserDTO user);
     List<SongDTO> handleSentiments(String tag) ;
}
