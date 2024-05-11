package com.mra.mono.controller;

import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Category;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.MenuAddReq;
import com.mra.mono.dto.request.MenuUpdateReq;
import com.mra.mono.dto.response.MenuRes;
import com.mra.mono.repository.MenuRepository;
import com.mra.mono.service.MenuService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mra.mono.common.controller.BaseController;

import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/menu")
@Slf4j
public class MenuController extends BaseController{

    @Resource
    private final MenuRepository menuRepository;


    @Resource
    private MenuService menuService;


    @PostMapping
    public ResponseEntity<Message<Menu>> createMenu(@Validated  @RequestBody MenuAddReq menu) {
        try {
            Menu savedMenu = menuService.create(menu);
            return buildSuccessReturnEntity(savedMenu);
        } catch (Exception e) {
            log.error("Error creating menu: ", e);
            return buildFailureReturnEntity("Error creating menu: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Menu>> updateMenu(@PathVariable UUID id, @RequestBody MenuUpdateReq menu) {
        try {
            if (!menuService.existsById(id)) {
                log.warn("Menu not found with id: {}", id);
                return buildFailureReturnEntity("Menu not found with id: " + id);
            }
            Menu updatedMenu = menuService.update(id, menu);
            return buildSuccessReturnEntity(updatedMenu);
        } catch  (Exception e) {
            log.error("Error updating menu with id {}: ", id, e);
            return buildFailureReturnEntity("Error updating menu: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message<MenuRes>> getMenu(@PathVariable UUID id) {
        try {
            if (!menuService.existsById(id)) {
                log.warn("Menu not found with id: {}", id);
                return buildFailureReturnEntity("Menu not found with id: " + id);
            }
            MenuRes menuRes = menuService.findById(id);
            return buildSuccessReturnEntity(menuRes);
        } catch (Exception e) {
            log.error("Error fetching menu with id {}: ", id, e);
            return buildFailureReturnEntity("Error fetching menu: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<Message<List<Menu>>> getAllMenus(@RequestParam Optional<UUID> companyId) {
        try {
            List<Menu> menus ;
            if (companyId.isPresent() ) {
                menus = menuService.findAll(companyId);
            }
            else {
                return buildReturnEntity("Error No found menus ",301);
            }
            return buildSuccessReturnEntity(menus);
        } catch  (Exception e) {
            log.error("Error fetching menus: ", e);
            return buildFailureReturnEntity("Error fetching menus: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteMenu(@PathVariable UUID id) {
        try {
            if (!menuService.existsById(id)) {
                log.warn("Menu not found with id: {}", id);
                return buildFailureReturnEntity("Menu not found with id: " + id);
            }
            menuService.deleteById(id);
            return buildSuccessReturnEntity("Menu successfully deleted");
        } catch  (Exception e) {
            log.error("Error deleting menu with id {}: ", id, e);
            return buildFailureReturnEntity("Error deleting menu: " + e.getMessage());
        }
    }

    @PostMapping("/{menuId}/products")
    public ResponseEntity<Message<String>> addProductsToMenu(@PathVariable UUID menuId, @RequestBody Set<UUID> productIds) {
        try {
            menuService.addProductsToMenu(menuId, productIds);
            log.info("Products added to menu with id: {}", menuId);
            return buildSuccessReturnEntity("Products added ",200);
        } catch (RuntimeException e) {
            log.error("Error adding products to menu with id {}: ", menuId, e);
             return buildFailureReturnEntity("Error adding products ");
        }
    }

    @GetMapping("/categories/{menuId}")
    public ResponseEntity<Message<List<Category>>> getMenuCategories(@PathVariable UUID menuId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + menuId));

        List<Category> categories = menuService.getCategoriesByProductIds(new ArrayList<>(menu.getProductIds()));

        return buildSuccessReturnEntity(categories);
    }


    @PostMapping("/{menuId}/products/{productId}")
    public ResponseEntity<Message<String>> removeProductFromMenu(@PathVariable UUID menuId, @PathVariable UUID productId) {
        try {
            menuService.deleteProductFromMenu(menuId, productId);
            log.info("Product removed from menu with id: {}", menuId);
            return buildSuccessReturnEntity("Product removed");
        } catch (RuntimeException e) {
            log.error("Error removing product from menu with id {}: ", menuId, e);
            return buildFailureReturnEntity("Error removing product");
        }
    }



}
