package tn.example.responses;

import tn.example.entities.User;
import tn.example.requests.UserRequest;


import java.util.stream.Collectors;

public class UserResponse extends UserRequest {

    private long id;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public UserResponse(User user){
        super(user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getRoles().stream().map(x->x.getName().name()).collect(Collectors.toSet()),
                user.isActive());
        this.id= user.getId();
    }

}
