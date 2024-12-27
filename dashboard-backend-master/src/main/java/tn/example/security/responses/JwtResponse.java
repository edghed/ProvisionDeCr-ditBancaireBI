package tn.example.security.responses;

import javax.validation.constraints.Email;
import java.util.List;

public class JwtResponse {

    private String token;
    private Long id;
    private String username;

    @Email
    private String email;

    private boolean active;

    private List<String> roles;

    public JwtResponse(String token, Long id, String username, @Email String email,boolean active, List<String> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.active = active;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getRoles() {
        return roles;
    }
}
