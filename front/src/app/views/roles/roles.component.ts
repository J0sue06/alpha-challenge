import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RolesService } from '../../services/roles/roles.service';
import { Role, RoleCreate } from '../../shared/interfaces/Role';
import { finalize } from 'rxjs';
import { IsLoadingService } from '../../services/is-loading/is-loading.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  private rolesService = inject(RolesService);
  public isLoadingService = inject(IsLoadingService);

  msgError: string | null = null;
  roles: Role[] = [];
  isModalOpen = false;
  isSubmitting = false;
  editingRole: Role | null = null;

  roleFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor() {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al cargar los roles:', err);
      },
    });
  }

  saveRole(): void {
    if (this.roleFormGroup.invalid) return;

    const formValue = this.roleFormGroup.value as Partial<RoleCreate>;
    const payload: RoleCreate = {
      name: formValue.name || '',
      description: formValue.description || null,
    };

    this.isSubmitting = true;
    const request$ = this.editingRole
      ? this.rolesService.updateRole(this.editingRole.id, payload)
      : this.rolesService.createRole(payload);

    request$
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (savedRole) => {
          if (this.editingRole) {
            const index = this.roles.findIndex((r) => r.id === savedRole.id);
            if (index >= 0) this.roles[index] = savedRole;
          } else {
            this.roles.push(savedRole);
          }
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
              this.msgError = detail.map((errItem) => `${errItem?.loc[1]}: ${errItem?.msg}`).join(", ");
            }
          }
          console.error("Error saving rol:", err);
        },
      });
  }

  deleteRole(id: number): void {
    this.rolesService.deleteRole(id).subscribe({
      next: () => {
        this.roles = this.roles.filter((role) => role.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar el rol:', err);
      },
    });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.editingRole = null;
    this.roleFormGroup.reset();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingRole = null;
    this.roleFormGroup.reset();
  }

  editRole(role: Role): void {
    this.editingRole = role;
    this.roleFormGroup.patchValue({
      name: role.name,
      description: role.description,
    });
    this.isModalOpen = true;
  }
}
