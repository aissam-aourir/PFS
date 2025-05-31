package com.ordex.helpers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDetailsDTO {
    private Long id;
    private String name;
    private String fournisseurName;
    private Long productCount;
}
