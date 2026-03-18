"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Trash2, 
  Edit, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  RefreshCw,
  AlertTriangle,
  X
} from "lucide-react";
import { getWaitlistUsers, deleteWaitlistUsers, refreshWaitlist } from "@/app/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface User {
  id: string;
  email: string;
  source: string | null;
  joinedAt: Date | string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{ show: boolean, ids: string[] }>({ show: false, ids: [] });
  const itemsPerPage = 15;

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshWaitlist();
    await fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getWaitlistUsers();
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.source || "Direct").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  // Ensure current page is valid after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredUsers, totalPages, currentPage]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (showDeleteModal.ids.length === 0) return;
    
    setIsDeleting(true);
    const res = await deleteWaitlistUsers(showDeleteModal.ids);
    if (res.success) {
      setUsers(prev => prev.filter(u => !showDeleteModal.ids.includes(u.id)));
      setSelectedIds(prev => prev.filter(id => !showDeleteModal.ids.includes(id)));
      setShowDeleteModal({ show: false, ids: [] });
    } else {
      alert("Failed to delete users.");
    }
    setIsDeleting(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Whop Waitlist Users", 14, 15);
    
    const tableData = filteredUsers.map(user => [
      user.email,
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(new Date(user.joinedAt)),
      user.source || "Direct"
    ]);

    autoTable(doc, {
      head: [["Email", "Time Joined", "Source"]],
      body: tableData,
      startY: 20,
    });

    doc.save("whop-waitlist.pdf");
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen dark:bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold special-font mb-2">Waitlist Users</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage early access signups and track recruitment sources.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setShowDeleteModal({ show: true, ids: selectedIds })}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all animate-in fade-in slide-in-from-right-2"
            >
              <Trash2 size={16} />
              Delete Selected ({selectedIds.length})
            </button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-full w-full md:w-64 outline-none focus:ring focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>

          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white dark:text-zinc-100 hover:bg-blue-700 dark:hover:bg-zinc-200 rounded-lg text-xs font-medium transition-all"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </header>

      <section className="bg-white dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-100 dark:border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/10">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Total Signups: <span className="text-zinc-900 dark:text-white ml-1">{users.length}</span>
          </p>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 transition-all active:scale-95 disabled:opacity-50"
            title="Reload Data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Reload
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-700 dark:text-zinc-400 text-sm font-thin border-b border-zinc-200 dark:border-zinc-800/60">
                <th className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                    className="w-3 h-3 rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-blue-600 focus:ring-blue-500/50"
                  />
                </th>
                <th className="p-4">User</th>
                <th className="p-4">Time Joined</th>
                <th className="p-4">Source</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-zinc-200 dark:border-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${selectedIds.includes(user.id) ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleSelectOne(user.id)}
                      className="w-3 h-3 rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-blue-600 focus:ring-blue-500/50"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{user.email.split("@")[0]}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-500">Waitlist Registered</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400 text-xs">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false
                    }).format(new Date(user.joinedAt)).replace(',', ' ·')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.source ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {user.source || "Direct"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setShowDeleteModal({ show: true, ids: [user.id] })}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 dark:text-zinc-400 italic">
                    {searchQuery ? "No users found matching your search." : "No users have joined the waitlist yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-medium text-zinc-900 dark:text-white">
              {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span> to <span className="font-medium text-zinc-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span> of <span className="font-medium text-zinc-900 dark:text-white">{filteredUsers.length}</span> entries
          </p>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium text-xs flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === p 
                    ? 'bg-blue-600 text-white' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 disabled:opacity-50 hover:bg-white dark:hover:bg-zinc-800 transition-all font-medium text-xs flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Custom Delete Modal */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-lg">
                <AlertTriangle size={26} />
              </div>
              <button 
                onClick={() => setShowDeleteModal({ show: false, ids: [] })}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-xl font-semibold mb-2 text-center">Are you sure?</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 text-center">
              This action will permanently remove {showDeleteModal.ids.length} user(s) from the database. This cannot be undone.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-zinc-100 rounded-lg font-medium transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {isDeleting ? "Removing..." : "Permanently Remove"}
              </button>
              <button
                onClick={() => setShowDeleteModal({ show: false, ids: [] })}
                disabled={isDeleting}
                className="w-full py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-medium transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;