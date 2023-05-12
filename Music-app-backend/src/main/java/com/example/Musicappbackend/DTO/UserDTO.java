package com.example.Musicappbackend.DTO;

import lombok.Data;

@Data
public class UserDTO {

    private String username;
    private String password;
    private String name;
    private String email;
    private String birthday;
    private String address;
    private String phone;
    private String role;
}
