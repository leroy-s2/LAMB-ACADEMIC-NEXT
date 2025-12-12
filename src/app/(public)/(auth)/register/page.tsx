'use client';

import { RegisterForm } from '@/features/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm
      onSwitch={() => router.push('/log')}
      backgroundUrl="https://i.ytimg.com/vi/P_ajjxDUH-M/maxresdefault.jpg"
    />
  );
}
