package tn.example.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.example.entities.Profile;
import tn.example.entities.Role;
import tn.example.entities.RoleEnum;
import tn.example.entities.User;
import tn.example.repositories.ProfileRepository;
import tn.example.repositories.RoleRepository;
import tn.example.repositories.UserRepository;
import tn.example.requests.UserRequest;
import tn.example.responses.UserResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    ProfileRepository profileRepository;

    @GetMapping("/all")
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(x->new UserResponse(x)).collect(Collectors.toList());
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser (@PathVariable long id,@RequestBody UserRequest userRequest){
        Optional<User> dbUser = userRepository.findByUsername(userRequest.getUsername());
        if (!dbUser.isPresent()){
            return ResponseEntity
                    .badRequest()
                    .body("Error: No user found!");
        }
        User user = dbUser.get();

        if (userRequest.getPassword()!=null && !userRequest.getPassword().isBlank()){
            user.setPassword(encoder.encode(userRequest.getPassword()));
        }
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        Set<String> strRoles = userRequest.getRoles();
        Set<Role> roles = getRoles(strRoles);
        user.setRoles(roles);
        user.setActive(userRequest.isActive());
        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully!");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/add")
    public ResponseEntity addUser (@RequestBody UserRequest userRequest) throws Exception {
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }
        // Create new user's account
        User user = new User(userRequest.getUsername(),
                userRequest.getEmail(),
                encoder.encode(userRequest.getPassword()));
        Set<String> strRoles = userRequest.getRoles();
        Set<Role> roles = getRoles(strRoles);
        user.setRoles(roles);
        user.setActive(userRequest.isActive());
        Profile userProfile = new Profile();
        userRepository.save(user);
        userProfile.setUser(user);
        profileRepository.save(userProfile);
        user.setProfile(userProfile);
        userRepository.saveAndFlush(user);
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        this.userRepository.deleteById(id);
        return "User deleted Successfully";
    }

    private Set<Role> getRoles(Set<String> strRoles){
        Set<Role> roles = new HashSet<>();
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "ROLE_ADMIN":
                        Role adminRole = roleRepository.findByName(RoleEnum.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "ROLE_USER":
                        Role userRole = roleRepository.findByName(RoleEnum.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }
        return roles;
    }

}
