import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

/**
 * API Route: POST /api/location/share
 * 
 * Stores user location and optional contact information in Sanity CMS.
 * This is a public endpoint (no authentication required) but includes
 * rate limiting to prevent spam.
 * 
 * Request Body:
 * {
 *   latitude: number;        // User's latitude (-90 to 90)
 *   longitude: number;       // User's longitude (-180 to 180)
 *   distanceKm: number;      // Distance from Pooja in kilometers
 *   travelTimeMinutes: number; // Travel time in minutes
 *   name?: string;           // Optional: User's name
 *   phone?: string;          // Optional: User's phone number
 * }
 */

// Rate limiting: Store in memory (simple implementation)
// In production, consider using Redis or a proper rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

// Create Sanity write client
function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false, // Write operations should not use CDN
  });
}

// Validate request body
function validateRequestBody(body: any): { valid: boolean; error?: string; data?: any } {
  // Required fields
  if (typeof body.latitude !== "number" || body.latitude < -90 || body.latitude > 90) {
    return { valid: false, error: "Invalid latitude. Must be a number between -90 and 90." };
  }

  if (typeof body.longitude !== "number" || body.longitude < -180 || body.longitude > 180) {
    return { valid: false, error: "Invalid longitude. Must be a number between -180 and 180." };
  }

  if (typeof body.distanceKm !== "number" || body.distanceKm < 0) {
    return { valid: false, error: "Invalid distanceKm. Must be a non-negative number." };
  }

  if (typeof body.travelTimeMinutes !== "number" || body.travelTimeMinutes < 0) {
    return { valid: false, error: "Invalid travelTimeMinutes. Must be a non-negative number." };
  }

  // Optional fields
  const name = body.name ? String(body.name).trim() : undefined;
  const phone = body.phone ? String(body.phone).trim() : undefined;

  // Basic phone validation (optional)
  if (phone && phone.length > 20) {
    return { valid: false, error: "Phone number is too long (max 20 characters)." };
  }

  // Basic name validation (optional)
  if (name && name.length > 100) {
    return { valid: false, error: "Name is too long (max 100 characters)." };
  }

  return {
    valid: true,
    data: {
      _type: "userLocationShare",
      userLatitude: body.latitude,
      userLongitude: body.longitude,
      distanceKm: body.distanceKm,
      travelTimeMinutes: body.travelTimeMinutes,
      userName: name || undefined,
      userPhone: phone || undefined,
      sharedAt: new Date().toISOString(),
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));

    // Validate request body
    const validation = validateRequestBody(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Get Sanity write client
    const client = getSanityWriteClient();

    // Create document in Sanity
    const document = await client.create(validation.data!);

    return NextResponse.json(
      {
        success: true,
        id: document._id,
        message: "Location shared successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error storing location share:", error);

    // Handle Sanity-specific errors
    if (error.message?.includes("SANITY_API_WRITE_TOKEN")) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to store location. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json(
    {
      message: "Location share API endpoint",
      method: "POST",
      requiredFields: ["latitude", "longitude", "distanceKm", "travelTimeMinutes"],
      optionalFields: ["name", "phone"],
    },
    { status: 200 }
  );
}
