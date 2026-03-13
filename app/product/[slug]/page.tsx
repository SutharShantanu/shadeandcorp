import type { Metadata } from "next";
import ProductClient from "./ProductClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const formattedSlug = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedSlug} - Shade & Co`,
    description: `Shop ${formattedSlug} at Shade & Co. Quality products and excellent customer service.`,
    openGraph: {
      title: `${formattedSlug} - Shade & Co`,
      description: `Shop ${formattedSlug} at Shade & Co. Quality products and excellent customer service.`,
    },
  };
}

export default async function ProductPage() {
  return <ProductClient />;
}
