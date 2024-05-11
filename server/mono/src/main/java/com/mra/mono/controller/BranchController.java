package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.HandledException;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Menu;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.BranchAddReq;
import com.mra.mono.dto.request.BranchUpdateReq;
import com.mra.mono.dto.response.BranchRes;
import com.mra.mono.repository.MenuRepository;
import com.mra.mono.service.BranchService;
import com.mra.mono.service.MenuService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/branch")
@Slf4j
public class BranchController extends BaseController {
    private final MenuRepository menuRepository;

    public BranchController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @Resource
    private BranchService branchService;
    @Resource
    private MenuService menuService;

    @PostMapping
    public ResponseEntity<Message<Branch>> createBranch(@RequestBody BranchAddReq branchAddReq) {

        try {
            Branch savedBranch = branchService.save(branchAddReq);
            return buildSuccessReturnEntity(savedBranch);
        } catch (HandledException e) {
            log.error("Error while creating branch", e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }




    @GetMapping("/{id}")
    public ResponseEntity<Message<BranchRes>> getBranch(@PathVariable UUID id) {
        try {
            Branch branch = branchService.findById(id).orElseThrow(() -> {
                log.error("Branch not found with ID: {}", id);
                return new HandledException(400,"Şube bulunamadı: " + id);
            });

            BranchRes branchRes = new BranchRes();
            BeanUtils.copyProperties(branch, branchRes);

            UUID menuId = branch.getMenuId();
            if (menuId != null) {
                Optional<Menu> menuOptional = menuRepository.findById(menuId);
                if (menuOptional.isPresent()) {
                    Menu menu = menuOptional.get();
                    branchRes.setMenuName(menu.getMenuName());
                    branchRes.setMenuColor(menu.getColor());
                } else {
                    log.error("Menu not found for branch with ID: {}", id);
                    // Set default or null values for menu-related fields
                    branchRes.setMenuName(null);
                    branchRes.setMenuColor(null);
                }
            } else {
                log.error("Menu ID is null for branch with ID: {}", id);
                // Set default or null values for menu-related fields
                branchRes.setMenuName(null);
                branchRes.setMenuColor(null);
            }

            return buildSuccessReturnEntity(branchRes);
        } catch  (HandledException e) {
            log.error("Error while fetching branch", e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }


    @GetMapping
    public ResponseEntity<Message<List<Branch>>> getAllBranches(@RequestParam Optional<UUID> companyId) {
        try {
            List<Branch> branches = branchService.findAll(companyId);
            if (branches.isEmpty()) {
                return buildReturnEntity("Şubeler bulunamadı", 301);
            }
            return buildSuccessReturnEntity(branches);
        } catch (HandledException e) {
            log.error("Error while fetching branches", e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Branch>> updateBranch(@PathVariable UUID id, @RequestBody BranchUpdateReq branchUpdateReq) {
        try {
            if (!branchService.existsById(id)) {
                log.warn("Branch not found with id: {}", id);
                return buildFailureReturnEntity("Şube bulunamadı " + id);
            }
            Branch updatedBranch = branchService.update(id, branchUpdateReq);
            return buildSuccessReturnEntity(updatedBranch);
        } catch (HandledException e) {
            log.error("Error while updating branch", e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteBranch(@PathVariable UUID id) {
        try {
            if (!branchService.existsById(id)) {
                log.warn("Branch not found with id: {}", id);
                return buildFailureReturnEntity("Şube bulunamadı: " + id);
            }
            branchService.deleteById(id);
            return buildSuccessReturnEntity(SUCCESS);
        } catch (HandledException e) {
            log.error("Error while deleting branch", e);
            return buildReturnEntity(e.getMessage(),e.getCode());
        }
    }
}

