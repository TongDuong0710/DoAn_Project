package com.example.Musicappbackend.Service.Impl;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.Song;
import com.example.Musicappbackend.Entity.SongPlaylist;
import com.example.Musicappbackend.Entity.User;
import com.example.Musicappbackend.Service.PlayListService;
import com.example.Musicappbackend.Service.SongService;
import com.example.Musicappbackend.repository.PlayListRepository;
import com.example.Musicappbackend.repository.SongRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayListServiceImpl implements PlayListService {
    @Autowired
    PlayListRepository playListRepository;
    @Autowired
    ModelMapper modelMapper;

    public List<SongDTO> findSongsByPlayListId(int id) {
        var playListById = playListRepository.findById(id).stream().collect(Collectors.toList());
        if (!CollectionUtils.isEmpty(playListById)) {
            return playListById.get(0).getSongList().stream().map(SongPlaylist::getSong).map(this::toDTO).collect(Collectors.toList());
        }
        return List.of();
    }
    public SongDTO toDTO(Song song) {
        return modelMapper.map(song, SongDTO.class);
    }


}
