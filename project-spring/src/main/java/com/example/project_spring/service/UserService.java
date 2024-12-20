package com.example.project_spring.service;

import com.example.project_spring.dto.CategoryDTO;
import com.example.project_spring.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);

    UserDTO getUserById(Long userID);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long userID, UserDTO updatedUser);

    void deleteUser(Long userID);

    public UserDTO authenticateUser(String email, String password);
}