package com.example.Musicappbackend.repository;

import com.example.Musicappbackend.Entity.Song;
import com.example.Musicappbackend.Entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song,Integer> {
     List<Song> findByName(String name);
     List<Song> findAllByAuthor(User author);
     @Query( value = "SELECT a FROM Song a WHERE a.tag=:tag ORDER BY a.viewCount DESC")
     List<Song> handleSentiment(@Param("tag") String tag, Pageable pageable);

}
