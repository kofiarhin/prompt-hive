import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import toast from "react-hot-toast";
import { Trash2, Users, FileText, Shield, ShieldOff } from "lucide-react";

export default function AdminPage({ initialTab = "content", hideTabs = false }) {
  const [tab, setTab] = useState(initialTab);
  const qc = useQueryClient();

  const contentQuery = useQuery({
    queryKey: ["admin", "content"],
    queryFn: () => adminService.getContent({ limit: 50 }).then((r) => r.data),
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminService.getUsers({ limit: 50 }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteContent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      toast.success("Content deleted");
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminService.updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role updated");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateUserStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Status updated");
    },
  });

  const tabs = [
    { key: "content", label: "Content", icon: FileText },
    { key: "users", label: "Users", icon: Users },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      {!hideTabs && (
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                tab === key
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div>
          {contentQuery.isLoading ? (
            <LoadingSpinner />
          ) : contentQuery.data?.data?.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Visibility</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Owner</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contentQuery.data.data.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.title}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          item.type === "prompt" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${item.visibility === "public" ? "text-green-600" : "text-gray-500"}`}>
                          {item.visibility}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.createdBy?.username || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete this content?")) {
                              deleteMutation.mutate(item._id);
                            }
                          }}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No content" />
          )}
        </div>
      )}

      {tab === "users" && (
        <div>
          {usersQuery.isLoading ? (
            <LoadingSpinner />
          ) : usersQuery.data?.data?.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersQuery.data.data.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{u.username}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${u.status === "active" ? "text-green-600" : "text-red-500"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() =>
                            roleMutation.mutate({ id: u._id, role: u.role === "admin" ? "user" : "admin" })
                          }
                          className="text-amber-500 hover:text-amber-700"
                          title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                        >
                          {u.role === "admin" ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: u._id,
                              status: u.status === "active" ? "suspended" : "active",
                            })
                          }
                          className={`text-sm px-2 py-0.5 rounded ${
                            u.status === "active" ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"
                          }`}
                        >
                          {u.status === "active" ? "Suspend" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No users" />
          )}
        </div>
      )}
    </div>
  );
}
