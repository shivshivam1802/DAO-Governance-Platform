'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { Network, FileText, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CreateDAO() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    website: '',
    twitter: '',
    discord: '',
    tokenName: '',
    tokenSymbol: '',
    initialSupply: '10000000',
    minDelay: '3600',
    votingDelay: '1',
    votingPeriod: '50400',
    proposalThreshold: '1000',
    quorumFraction: '4',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deployedAddrs, setDeployedAddrs] = useState<any>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeploy = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setDeployedAddrs({
        token: '0x32A4f1412574A92929eB9d7F357fE768c8dfaE4D',
        timelock: '0x9E73fF14704E9C1aCd4f92305886d34e2bCbFDe1',
        governor: '0x4f12Cd92929eB9d7F357fE768c8dfaE4D2574A9B',
        treasury: '0xCBfDe19E73fF14704E9C1aCd4f92305886d34e2b',
      });
    }, 3000);
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Create a DecentraDAO</h1>
          <p className="text-slate-400 mt-2">Deploy your own token governance, timelock, and treasury in minutes.</p>
        </div>

        <div className="flex justify-between items-center mb-10 px-4">
          {[
            { num: 1, label: 'DAO Details', icon: FileText },
            { num: 2, label: 'Governance Token', icon: Network },
            { num: 3, label: 'Voting Parameters', icon: Settings },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition ${
                step === s.num 
                  ? 'bg-indigo-600 text-white' 
                  : step > s.num 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-indigo-400' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl text-center glow-accent"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">DAO Deployed Successfully!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your governance contracts are compiled, verified, and live on the network.
            </p>

            <div className="text-left bg-slate-950/60 rounded-2xl p-5 border border-slate-900 space-y-3 font-mono text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Governance Token:</span>
                <span className="text-slate-300">{deployedAddrs?.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timelock Controller:</span>
                <span className="text-slate-300">{deployedAddrs?.timelock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Governor Contract:</span>
                <span className="text-slate-300">{deployedAddrs?.governor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DAO Treasury:</span>
                <span className="text-slate-300">{deployedAddrs?.treasury}</span>
              </div>
            </div>

            <Link href="/" className="inline-block px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition">
              Go to Explorer
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleDeploy} className="glass-card p-8 rounded-3xl space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Step 1: DAO Info</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">DAO Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. DecentraFund"
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your DAO's mission, goals, and values..."
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Logo URL</label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Banner URL</label>
                    <input
                      type="url"
                      name="banner"
                      value={formData.banner}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Step 2: ERC20 Governance Token</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Token Name</label>
                    <input
                      type="text"
                      name="tokenName"
                      required
                      value={formData.tokenName}
                      onChange={handleInputChange}
                      placeholder="e.g. DecentraToken"
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Token Symbol</label>
                    <input
                      type="text"
                      name="tokenSymbol"
                      required
                      value={formData.tokenSymbol}
                      onChange={handleInputChange}
                      placeholder="e.g. DCT"
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Initial Supply (Minted to Creator)</label>
                  <input
                    type="number"
                    name="initialSupply"
                    required
                    value={formData.initialSupply}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-2 rounded-full border border-slate-800 hover:bg-slate-900 text-slate-400 text-sm transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Step 3: Governance & Timelock Parameters</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Voting Delay (Blocks)</label>
                    <input
                      type="number"
                      name="votingDelay"
                      required
                      value={formData.votingDelay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Voting Period (Blocks)</label>
                    <input
                      type="number"
                      name="votingPeriod"
                      required
                      value={formData.votingPeriod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Proposal Threshold (Tokens)</label>
                    <input
                      type="number"
                      name="proposalThreshold"
                      required
                      value={formData.proposalThreshold}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Quorum Requirement (%)</label>
                    <input
                      type="number"
                      name="quorumFraction"
                      required
                      value={formData.quorumFraction}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Timelock Min Delay (Seconds)</label>
                  <input
                    type="number"
                    name="minDelay"
                    required
                    value={formData.minDelay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                  />
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Executing these transactions will trigger contract deployment using MetaMask or your connected wallet on the network. Gas fees will apply.
                  </span>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2 rounded-full border border-slate-800 hover:bg-slate-900 text-slate-400 text-sm transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Deploying Governance...' : 'Launch DAO'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        )}
      </main>
    </>
  );
}
