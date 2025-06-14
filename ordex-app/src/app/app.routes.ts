import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MdpOublieComponent } from './pages/mdpoublie/mdp-oublie.component';
import { HomeComponent } from './pages/home/home.component';
import { MainComponent } from './pages/home/main/main.component';
import { ProductsPageComponent } from './pages/home/products-page/products-page.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';
import { VerifyRegisterComponent } from './pages/verify-register/verify-register.component';
import { SupplierPanelComponent } from './pages/supplier-panel/supplier-panel.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CreatorsComponent } from './components/creators/creators.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientsComponent } from './components/clients/clients.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticatedSupplierGuard } from './guards/authenticated-supplier.guard';
import { ShoppingCartComponent } from './pages/home/shopping-cart/shopping-cart.component';
import { CheckoutPageComponent } from './pages/checkout/checkout.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardsupplierComponent } from './components/dashboardsupplier/dashboardsupplier.component';

// Home routes
const homeRoutes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'products', component: ProductsPageComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutPageComponent },
  { path: 'my-orders', component: UserOrdersComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'creators', component: CreatorsComponent }
];

// Supplier panel routes
const supplierRoutes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent }
  ,
  { path: 'dashboard', component: DashboardsupplierComponent }
];

// Admin panel routes
const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: AdminProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'suppliers', component: SuppliersComponent }
];

// Main routes
export const routes: Routes = [
  { path: '', redirectTo: '/home/main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mdpoublie', component: MdpOublieComponent },
  { path: 'home', component: HomeComponent, children: homeRoutes },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'verifyregister', component: VerifyRegisterComponent },
  {
    path: 'supplier',
    component: SupplierPanelComponent,
    canActivate: [AuthenticatedSupplierGuard],
    children: supplierRoutes
  },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    children: adminRoutes
  }
];
