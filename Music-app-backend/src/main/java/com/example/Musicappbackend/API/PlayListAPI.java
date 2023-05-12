package com.example.Musicappbackend.API;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.Text;
import com.example.Musicappbackend.Service.PlayListService;
import com.example.Musicappbackend.Service.SongService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PlayListAPI {
    @Autowired
    PlayListService playListService;

    @PostMapping("/findSongsByPlayListId/{id}")
    public List<SongDTO> findSongsByPlayListId(@PathVariable Integer id) {
        return playListService.findSongsByPlayListId(id);
    }
}

