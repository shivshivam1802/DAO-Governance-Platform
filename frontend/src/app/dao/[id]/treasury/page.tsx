'use client';

import React, { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Landmark, Check, X, Shield, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOCK_MULTISIG_TXS = [
  { id: 1, to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', value: '1.5 ETH', data: '0x', confirmations: 1, required: 2, approvedBy: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'], executed: false },
  { id: 2, to: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', value: '25,000 ARB', data: '0xa9059cbb0000000000000000000000003c44cdddb6...', confirmations: 2, required: 2, approvedBy: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'], executed: false }
];

export default function TreasuryDashboard() {
  const params = useParams();
  const id = params?.id || 'arbitrum';

  const [txs, setTxs] = useState(MOCK_MULTISIG_TXS);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [formData, setFormData] = useState({ to: '', value: '', asset: 'ETH' });

  const handleApprove = (txId: number) => {
    setTxs((prev) => 
      prev.map((tx) => {
        if (tx.id === txId) {
          const nextConfirmations = tx.confirmations + 1;
          if (nextConfirmations >= tx.required) {
            confetti({ particleCount: 50, spread: 45 });
          }
          return {
            ...tx,
            confirmations: nextConfirmations,
            approvedBy: [...tx.approvedBy, 'userAddress']
          };
        }
        return tx;
      })
    );
  };

  const handleExecute = (txId: number) => {
    setTxs((prev) => 
      prev.map((tx) => {
        if (tx.id === txId) {
          confetti({ particleCount: 100, spread: 80 });
          return { ...tx, executed: true };
        }
        return tx;
      })
    );
  };

  const handleCreateTx = (e: any) => {
    e.preventDefault();
    setTxs((prev) => [
      ...prev,
      {
        id: Date.now(),
        to: formData.to,
        value: `${formData.value} ${formData.asset}`,
        data: '0x',
        confirmations: 1,
        required: 2,
        approvedBy: ['userAddress'],
        executed: false
      }
    ]);
    setShowTransferModal(false);
    setFormData({ to: '', value: '', asset: 'ETH' });
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
        <Link href={`/dao/${id}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to DAO Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Landmark className="w-8 h-8 text-indigo-400" />
              Treasury Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Manage DAO assets, track portfolio health, and sign multi-signature transactions.</p>
          </div>
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            New Transfer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Treasury Balance (ETH)</span>
            <span className="text-3xl font-bold text-white mt-4 flex items-center gap-2">
              1,240 ETH
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">+4.2%</span>
            </span>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">ERC20 Token Value</span>
            <span className="text-3xl font-bold text-slate-100 mt-4">
              $12,840,900
            </span>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">NFT Assets</span>
            <span className="text-3xl font-bold text-slate-100 mt-4">
              14 NFTs
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-b border-slate-900 pb-2">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              MultiSig Approvals Panel
            </h3>
          </div>

          <div className="space-y-4">
            {txs.filter(tx => !tx.executed).map((tx) => {
              const thresholdReached = tx.confirmations >= tx.required;
              
              return (
                <div key={tx.id} className="glass-card p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-800 transition">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                        PENDING
                      </span>
                      <span className="text-xs text-slate-500 font-mono">Recipient: {tx.to}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      Transfer {tx.value}
                    </h4>
                    <div className="text-xs text-slate-400">
                      Confirmations: <span className="font-bold text-indigo-400">{tx.confirmations}</span> / {tx.required}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {thresholdReached ? (
                      <button
                        onClick={() => handleExecute(tx.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                      >
                        <Check className="w-4 h-4" />
                        Execute Transaction
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(tx.id)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold border border-indigo-500 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-950/40 hover:bg-rose-950/10 transition"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 rounded-3xl w-full max-w-md relative">
              <button onClick={() => setShowTransferModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">&times;</button>
              
              <h3 className="text-lg font-bold text-white mb-4">Propose Fund Transfer</h3>
              
              <form onSubmit={handleCreateTx} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Recipient Address</label>
                  <input
                    type="text"
                    required
                    value={formData.to}
                    onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="0x..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-xs text-slate-200 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Amount</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="e.g. 10.5"
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Asset</label>
                    <select
                      value={formData.asset}
                      onChange={(e) => setFormData(prev => ({ ...prev, asset: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    >
                      <option value="ETH">ETH</option>
                      <option value="ARB">ARB</option>
                      <option value="UNI">UNI</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all mt-4"
                >
                  Propose Transfer
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </>
  );
}
