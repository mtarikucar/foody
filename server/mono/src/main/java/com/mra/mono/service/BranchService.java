package com.mra.mono.service;

import com.mra.mono.common.exception.HandledException;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.Branch;
import com.mra.mono.dto.entity.Locations;
import com.mra.mono.dto.request.BranchAddReq;
import com.mra.mono.dto.request.BranchUpdateReq;
import com.mra.mono.repository.BranchRepository;
import com.mra.mono.repository.LocationRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class BranchService {
    @Resource
    private BranchRepository branchRepository;

    @Resource
    private LocationRepository locationRepository;

    public Branch save(BranchAddReq branchAddReq) throws HandledException {
        try {
            Locations location =new Locations();
            BeanUtils.copyProperties(branchAddReq, location);
            Locations saveLocation = locationRepository.save(location);

            Branch branch = new Branch();
            BeanUtils.copyProperties(branchAddReq, branch);
            branch.setLocationId(saveLocation.getLocationId());
            log.info("branch: {} ",branch);
            return branchRepository.save(branch);
        } catch (Exception e) {
            log.error("Error saving branch: ", e);
            throw new HandledException(400,"Şube kaydedilirken hata oluştu");
        }
    }

    public Optional<Branch> findById(UUID id) throws HandledException {
        try {
            return branchRepository.findById(id);

        } catch (Exception e) {
            log.error("Error finding branch by id: {}", id, e);
            throw new HandledException(400, "Şube bulma bulunamadı");
        }
    }

    public List<Branch> findAll(Optional<UUID> companyId) throws HandledException {
        try {
            List<Branch> branches = branchRepository.findAllByCompanyId(companyId);

            for (Branch branch : branches) {
                Optional<Locations> locationOpt = locationRepository.findById(branch.getLocationId());
                if (locationOpt.isPresent()) {
                    Locations location = locationOpt.get();
                    String fullAddress = String.format("%s, %s, %s, No: %d, Apt: %d",
                            location.getStreet(),
                            location.getDistrict(),
                            location.getCity(),
                            location.getBuildingNumber(),
                            location.getApartmentNumber());
                    branch.setAddress(fullAddress);
                }
            }

            return branches;
        } catch (Exception e) {
            log.error("Error finding all branches", e);
            throw new HandledException(400,"Şubeler bulunurken hata oluştu");
        }
    }

    public void deleteById(UUID id) throws HandledException {
        try {
            branchRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error deleting branch with id: {}", id, e);
            throw new HandledException(400,"Şube silinirken hata oluştu");
        }
    }

    public Branch update(UUID id, BranchUpdateReq branchUpdateReq) throws HandledException {
        try {
            Branch branch = branchRepository.findById(id).orElseThrow(() -> new HandledException(400,"Şube bulunamadı: " + id));
            if (branchUpdateReq.getBranchName() != null) {
                branch.setBranchName(branchUpdateReq.getBranchName());
            }
            if (branchUpdateReq.getAddress() != null) {
                branch.setAddress(branchUpdateReq.getAddress());
            }
            if (branchUpdateReq.getPhone() != null) {
                branch.setPhone(branchUpdateReq.getPhone());
            }
            if (branchUpdateReq.getMenuId() != null) {
                branch.setMenuId(branchUpdateReq.getMenuId());
            }
            branch.setCreateTime(new Date());

            return branchRepository.save(branch);
        } catch (Exception e) {
            log.error("Error updating branch with id: {}", id, e);
            throw new HandledException(400,"Şube güncellenirken hata oluştu");
        }
    }

    public Branch updateMenuId(UUID branchId, UUID menuId) throws HandledException {
        try {
            Branch branch = branchRepository.findById(branchId).orElseThrow(() -> new HandledException(400,"Branch not found with id: " + branchId));
            branch.setMenuId(menuId);

            return branchRepository.save(branch);
        } catch (Exception e) {
            log.error("Error updating branch with id: {}", branchId, e);
            throw new HandledException(400,"Şube menusu güncellenirken hata oluştu");
        }
    }


    public boolean existsById(UUID id) throws HandledException {
        try {
            return branchRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error checking existence of branch with id: {}", id, e);
            throw new HandledException(400,"Şubenin varlığı kontrol edilirken hata oluştu");
        }
    }


}
