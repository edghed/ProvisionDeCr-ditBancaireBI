package tn.example.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.example.entities.Profile;
import tn.example.entities.User;
import tn.example.repositories.ProfileRepository;
import tn.example.repositories.UserRepository;
import tn.example.requests.ProfileRequest;
import tn.example.responses.ProfileResponse;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProfileRepository profileRepository;

    @Autowired
    PasswordEncoder encoder;

    @PutMapping("/update")
    public ResponseEntity updateProfile(@RequestBody ProfileRequest profileRequest){
        SecurityContext context = SecurityContextHolder.getContext();
        String username = profileRequest.getUsername();
        if(context != null && username!=null && !username.isBlank()){
            Authentication authentication = context.getAuthentication();
            String currentUser = authentication != null? authentication.getName() : null;
            if (currentUser == null || !username.equalsIgnoreCase(currentUser)){
                return ResponseEntity.badRequest().body("Invalid username!");
            }

            Optional<User> optionalUser = userRepository.findByUsername(username);
            if(optionalUser.isEmpty()){
                return ResponseEntity.badRequest().body("User not found!");
            }

            User user = optionalUser.get();
            String email = profileRequest.getEmail();

            if ( email != null && !email.isBlank()){
                user.setEmail(email);
            }

            String password = profileRequest.getPassword();

            if (password != null && !password.isBlank()){
                user.setPassword(password);
            }

            Profile profile = user.getProfile();

            profile.setFirstName(profileRequest.getFirstName());
            profile.setLastName(profileRequest.getLastName());
            profile.setPosition(profileRequest.getPosition());
            profile.setPicture(profileRequest.getPicture().getBytes(StandardCharsets.UTF_8));

            profileRepository.save(profile);

            userRepository.save(user);

            return ResponseEntity.ok("Profile updated Successfully");
        }


        return ResponseEntity.status(401).body("Unauthorized!");
    }

    @GetMapping("/{username}")
    public ProfileResponse getUserProfile(@PathVariable String username){
        if (!userRepository.existsByUsername(username)){
            return null;
        }
        User user = userRepository.findByUsername(username).get();
        if (profileRepository.findByUser(user).isEmpty()){
            return null;
        }

        Profile profile = profileRepository.findByUser(user).get();
        ProfileResponse userProfile = new ProfileResponse();

        userProfile.setUsername(username);
        userProfile.setEmail(user.getEmail());
        userProfile.setFirstName(profile.getFirstName());
        userProfile.setLastName(profile.getLastName());
        if(profile.getPicture()!=null){
            userProfile.setPicture(new String(profile.getPicture(),StandardCharsets.UTF_8));
        }
        userProfile.setPosition(profile.getPosition());
        return userProfile;
    }


}
