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
    public String showHomePage(Model model) {
        model.addAttribute("active","home");
        return "/customer/views/index";
    }

    @GetMapping("/shop")
    public String showShoppingPage(Model model) {
        model.addAttribute("active","shop");
        return "/customer/views/shop";
    }

    @GetMapping("/about")
    public String showAboutPage(Model model) {
        model.addAttribute("active","about");
        return "/customer/views/aboutUs";
    }

    @GetMapping("/contact")
    public String showContactPage(Model model) {
        model.addAttribute("active","contact");
        return "/customer/views/contactUs";
    }


    @GetMapping("/cart")
    public String showCartPage() {
        return "/customer/views/cart";
    }

    @GetMapping("/checkout")
    public String showCheckOutPage() {
        return "/customer/views/checkout";
    }

    @GetMapping("/thank-you")
    public String showThankYouPage() {
        return "/customer/views/thank-you";
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
