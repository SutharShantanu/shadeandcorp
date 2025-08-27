"use client";
import { usePathname } from "next/navigation";

/**
 * Custom hook to get the segments of the current pathname.
 *
 * This hook uses the `usePathname` function to retrieve the current pathname,
 * splits it into segments by the "/" character, filters out any empty segments,
 * and decodes each segment using `decodeURIComponent`.
 *
 * @returns {string[]} An array of decoded pathname segments.
 */
export function usePathSegments () {
    const pathname = usePathname();
    const segments = pathname
        ?.split("/")
        .filter(Boolean)
        .map(segment => decodeURIComponent(segment)) || [];
    return segments;
}

export const useRefineUrl = (param = null) => {
    const pathname = usePathname();
    const urlPart = param || pathname.split("/").pop();

    return decodeURIComponent(urlPart);
};
