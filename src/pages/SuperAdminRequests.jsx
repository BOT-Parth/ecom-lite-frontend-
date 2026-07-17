/**
 * Layer:
 * Page
 *
 * Purpose:
 * Renders the Platform Admin panel directory listing all pending and processed store requests.
 * Allows SUPER_ADMIN users to approve or reject requests.
 *
 * Used By:
 * - App.jsx (routes mapping)
 *
 * Uses:
 * - api.js (Axios client)
 * - useToast() (success/error toast messages)
 * - API_ENDPOINTS (constants)
 *
 * Backend APIs:
 * - GET /store-requests (fetches requests list)
 * - PATCH /store-requests/:requestId/approve (approves store request)
 * - PATCH /store-requests/:requestId/reject (rejects store request)
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API_ENDPOINTS } from "../constants/api";
import { useToast } from "../hooks/useToast";

const SuperAdminRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.STORE_REQUESTS.LIST);
      setRequests(res.data?.requests || []);
      setForbidden(false);
    } catch (err) {
      if (err.status === 403) {
        setForbidden(true);
      } else {
        setError(err.message || "Failed to fetch store requests");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(API_ENDPOINTS.STORE_REQUESTS.LIST);
        if (!cancelled) {
          setRequests(res.data?.requests || []);
          setForbidden(false);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 403) {
            setForbidden(true);
          } else {
            setError(err.message || "Failed to fetch store requests");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
    try {
      await api.patch(API_ENDPOINTS.STORE_REQUESTS.APPROVE(id));
      showToast(
        "Store request approved successfully. Store created.",
        "success",
      );
      await fetchRequests();
    } catch (err) {
      showToast(err.message || "Failed to approve store request", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
    try {
      await api.patch(API_ENDPOINTS.STORE_REQUESTS.REJECT(id));
      showToast("Store request rejected.", "warning");
      await fetchRequests();
    } catch (err) {
      showToast(err.message || "Failed to reject store request", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-brand-muted">Loading store requests...</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-brand-border shadow-2xl text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-950/50 text-rose-400 border border-rose-800/30 mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-brand-text tracking-tight">
            Access Forbidden
          </h2>
          <p className="text-brand-muted mt-2 text-xs leading-relaxed">
            You do not have administrative permissions (`APPROVE_STORE`) to
            access this page. Administrative actions are restricted to super
            administrators.
          </p>
          <div className="mt-6">
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-xl text-brand-text bg-white hover:bg-brand-secondary transition-smooth"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-brand-text tracking-tight">
          Platform Store Approvals
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Review pending merchant requests and approve or reject them
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/30 text-rose-200 text-sm">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-brand-border p-8">
          <svg
            className="mx-auto h-12 w-12 text-brand-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h3 className="mt-4 text-sm font-semibold text-brand-text">
            No requests queue
          </h3>
          <p className="mt-2 text-xs text-brand-muted max-w-sm mx-auto">
            There are currently no store requests registered on the platform.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl border border-brand-border overflow-hidden shadow-xl">
          <table className="min-w-full divide-y divide-brand-border text-left text-xs">
            <thead className="bg-white/50 text-brand-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Store Details</th>
                <th className="px-6 py-4">Requester ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-muted font-medium">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-white/20 transition-smooth"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-brand-text">
                      {req.name}
                    </div>
                    <div className="text-[10px] text-brand-muted font-mono">
                      /{req.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-brand-muted font-mono text-[10px]">
                    {req.userId}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.status === "PENDING"
                          ? "bg-amber-950/80 text-amber-400 border border-amber-800/30"
                          : req.status === "APPROVED"
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/30"
                            : req.status === "NEEDS_CHANGES"
                              ? "bg-blue-950/80 text-blue-400 border border-blue-800/30"
                              : "bg-rose-950/80 text-rose-400 border border-rose-800/30"
                      }`}
                    >
                      {req.status === "NEEDS_CHANGES"
                        ? "NEEDS CHANGES"
                        : req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {req.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actionLoading[req.id]}
                          onClick={() => handleReject(req.id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-800/30 bg-rose-950/20 hover:bg-rose-950/50 text-rose-400 disabled:opacity-50 transition-smooth cursor-pointer text-xxs font-bold uppercase tracking-wider"
                        >
                          {actionLoading[req.id] === "reject"
                            ? "Rejecting..."
                            : "Reject"}
                        </button>
                        <button
                          disabled={actionLoading[req.id]}
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 rounded-lg border border-emerald-800/30 bg-emerald-950/20 hover:bg-emerald-950/50 text-emerald-400 disabled:opacity-50 transition-smooth cursor-pointer text-xxs font-bold uppercase tracking-wider"
                        >
                          {actionLoading[req.id] === "approve"
                            ? "Approving..."
                            : "Approve"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-brand-muted uppercase">
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRequests;
