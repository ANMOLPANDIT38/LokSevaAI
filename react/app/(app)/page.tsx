import { headers } from 'next/headers';
import { MainApp } from '@/components/main-app';
import { AuthProvider } from '@/lib/auth-context';
import { getAppConfig } from '@/lib/utils';

export default async function Page() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return (
    <AuthProvider>
      <MainApp appConfig={appConfig} />
    </AuthProvider>
  );
}
