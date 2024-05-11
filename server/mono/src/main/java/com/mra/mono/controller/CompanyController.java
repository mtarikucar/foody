package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.response.CompanyRes;
import com.mra.mono.dto.request.CompanyReq;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.service.CompanyService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/company")
@Slf4j
@RequiredArgsConstructor
public class CompanyController extends BaseController {

    @Resource
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<Message<List<CompanyRes>>> getAllCompanies(@RequestParam UUID userId) {
        try {
            List<CompanyRes> companyRes = companyService.findAll(userId);
            if (companyRes.isEmpty()) {
                return buildFailureReturnEntity("Companies not found");
            }
            return buildSuccessReturnEntity(companyRes);
        } catch (Exception e) {
            log.error("Error while fetching companies", e);
            return buildFailureReturnEntity("Error fetching companies: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message<CompanyRes>> getCompanyById(@PathVariable UUID id) {
        try {

            CompanyRes companyRes = companyService.findById(id).orElseThrow(() -> {
                log.error("company not found with ID: {}", id);
                return new ResourceNotFoundException("company not found with id: " + id);
            });

            return buildSuccessReturnEntity(companyRes);
        } catch (ResourceNotFoundException e) {
            log.error("Company not found with id: {}", id, e);
            return buildFailureReturnEntity("Company not found with id: " + id);
        } catch (Exception e) {
            log.error("Error while fetching company", e);
            return buildFailureReturnEntity("Error fetching company: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Message<CompanyRes>> createCompany(@RequestBody CompanyReq companyReq) {
        try {
            CompanyRes companyRes = companyService.save(companyReq);
            return buildSuccessReturnEntity(companyRes);
        } catch (Exception e) {
            log.error("Error while creating company", e);
            return buildFailureReturnEntity("Error creating company: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<String>> updateCompany(@PathVariable UUID id, @RequestBody CompanyReq companyReq) {
        try {
            if (!companyService.existsById(id)){
                log.warn("Company not found with id: {}", id);
                return buildFailureReturnEntity("Company not found with id: " + id);
            }
            companyService.update(companyReq, id);
            return buildSuccessReturnEntity("Company successfully updated");
        } catch (Exception e) {
            log.error("Error while updating company", e);
            return buildFailureReturnEntity("Error updating company: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteCompany(@PathVariable UUID id) {
        try {
            if (!companyService.existsById(id)){
                log.warn("Company not found with id: {}", id);
                return buildFailureReturnEntity("Company not found with id: " + id);
            }
            companyService.deleteById(id);
            return buildSuccessReturnEntity("Company successfully deleted");
        } catch (Exception e) {
            log.error("Error while deleting company", e);
            return buildFailureReturnEntity("Error deleting company: " + e.getMessage());
        }
    }
}

