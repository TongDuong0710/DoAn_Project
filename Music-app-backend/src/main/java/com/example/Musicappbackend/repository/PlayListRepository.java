package com.example.Musicappbackend.repository;

import com.example.Musicappbackend.Entity.Playlist;
import com.example.Musicappbackend.Entity.Song;
import com.example.Musicappbackend.Entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayListRepository extends JpaRepository<Playlist,Integer> {


}
