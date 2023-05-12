package com.example.Musicappbackend.Service;

import com.example.Musicappbackend.DTO.UserDTO;

public interface UserService {
    UserDTO getUserByUsername(UserDTO user);
    UserDTO save(UserDTO user);
    UserDTO login(UserDTO user);
}
