package org.example.Security;

import lombok.AllArgsConstructor;
import org.example.Models.AppUser;
import org.example.Models.User;
import org.example.Services.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AppUserService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userService.findByUserName(username);
        return user.map(value -> new AppUser(value.getId(), value.getUsername(), value.getPassword(), List.of(value.getRole())))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}
