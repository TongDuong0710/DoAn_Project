package com.example.Musicappbackend.API;

import com.example.Musicappbackend.DTO.SongDTO;
import com.example.Musicappbackend.DTO.Text;
import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.Song;
import com.example.Musicappbackend.Service.SongService;
import org.jsoup.internal.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@RestController
public class SongAPI {
    @Autowired
    SongService songService;
    static HttpURLConnection con;

    @GetMapping("/findAllSong")
    public List<SongDTO> findAllSong() {
        return songService.findAll();
    }
    @PostMapping("/findById/{id}")
    public SongDTO findById(@PathVariable int id) {
        return songService.findOneByID(id);
    }
    @PostMapping("/findByName/{name}")
    public List<SongDTO> findByName(@PathVariable String name) {
        return songService.findAllBySongName(name);
    }
    @PostMapping("/createSong")
    public SongDTO createSong( @RequestBody SongDTO song) {
        return songService.createSong(song);
    }
    @PostMapping(value = "/uploadSong", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadFile(@RequestParam MultipartFile fileMusic,
                                     @RequestParam MultipartFile fileThumbnail,
                                     @RequestParam MultipartFile fileBigThumbnail,
                                     @RequestParam String name,
                                     @RequestParam String artistName,
                                     @RequestParam String author)  {

        String fileMusicPath = null;
        try {
            fileMusicPath = write(fileMusic, "mp3");

            String fileThumbnailPath = write(fileThumbnail, "jpg");
            String fileBigThumbnailPath = write(fileBigThumbnail, "jpg");
            var song = new SongDTO();
            song.setName(name);
            song.setArtistsName(artistName);
            song.setBigThumbnail(fileBigThumbnailPath);
            song.setThumbnail(fileThumbnailPath);
            song.setPath(fileMusicPath);

            song.setAuthor(StringUtils.hasText(author)?author:"tongdeptrai");
            song.setLyrics(" ");
            song.setDuration(400);

            songService.createSong(song);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok().build();
    }
    public String write(MultipartFile file, String fileType) throws IOException {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss-"));
        String fileName = date + file.getOriginalFilename();

        String folderPath = "D:\\HocReact\\music-react-app\\public\\mp3\\";
        String filePath = folderPath + fileName;

        Files.copy(file.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
        return "/mp3/"+fileName;

    }
    @PostMapping("/handleSentiment")
    public List<SongDTO> handleSentiment(@RequestBody Text text) {
        if (!"".equals(text.getText())) {
            var responseText = requestHandleSentiment(text);
            if (!"".equals(responseText)) {
                var tag = responseText.replace("\"","");
//                if (responseText.equals("yêu đời")) {
//                    tag = "yêu đời";
//                } else if (responseText.equals("thất tình")  {
//                    tag = "thất tình";
//                }
                var sentimentList = songService.handleSentiments(tag);
                Collections.shuffle(sentimentList);
                return sentimentList;
            }
        }
        return new ArrayList<>();
    }
    public String requestHandleSentiment(Text text)
    {
        String tag = "";
        String str= "http://localhost:8088/handleSentiment";
        try {
            URL url = new URL(str);
            con= (HttpURLConnection)url.openConnection();
            con.setRequestMethod("POST");
            con.setConnectTimeout(5000);
            con.setReadTimeout(5000);
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);
            con.setDoInput(true);

            ObjectWriter  ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            String jsonInputString = ow.writeValueAsString(text);
//            DataOutputStream dos = new DataOutputStream(con.getOutputStream());
//            dos.writeBytes(jsonInputString);

            OutputStream os = con.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
            writer.write(jsonInputString);
            writer.flush();
            writer.close();
            os.close();
            con.connect();



            System.out.println(jsonInputString);
            int responseCode = con.getResponseCode();
            System.out.println("POST Response Code :: " + responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                System.out.println(response.toString());
                if(response.toString().trim().equals("")==false)
                {
                    ObjectMapper mapper = new ObjectMapper();
                    tag= response.toString();
                }
            } else {
                System.out.println("POST request not worked");
            }
            System.out.println(jsonInputString);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return tag ;
    }
}
