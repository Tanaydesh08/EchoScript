package com.echoscript.backend.service;

import com.echoscript.backend.dto.TranscriptDto;
import com.echoscript.backend.model.Transcription;
import com.echoscript.backend.model.User;
import com.echoscript.backend.repository.TranscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranscriptionService {

    private final TranscriptionRepository transcriptionRepository;

    public Transcription saveTranscript(
            String fileName,
            String transcript,
            User user) {

        Transcription transcription =
                Transcription.builder()
                        .fileName(fileName)
                        .transcript(transcript)
                        .createdAt(LocalDateTime.now())
                        .user(user)
                        .build();

        return transcriptionRepository.save(transcription);
    }

    public List<TranscriptDto> getHistory(Long userId) {

        System.out.println("Fetching history from DB...");

        List<TranscriptDto> result =
                transcriptionRepository.findByUserId(userId)
                        .stream()
                        .map(t -> new TranscriptDto(
                                t.getId(),
                                t.getFileName(),
                                t.getTranscript(),
                                t.getCreatedAt()
                        ))
                        .toList();

        System.out.println("History fetched successfully");

        return result;
    }

    public TranscriptDto getTranscript(Long id) {

        System.out.println("Fetching transcript by ID...");

        Transcription t =
                transcriptionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transcript not found"));

        return new TranscriptDto(
                t.getId(),
                t.getFileName(),
                t.getTranscript(),
                t.getCreatedAt()
        );
    }
}