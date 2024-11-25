import { Routes } from "@angular/router";
import { LoginComponent } from "./views/login/login.component";
import { DashboardComponent } from "./views/dashboard/dashboard/dashboard.component";
import { ProductsComponent } from "./views/products/products/products.component";
import { InvestmentComponent } from "./views/investments/investments/investments.component";
import { HolydaysComponent } from "./views/holydays/holydays/holydays.component";
import { UsersComponent } from "./views/users/users.component";
import { RolesComponent } from "./views/roles/roles.component";
import { AuthGuard } from "./guards/auth/auth.guard";
import { RoleGuard } from "./guards/role/role.guard";

export const routes: Routes = [
  { 
    path: "", 
    redirectTo: "login", 
    pathMatch: "full" 
  },
  {
    path: "login",
    component: LoginComponent,
  },

  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "products",
        component: ProductsComponent,
        data: { roles: ["user", "admin"] },
        canActivate: [RoleGuard],
      },
      {
        path: "investments",
        component: InvestmentComponent,
        data: { roles: ["user", "admin"] },
        canActivate: [RoleGuard],
      },
      {
        path: "holydays",
        component: HolydaysComponent,
        data: { roles: ["admin"] },
        canActivate: [RoleGuard],
      },
      {
        path: "users",
        component: UsersComponent,
        data: { roles: ["admin"] },
        canActivate: [RoleGuard],
      },
      {
        path: "roles",
        component: RolesComponent,
        data: { roles: ["admin"] },
        canActivate: [RoleGuard],
      },
    ],
  },
];
