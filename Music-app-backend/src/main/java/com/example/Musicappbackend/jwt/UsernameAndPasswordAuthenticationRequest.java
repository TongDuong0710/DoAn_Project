package com.example.Musicappbackend.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UsernameAndPasswordAuthenticationRequest {
	private String username;
	private String password;
}
