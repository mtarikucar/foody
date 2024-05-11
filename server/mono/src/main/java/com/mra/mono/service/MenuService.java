package com.mra.mono.service;


import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.common.utils.CustomBeanUtils;
import com.mra.mono.dto.entity.Category;
import com.mra.mono.dto.entity.Company;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.Product;
import com.mra.mono.dto.request.MenuAddReq;
import com.mra.mono.dto.request.MenuUpdateReq;
import com.mra.mono.dto.response.MenuRes;
import com.mra.mono.repository.CategoryRepository;
import com.mra.mono.repository.CompanyRepository;
import com.mra.mono.repository.MenuRepository;
import com.mra.mono.repository.ProductRepository;
import jakarta.annotation.Resource;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MenuService {

    @Resource
    MenuRepository menuRepository;

    @Resource
    private ProductRepository productRepository;

    @Resource
    private CategoryRepository categoryRepository;

    @Resource
    private CompanyRepository companyRepository;

    public Menu create(MenuAddReq menuAddReq) {
        try {
            Menu menu = new Menu();
            menu.setCompanyId(menuAddReq.getCompanyId());
            menu.setMenuName(menuAddReq.getMenuName());
            menu.setColor(menuAddReq.getColor());
            menu.setCreateTime(new Date());
            menu.setMenuId(UUID.randomUUID());
            return menuRepository.save(menu);
        } catch (Exception e) {
            log.error("Error creating menu: ", e);
            throw e;
        }
    }

    public Menu update(UUID id, MenuUpdateReq menuUpdateReq) {
        try {
            Menu menu = menuRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
            CustomBeanUtils.copyNonNullProperties(menuUpdateReq, menu);
            menu.setCreateTime(new Date());
            return menuRepository.save(menu);
        } catch (Exception e) {
            log.error("Error updating menu with id {}: ", id, e);
            throw e;
        }
    }

    public MenuRes findById(UUID menuId) {
        try {
            MenuRes menuRes = new MenuRes();
            Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + menuId));
            Company company = companyRepository.findById(menu.getCompanyId()).get();
            BeanUtils.copyProperties(menu, menuRes);
            menuRes.setLogo(company.getLogo());
            return menuRes;
        } catch (Exception e) {
            log.error("Error finding menu with id {}: ", menuId, e);
            throw e;
        }
    }

    public List<Menu> findAll(Optional<UUID> companyId) {
        try {
            return menuRepository.findAllByCompanyId(companyId);
        } catch (Exception e) {
            log.error("Error finding all menus: ", e);
            throw e;
        }
    }

    public void deleteById(UUID menuId) {
        try {
            if (!menuRepository.existsById(menuId)) {
                throw new ResourceNotFoundException("Menu not found with id: " + menuId);
            }
            menuRepository.deleteById(menuId);
        } catch (Exception e) {
            log.error("Error deleting menu with id {}: ", menuId, e);
            throw e;
        }
    }

    public boolean existsById(UUID id) {
        try {
            return menuRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error checking existence of menu with id {}: ", id, e);
            throw e;
        }
    }


    public void  addProductsToMenu(UUID menuId, Set<UUID> productIds) {
        try {
            Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));
            menu.getProductIds().addAll(productIds);
            menuRepository.save(menu);
            log.info("Products added to menu with id: {}", menuId);
        } catch (Exception e) {
            log.error("Error adding products to menu with id {}: ", menuId, e);
            throw e;
        }
    }


    public List<Category> getCategoriesByProductIds(List<UUID> productIds) {

        List<Product> products = productRepository.findAllById(productIds);

        Set<UUID> categoryIds = products.stream()
                .map(Product::getCategoryId)
                .collect(Collectors.toSet());
        return categoryRepository.findAllById(categoryIds);
    }


    public void deleteProductFromMenu(UUID menuId, UUID productIdToRemove) {
        try {
            Menu menu = menuRepository.findById(menuId)
                    .orElseThrow(() -> new RuntimeException("Menu not found with id: " + menuId));

            // Tek bir productId'yi kaldır
            menu.getProductIds().remove(productIdToRemove);

            menuRepository.save(menu);
            log.info("Product removed from menu with id: {}", menuId);
        } catch (Exception e) {
            log.error("Error removing product from menu with id {}: ", menuId, e);
            throw e;
        }
    }


}

