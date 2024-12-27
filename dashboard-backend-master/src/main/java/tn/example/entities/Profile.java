package tn.example.entities;

import javax.persistence.*;

@Table(	name = "profiles",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "user")})
@Entity
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }


    public Long getId() {
        return id;
    }

    @JoinColumn(name = "user",referencedColumnName = "id")
    @OneToOne(fetch = FetchType.LAZY)
    private User user;

    private String firstName;
    private String lastName;

    private String position;

    @Lob
    @Column(name = "picture", columnDefinition="LONGBLOB")
    private byte[] picture;

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPosition() {
        return position;
    }

    public byte[] getPicture() {
        return picture;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
