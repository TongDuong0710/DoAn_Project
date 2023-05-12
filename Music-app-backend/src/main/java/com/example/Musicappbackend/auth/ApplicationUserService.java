package com.example.Musicappbackend.auth;

import com.example.Musicappbackend.Entity.User;
import com.example.Musicappbackend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ApplicationUserService implements UserDetailsService{
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> userOpt = userRepository.findById(username);
		
		if (userOpt.isEmpty()) {
			System.out.println("Username not found! " + username);
			throw new UsernameNotFoundException("username: " + username + " was not found in the database");
		}
		
		ApplicationUser applicationUser = new ApplicationUser(userOpt.get());
		
		return applicationUser;
	}

}
