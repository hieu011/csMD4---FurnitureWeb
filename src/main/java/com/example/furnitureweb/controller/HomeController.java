package com.example.furnitureweb.controller;

import com.example.furnitureweb.service.productService.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@AllArgsConstructor
public class HomeController {

    private final ProductService productService;

    @GetMapping("/home")
    public String showHomePage() {
        return "/customer/views/index";
    }

    @GetMapping("/shop")
    public String showShoppingPage() {
        return "/customer/views/shop";
    }


    @GetMapping("/admin")
    public String showAdminPage() {
        return "/admin/views/index";
    }

    @GetMapping("/products")
    public String showProductsDashboardPage(Model model) {
        return "/admin/views/product/listProduct";
    }

    @GetMapping("/categories")
    public String showCategoriesDashboardPage(Model model) {
        return "/admin/views/product/categories";
    }

    @GetMapping("/materials")
    public String showMaterialsDashboardPage(Model model) {
        return "/admin/views/product/materials";
    }
}
