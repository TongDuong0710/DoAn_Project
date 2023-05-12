package com.example.Musicappbackend.Entity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.Date;
import java.util.List;

@Entity
public class Playlist {
    @Id
    private int id;
    private String name;
    private Date createTime;
    private String privacy;
    private String image;
    @ManyToOne
    @JoinColumn(name="author")
    private User author;

    @OneToMany(mappedBy ="playlist",fetch = FetchType.EAGER)
    private List<SongPlaylist> songList;

    public List<SongPlaylist> getSongList() {
        return songList;
    }

    public void setSongList(List<SongPlaylist> songList) {
        this.songList = songList;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getPrivacy() {
        return privacy;
    }

    public void setPrivacy(String privacy) {
        this.privacy = privacy;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }
}
