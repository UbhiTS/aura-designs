import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product (protected)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, images, featured, available } = body;

    // Get current product to check if name changed
    const currentProduct = await prisma.product.findUnique({
      where: { id: params.id },
      select: { name: true, slug: true },
    });

    // Generate new slug if name changed
    let slug = currentProduct?.slug;
    if (currentProduct && name !== currentProduct.name) {
      slug = await generateUniqueSlug(name, params.id);
    }

    // Delete existing images and create new ones
    await prisma.image.deleteMany({
      where: { productId: params.id },
    });

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        price: price ? parseFloat(price) : null,
        category,
        featured,
        available,
        images: {
          create: images?.map((img: { url: string; alt?: string }, index: number) => ({
            url: img.url,
            alt: img.alt || name,
            order: index,
          })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product (protected)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
