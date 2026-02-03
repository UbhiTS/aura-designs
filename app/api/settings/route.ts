import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Default settings
const defaultSettings = {
  heroImage1: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
  heroImage2: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800',
  heroImage3: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400',
  aboutImage: '',
  instagramHandle: '',
  facebookHandle: '',
  pinterestHandle: '',
};

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'site-settings',
          ...defaultSettings,
        },
      });
    }

    return NextResponse.json({
      ...settings,
      heroImage1: settings.heroImage1 || defaultSettings.heroImage1,
      heroImage2: settings.heroImage2 || defaultSettings.heroImage2,
      heroImage3: settings.heroImage3 || defaultSettings.heroImage3,
      aboutImage: settings.aboutImage || '',
      instagramHandle: settings.instagramHandle || '',
      facebookHandle: settings.facebookHandle || '',
      pinterestHandle: settings.pinterestHandle || '',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'site-settings' },
      update: {
        heroImage1: data.heroImage1,
        heroImage2: data.heroImage2,
        heroImage3: data.heroImage3,
        aboutImage: data.aboutImage,
        instagramHandle: data.instagramHandle,
        facebookHandle: data.facebookHandle,
        pinterestHandle: data.pinterestHandle,
      },
      create: {
        id: 'site-settings',
        heroImage1: data.heroImage1,
        heroImage2: data.heroImage2,
        heroImage3: data.heroImage3,
        aboutImage: data.aboutImage,
        instagramHandle: data.instagramHandle,
        facebookHandle: data.facebookHandle,
        pinterestHandle: data.pinterestHandle,
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
