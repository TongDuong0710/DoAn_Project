package com.example.Musicappbackend.Service.Impl;

import com.example.Musicappbackend.DTO.UserDTO;
import com.example.Musicappbackend.Entity.User;
import com.example.Musicappbackend.Service.UserService;
import com.example.Musicappbackend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Override
    public UserDTO getUserByUsername(UserDTO user) {
        return (UserDTO) userRepository.findById(user.getUsername()).stream().map(this::toDTO);
    }

    @Override
    public UserDTO save(UserDTO user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return toDTO(userRepository.save(toEntity(user)));
    }
    @Override
    public UserDTO login(UserDTO user) {
        return getUserByUsername(user);
    }
    private UserDTO toDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
    private User toEntity(UserDTO user) {
        return modelMapper.map(user, User.class);
    }
}
