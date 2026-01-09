package org.example.Services;

import org.example.Models.User;
import org.example.Repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;


    public UserService(UserRepository userRepository, PasswordEncoder encoder){
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public Optional<User> findById(Integer id){
        return userRepository.findById(id);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public Optional<User> findByUserName(String userName) {
        return userRepository.findByUsername(userName);
    }

    public ResponseEntity<?> addUser(User user) {
        Optional<User> checkedUser = userRepository.findByUsername(user.getUsername());

        if (checkedUser.isPresent()) {
            return ResponseEntity.badRequest().body("This username is already taken");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    public User update(User user) {
        Integer id = user.getId();
        Optional<User> existingUserOpt = userRepository.findById(id);
        User existingUser;
        if(existingUserOpt.isPresent()){
            existingUser = existingUserOpt.get();
            existingUser.setName(user.getName());
            existingUser.setAddress(user.getAddress());
            existingUser.setPassword(user.getPassword());
            existingUser.setUsername(user.getUsername());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setRole(user.getRole());
            userRepository.save(existingUser);
        } else {
            return null;
        }
        return existingUser;
    }

    public boolean delete(Integer id){
        if (userRepository.existsById(id)){
            userRepository.deleteById(id);
        } else {
            return false;
        }
        return true;
    }


}
