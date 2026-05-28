package com.echoscript.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TranscriptDto {

    private Long id;
    private String fileName;
    private String transcript;
    private LocalDateTime createdAt;
}