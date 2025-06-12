package com.ordex.helpers;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
class CategoryRequest {
    private String name;
    private String supplierId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }
}