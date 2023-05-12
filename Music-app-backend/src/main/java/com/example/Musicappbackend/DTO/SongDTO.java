package com.example.Musicappbackend.DTO;

import com.example.Musicappbackend.Entity.User;
import lombok.Data;

@Data
public class SongDTO {
    private String id;
    private String path;
    private String name;
    private String author;
    private String artistsName;
    private String lyrics;
    private String bigThumbnail;
    private String thumbnail;
    private Integer duration;
    private String tag;
    private Integer viewCount;
}
