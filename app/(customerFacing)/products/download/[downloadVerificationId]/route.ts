import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { notFound } from "next/navigation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerificationId: string }> },
) {
  const { downloadVerificationId } = await params;
  const data = await prisma.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url),
    );
  }

  const { size } = await fs.stat(data.product.filePath);
  const file = await fs.readFile(data.product.filePath);
  const safeName = data.product.name.replace(/[^a-z0-9]/gi, "_");
  const extension = data.product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${safeName}.${extension}"`,
      "Content-Length": size.toString(),
      "Content-Type": "application/octet-stream",
    },
  });
}
