package com.example.Musicappbackend.auth;

import com.example.Musicappbackend.DTO.ERole;
import com.example.Musicappbackend.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ApplicationUser implements UserDetails{
	private static final long serialVersionUID = 1L;
	
	private User user;

	public ApplicationUser(User user) {
		super();
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();
		GrantedAuthority authority;
		if(user.getRole().trim().equals(ERole.ADMIN.getValue())) {
			authority = new SimpleGrantedAuthority("ROLE_" + ERole.ADMIN.name());
		}else {
			authority = new SimpleGrantedAuthority("ROLE_" + ERole.USER.name());			
		}
		grantList.add(authority);
		return grantList;
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}
