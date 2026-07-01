'use client';

import React, { useState } from 'react';
import Navbar from '../../../../components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Coins, AlertTriangle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChevronLeft } from 'lucide-react';

export default function StakingPage() {
  const params = useParams();
  const id = params?.id || 'arbitrum';

  const [stakedBalance, setStakedBalance] = useState(2500);
  const [rewardsEarned, setRewardsEarned] = useState(12.45);
  const [lockDuration, setLockDuration] = useState(30);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getMultiplier = (days: number) => {
    if (days === 0) return '1.0x';
    if (days === 30) return '1.2x';
    if (days === 90) return '1.5x';
    if (days === 180) return '2.0x';
    return '1.0x';
  };

  const getApy = (days: number) => {
    if (days === 0) return '5%';
    if (days === 30) return '8%';
    if (days === 90) return '12%';
    if (days === 180) return '20%';
    return '5%';
  };

  const handleStake = (e: any) => {
    e.preventDefault();
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setStakedBalance((prev) => prev + parseFloat(stakeAmount));
      setStakeAmount('');
      confetti({ particleCount: 60, spread: 50 });
      setTimeout(() => setSuccess(false), 4000);
    }, 2500);
  };

  const handleClaim = () => {
    if (rewardsEarned <= 0) return;
    setRewardsEarned(0);
    confetti({ particleCount: 30, spread: 35 });
    alert('Rewards claimed successfully!');
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
        <Link href={`/dao/${id}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to DAO Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Coins className="w-8 h-8 text-yellow-400" />
            Token Staking & Yield
          </h1>
          <p className="text-slate-400 mt-2">Stake governance tokens to lock in APY rewards and amplify your voting weight.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Your Staked Balance</span>
            <div className="mt-4">
              <span className="text-3xl font-bold text-white block">{stakedBalance.toLocaleString()} ARB</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Voting Power: {(stakedBalance * 1.2).toLocaleString()} votes</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Multiplier</span>
            <div className="mt-4">
              <span className="text-3xl font-bold text-indigo-400 block">{getMultiplier(lockDuration)}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Based on {lockDuration} day lock</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Staking Yield Earned</span>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold text-emerald-400 block">{rewardsEarned.toFixed(2)} ARB</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Accrued Real-Time</span>
              </div>
              <button
                onClick={handleClaim}
                disabled={rewardsEarned <= 0}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition"
              >
                Claim
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleStake} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-2">Stake Governance Tokens</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Amount to Stake</label>
                <input
                  type="number"
                  required
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase">Lock Duration</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 30, 90, 180].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setLockDuration(days)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition ${
                        lockDuration === days 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                          : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold block">{days === 0 ? 'No Lock' : `${days} Days`}</span>
                      <span className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">APY: {getApy(days)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {lockDuration > 0 && (
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Early withdrawal before the lock period expires will incur a **10% penalty** on your staked principal, returned back to the DAO treasury.
                  </span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                  <Check className="w-4 h-4" />
                  <span>Staking successful! Your voting power multiplier has been updated.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
              >
                {loading ? 'Confirming Transaction...' : 'Stake Tokens'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800">
              <h3 className="text-md font-bold text-white mb-4">Staking Multipliers</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400 font-semibold">Flexible (No Lock)</span>
                  <span className="text-slate-200">1.0x voting boost / 5% APY</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400 font-semibold">30 Days Lock</span>
                  <span className="text-indigo-400 font-bold">1.2x voting boost / 8% APY</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400 font-semibold">90 Days Lock</span>
                  <span className="text-indigo-400 font-bold">1.5x voting boost / 12% APY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">180 Days Lock</span>
                  <span className="text-indigo-400 font-bold">2.0x voting boost / 20% APY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
