'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Compass, Trophy, PlusCircle, LogOut, Wallet } from 'lucide-react';

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-wider gradient-text font-serif">VETO</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition">
                <Compass className="w-4 h-4 text-indigo-400" />
                Explorer
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition">
                <Trophy className="w-4 h-4 text-yellow-400" />
                Leaderboard
              </Link>
              <Link href="/create" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Create DAO
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-slate-400">Balance</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 ETH'}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-sm font-medium text-indigo-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {shortAddress}
                </div>

                <button
                  onClick={() => disconnect()}
                  className="p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-900/30 hover:bg-rose-950/20 transition"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
