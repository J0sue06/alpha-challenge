import { Component, inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { NgFor, NgIf, CommonModule } from "@angular/common";
import {
  Investment,
  InvestmentCreate,
} from "../../../shared/interfaces/Investment";
import { finalize } from "rxjs";
import { InvestmentService } from "../../../services/investment/investment.service";
import { IsLoadingService } from "../../../services/is-loading/is-loading.service";
import { ProductsService } from "../../../services/products/products.service";
import { Product } from "../../../shared/interfaces/Product";

@Component({
  selector: "app-investment",
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: "./investments.component.html",
  styleUrls: ["./investments.component.scss"],
})
export class InvestmentComponent {
  private investmentService = inject(InvestmentService);
  public isLoadingService = inject(IsLoadingService);
  public productsService = inject(ProductsService);

  products: Product[] = [];
  investments: Investment[] = [];
  isModalOpen = false;
  isSubmitting = false;

  investmentFormGroup = new FormGroup({
    product_id: new FormControl(0, Validators.required),
    creation_date: new FormControl("", Validators.required),
    term: new FormControl(0, Validators.required),
    reinvestment: new FormControl(false, Validators.required),
  });

  constructor() {
    this.loadInvestments();
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProductos().subscribe(
      (productos) => {
        this.products = productos;
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  loadInvestments(): void {
    this.investmentService.getInvestments().subscribe({
      next: (data) => {
        this.investments = data;
      },
      error: (err) => {
        console.error("Error fetching investments:", err);
      },
    });
  }

  saveInvestment(): void {
    if (this.investmentFormGroup.invalid) return;

    const formValue = this.investmentFormGroup
      .value as Partial<InvestmentCreate>;

    const payload: InvestmentCreate = {
      product_id: formValue.product_id || 0,
      creation_date: formValue.creation_date || "",
      term: formValue.term || 0,
      reinvestment: formValue.reinvestment || false,
    };

    this.isSubmitting = true;
    const request$ = this.investmentService.calculateInvestment(payload);

    request$.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: (response) => {
        this.closeModal();
        this.loadInvestments();
      },
      error: (err) => {
        console.error("Error saving investment:", err);
      },
    });
  }

  deleteInvestment(id: number): void {
    this.investmentService.deleteInvestment(id).subscribe({
      next: () => {
        this.investments = this.investments.filter(
          (investment) => investment.id !== id
        );
      },
      error: (err) => {
        console.error("Error deleting investment:", err);
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.investmentFormGroup.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.investmentFormGroup.reset();
  }
}
