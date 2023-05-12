package com.example.Musicappbackend.Entity;

import javax.persistence.Embeddable;
import java.io.Serializable;
@Embeddable
public class SongPlaylistKey implements Serializable {
    private int songID;
    private int playListID;
}
