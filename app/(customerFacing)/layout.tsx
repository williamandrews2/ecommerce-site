import { NavLink, Nav } from "@/components/nav";

export const dynamic = "force-dynamic";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
