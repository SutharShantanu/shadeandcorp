export async function fetchUnsplashImages({
    query,
    perPage = 6,
}: {
    query: string;
    perPage?: number;
}) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
        console.error("UNSPLASH_ACCESS_KEY is not defined in environment variables");
        return [];
    }

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                query
            )}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
                // In Next.js 13+ with App Router, fetch is automatically cached/extended
                // We can use Next.js specific options if needed, but for seeding dynamic is fine
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Unsplash API Error:", errorData);
            return [];
        }

        const data = await res.json();

        return data.results.map((img: any) => ({
            id: img.id,
            urls: {
                thumb: img.urls.thumb,
                small: img.urls.small,
                regular: img.urls.regular,
                full: img.urls.full,
            },
            user: {
                name: img.user.name,
                profileUrl: img.user.links.html,
            },
            alt: img.alt_description || img.description || "Unsplash image",
        }));
    } catch (error) {
        console.error("Failed to fetch from Unsplash:", error);
        return [];
    }
}
