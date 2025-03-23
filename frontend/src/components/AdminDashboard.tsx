import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

// Keep both API URLs
const FASTAPI_URL = 'http://127.0.0.1:8003';
const EXPRESS_URL = 'http://localhost:5000';

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

interface Metric {
  department: string;
  queries: number;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'metrics' | 'escalations'>('faq');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', department: 'HR', tags: '' });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'faq') {
          const response = await fetch(`${EXPRESS_URL}/api/faqs`);
          const data = await response.json();
          setFaqs(data);
        } else if (activeTab === 'metrics') {
          setIsLoadingMetrics(true);
          const response = await fetch(`${EXPRESS_URL}/api/metrics/department-metrics`);
          if (response.ok) {
            const data = await response.json();
            setMetrics(data);
          }
          setIsLoadingMetrics(false);
        } else if (activeTab === 'escalations') {
          const response = await fetch(`${FASTAPI_URL}/escalations`);
          const data = await response.json();
          setEscalations(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (activeTab === 'metrics') {
          setIsLoadingMetrics(false);
        }
      }
    };
    
    fetchData();
  }, [activeTab]);

  const handleAddFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = newFAQ.tags.split(',').map(tag => tag.trim());
      const response = await fetch(`${EXPRESS_URL}/api/faqs`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
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
      const response = await fetch(`${FASTAPI_URL}/faqs/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFaqs(faqs.filter(faq => faq.id !== id));
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleFilterByDepartment = async (department: string) => {
    try {
      const response = await fetch(`${EXPRESS_URL}/api/faqs/department/${department}`);
      if (response.ok) {
        const filteredFaqs = await response.json();
        setFaqs(filteredFaqs);
      }
    } catch (error) {
      console.error('Error filtering FAQs:', error);
    }
  };

  const handleResetFilters = async () => {
    try {
      const response = await fetch(`${EXPRESS_URL}/api/faqs`);
      if (response.ok) {
        const allFaqs = await response.json();
        setFaqs(allFaqs);
      }
    } catch (error) {
      console.error('Error resetting filters:', error);
    }
  };

  const refreshMetrics = async () => {
    try {
      setIsLoadingMetrics(true);
      const response = await fetch(`${EXPRESS_URL}/api/metrics/department-metrics`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
      setIsLoadingMetrics(false);
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'metrics') {
      refreshMetrics();
    }
  }, [faqs, activeTab]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-card rounded-lg shadow-chat-lg overflow-hidden">
        <div className="flex flex-wrap sm:flex-nowrap border-b border-border">
          <button
            className={clsx(
              "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-1 text-center transition-colors",
              activeTab === "faq"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            )}
            onClick={() => setActiveTab("faq")}
          >
            FAQ Management
          </button>
          <button
            className={clsx(
              "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-1 text-center transition-colors",
              activeTab === "metrics"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            )}
            onClick={() => setActiveTab("metrics")}
          >
            Usage Metrics
          </button>
          <button
            className={clsx(
              "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium flex-1 text-center transition-colors",
              activeTab === "escalations"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted"
            )}
            onClick={() => setActiveTab("escalations")}
          >
            Escalations
          </button>
        </div>

        {/* FAQ Management */}
        {activeTab === 'faq' && (
          <div className="p-3 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
              FAQ Management
            </h2>

            {/* Add FAQ Form */}
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-muted rounded-lg animate-slide-up">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-foreground">
                Add New FAQ
              </h3>
              <form onSubmit={handleAddFAQ} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newFAQ.question}
                      onChange={(e) =>
                        setNewFAQ({ ...newFAQ, question: e.target.value })
                      }
                      required
                      className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                      Department
                    </label>
                    <select
                      value={newFAQ.department}
                      onChange={(e) =>
                        setNewFAQ({ ...newFAQ, department: e.target.value })
                      }
                      className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                      <option value="IT">IT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Answer
                  </label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) =>
                      setNewFAQ({ ...newFAQ, answer: e.target.value })
                    }
                    required
                    rows={3}
                    className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary text-sm"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newFAQ.tags}
                    onChange={(e) =>
                      setNewFAQ({ ...newFAQ, tags: e.target.value })
                    }
                    className="w-full p-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary text-sm"
                    placeholder="e.g. policy, benefits, vacation"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Add FAQ
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Filter Controls */}
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 animate-fade-in">
              <button
                onClick={() => handleResetFilters()}
                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-secondary/80 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => handleFilterByDepartment("HR")}
                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-secondary/80 transition-colors"
              >
                HR
              </button>
              <button
                onClick={() => handleFilterByDepartment("Finance")}
                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-secondary/80 transition-colors"
              >
                Finance
              </button>
              <button
                onClick={() => handleFilterByDepartment("Sales")}
                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-secondary/80 transition-colors"
              >
                Sales
              </button>
              <button
                onClick={() => handleFilterByDepartment("IT")}
                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-secondary/80 transition-colors"
              >
                IT
              </button>
            </div>

            {/* FAQs List */}
            <div className="space-y-3 sm:space-y-4">
              {faqs.length === 0 ? (
                <div className="text-center p-4 sm:p-8 bg-muted rounded-lg text-muted-foreground text-sm">
                  No FAQs found. Add one using the form above.
                </div>
              ) : (
                faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-3 sm:p-4 bg-card border border-border rounded-lg shadow-chat-sm hover:shadow-chat-md transition-shadow animate-scale-in"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-foreground text-sm sm:text-base">
                        {faq.question}
                      </h4>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
                      {faq.answer}
                    </p>
                    <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {faq.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary text-[10px] sm:text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground rounded-full">
                        {faq.department}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Metrics */}
        {activeTab === 'metrics' && (
          <div className="p-3 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Usage Metrics
              </h2>
              <button
                onClick={refreshMetrics}
                disabled={isLoadingMetrics}
                className={clsx(
                  "px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm flex items-center",
                  isLoadingMetrics
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <RefreshCw
                  className={clsx(
                    "w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2",
                    isLoadingMetrics && "animate-spin"
                  )}
                />
                {isLoadingMetrics ? "Refreshing..." : "Refresh Metrics"}
              </button>
            </div>

            {metrics.length === 0 ? (
              <div className="bg-muted rounded-lg p-8 text-center animate-fade-in">
                <p className="text-muted-foreground">No metrics data available</p>
              </div>
            ) : (
              <>
                <div className="bg-card border border-border rounded-lg p-2 sm:p-4 h-64 sm:h-96 mb-4 sm:mb-6 animate-fade-in">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={metrics}
                      margin={{ top: 20, right: 10, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="department"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        label={{
                          value: "Queries",
                          angle: -90,
                          position: "insideLeft",
                          fill: "hsl(var(--foreground))",
                          fontSize: 12,
                          dx: -10,
                        }}
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                        axisLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--foreground))",
                          fontSize: 12,
                        }}
                        formatter={(value) => [`${value} queries`, "Usage"]}
                      />
                      <Bar dataKey="queries" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  {metrics.map((item, index) => (
                    <div
                      key={index}
                      className="bg-card p-3 sm:p-4 rounded-lg border border-border shadow-chat-sm animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-muted-foreground mb-1 text-xs sm:text-sm">
                        {item.department} Department
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-foreground">
                        {item.queries}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          queries
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Escalations */}
        {activeTab === 'escalations' && (
          <div className="p-3 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-foreground">
              Escalated Queries
            </h2>

            <div className="overflow-x-auto rounded-lg border border-border animate-fade-in table-responsive">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Query
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {escalations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-muted-foreground"
                      >
                        No escalations found
                      </td>
                    </tr>
                  ) : (
                    escalations.map((esc, index) => (
                      <tr
                        key={index}
                        className="hover:bg-muted/50 transition-colors animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-foreground">
                          {esc.query}
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-foreground">
                          {esc.department}
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-foreground">
                          {new Date(esc.timestamp).toLocaleDateString()}{" "}
                          {new Date(esc.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full bg-destructive/10 text-destructive">
                            Needs Attention
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};