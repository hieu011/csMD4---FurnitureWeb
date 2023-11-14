package com.example.furnitureweb.service.productService;

import com.example.furnitureweb.model.Category;
import com.example.furnitureweb.model.Material;
import com.example.furnitureweb.model.Product;
import com.example.furnitureweb.model.ProductImage;
import com.example.furnitureweb.model.dto.productDTO.ProductListResponse;
import com.example.furnitureweb.model.dto.productDTO.ProductSaveRequest;
import com.example.furnitureweb.model.dto.request.OptionRequest;
import com.example.furnitureweb.repository.ProductImageRepository;
import com.example.furnitureweb.repository.ProductRepository;
import com.example.furnitureweb.service.categoryService.CategoryService;
import com.example.furnitureweb.service.materialService.MaterialService;
import com.example.furnitureweb.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    private final ProductImageRepository fileRepository;

    private final CategoryService categoryService;

    private final MaterialService materialService;

    public Page<ProductListResponse> getAll(Pageable pageable, String search){
        search = "%" + search + "%";
        return productRepository.searchEverything(search ,pageable).map(e -> {
            var result = AppUtils.mapper.map(e, ProductListResponse.class);
            result.setCategory(e.getCategory().getName());
            result.setMaterial(e.getMaterial().getName());
            List<String> images = e.getProductImages().stream().map(ProductImage::getFileUrl)
                    .collect(Collectors.toList());
            result.setImages(images);
            return result;
        });
    }

    public Product create(ProductSaveRequest request){
        var product = AppUtils.mapper.map(request, Product.class);
        productRepository.save(product);
        Category category = categoryService.findByID(Long.valueOf(request.getCategoryId().getId())).get();
        product.setCategory(category);
        Material material = materialService.findByID(Long.valueOf(request.getMaterialId().getId())).get();
        product.setMaterial(material);
        var files = fileRepository.findAllById(request.getFiles().stream().map(OptionRequest::getId).collect(Collectors.toList()));
        for (var file: files) {
            file.setProduct(product);
        }
        fileRepository.saveAll(files);
        productRepository.save(product);
        return product;
    }

    public ProductListResponse findById(Long id){
        var product = productRepository.findById(id).orElse(new Product());
        var result = AppUtils.mapper.map(product, ProductListResponse.class);
        result.setCategory(product.getCategory().getId().toString());
        result.setMaterial(product.getMaterial().getId().toString());
        List<String> images = product.getProductImages()
                .stream()
                .map(ProductImage::getFileUrl)
                .collect(Collectors.toList());
        result.setImages(images);
        return result;
    }

    public ProductListResponse findByIdForClient(Long id){
        var product = productRepository.findById(id).orElse(new Product());
        var result = AppUtils.mapper.map(product, ProductListResponse.class);
        result.setCategory(product.getCategory().getName().toString());
        result.setMaterial(product.getMaterial().getName().toString());
        List<String> images = product.getProductImages()
                .stream()
                .map(ProductImage::getFileUrl)
                .collect(Collectors.toList());
        result.setImages(images);
        return result;
    }

    public void update(ProductSaveRequest request, Long id) {
        var product = productRepository.findById(id).orElse(new Product());
        AppUtils.mapper.map(request, product);
        Category category = categoryService.findByID(Long.valueOf(request.getCategoryId().getId())).get();
        product.setCategory(category);
        Material material = materialService.findByID(Long.valueOf(request.getMaterialId().getId())).get();
        product.setMaterial(material);
        product = productRepository.save(product);
        var files = fileRepository.findAllById(request.getFiles().stream().map(OptionRequest::getId).collect(Collectors.toList()));
        for ( ProductImage image: product.getProductImages()) {
            for(var file: files){
                if( image.getId() != file.getId() ){
                    fileRepository.delete(image);
                    break;
                } else {
                    break;
                }
            }
        }

        for (var file: files){
            file.setProduct(product);
        }
        fileRepository.saveAll(files);
    }
}
