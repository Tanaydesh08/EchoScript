package com.echoscript.backend.repository;

import com.echoscript.backend.model.Transcription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TranscriptionRepository extends JpaRepository<Transcription, Long> {
    List<Transcription> findByUserId(Long userId);
}
