package com.onnongwa.back_end.domain.user.entity;

import com.onnongwa.back_end.domain.farm.entity.Farm;
import com.onnongwa.back_end.domain.recommend.entity.Recommend;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "user")
    private List<Recommend> recommends;

    @OneToMany(mappedBy = "user")
    private List<Farm> farms;
}
