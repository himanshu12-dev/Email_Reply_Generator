package com.email.email_writer.emailwriterapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
@CrossOrigin(origins = "*")
public class EmailGenratorController {

    private final EmailService emailService;

    public EmailGenratorController(EmailService emailService){
        this.emailService=emailService;
    }
    
    @PostMapping("/gen-Email")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){

        log.info("genrate email");


        return ResponseEntity.ok().body(emailService.generateReplyEmail(emailRequest));
    }
}
