import { Component, inject } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { Product, ProductCreate } from "../../../shared/interfaces/Product";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ProductsService } from "../../../services/products/products.service";
import { IsLoadingService } from "../../../services/is-loading/is-loading.service";
import { finalize } from "rxjs";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent {
  public isLoadingService = inject(IsLoadingService);

  msgError: string | null = null;
  products: Product[] = [];
  isModalOpen = false;
  isSubmitting = false;
  editingProduct: Product | null = null;

  productFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    days_less_equal_operating_hour: new FormControl(0, Validators.required),
    days_greater_operating_hour: new FormControl(0, Validators.required),
    days_less_equal_operating_hour_reinvestment: new FormControl(
      0,
      Validators.required
    ),
    days_greater_operating_hour_reinvestment: new FormControl(
      0,
      Validators.required
    ),
    operating_hour: new FormControl('', Validators.required),
  });

  constructor(private productsService: ProductsService) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProductos().subscribe((products) => {
      this.products = products;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.editingProduct = null;
    this.productFormGroup.reset();
    this.productFormGroup.controls.operating_hour.setValue("10:00:00");
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingProduct = null;
    this.productFormGroup.reset();
  }

  saveProduct(): void {
    this.msgError = null;
    if (this.productFormGroup.invalid) return;

    const formValue = this.productFormGroup.value as Partial<ProductCreate>;

    const payload: ProductCreate = {
      name: formValue.name || "",
      days_less_equal_operating_hour:
        formValue.days_less_equal_operating_hour || 0,
      days_greater_operating_hour: formValue.days_greater_operating_hour || 0,
      days_less_equal_operating_hour_reinvestment:
        formValue.days_less_equal_operating_hour_reinvestment || 0,
      days_greater_operating_hour_reinvestment:
        formValue.days_greater_operating_hour_reinvestment || 0,
      operating_hour: formValue.operating_hour || "",
    };

    this.isSubmitting = true;

    const request$ = this.editingProduct
      ? this.productsService.updateProducto(this.editingProduct.id, payload)
      : this.productsService.createProducto(payload);

    request$.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
      },
      error: (err) => {
        if (err?.status == 400) {
          const {
            error: { detail },
          } = err;
          if (typeof detail == "string") {
            this.msgError = detail;
          }
        }
        if (err?.status == 422) {
          const {
            error: { detail },
          } = err;
          if (Array.isArray(detail)) {
            this.msgError = detail
              .map((errItem) => `${errItem?.loc[1]}: ${errItem?.msg}`)
              .join(", ");
          }
        }
        console.error("Error saving product:", err);
      },
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productFormGroup.patchValue({
      name: product.name,
      days_less_equal_operating_hour: product.days_less_equal_operating_hour,
      days_greater_operating_hour: product.days_greater_operating_hour,
      days_less_equal_operating_hour_reinvestment:
        product.days_less_equal_operating_hour_reinvestment,
      days_greater_operating_hour_reinvestment:
        product.days_greater_operating_hour_reinvestment,
      operating_hour: product.operating_hour,
    });
    this.isModalOpen = true;
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProducto(id).subscribe(() => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }
}
