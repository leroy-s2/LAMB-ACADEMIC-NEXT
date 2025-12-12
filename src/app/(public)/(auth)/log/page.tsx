'use client';

import { LoginForm } from '@/features/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm
      onSwitch={() => router.push('/register')}
      backgroundUrl="https://i.ytimg.com/vi/P_ajjxDUH-M/maxresdefault.jpg"
    />
  );
}
