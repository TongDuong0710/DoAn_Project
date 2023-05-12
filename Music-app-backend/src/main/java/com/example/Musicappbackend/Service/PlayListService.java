package com.example.Musicappbackend.Service;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.Song;

import java.util.List;

public interface PlayListService {
    public List<SongDTO> findSongsByPlayListId(int id);
}
