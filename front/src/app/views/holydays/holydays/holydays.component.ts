import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Holydays, HolydaysCreate } from '../../../shared/interfaces/HolyDays';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HolydaysService } from '../../../services/holydays/holydays.service';
import { IsLoadingService } from '../../../services/is-loading/is-loading.service';

@Component({
  selector: 'app-holydays',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './holydays.component.html',
  styleUrls: ['./holydays.component.scss'],
})
export class HolydaysComponent {
  public isLoadingService = inject(IsLoadingService);

  msgError: string | null = null;
  holydays: Holydays[] = [];
  isModalOpen = false;
  isSubmitting = false;
  editingHolyday: Holydays | null = null;

  holydayFormGroup = new FormGroup({
    day: new FormControl('', Validators.required)
  });

  constructor(private holydaysService: HolydaysService) {
    this.loadHolydays();
  }

  loadHolydays(): void {
    this.holydaysService.getHolydays().subscribe((data) => {
      this.holydays = data;
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.editingHolyday = null;
    this.holydayFormGroup.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingHolyday = null;
    this.holydayFormGroup.reset();
  }

  onSubmit(): void {
    this.msgError = null;
  
    if (this.holydayFormGroup.invalid) return;
  
    const formValue = this.holydayFormGroup.value as Partial<HolydaysCreate>;
  
    const holyday: HolydaysCreate = {
      day: formValue.day ? new Date(formValue.day).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };
  
    this.isSubmitting = true;
  
    const request$ = this.editingHolyday
      ? this.holydaysService.updateHolyday(this.editingHolyday.id, holyday) 
      : this.holydaysService.createHolyday(holyday); 
  
    request$
      .subscribe({
        next: () => {
          this.loadHolydays(); 
          this.closeModal(); 
        },
        error: (err) => {
          if (err?.status === 404) {
            const { error: { detail } } = err;
            this.msgError = detail; 
          }
          console.error('Error saving holiday:', err); 
        }
      });
  }
  

  editHolyday(holyday: Holydays): void {
    this.editingHolyday = holyday;
    this.holydayFormGroup.patchValue({
      day: holyday.day.toString()
    });
    this.isModalOpen = true;
  }

  deleteHolyday(id: number): void {
    this.holydaysService.deleteHolyday(id).subscribe(() => {
      this.loadHolydays();
    });
  }
}
