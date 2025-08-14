package com.onnongwa.back_end.domain.user.controller;

import com.onnongwa.back_end.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/api/signup")
    public ResponseEntity<?> signup(@RequestBody SignupDTO signupDTO) {
        userService.signup(signupDTO);
        System.out.println("성공");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/hello")
    public ResponseEntity<?> hello() {
        System.out.println("성공");
        return ResponseEntity.ok("hello");
    }

}
