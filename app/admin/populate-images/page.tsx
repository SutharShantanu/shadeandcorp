"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PopulateImagesPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePopulate = async (category?: string, limit: number = 5) => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/populate-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, limit }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Populate Product Images</h1>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This will fetch images from Unsplash and upload to Vercel Blob.
                    Start with a small batch (5 products) to test. Unsplash free tier allows 50 requests/hour.
                </p>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                    <Button
                        onClick={() => handlePopulate(undefined, 5)}
                        disabled={loading}
                    >
                        Test: 5 Products (All Categories)
                    </Button>
                    <Button
                        onClick={() => handlePopulate("men", 5)}
                        disabled={loading}
                        variant="outline"
                    >
                        Test: 5 Men's Products
                    </Button>
                    <Button
                        onClick={() => handlePopulate("women", 5)}
                        disabled={loading}
                        variant="outline"
                    >
                        Test: 5 Women's Products
                    </Button>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => handlePopulate(undefined, 50)}
                        disabled={loading}
                        variant="destructive"
                    >
                        Populate 50 Products
                    </Button>
                    <Button
                        onClick={() => handlePopulate(undefined, 250)}
                        disabled={loading}
                        variant="destructive"
                    >
                        Populate All Products (250)
                    </Button>
                </div>
            </div>

            {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="text-blue-800">Processing... This may take several minutes.</p>
                    </div>
                </div>
            )}

            {result && (
                <div className={`rounded-lg p-6 ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <h2 className="text-xl font-semibold mb-4">
                        {result.success ? "✓ Success" : "✗ Error"}
                    </h2>

                    {result.message && <p className="mb-4">{result.message}</p>}

                    {result.results && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Badge>Processed: {result.results.processed}</Badge>
                                <Badge color="success">Success: {result.results.success}</Badge>
                                <Badge color="danger">Failed: {result.results.failed}</Badge>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                <h3 className="font-semibold mb-2">Details:</h3>
                                <div className="space-y-2">
                                    {result.results.details.map((detail: any, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-3 rounded border ${detail.status === "success"
                                                    ? "bg-green-100 border-green-300"
                                                    : detail.status === "skipped"
                                                        ? "bg-gray-100 border-gray-300"
                                                        : "bg-red-100 border-red-300"
                                                }`}
                                        >
                                            <p className="font-medium">{detail.title}</p>
                                            <p className="text-sm">Status: {detail.status}</p>
                                            {detail.assetsCreated && (
                                                <p className="text-sm">Assets created: {detail.assetsCreated}</p>
                                            )}
                                            {detail.reason && (
                                                <p className="text-sm text-gray-600">{detail.reason}</p>
                                            )}
                                            {detail.error && (
                                                <p className="text-sm text-red-600">Error: {detail.error}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {result.error && (
                        <p className="text-red-600">Error: {result.error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
