"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useActionState, useState } from "react";
import { addProduct } from "../../_actions/products";

export function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>();
  const [error, action, isPending] = useActionState(addProduct, {});

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required>
          {error.name && (
            <div className="text-destructive">{error.name.join(", ")}</div>
          )}
        </Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input
          type="number"
          id="priceInCents"
          name="priceInCents"
          required
          value={priceInCents}
          onChange={(e) => setPriceInCents(Number(e.target.value))}
        ></Input>
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">
            {error.priceInCents.join(", ")}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required>
          {error.description && (
            <div className="text-destructive">
              {error.description.join(", ")}
            </div>
          )}
        </Textarea>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required>
          {error.file && (
            <div className="text-destructive">{error.file.join(", ")}</div>
          )}
        </Input>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required>
          {error.image && (
            <div className="text-destructive">{error.image.join(", ")}</div>
          )}
        </Input>
      </div>

      <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
    </form>
  );
}
