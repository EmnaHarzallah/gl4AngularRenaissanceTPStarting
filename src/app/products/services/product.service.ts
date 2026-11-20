import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "src/config/api.config";
import { Settings } from "../dto/product-settings.dto";
import { ProductApiResponse } from "../dto/product-api-response.dto";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

   getProducts({ limit, skip }: Settings) {
    const params = new HttpParams().set("limit", limit).set("skip", skip);
    return this.http.get<ProductApiResponse>(API.products, { params });
  }
  
}
