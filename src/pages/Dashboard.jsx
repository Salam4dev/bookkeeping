import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STORAGE_KEY = 'bk_transactions';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

const formatDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('bk_user') || '{}');
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'income',
    date: new Date().toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Derived totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Filtered list
  const filteredTransactions = transactions
    .filter((t) => filter === 'all' || t.type === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const validateForm = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount) {
      errs.amount = 'Amount is required';
    } else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      errs.amount = 'Enter a valid positive amount';
    }
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      date: form.date,
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({
      description: '',
      amount: '',
      type: 'income',
      date: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getEmailName = (email) => {
    if (!email) return 'there';
    return email.split('@')[0];
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">
              {getGreeting()}, {getEmailName(user.email)} 👋
            </h1>
            <p className="dashboard-subtitle">
              Here&apos;s your financial overview for today
            </p>
          </div>

          {/* Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card balance">
              <div className="summary-icon">💼</div>
              <div className="summary-label">Net Balance</div>
              <div className="summary-value">{formatCurrency(balance)}</div>
            </div>
            <div className="summary-card income">
              <div className="summary-icon">📈</div>
              <div className="summary-label">Total Income</div>
              <div className="summary-value">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="summary-card expense">
              <div className="summary-icon">📉</div>
              <div className="summary-label">Total Expenses</div>
              <div className="summary-value">{formatCurrency(totalExpense)}</div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Add Transaction Form */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">➕ Add Transaction</h2>
              </div>

              <form
                className="transaction-form"
                onSubmit={handleAddTransaction}
                id="add-transaction-form"
              >
                {/* Type Toggle */}
                <div className="form-group">
                  <label className="form-label">Transaction Type</label>
                  <div className="type-toggle">
                    <button
                      type="button"
                      id="type-income-btn"
                      className={`type-btn income ${form.type === 'income' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, type: 'income' })}
                    >
                      📈 Income
                    </button>
                    <button
                      type="button"
                      id="type-expense-btn"
                      className={`type-btn expense ${form.type === 'expense' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, type: 'expense' })}
                    >
                      📉 Expense
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-description">Description</label>
                  <input
                    id="tx-description"
                    name="description"
                    type="text"
                    className={`form-input ${formErrors.description ? 'error' : ''}`}
                    placeholder="e.g. Monthly salary, Grocery shopping..."
                    value={form.description}
                    onChange={handleFormChange}
                  />
                  {formErrors.description && (
                    <span className="form-error">{formErrors.description}</span>
                  )}
                </div>

                {/* Amount */}
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-amount">Amount (USD)</label>
                  <input
                    id="tx-amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={`form-input ${formErrors.amount ? 'error' : ''}`}
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleFormChange}
                  />
                  {formErrors.amount && (
                    <span className="form-error">{formErrors.amount}</span>
                  )}
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-date">Date</label>
                  <input
                    id="tx-date"
                    name="date"
                    type="date"
                    className={`form-input ${formErrors.date ? 'error' : ''}`}
                    value={form.date}
                    onChange={handleFormChange}
                  />
                  {formErrors.date && (
                    <span className="form-error">{formErrors.date}</span>
                  )}
                </div>

                <button
                  id="add-transaction-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: '4px' }}
                >
                  ✨ Add Transaction
                </button>
              </form>
            </div>

            {/* Transaction List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📋 Transactions</h2>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="filter-tabs" style={{ marginBottom: '20px' }}>
                {['all', 'income', 'expense'].map((f) => (
                  <button
                    key={f}
                    id={`filter-${f}-btn`}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' && '🔀 All'}
                    {f === 'income' && '📈 Income'}
                    {f === 'expense' && '📉 Expenses'}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="transaction-list">
                {filteredTransactions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <p>
                      {filter === 'all'
                        ? 'No transactions yet. Add your first one!'
                        : `No ${filter} transactions found.`}
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((t) => (
                    <div
                      key={t.id}
                      className={`transaction-item ${t.type}`}
                      id={`transaction-${t.id}`}
                    >
                      <div className="transaction-icon">
                        {t.type === 'income' ? '📈' : '📉'}
                      </div>
                      <div className="transaction-info">
                        <div className="transaction-desc">{t.description}</div>
                        <div className="transaction-date">{formatDate(t.date)}</div>
                      </div>
                      <div className="transaction-amount">
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </div>
                      <div className="transaction-actions">
                        <button
                          id={`delete-${t.id}`}
                          className="btn-delete"
                          onClick={() => handleDelete(t.id)}
                          title="Delete transaction"
                          aria-label={`Delete ${t.description}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
