package com.example.Musicappbackend.DTO;

import lombok.Data;

import java.util.List;
@Data
public class PlaylistDTO {
    private String id;
    private String name;
    private String createTime;
    private String privacy;
    private String image;
    private String authorID;
    private List<String> songListID;
}
