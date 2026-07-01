'use client';

import React, { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ChevronLeft, Landmark, Settings } from 'lucide-react';

export default function CreateProposal() {
  const params = useParams();
  const id = params?.id || 'arbitrum';
  const router = useRouter();
  const { isConnected } = useAccount();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'GENERAL',
    recipient: '',
    amount: '',
    executionDelay: '0',
  });

  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateType: string) => {
    if (templateType === 'treasury') {
      setFormData((prev) => ({
        ...prev,
        type: 'TREASURY',
        title: 'AIP-X: Treasury Allocation for [Grant/Funding Name]',
        description: `## Abstract
[Provide a short summary of the treasury fund request.]

## Motivation
[Explain why this fund transfer is beneficial to the DAO ecosystem.]

## Proposed Action
- Transfer [Amount] to [Recipient]
- Funds will be used for [Milestone details]`,
      }));
    } else if (templateType === 'upgrade') {
      setFormData((prev) => ({
        ...prev,
        type: 'UPGRADE',
        title: 'AIP-X: Smart Contract Upgrade of [Contract Name]',
        description: `## Abstract
This proposal details an upgrade to the [Contract Name] implementation.

## Security Audit
[Include links or notes of the security audit reports.]

## Proposal Specification
- Deploy new implementation at [New Address]
- Call timelock to execute upgrade proxy.`,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push(`/dao/${id}`);
    }, 2000);
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        <Link href={`/dao/${id}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to DAO Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Create Proposal</h1>
          <p className="text-slate-400 mt-2">Draft off-chain or on-chain governance proposals for the community to vote on.</p>
        </div>

        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase block mb-3">Quick Templates</span>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTemplateSelect('treasury')}
              className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left hover:border-indigo-500/50 transition"
              type="button"
            >
              <Landmark className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">Treasury Spend</span>
                <span className="text-[10px] text-slate-500">Fund transfers and grants</span>
              </div>
            </button>
            <button
              onClick={() => handleTemplateSelect('upgrade')}
              className="glass-card p-4 rounded-2xl flex items-center gap-3 text-left hover:border-purple-500/50 transition"
              type="button"
            >
              <Settings className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">System Upgrade</span>
                <span className="text-[10px] text-slate-500">Proxy upgrades & parameters</span>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Proposal Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. AIP-12: Launch Developer Incentives"
                className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Proposal Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
              >
                <option value="GENERAL">General Proposal</option>
                <option value="TREASURY">Treasury Proposal</option>
                <option value="UPGRADE">Contract Upgrade</option>
                <option value="PARAMETER_CHANGE">Parameter Change</option>
              </select>
            </div>
          </div>

          {formData.type === 'TREASURY' && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Recipient Address</label>
                <input
                  type="text"
                  name="recipient"
                  required
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="0x..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-xs text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Transfer Amount (ETH/Token)</label>
                <input
                  type="text"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="e.g. 5.2"
                  className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                />
              </div>
            </motion.div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase">Proposal Body (Markdown)</label>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
              >
                {isPreview ? 'Write Code' : 'Preview Markdown'}
              </button>
            </div>

            {isPreview ? (
              <div className="w-full min-h-[200px] p-4 rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-300 whitespace-pre-line font-sans">
                {formData.description || '*No description provided yet.*'}
              </div>
            ) : (
              <textarea
                name="description"
                required
                rows={8}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="## Abstract&#10;Describe your proposal abstract here..."
                className="w-full p-4 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 font-mono resize-none"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Creating Proposal...' : 'Submit Proposal'}
          </button>
        </form>
      </main>
    </>
  );
}
