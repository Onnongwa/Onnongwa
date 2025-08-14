package com.onnongwa.back_end.domain.user.service;

import com.onnongwa.back_end.domain.user.controller.SignupDTO;
import com.onnongwa.back_end.domain.user.entity.Role;
import com.onnongwa.back_end.domain.user.entity.User;
import com.onnongwa.back_end.domain.user.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void signup(SignupDTO signupDTO) {
        User user = User.builder()
                .email(signupDTO.getEmail())
                .password(signupDTO.getPassword())
                .name(signupDTO.getName())
                .phone(signupDTO.getPhone())
                .role(Role.valueOf(signupDTO.getRole()))
                .build();

        userRepository.save(user);
    }
}
