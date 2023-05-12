package com.example.Musicappbackend.DTO;

import lombok.Data;

@Data
public class StatisticsDTO {
    private String id;
    private String date;
    private String viewCount;
    private SongDTO song;
}
