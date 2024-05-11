package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.CompanyPackage;
import com.mra.mono.dto.entity.Feature;
import com.mra.mono.dto.entity.Package;
import com.mra.mono.dto.entity.Product;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.FeatureAddReq;
import com.mra.mono.dto.request.ProductAddReq;
import com.mra.mono.dto.request.ProductUpdateReq;
import com.mra.mono.service.CompanyPackageService;
import com.mra.mono.service.FeatureService;
import com.mra.mono.service.PackageService;
import com.mra.mono.service.ProductService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@RestController
@RequestMapping("/package")
@Slf4j
public class PackageController extends BaseController {

    @Resource
    private PackageService packageService;
    @Resource

    private CompanyPackageService companyPackageService;


    @GetMapping
    public ResponseEntity<Message<List<Package>>> getPackages() {
        try {
            List<Package> packages = packageService.getAllPackages();
            return buildSuccessReturnEntity(packages);
        } catch (Exception e) {
            log.error("Error retrieving packages: {}", e.getMessage());
            return buildReturnEntity("An error occurred while fetching packages",300);
        }
    }


    @PostMapping
    public ResponseEntity<Message<String>> createPackage(@RequestBody Package newPackage) {
        try {
            packageService.createPackage(newPackage);
            return buildSuccessReturnEntity("success");
        } catch (Exception e) {
            log.error("Error retrieving products: {}", e.getMessage());
            return buildReturnEntity("An error occurred while saving package",300);
        }
    }

    @GetMapping("/subscription")
    public ResponseEntity<Message<CompanyPackage>> getSubcription(@RequestParam UUID companyId) {
        try {
            CompanyPackage companyPackage =  companyPackageService.getSubscription(companyId);
            return buildSuccessReturnEntity(companyPackage);
        } catch (Exception e) {
            if (e instanceof ResourceNotFoundException)
                return buildReturnEntity("No subscription found",300);
            return buildReturnEntity("An error occurred while getting package",400);
        }
    }

    @PostMapping("/subscription")
    public ResponseEntity<Message<CompanyPackage>> createSubcription(@RequestBody CompanyPackage companyPackage) {
        try {
            CompanyPackage newCompanyPackage =  companyPackageService.createNewSubscription(companyPackage.getCompanyId(),companyPackage.getPackageId());
            return buildSuccessReturnEntity(newCompanyPackage);
        } catch (Exception e) {
            log.error("Error retrieving products: {}", e.getMessage());
            return buildReturnEntity("An error occurred while saving package",300);
        }
    }



}
