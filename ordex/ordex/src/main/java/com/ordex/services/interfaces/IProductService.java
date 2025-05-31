package com.ordex.services.interfaces;

import com.ordex.entities.Product;

import java.util.List;

public interface IProductService extends ICrudBaseService<Product, Long>{
    List<Product> getBySupplierId(Long supplierId);
    List<Product> getValidProducts();
    //retourner la liste des produist apparentenat a une actegory
    List<Product> getByCategoryId(int categoryId);
}
