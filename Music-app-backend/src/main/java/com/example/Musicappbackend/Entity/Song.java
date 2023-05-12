package com.example.Musicappbackend.Entity;

import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name="`Song`")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String path;
    private String name;
    private String artistsName;
    private String lyrics;
    private String bigThumbnail;
    private String thumbnail;
    private Integer  duration;
    private String tag;
    private Integer viewCount;
    private String author;
}
