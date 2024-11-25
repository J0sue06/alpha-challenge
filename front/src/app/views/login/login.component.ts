import { NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { IsLoadingService } from "../../services/is-loading/is-loading.service";
import { LoginService } from "../../services/login/login.service";
import { Login } from "../../shared/interfaces/Login";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  router = inject(Router);
  public isLoadingService = inject(IsLoadingService);
  public loginService = inject(LoginService);
  messageError: string | null = null;

  loginFormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });

  constructor() {
    this.userProfileProcess();
  }

  userProfileProcess() {
    const userInfo = this.loginService.getUserInfo();
    if (userInfo) {
      this.router.navigate(["/dashboard/investments"]);
    }
  }

  onSubmit() {
    this.messageError = null;

    if (this.loginFormGroup.invalid) return;

    const formValue = this.loginFormGroup.value as Partial<Login>;

    const payload: Login = {
      username: formValue.username || "",
      password: formValue.password || "",
    };

    this.loginService.login(payload).subscribe({
      next: (response) => {
        this.loginService.storeToken(response.access_token);
        setTimeout(() => {
          this.router.navigate(["/dashboard/investments"]);
        }, 700);
      },
      error: (e) => {
        if (e?.status == 404) {
          const {
            error: { detail },
          } = e;
          this.messageError = detail;
        }
        console.error("Login failed:", this.messageError);
      },
    });
  }
}
