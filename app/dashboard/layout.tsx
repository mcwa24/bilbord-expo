import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')

  if (!adminSession) {
    redirect('/prijava')
  }

  return <>{children}</>
}

