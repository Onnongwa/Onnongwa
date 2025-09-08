package com.onnongwa.back_end.domain.farm.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onnongwa.back_end.domain.farm.controller.dto.FarmRegisterDto;
import com.onnongwa.back_end.domain.farm.controller.dto.FarmUpdateDto;
import com.onnongwa.back_end.domain.farm.service.FarmService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/farm")
public class FarmController {

	private final FarmService farmService;

	@PostMapping
	public ResponseEntity<?> registerFarm(@RequestBody FarmRegisterDto dto){

		farmService.registerFarm(dto);

		return ResponseEntity.status(HttpStatus.OK).build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getFarmById(@PathVariable("id") Long id){
		return ResponseEntity.status(HttpStatus.OK)
			.body(farmService.getFarmById(id));
	}

	@PatchMapping("/{id}")
	public ResponseEntity<?> updateFarm(@PathVariable("id") Long id,
										@RequestBody FarmUpdateDto dto){
		return ResponseEntity.status(HttpStatus.OK)
			.body(farmService.updateFarm(id,dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteFarm(@PathVariable("id") Long id){
		farmService.deleteFarm(id);
		return ResponseEntity.status(HttpStatus.OK).build();
	}
}
