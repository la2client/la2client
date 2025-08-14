'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Crown, ExternalLink } from 'lucide-react';
import { Server, RATES, CHRONICLES } from '@/lib/types';
import { saveServer, deleteServer } from '@/lib/storage';
import {useBlobJson} from "@/hooks/useBlobJson";

export default function AdminServersPage() {
    const { data: servers, loading: sLoading, error: sError, mutate, revalidate } = useBlobJson<Server[]>('/servers.json');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
    name: '',
    url: '',
    rate: '',
    chronicle: '',
    openingDate: '',
    isVip: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newServer = await saveServer(formData);
        const current = Array.isArray(servers) ? servers : [];
        await revalidate();
        mutate([...current, newServer]);
      setFormData({
        name: '',
        url: '',
        rate: '',
        chronicle: '',
        openingDate: '',
        isVip: false,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save server:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      try {
        await deleteServer(id);
          const current = Array.isArray(servers) ? servers : [];
          await revalidate();
          mutate(current.filter((server) => server.id !== id));
      } catch (error) {
        console.error('Failed to delete server:', error);
      }
    }
  };

  if (sLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="animate-pulse text-center text-gray-400">Loading...</div>
      </div>
    );
  }

    // if (sError) {
    //     return (
    //         <div className="min-h-screen bg-gray-900 p-8">
    //             <div className="text-center text-red-400">Failed to load servers.</div>
    //         </div>
    //     );
    // }

    return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Servers</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Server</span>
          </button>
        </div>

        {/* Add Server Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Add New Server</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rate
                </label>
                <select
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select Rate</option>
                  {RATES.map((rate) => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Chronicle
                </label>
                <select
                  value={formData.chronicle}
                  onChange={(e) => setFormData({ ...formData, chronicle: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                >
                  <option value="">Select Chronicle</option>
                  {CHRONICLES.map((chronicle) => (
                    <option key={chronicle} value={chronicle}>{chronicle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Opening Date
                </label>
                <input
                  type="date"
                  value={formData.openingDate}
                  onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isVip}
                    onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                    className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-300">VIP Server</span>
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Server
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Servers Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Server
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Chronicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Opening Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    VIP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {(servers ?? []).map((server) => (
                  <tr key={server.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{server.name}</span>
                        <a
                          href={server.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-orange-500"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {server.rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {server.chronicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(server.openingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {server.isVip && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center w-fit">
                          <Crown className="w-3 h-3 mr-1" />
                          VIP
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(server.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(servers ?? []).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No servers found. Add your first server!</p>
          </div>
        )}
      </div>
    </div>
  );
}