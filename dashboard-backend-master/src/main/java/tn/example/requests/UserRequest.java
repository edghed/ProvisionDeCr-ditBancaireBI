package tn.example.requests;

import javax.validation.constraints.Email;
import java.util.Set;

public class UserRequest extends SignupRequest{

    private boolean active;


    public UserRequest(String username, String password, @Email String email, Set<String> roles, boolean active) {
        super(username, password, email, roles);
        this.active = active;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
