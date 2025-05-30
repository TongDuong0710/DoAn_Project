package com.example.Musicappbackend.jwt;

import com.google.common.base.Strings;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
public class JwtVerifier extends OncePerRequestFilter{

	private final SecretKey secretKey;
	private final JwtConfig jwtConfig;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request,
									HttpServletResponse response,
									FilterChain filterChain) throws ServletException, IOException {
		String authorizationHeader = request.getHeader(jwtConfig.getAuthorizationHeader());
		if(Strings.isNullOrEmpty(authorizationHeader) || !authorizationHeader.startsWith(jwtConfig.getTokenPrefix())) {
			filterChain.doFilter(request, response);
			return;
		}
		String token = authorizationHeader.replace(jwtConfig.getTokenPrefix(), "");
		try {
			
			Jws<Claims> claimsJws = Jwts.parser()
					.setSigningKey(secretKey)
					.parseClaimsJws(token);
			
			Claims bodyClaims = claimsJws.getBody();
			
			String email = bodyClaims.getSubject();
			
			var authorities = (List<Map<String, String>>)bodyClaims.get("authorities");
			
			Set<SimpleGrantedAuthority> simpleGrantedAuthorities = authorities.stream()
					.map(m -> new SimpleGrantedAuthority(m.get("authority")))
					.collect(Collectors.toSet());
			
			Authentication authentication = new UsernamePasswordAuthenticationToken(
					email, 
					null, 
					simpleGrantedAuthorities);
			
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
		} catch (JwtException e) {
			throw new IllegalStateException(String.format("Token %s cannot be trusted", token));
		}
		
		filterChain.doFilter(request, response);
	}

}
