package com.example.Musicappbackend.security;

import com.example.Musicappbackend.DTO.ERole;
import com.example.Musicappbackend.jwt.JwtConfig;
import com.example.Musicappbackend.jwt.JwtFilter;
import com.example.Musicappbackend.jwt.JwtVerifier;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.List;

@EnableWebSecurity
@Configuration
@AllArgsConstructor
public class SecurityConfig {
	private final SecretKey secretKey;
	private final JwtConfig jwtConfig;
	private static final String[] AUTH_WHITELIST = {
	        "/swagger-resources/**",
	        "/swagger-ui.html",
	        "/swagger-ui/**",
	        "/v2/api-docs",
	        "/webjars/**"
	};
	
	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
	
	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		AuthenticationConfiguration configuration = http.getSharedObject(AuthenticationConfiguration.class);
		http
			.cors().configurationSource(corsConfigurationSource()).and()
			.csrf().disable()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
			.addFilter(new JwtFilter(authenticationManager(configuration), jwtConfig, secretKey))
			.addFilterAfter(new JwtVerifier(secretKey, jwtConfig), JwtFilter.class)
			.authorizeRequests()
				.antMatchers(HttpMethod.POST,"/register").permitAll()
				.antMatchers(HttpMethod.GET,"/findAllSong").permitAll()
				.antMatchers(HttpMethod.POST,"/handleSentiment").permitAll()
				.antMatchers(HttpMethod.POST,"/findSongsByPlayListId/**").permitAll()
				.antMatchers(HttpMethod.POST, "/login").permitAll()
				.antMatchers(HttpMethod.POST, "/uploadSong").permitAll()
				.antMatchers(HttpMethod.POST, "/createSong").permitAll()
				.antMatchers( "/helloAdmin").hasRole(ERole.ADMIN.name())
				.antMatchers( "/helloUser").hasRole(ERole.USER.name())
			.anyRequest()
				.authenticated();
		
		return http.build();
	}
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("GET","POST"));
		//the below three lines will add the relevant CORS response headers
		configuration.addAllowedOrigin("*");
		configuration.addAllowedHeader("*");
		configuration.addAllowedMethod("*");
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}
