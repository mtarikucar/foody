package com.mra.mono.service;

import com.mra.mono.common.exception.HandledException;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.common.utils.CustomBeanUtils;
import com.mra.mono.dto.entity.*;
import com.mra.mono.dto.request.*;
import com.mra.mono.dto.response.CompanyRes;
import com.mra.mono.repository.CompanyRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.introspector.PropertyUtils;

import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class CompanyService {

    @Resource
    private final CompanyRepository companyRepository;
    @Resource
    private UserService userService;
    @Resource
    private BranchService branchService;
    @Resource
    private MenuService menuService;
    @Resource
    private ProductService productService;
    @Resource
    private CategoryService categoryService;


    public List<CompanyRes> findAll(UUID userId) throws HandledException {
        try {
            List<Company> companyList = companyRepository.findAllByUserId(userId);
            List<CompanyRes> list = new ArrayList<>();

            for (Company company : companyList) {
                CompanyRes vo = new CompanyRes();
                Optional<Users> users = userService.getUserById(company.getUserId()).stream().findFirst();

                if (users.isPresent()) {
                    BeanUtils.copyProperties(users.get(), vo);
                    BeanUtils.copyProperties(company, vo);
                    list.add(vo);
                }
            }
            return list;
        } catch (Exception e) {
            log.error("Error finding all companies", e);
            throw new HandledException(400, "Tüm şirketler bulunurken hata oluştu");
        }
    }

    public Optional<CompanyRes> findById(UUID id) throws HandledException {
        try {
            CompanyRes vo = new CompanyRes();
            Company company = companyRepository.findById(id).orElseThrow(() -> new HandledException(400,"Şirket bulunamadı: " + id));
            Optional<Users> users = userService.getUserById(company.getUserId()).stream().findFirst();

            if (users.isPresent()) {
                BeanUtils.copyProperties(users.get(), vo);
                BeanUtils.copyProperties(company, vo);
            }

            return Optional.of(vo);
        } catch (Exception e) {
            log.error("Error finding company by id: {}", id, e);
            throw new HandledException(400,"Şirket bulunurken hata oluştu");
        }
    }

    public CompanyRes save(CompanyReq companyReq) throws HandledException {
        try {

            Company company = new Company();

            BeanUtils.copyProperties(companyReq, company);

            Company savedCompany = companyRepository.save(company);

            userService.updateCompanyId(savedCompany.getCompanyId(), companyReq.getUserId());

            BranchAddReq branchAddReq = new BranchAddReq();
            branchAddReq.setCompanyId(savedCompany.getCompanyId());
            branchAddReq.setBranchName("Head Office");
            branchAddReq.setCity("Istanbul");
            branchAddReq.setDistrict("Kadikoy");
            branchAddReq.setStreet("Bagdat");
            branchAddReq.setBuildingNumber(1);
            branchAddReq.setApartmentNumber(1);
            branchAddReq.setOpenAddress("Bagdat Caddesi No:1/1");
            Branch savedBranch = branchService.save(branchAddReq);

            MenuAddReq menuAddReq = new MenuAddReq();
            menuAddReq.setCompanyId(savedCompany.getCompanyId());
            menuAddReq.setMenuName("Default Menu");
            menuAddReq.setColor("#4B0082");
            Menu savedMenu = menuService.create(menuAddReq);
            branchService.updateMenuId(savedBranch.getBranchId(), savedMenu.getMenuId());



            List<String> categoryNames = Arrays.asList("İçecek", "Tatlı", "Ana Yemek");
            for (String categoryName : categoryNames) {
                CategoryAddReq categoryAddReq = new CategoryAddReq();
                categoryAddReq.setCompanyId(savedCompany.getCompanyId());
                categoryAddReq.setName(categoryName);
                categoryAddReq.setImage("https://via.placeholder.com/150");
                Category savedCategory = categoryService.save(categoryAddReq);

                Set<UUID> productIds = new HashSet<>();
                for (int i = 1; i <= 5; i++) {
                    ProductAddReq productAddReq = new ProductAddReq();
                    productAddReq.setCompanyId(savedCompany.getCompanyId());
                    productAddReq.setName(categoryName + " Ürün " + i);
                    productAddReq.setCategoryId(savedCategory.getCategoryId());
                    productAddReq.setPrice(10.0);
                    productAddReq.setImages(Collections.singletonList("https://via.placeholder.com/150"));
                    Product savedProduct = productService.save(productAddReq);
                    productIds.add(savedProduct.getProductId());
                }
                menuService.addProductsToMenu(savedMenu.getMenuId(), productIds);
                productIds.clear();
            }

            CompanyRes companyRes = new CompanyRes();
            BeanUtils.copyProperties(savedCompany, companyRes);

            return companyRes;
        } catch (Exception e) {
            log.error("Error saving company", e);
            throw new HandledException(400, "Şirket kaydedilirken hata oluştu");
        }
    }

    public Company update(CompanyReq companyReq, UUID id) throws HandledException {
        try {
            Company company = companyRepository.findById(id).orElseThrow(() -> new HandledException(400,"Şirket bulunamadı: " + id));
            CustomBeanUtils.copyNonNullProperties(companyReq, company);
            company.setCreateTime(new Date());
            log.info("companyReq :{}",companyReq);

            return companyRepository.save(company);
        } catch (Exception e) {
            log.error("Error updating company with id: {}", id, e);
            throw new HandledException(400,"Şirket güncellenirken hata oluştu");
        }
    }

    public boolean existsById(UUID id) throws HandledException{
        try {
            return companyRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error checking existence of company with id: {}", id, e);
            throw new HandledException(400,"Şirketin varlığı kontrol edilirken hata oluştu");
        }
    }

    public void deleteById(UUID id) throws HandledException{
        try {
            companyRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error deleting company with id: {}", id, e);
            throw new HandledException(400,"Şirket silinirken hata oluştu");
        }
    }
}
