package com.example.backend.controller;

import com.example.backend.model.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173") // Allow Vite frontend
public class PostController {

    private static final java.util.Map<String, Integer> WORD_LIMITS = java.util.Map.of(
            "Twitter", 50,
            "Instagram", 100,
            "Facebook", 200
    );

    @Autowired
    private PostRepository postRepository;

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        String error = validate(post);
        if (error != null) return ResponseEntity.badRequest().body(error);
        return ResponseEntity.status(HttpStatus.CREATED).body(postRepository.save(post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            String error = validate(postDetails);
            if (error != null) return ResponseEntity.badRequest().build();
            Post existingPost = post.get();
            existingPost.setPlatform(postDetails.getPlatform());
            existingPost.setContent(postDetails.getContent());
            return ResponseEntity.ok(postRepository.save(existingPost));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String validate(Post post) {
        if (post == null || post.getPlatform() == null || post.getContent() == null || post.getContent().isBlank()) {
            return "Platform and non-empty content are required.";
        }
        Integer limit = WORD_LIMITS.get(post.getPlatform());
        if (limit == null) return "Unsupported platform.";
        int words = post.getContent().trim().split("\\s+").length;
        return words > limit ? "Maximum " + limit + " words allowed for " + post.getPlatform() + "." : null;
    }
}
