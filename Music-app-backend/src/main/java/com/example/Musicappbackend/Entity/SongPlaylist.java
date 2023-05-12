package com.example.Musicappbackend.Entity;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

@Entity
@Table(name = "Song_PlayList")
public class SongPlaylist {
    @EmbeddedId
    private SongPlaylistKey id;
    @ManyToOne
    @MapsId("songID")
    @JoinColumn(name = "songID")
    private Song song;
    @ManyToOne
    @MapsId("playListID")
    @JoinColumn(name = "playListID")
    private Playlist playlist;
    private int position;

    public SongPlaylistKey getId() {
        return id;
    }

    public void setId(SongPlaylistKey id) {
        this.id = id;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
