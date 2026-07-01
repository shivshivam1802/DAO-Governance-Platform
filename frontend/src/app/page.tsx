'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Flame, Users, CheckCircle2, ChevronRight, BarChart3, Database } from 'lucide-react';

const MOCK_DAOS = [
  {
    id: 'arbitrum',
    name: 'Arbitrum DAO',
    description: 'Governing the Arbitrum One and Arbitrum Nova layer-2 rollups network parameters and ecosystem development.',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    membersCount: 45280,
    proposalsCount: 142,
    tvl: '$2.48B',
    isVerified: true,
  },
  {
    id: 'uniswap',
    name: 'Uniswap Governance',
    description: 'Participate in Uniswap protocol development, ecosystem grant funding allocation, and fee switch parameters.',
    logo: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800',
    membersCount: 88120,
    proposalsCount: 96,
    tvl: '$1.15B',
    isVerified: true,
  },
  {
    id: 'compound',
    name: 'Compound Governance',
    description: 'Decentralized decision-making platform for Compound lending markets, cTokens parameters, and COMP distribution rates.',
    logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800',
    membersCount: 12430,
    proposalsCount: 204,
    tvl: '$890M',
    isVerified: true,
  },
  {
    id: 'decentrafund',
    name: 'DecentraFund DAO',
    description: 'Ecosystem investment pool supporting next-generation Web3 builders and decentralized AI applications.',
    logo: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=800',
    membersCount: 1450,
    proposalsCount: 18,
    tvl: '$12.4M',
    isVerified: false,
  },
];

export default function Explorer() {
  const [search, setSearch] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);

  const filteredDAOs = MOCK_DAOS.filter((dao) => {
    const matchesSearch = dao.name.toLowerCase().includes(search.toLowerCase()) || 
                          dao.description.toLowerCase().includes(search.toLowerCase());
    const matchesVerified = !filterVerified || dao.isVerified;
    return matchesSearch && matchesVerified;
  });

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="text-center py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight font-serif text-white mb-4"
          >
            Govern the <span className="gradient-text">Future</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto"
          >
            Create proposals, cast votes, and manage digital treasuries in next-generation decentralized organizations.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Total DAOs Deployed', value: '4,102', icon: Database, color: 'text-indigo-400' },
            { label: 'Active Voters', value: '147.2K', icon: Users, color: 'text-emerald-400' },
            { label: 'Proposals Executed', value: '12,840', icon: BarChart3, color: 'text-purple-400' },
            { label: 'Treasury Managed', value: '$4.53B', valueColor: 'gradient-text', icon: Flame, color: 'text-rose-400' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-2xl font-bold text-slate-100 ${stat.valueColor || ''}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search DAOs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200 transition"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterVerified(!filterVerified)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                filterVerified 
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified Only
            </button>
            <Link 
              href="/create"
              className="px-5 py-2 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-500/20"
            >
              Create New DAO
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDAOs.map((dao, idx) => (
            <motion.div
              key={dao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl overflow-hidden group flex flex-col justify-between"
            >
              <div>
                <div className="h-28 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                  <img 
                    src={dao.banner} 
                    alt={dao.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-60" 
                  />
                </div>
                
                <div className="p-6 relative -mt-8 z-20 flex gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 p-1 flex-shrink-0">
                    <img src={dao.logo} alt={dao.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">
                        {dao.name}
                      </h3>
                      {dao.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/10" title="Verified DAO" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {dao.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-900 flex justify-between items-center bg-slate-950/20">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Members</span>
                    <span className="text-sm font-bold text-slate-300">{dao.membersCount.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Proposals</span>
                    <span className="text-sm font-bold text-slate-300">{dao.proposalsCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">TVL</span>
                    <span className="text-sm font-bold text-slate-300">{dao.tvl}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/dao/${dao.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition"
                >
                  Enter Governance
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
