package com.echoscript.backend.service;

import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Service
@RequiredArgsConstructor
public class DeepgramService {

    @Value("${deepgram.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public String transcribeAudio(File audioFile) {

        try {

            byte[] audioBytes =
                    Files.readAllBytes(audioFile.toPath());

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(
                    MediaType.parseMediaType("audio/mp3"));

            headers.set("Authorization",
                    "Token " + apiKey);

            HttpEntity<byte[]> request =
                    new HttpEntity<>(audioBytes, headers);

            String url =
                    "https://api.deepgram.com/v1/listen";

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            request,
                            String.class
                    );

            JSONObject json =
                    new JSONObject(response.getBody());

            JSONArray channels =
                    json.getJSONObject("results")
                            .getJSONArray("channels");

            JSONArray alternatives =
                    channels.getJSONObject(0)
                            .getJSONArray("alternatives");

            return alternatives.getJSONObject(0)
                    .getString("transcript");

        } catch (IOException e) {
            throw new RuntimeException(
                    "Failed to transcribe audio",
                    e
            );
        }
    }
}