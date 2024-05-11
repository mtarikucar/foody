package com.mra.mono.service;


import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.DiningTable;
import com.mra.mono.dto.request.TableAddReq;
import com.mra.mono.dto.request.TableUpdateReq;
import com.mra.mono.repository.TableRepository;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
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
@NoArgsConstructor
public class    TableService {
    @Resource
    private TableRepository diningTableRepository;

    public DiningTable save(TableAddReq tableAddReq) {
        try {
            DiningTable table = new DiningTable();
            BeanUtils.copyProperties(tableAddReq, table);

            return diningTableRepository.save(table);
        } catch (Exception e) {
            log.error("Error saving dining table: ", e);
            throw e;
        }
    }

    public Optional<DiningTable> findById(UUID tableId) {
        try {
            return diningTableRepository.findById(tableId);
        } catch (Exception e) {
            log.error("Error finding dining table by id: {}", tableId, e);
            throw e;
        }
    }

    public List<DiningTable> findAll(UUID branchId) {
        try {
            return diningTableRepository.findDiningTableByBranchId(branchId);
        } catch (Exception e) {
            log.error("Error finding all dining tables", e);
            throw e;
        }
    }

    public void deleteById(UUID tableId) {
        try {
            diningTableRepository.deleteById(tableId);
        } catch (Exception e) {
            log.error("Error deleting dining table with id: {}", tableId, e);
            throw e;
        }
    }

    public DiningTable update(UUID id, TableUpdateReq tableUpdateReq) {
        try {
            DiningTable table = diningTableRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Dining table not found with id: " + id));
            BeanUtils.copyProperties(tableUpdateReq, table);
            table.setCreateTime(new Date());

            return diningTableRepository.save(table);
        } catch (Exception e) {
            log.error("Error updating dining table with id: {}", id, e);
            throw e;
        }
    }

    public boolean existsById(UUID id) {
        try {
            return diningTableRepository.existsById(id);
        } catch (Exception e) {
            log.error("Error checking existence of dining table with id: {}", id, e);
            throw e;
        }
    }
}
