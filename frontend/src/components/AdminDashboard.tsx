import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const API_URL = 'http://127.0.0.1:8003';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  department: string;
  tags: string[];
}

interface Escalation {
  query: string;
  department: string;
  timestamp: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'metrics' | 'escalations'>('faq');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', department: 'HR', tags: '' });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [metrics] = useState([
    { department: 'HR', queries: 125 },
    { department: 'Sales', queries: 200 },
    { department: 'Finance', queries: 150 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'faq') {
          const response = await fetch(`${API_URL}/faqs`);
          const data = await response.json();
          setFaqs(data);
        } else if (activeTab === 'escalations') {
          const response = await fetch(`${API_URL}/escalations`);
          const data = await response.json();
          setEscalations(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = newFAQ.tags.split(',').map(tag => tag.trim());
      const response = await fetch(`${API_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newFAQ.question,
          answer: newFAQ.answer,
          department: newFAQ.department,
          tags
        }),
      });
      
      if (response.ok) {
        const newFaq = await response.json();
        setNewFAQ({ question: '', answer: '', department: 'HR', tags: '' });
        setFaqs([...faqs, newFaq]);
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFaqs(faqs.filter(faq => faq.id !== id));
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <nav className="flex space-x-4">
          {['FAQ Management', 'User Metrics', 'Escalated Queries'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(['faq', 'metrics', 'escalations'][index] as any)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium',
                activeTab === ['faq', 'metrics', 'escalations'][index]
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Add New FAQ</h2>
            <form onSubmit={handleAddFAQ} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={e => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Answer</label>
                <textarea
                  value={newFAQ.answer}
                  onChange={e => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={newFAQ.department}
                  onChange={e => setNewFAQ({ ...newFAQ, department: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option>HR</option>
                  <option>Sales</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newFAQ.tags}
                  onChange={e => setNewFAQ({ ...newFAQ, tags: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., vacation, time off, leave"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Existing FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{faq.question}</h3>
                      <p className="text-gray-600 mt-1">{faq.answer}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Metrics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="queries" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'escalations' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Escalated Queries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {escalations.map((escalation, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {escalation.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{escalation.query}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(escalation.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};