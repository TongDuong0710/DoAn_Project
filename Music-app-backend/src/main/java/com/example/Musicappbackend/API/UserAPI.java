package com.example.Musicappbackend.API;

import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserAPI {
    @Autowired
    UserService userService;
    @PostMapping(path = "/register")
    public UserDTO register(@RequestBody UserDTO user) {
        return userService.save(user);
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody UserDTO user) {

        return userService.login(user);
    }
    @GetMapping("/helloAdmin")
    public String helloWorld(@RequestBody UserDTO user)
    {
        return "Hello World Admin";
    }
    @GetMapping("/helloUser")
    public String helloUser(@RequestBody UserDTO user)
    {
        return "Hello World User";
    }
}
