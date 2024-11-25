import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { IsLoadingService } from '../../services/is-loading/is-loading.service';
import { UsersService } from '../../services/users/users.service'
import { User, UserCreate } from '../../shared/interfaces/User';
import { RolesService } from '../../services/roles/roles.service';
import { Role } from '../../shared/interfaces/Role';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  public isLoadingService = inject(IsLoadingService);
  private usersService = inject(UsersService); 
  private rolesService = inject(RolesService); 

  users: User[] = [];
  roles: Role[] = [];
  isModalOpen = false;
  isSubmitting = false;
  msgError: string | null = null;
  editingUser: User | null = null;
  editingUserCtrl: boolean = false;

  userFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    newpassword: new FormControl('', Validators.required),
    rol_id: new FormControl(0, Validators.required),
  });
  
  constructor() {
    this.loadUsers();
  }

  setEditingMode(editing: boolean): void {
    this.editingUserCtrl = editing;
    const newpasswordControl = this.userFormGroup.get('newpassword');
    
    if (editing) {
      newpasswordControl?.setValidators(Validators.required);
    } else {
      newpasswordControl?.clearValidators();
    }
    newpasswordControl?.updateValueAndValidity();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      },
    });
  }

  loadUsers(): void {
    this.usersService
      .getUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          console.error('Error loading holydays:', err);
        },
      });
  }

  saveUser(): void {
    this.msgError = null;
    if (this.userFormGroup.invalid) return;
  
    const formValue = this.userFormGroup.value as Partial<UserCreate>;
    
    const payload: UserCreate = {
      name: formValue.name ?? '',
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      rol_id: formValue.rol_id ?? 0,
      newpassword: this.editingUser ? formValue.newpassword ?? '' : null,
    };
  
    this.isSubmitting = true;
    const request$ = this.editingUser
      ? this.usersService.updateUser(this.editingUser.id, payload)
      : this.usersService.createUser(payload);
  
    request$
      .subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          if(err?.status == 404)
          {
            const { error: { detail }} = err;
            this.msgError = detail;
          }
          console.error('Error saving user:', err);
        },
      });
  }
  

  deleteUser(id: number): void {
    this.usersService
      .deleteUser(id) 
      .subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
        },
        error: (err) => {
          console.error('Error deleting holyday:', err);
        },
      });
  }

  openModal(): void {
    this.setEditingMode(!!this.editingUserCtrl);
    this.isModalOpen = true;
    this.editingUser= null;
    this.userFormGroup.reset();
    this.loadRoles();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingUser = null;
    this.userFormGroup.reset();
  }

  editUser(user: User): void {
    this.setEditingMode(!!this.editingUserCtrl);
    this.loadRoles();
    this.editingUser = user;
    this.userFormGroup.patchValue({
      name: user.name,
      email: user.email,
      rol_id: user.rol_id
    });
    this.isModalOpen = true;
  }
}
