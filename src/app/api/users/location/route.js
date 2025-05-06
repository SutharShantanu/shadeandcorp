import { IPSTACK_API_KEY, IPSTACK_API_URL } from "@/constant/apiConstants";
import { NextResponse } from "next/server";

async function getPublicIP() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    if (response.ok) {
      const data = await response.json();
      return data.ip;
    }
    return "check";
  } catch (error) {
    console.error("Error fetching public IP:", error);
    return "check";
  }
}

export async function GET(request) {
  const ipAddress =
    request.headers.get("x-forwarded-for") || request.ip || "check";
  // const ipAddress =
  //   (await getPublicIP()) ||
  //   request.headers.get("x-forwarded-for") ||
  //   request.ip ||
  //   "check";
  const apiKey = IPSTACK_API_KEY;
  const apiUrl = IPSTACK_API_URL;
  const ipStackUrl = `${apiUrl}${ipAddress}?access_key=${apiKey}`;

  try {
    const response = await fetch(ipStackUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch location data (status: ${response.status})` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching location from API route:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching location" },
      { status: 500 }
    );
  }
}
