package com.mra.mono.controller;

import com.mra.mono.common.controller.BaseController;
import com.mra.mono.common.exception.ResourceNotFoundException;
import com.mra.mono.dto.entity.DiningTable;
import com.mra.mono.dto.entity.message.Message;
import com.mra.mono.dto.request.TableAddReq;
import com.mra.mono.dto.request.TableUpdateReq;
import com.mra.mono.service.TableService;
/*import io.swagger.annotations.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;*/
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("table")
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class TableController extends BaseController {
    @Resource
    private TableService tableService;

    @PostMapping
    public ResponseEntity<Message<DiningTable>> createTable(@RequestBody TableAddReq tableAddReq) {

        DiningTable savedTable = tableService.save(tableAddReq);
        if (savedTable == null) {
            log.error("Failed to create table with request: {}", tableAddReq);
            return buildReturnEntity("Error while creating table", 500);
        }
        log.info("Successfully created table with ID: {}", savedTable.getTableId());
        return buildSuccessReturnEntity(savedTable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message<DiningTable>> getTable(@PathVariable UUID id) {

        DiningTable table = tableService.findById(id)
                .orElseThrow(() -> {
                    log.error("Table not found with ID: {}", id);
                    return new ResourceNotFoundException("Table not found with id: " + id);
                });
        log.info("Successfully fetched table with ID: {}", id);
        return buildSuccessReturnEntity(table);
    }

    @GetMapping
    public ResponseEntity<Message<List<DiningTable>>> getAllTables(@RequestParam UUID branchId) {

        List<DiningTable> tables = tableService.findAll(branchId);
        if(tables.isEmpty()) {
            log.info("No tables found in the system.");
            return buildReturnEntity("No tables found", 200);
        }
        log.info("Successfully fetched {} tables", tables.size());
        return buildSuccessReturnEntity(tables);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message<DiningTable>> updateTable(@PathVariable UUID id, @RequestBody TableUpdateReq tableUpdateReq) {

        if(!tableService.findById(id).isPresent()) {
            log.error("Table not found with ID: {}", id);
            return buildReturnEntity("Table not found with id", 200);
        }
        DiningTable updatedTable = tableService.update(id, tableUpdateReq);
        log.info("Successfully updated table with ID: {}", id);
        return buildSuccessReturnEntity(updatedTable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Message<String>> deleteTable(@PathVariable UUID id) {

        if(!tableService.findById(id).isPresent()) {
            log.error("Table not found with ID: {}", id);
            return buildReturnEntity("Table not found with id", 200);
        }
        tableService.deleteById(id);
        log.info("Successfully deleted table with ID: {}", id);
        return buildReturnEntity("Table successfully deleted", 200);
    }
}

