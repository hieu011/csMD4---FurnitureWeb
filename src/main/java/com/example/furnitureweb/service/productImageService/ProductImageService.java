package com.example.furnitureweb.service.productImageService;

import com.cloudinary.Cloudinary;
import com.example.furnitureweb.model.ProductImage;
import com.example.furnitureweb.model.dto.productImageDTO.ProductImageResponse;
import com.example.furnitureweb.repository.ProductImageRepository;
import com.example.furnitureweb.utils.UploadUtils;
import javax.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
@Transactional
public class ProductImageService {
    private final Cloudinary cloudinary;

    private final ProductImageRepository productImageRepository;

    private final UploadUtils uploadUtils;

    public List<ProductImageResponse> saveProductImage(List<MultipartFile> files)throws IOException {
        List<ProductImageResponse> productImageResponses = new ArrayList<>();
        for ( var file : files){
            var fileNew = new ProductImage();
            productImageRepository.save(fileNew);

            var uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadUtils.buildProductImageUploadParams(fileNew));

            String fileUrl = (String) uploadResult.get("secure_url");
            String fileFormat = (String) uploadResult.get("format");

            fileNew.setFileName(fileNew.getId() + "." + fileFormat);
            fileNew.setFileUrl(fileUrl);
            fileNew.setFileFolder(UploadUtils.IMAGE_UPLOAD_FOLDER);
            fileNew.setCloudId(fileNew.getFileFolder() + "/" + fileNew.getId());
            productImageRepository.save(fileNew);
            var fileId = fileNew.getId();
            productImageResponses.add(new ProductImageResponse(fileId));
        }
        return productImageResponses;
    }

}
