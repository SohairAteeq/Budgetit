package com.sohair.moneymanager.dto;

import com.sohair.moneymanager.entity.ProfileEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.convert.DataSizeUnit;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    private long id;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String type;
    private String icon;
    private Long profileId;
}
