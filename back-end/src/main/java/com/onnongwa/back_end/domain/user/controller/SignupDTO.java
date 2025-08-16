package com.onnongwa.back_end.domain.user.controller;

import com.onnongwa.back_end.domain.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignupDTO {
    private String email;
    private String password;
    private String name;
    private String phone;
    private Role role;
}
