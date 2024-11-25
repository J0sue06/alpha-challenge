import { NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { UsersService } from "../../../services/users/users.service";
import { UserProfile } from "../../../shared/interfaces/User";
import { LoginService } from "../../../services/login/login.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
  router = inject(Router);
  userService = inject(UsersService);
  loginService = inject(LoginService);

  userProfile: UserProfile | null = null;
  isProfileMenuOpen = false;
  isMobileMenuOpen = false;
  userName = "John Doe";

  navItems = [
    { label: "Dashboard", route: "/dashboard/investments" },
    { label: "Products", route: "/dashboard/products" },
    { label: "Holidays", route: "/dashboard/holydays" },
    { label: "Users", route: "/dashboard/users" },
    { label: "Roles", route: "/dashboard/roles" },
  ];

  constructor() {
    this.userProfileProcess();
  }

  userProfileProcess() {
    const userInfo = this.loginService.getUserInfo();
    if (!userInfo) {
      this.loadProfile();
    } else {
      this.userProfile = userInfo;
    }
  }

  loadProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.userProfile = response;
        this.loginService.storeUserInfo(response);
      },
      error: (e) => {
        if (e?.status == 401) {
          const {
            error: { detail },
          } = e;
          this.logoutProcess();
        }
        console.error("User Profile failed:", e);
      },
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  getUserInitials(): string {
    return this.userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  }

  logout(): void {
    console.log("Logging out...");
    this.logoutProcess();
  }

  logoutProcess(): void {
    this.loginService.deleteToken();
    this.loginService.deleteUserInfo();
    this.router.navigate(["/login"]);
  }
}
