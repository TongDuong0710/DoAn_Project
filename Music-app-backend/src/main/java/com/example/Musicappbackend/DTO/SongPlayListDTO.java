package com.example.Musicappbackend.DTO;

import lombok.Data;

@Data
public class SongPlayListDTO {
    private int songID;
    private int playListID;
    private int position;
}
