import { redirect } from 'next/navigation';

export default function SuperAdminRoute() {
  // Redirigir a dashboard por defecto
  redirect('/super-admin/dashboard');
}

