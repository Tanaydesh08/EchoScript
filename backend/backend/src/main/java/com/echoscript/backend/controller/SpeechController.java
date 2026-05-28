package com.echoscript.backend.controller;

import com.echoscript.backend.dto.TranscriptDto;
import com.echoscript.backend.dto.UploadResponse;
import com.echoscript.backend.model.Transcription;
import com.echoscript.backend.model.User;
import com.echoscript.backend.repository.UserRepository;
import com.echoscript.backend.service.DeepgramService;
import com.echoscript.backend.service.FileStorageService;
import com.echoscript.backend.service.TranscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/speech")
@RequiredArgsConstructor
public class SpeechController {
    private final FileStorageService fileStorageService;
    private final DeepgramService deepgramService;
    private final TranscriptionService transcriptionService;
    private final UserRepository userRepository;

    @PostMapping("/upload")
    public UploadResponse uploadAudio(@RequestParam("audioFile")MultipartFile audioFile){
        String fileName = fileStorageService.storeFile(audioFile);
        return new UploadResponse("File Uploaded Successfully", fileName);
    }
    @PostMapping("/convert")
    public Map<String, Object> convertSpeech(
            @RequestParam("audioFile")
            MultipartFile audioFile,
            Authentication authentication) {

        String fileName = fileStorageService.storeFile(audioFile);

        File file = new File("uploads/" + fileName);

        System.out.println("Sending to deepgram...!!!");
        String transcript = deepgramService.transcribeAudio(file);

        System.out.println("Transcript Received...!!!");
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();

        Transcription saved = transcriptionService.saveTranscript(fileName, transcript, user);

        return Map.of(
                "message", "Transcription completed",
                "transcriptionId", saved.getId()
        );
    }

    @GetMapping("/history")
    public List<TranscriptDto> history(Authentication authentication){
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return transcriptionService.getHistory(user.getId());
    }

    @GetMapping("/{id}")
    public TranscriptDto getTranscript(@PathVariable Long id){
        return transcriptionService.getTranscript(id);
    }
}