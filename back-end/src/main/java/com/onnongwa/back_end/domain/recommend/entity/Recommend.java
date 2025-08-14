package com.onnongwa.back_end.domain.recommend.entity;

import com.onnongwa.back_end.domain.program.entity.Program;
import com.onnongwa.back_end.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Recommend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String marketComment;
    private String farmComment;
    private String item;
    private String purpose;
    private String requirement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "recommend")
    private List<Program> programs;
}
