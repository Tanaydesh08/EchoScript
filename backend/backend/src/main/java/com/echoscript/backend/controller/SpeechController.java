package com.echoscript.backend.controller;

import com.echoscript.backend.dto.UploadResponse;
import com.echoscript.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/speech")
@RequiredArgsConstructor
public class SpeechController {
    private final FileStorageService fileStorageService;
    @PostMapping("/upload")
    public UploadResponse uploadAudio(@RequestParam("audioFile")MultipartFile audioFile){
        String fileName = fileStorageService.storeFile(audioFile);
        return new UploadResponse("File Uploaded Successfully", fileName);
    }
}