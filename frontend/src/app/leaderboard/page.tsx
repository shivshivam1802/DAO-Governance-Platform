'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, Star, Target } from 'lucide-react';

const LEADERBOARD_USERS = [
  { rank: 1, address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', score: 2840, proposals: 12, votes: 94, rate: '98.9%' },
  { rank: 2, address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', score: 2450, proposals: 8, votes: 88, rate: '95.4%' },
  { rank: 3, address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', score: 1980, proposals: 5, votes: 76, rate: '92.1%' },
  { rank: 4, address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', score: 1640, proposals: 3, votes: 65, rate: '89.4%' },
  { rank: 5, address: '0x15d34AAf54a67C6810E79776d814A912b55776d6', score: 1290, proposals: 2, votes: 52, rate: '85.2%' },
  { rank: 6, address: '0x9965507D1a05cc275d01C92a884e6a6C8d307af2', score: 1100, proposals: 1, votes: 41, rate: '81.6%' },
];

export default function Leaderboard() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Governance Leaderboard
          </h1>
          <p className="text-slate-400 mt-2">Rankings of the most active proposal creators and voters by reputation score.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Top Contributor</span>
              <span className="text-sm font-bold text-slate-100">0xf39...2266</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Highest Success Rate</span>
              <span className="text-sm font-bold text-slate-100">98.9% Activity</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Leaderboard TVL</span>
              <span className="text-sm font-bold text-slate-100">12.5M Voting Power</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6 text-center w-16">Rank</th>
                  <th className="py-4 px-6">Contributor</th>
                  <th className="py-4 px-6 text-right">Reputation Score</th>
                  <th className="py-4 px-6 text-center">Proposals</th>
                  <th className="py-4 px-6 text-center">Votes Cast</th>
                  <th className="py-4 px-6 text-right">Participation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {LEADERBOARD_USERS.map((user, idx) => (
                  <motion.tr 
                    key={user.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-900/30 transition text-sm text-slate-300"
                  >
                    <td className="py-4 px-6 text-center font-bold">
                      {user.rank === 1 ? (
                        <span className="text-yellow-400 font-extrabold flex justify-center"><Star className="w-4 h-4 fill-yellow-400" /></span>
                      ) : user.rank === 2 ? (
                        <span className="text-slate-400 font-extrabold">2</span>
                      ) : user.rank === 3 ? (
                        <span className="text-amber-600 font-extrabold">3</span>
                      ) : (
                        user.rank
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-200">
                      {user.address}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-indigo-400">
                      {user.score.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center font-bold">{user.proposals}</td>
                    <td className="py-4 px-6 text-center">{user.votes}</td>
                    <td className="py-4 px-6 text-right text-emerald-400 font-semibold">{user.rate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
