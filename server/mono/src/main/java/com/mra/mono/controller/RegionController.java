package com.mra.mono.controller;


import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.DiningTable;
import com.mra.mono.dto.entity.Region;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.RegionAddReq;
import com.mra.mono.dto.request.RegionUpdateReq;
import com.mra.mono.repository.RegionRepository;
import com.mra.mono.repository.TableRepository;
import com.mra.mono.service.TableService;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("region")
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class RegionController extends BaseController {

    @Resource
    private RegionRepository regionRepository;
    @Resource
    private TableRepository tableRepository;
    @Resource
    private TableService tableService;

    @PostMapping
    public ResponseEntity<Message<Region>> createRegion(@RequestBody RegionAddReq regionAddReq) {

        try {
            Region region = new Region();
            BeanUtils.copyProperties(regionAddReq, region);

            Region savedRegion = regionRepository.save(region);

            log.info("Successfully created region with ID: {}", savedRegion.getRegionId());
            if (savedRegion == null) {
                log.error("Failed to create table with request: {}", regionAddReq);
                return buildReturnEntity("Error while creating table", 500);
            }
            return buildSuccessReturnEntity(savedRegion);
        } catch (Exception e) {
            log.error("Error saving region: ", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<Message<List<Region>>> getAllTables(@RequestParam UUID branchId) {

        List<Region> regions = regionRepository.findRegionByBranchId(branchId);
        if (regions.isEmpty()) {
            log.info("No regions found in the system.");
            return buildReturnEntity("No regions found", 200);
        }
        log.info("Successfully fetched {} regions", regions.size());
        return buildSuccessReturnEntity(regions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<Region>> updateTable(@PathVariable UUID id, @RequestBody RegionUpdateReq regionUpdateReq) {

        Region updatedRegion = regionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Region not found with id: " + id));

        if (updatedRegion == null)  {
            log.error("Region not found with ID: {}", id);
            return buildReturnEntity("Region not found with id", 200);
        }
        try {
            BeanUtils.copyProperties(regionUpdateReq, updatedRegion);

            regionRepository.save(updatedRegion);
        } catch (Exception e) {
            log.error("Error updating dining table with id: {}", id, e);
            throw e;
        }
        log.info("Successfully updated table with ID: {}", id);
        return buildSuccessReturnEntity(updatedRegion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteTable(@PathVariable UUID id) {
        try {
            if (!regionRepository.findById(id).isPresent()) {
                log.error("region not found with ID: {}", id);
                return buildReturnEntity("region not found with id", 200);
            }
            List<DiningTable> tables = tableRepository.findDiningTableByRegionId(id);
            log.info("tables: {}", tables);
            for (DiningTable table : tables) {
                tableService.deleteById(table.getTableId());
            }
            regionRepository.deleteById(id);
            log.info("Successfully deleted table with ID: {}", id);
        }catch (Exception e){
            log.error("Error deleting table with id: {}", id, e);
        }
        return buildReturnEntity("region successfully deleted", 200);
    }
}
