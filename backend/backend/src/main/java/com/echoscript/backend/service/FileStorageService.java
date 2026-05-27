package com.echoscript.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {
    private static final String UPLOAD_DIR = "uploads";
    public String storeFile(MultipartFile file){
        try{
            if (file.isEmpty()){
                throw new RuntimeException("File is Empty");
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null ||
                    !(fileName.endsWith(".wav")
                            ||fileName.endsWith(".mp3")
                            ||fileName.endsWith(".m4a"))){
                throw new RuntimeException("Only .mp3, .wav, and .m4a files are allowed");
            }
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        }catch (IOException e){
            throw new RuntimeException("Failed to store file", e);
        }
    }
}