import React from 'react'
import AdminSidebar from '@/components/Admin/AdminSidebar'
import AdminAuthGuard from '@/components/Admin/AdminAuthGuard'

const AdminLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <AdminAuthGuard>
      <div className='flex'>
          <nav>
              <AdminSidebar />
          </nav>
          <main className='flex-1'>
              {children}
          </main>
      </div>
    </AdminAuthGuard>
  )
}

export default AdminLayout