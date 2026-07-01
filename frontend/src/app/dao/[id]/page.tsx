'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building, Users, Landmark, Vote, PlusCircle, CheckCircle2, 
  ChevronRight, Coins, ExternalLink, Sparkles 
} from 'lucide-react';

const MOCK_DAO_DATA: any = {
  arbitrum: {
    name: 'Arbitrum DAO',
    description: 'Governing the Arbitrum One and Arbitrum Nova layer-2 rollups network parameters and ecosystem development.',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    membersCount: 45280,
    tvl: '$2.48B',
    token: 'ARB',
    tokenAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    proposals: [
      { id: 'prop1', title: 'AIP-11: Enable gas subsidy for L2 developers', type: 'GENERAL', status: 'VOTING', start: '2026-06-28', end: '2026-07-04', votesFor: '12.4M', votesAgainst: '2.1M' },
      { id: 'prop2', title: 'AIP-10: Treasury transfer of 500,000 ARB for ecosystem grants', type: 'TREASURY', status: 'SUCCEEDED', start: '2026-06-20', end: '2026-06-27', votesFor: '20.1M', votesAgainst: '1.2M' },
      { id: 'prop3', title: 'AIP-9: Parameter change: Increase min Timelock delay to 3 days', type: 'PARAMETER_CHANGE', status: 'EXECUTED', start: '2026-06-10', end: '2026-06-17', votesFor: '18.4M', votesAgainst: '500K' },
    ]
  },
  uniswap: {
    name: 'Uniswap Governance',
    description: 'Participate in Uniswap protocol development, ecosystem grant funding allocation, and fee switch parameters.',
    logo: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800',
    membersCount: 88120,
    tvl: '$1.15B',
    token: 'UNI',
    tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    proposals: [
      { id: 'prop1', title: 'UNI-22: Deploy Uniswap v3 to Scroll network', type: 'UPGRADE', status: 'VOTING', start: '2026-06-29', end: '2026-07-05', votesFor: '8.4M', votesAgainst: '12K' },
      { id: 'prop2', title: 'UNI-21: Fund the Uniswap Foundation with 5M UNI', type: 'TREASURY', status: 'SUCCEEDED', start: '2026-06-18', end: '2026-06-25', votesFor: '34.2M', votesAgainst: '4.5M' },
    ]
  }
};

export default function DAODashboard() {
  const params = useParams();
  const id = (params?.id as string) || 'arbitrum';
  
  const dao = MOCK_DAO_DATA[id] || MOCK_DAO_DATA.arbitrum;
  const [activeTab, setActiveTab] = useState('proposals');

  return (
    <>
      <Navbar />
      
      <div className="h-48 sm:h-64 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
        <img src={dao.banner} alt={dao.name} className="w-full h-full object-cover opacity-40" />
      </div>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 relative z-20 -mt-20">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-slate-900 pb-6 mb-8">
          <div className="flex gap-4 items-end">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-slate-700 bg-slate-900 p-1 shadow-2xl flex-shrink-0">
              <img src={dao.logo} alt={dao.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2 mb-1.5">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{dao.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/10" />
              </div>
              <p className="text-sm text-slate-400 max-w-2xl">{dao.description}</p>
            </div>
          </div>

          <div className="flex gap-3 md:self-end">
            <Link 
              href={`/dao/${id}/proposal/create`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              New Proposal
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Treasury TVL', value: dao.tvl, icon: Landmark, color: 'text-indigo-400' },
            { label: 'Voters/Members', value: dao.membersCount.toLocaleString(), icon: Users, color: 'text-emerald-400' },
            { label: 'Token Symbol', value: dao.token, subText: 'Gov Token', icon: Coins, color: 'text-yellow-400' },
            { label: 'Token Address', value: `${dao.tokenAddress.slice(0, 6)}...${dao.tokenAddress.slice(-4)}`, subText: 'Copy address', icon: Building, color: 'text-purple-400' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-100">{stat.value}</span>
                {stat.subText && <span className="text-[10px] text-slate-500">{stat.subText}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 border-b border-slate-900 lg:border-0 pb-4 lg:pb-0 overflow-x-auto">
            {[
              { id: 'proposals', label: 'Proposals Feed', icon: Vote },
              { id: 'treasury', label: 'Treasury Dashboard', url: `/dao/${id}/treasury`, icon: Landmark },
              { id: 'staking', label: 'Token Staking', url: `/dao/${id}/staking`, icon: Coins },
              { id: 'leaderboard', label: 'DAO Leaderboard', url: `/leaderboard`, icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              if (tab.url) {
                return (
                  <Link 
                    key={tab.id}
                    href={tab.url}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-600" />
                  </Link>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'proposals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <h3 className="text-lg font-bold text-slate-200">Active and Past Proposals</h3>
                  <span className="text-xs text-slate-500 font-semibold">{dao.proposals.length} Proposals Total</span>
                </div>

                <div className="space-y-4">
                  {dao.proposals.map((prop: any) => (
                    <motion.div
                      key={prop.id}
                      whileHover={{ scale: 1.005 }}
                      className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700/50 transition duration-300"
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            prop.status === 'VOTING' 
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 animate-pulse' 
                              : prop.status === 'SUCCEEDED' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                                : 'bg-slate-900 text-slate-400'
                          }`}>
                            {prop.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase">{prop.type}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-tight">
                          {prop.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Starts: {prop.start}</span>
                          <span>Ends: {prop.end}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end justify-between self-stretch sm:self-center gap-2">
                        <div className="flex sm:flex-col text-xs text-slate-400 gap-4 sm:gap-1 text-right">
                          <div>
                            <span className="font-semibold text-slate-300">{prop.votesFor}</span> For
                          </div>
                          <div>
                            <span className="font-semibold text-slate-300">{prop.votesAgainst}</span> Against
                          </div>
                        </div>

                        <Link
                          href={`/dao/${id}/proposal/${prop.id}`}
                          className="flex items-center justify-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-800 bg-slate-900/60 hover:text-white hover:border-slate-700 transition"
                        >
                          View Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
