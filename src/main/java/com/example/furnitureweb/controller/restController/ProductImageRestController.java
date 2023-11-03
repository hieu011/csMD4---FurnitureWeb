package com.example.furnitureweb.controller.restController;

import com.example.furnitureweb.model.ProductImage;
import com.example.furnitureweb.model.dto.productImageDTO.ProductImageResponse;
import com.example.furnitureweb.service.productImageService.ProductImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/api/productImages")
@AllArgsConstructor
public class ProductImageRestController {
    private final ProductImageService upLoadFileService;

    @PostMapping()
    public List<ProductImageResponse> upload(@RequestParam("files") List<MultipartFile> files) throws IOException {
        return upLoadFileService.saveProductImage(files);
    }
}
