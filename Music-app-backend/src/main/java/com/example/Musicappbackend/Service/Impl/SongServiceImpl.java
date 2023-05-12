package com.example.Musicappbackend.Service.Impl;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.Song;
import com.example.Musicappbackend.Entity.User;
import com.example.Musicappbackend.Service.SongService;
import com.example.Musicappbackend.repository.SongRepository;
import com.example.Musicappbackend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongServiceImpl implements SongService {
    @Autowired
    SongRepository songRepository;
    @Autowired
    ModelMapper modelMapper;

    public List<SongDTO> findAll() {
        return songRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public SongDTO createSong(SongDTO songDTO)
    {
        var entity = toEntity(songDTO);
        return toDTO(songRepository.save(toEntity(songDTO)));
    }

    public SongDTO findOneByID(int id) {
        return toDTO(songRepository.findById(id).orElseThrow(() -> new IllegalStateException("Not Found Song by ID")));
    }

    public List<SongDTO> findAllBySongName(String songName) {
        return songRepository.findByName(songName).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SongDTO save(Song song) {
        return toDTO(songRepository.save(song));
    }

    public List<SongDTO> findAllByAuthor(UserDTO user) {
        return songRepository.findAllByAuthor(modelMapper.map(user, User.class)).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SongDTO toDTO(Song song) {
        return modelMapper.map(song, SongDTO.class);
    }
    public Song toEntity(SongDTO songDTO) {return modelMapper.map(songDTO, Song.class);}
    public List<SongDTO> handleSentiments(String tag) {
        return songRepository.handleSentiment(tag, PageRequest.of(0,10)).stream().map(this::toDTO).collect(Collectors.toList());

    }
}
