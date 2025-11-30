import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to revalidate pages when Sanity content changes
 * 
 * This endpoint can be called from Sanity webhooks to trigger
 * on-demand revalidation of pages after content updates.
 * 
 * Usage:
 * 1. Set REVALIDATE_SECRET in your environment variables
 * 2. Configure Sanity webhook to POST to: https://yourdomain.com/api/revalidate
 * 3. Include secret in Authorization header or as query param
 * 
 * Example Sanity webhook payload:
 * {
 *   "_type": "mediaItem",
 *   "operation": "update"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get secret from header or query param
    const authHeader = request.headers.get('authorization');
    const secret = request.nextUrl.searchParams.get('secret') || 
                   authHeader?.replace('Bearer ', '');
    
    const expectedSecret = process.env.REVALIDATE_SECRET;
    
    // Validate secret
    if (!expectedSecret) {
      console.error('REVALIDATE_SECRET is not set in environment variables');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 500 }
      );
    }
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // Parse webhook payload
    const body = await request.json().catch(() => ({}));
    const { _type, operation } = body;
    
    // Revalidate based on content type
    const pathsToRevalidate: string[] = [];
    
    switch (_type) {
      case 'hero':
        pathsToRevalidate.push('/');
        break;
      
      case 'mediaItem':
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/portfolio');
        pathsToRevalidate.push('/editorial');
        break;
      
      case 'videoItem':
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/videos');
        break;
      
      case 'testimonial':
        pathsToRevalidate.push('/');
        break;
      
      case 'about':
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/about');
        break;
      
      case 'contact':
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/contact');
        break;
      
      case 'category':
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/portfolio');
        break;
      
      default:
        // If type not specified, revalidate all main pages
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/portfolio');
        pathsToRevalidate.push('/videos');
        pathsToRevalidate.push('/about');
        pathsToRevalidate.push('/contact');
        pathsToRevalidate.push('/editorial');
    }
    
    // Revalidate each path
    for (const path of pathsToRevalidate) {
      revalidatePath(path, 'page');
      console.log(`Revalidated path: ${path}`);
    }
    
    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
      type: _type,
      operation: operation || 'unknown',
    });
    
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: 'Error revalidating', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing (with secret)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path') || '/';
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }
  
  revalidatePath(path, 'page');
  
  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}

