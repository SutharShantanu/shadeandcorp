import { put } from "@vercel/blob";

export async function uploadImageToBlob({
    imageUrl,
    path,
}: {
    imageUrl: string;
    path: string;
}) {
    try {
        const res = await fetch(imageUrl);
        if (!res.ok) {
            throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
        }

        const buffer = await res.arrayBuffer();

        const blob = await put(path, Buffer.from(buffer), {
            access: "public",
            contentType: "image/webp",
        });

        return blob.url;
    } catch (error) {
        console.error("Error uploading to Vercel Blob:", error);
        // Return the original URL as a fallback if blob upload fails during development
        return imageUrl;
    }
}
