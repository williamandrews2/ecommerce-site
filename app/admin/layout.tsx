import { NavLink, Nav } from "@/components/nav";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/">Customers</NavLink>
        <NavLink href="/admin/products">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
