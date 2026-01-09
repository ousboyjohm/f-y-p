package org.example.Controllers;

import lombok.AllArgsConstructor;
import org.example.Models.AppUser;
import org.example.Models.Category;
import org.example.Models.User;
import org.example.Security.JwtConverter;
import org.example.Services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class UserController {

    public final AuthenticationManager authenticationManager;
    private final JwtConverter jwtConverter;
    private final UserService userService;


    @GetMapping("users/{id}")
    public Optional<User> findUserById(@PathVariable Integer id){
        return userService.findById(id);
    }

    @GetMapping("users")
    public List<User> findAllUsers(){
        return userService.findAll();
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if(authentication.isAuthenticated()) {
            AppUser appUser = (AppUser) authentication.getPrincipal();
            String role = appUser.getAuthorities().stream()
                    .map(authority -> authority.getAuthority())
                    .findFirst()
                    .orElse("none");
            return new ResponseEntity<>(
                    Map.of("jwt", jwtConverter.getTokenFromUser(appUser), "userId", String.valueOf(appUser.getId()),
                            "role", role),
                    HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> create(@RequestBody User user){
        return userService.addUser(user);
    }

    @PutMapping("users/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("users/{id}")
    public boolean deleteUser(@PathVariable Integer id){
        return userService.delete(id);
    }


}
