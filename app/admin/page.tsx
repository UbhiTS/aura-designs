import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import AdminDashboardClient from '@/components/AdminDashboard';
import prisma from '@/lib/prisma';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    return [];
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const products = await getProducts();

  return <AdminDashboardClient initialProducts={products} session={session} />;
}
