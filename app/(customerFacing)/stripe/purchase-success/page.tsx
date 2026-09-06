import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import Stripe from "stripe";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const paymentIntent = await stripe.paymentIntents.retrieve(
    params.payment_intent,
  );

  if (paymentIntent.metadata.productId == null) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });
  if (product == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video shrink-0 w-1/3 relative">
          <Image
            className="object-cover"
            src={product.imagePath}
            fill
            alt={product.name}
          />
        </div>

        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
          <Button className="mt-4" size="lg">
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerification(product.id)}`}
              >
                Download Product
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  // download link expires in 24h
  return (
    await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
  ).id;
}
