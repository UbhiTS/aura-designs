import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - fetch testimonials (approved only for public, all for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    
    // Check if admin is requesting all testimonials
    if (all) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(testimonials);
    }
    
    // Public: only approved testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST - create a new testimonial (public)
export async function POST(request: Request) {
  try {
    const { name, message, rating } = await request.json();
    
    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
    }
    
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        message,
        rating: rating || 5,
        approved: false, // Requires admin approval
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your testimonial! It will be reviewed and published soon.',
      testimonial 
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to submit testimonial' }, { status: 500 });
  }
}
