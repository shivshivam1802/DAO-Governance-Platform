'use client';

import React, { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAccount, useSignTypedData } from 'wagmi';
import { ChevronLeft, MessageSquare, Calendar, ShieldCheck, FileText, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const MOCK_PROPOSAL: any = {
  id: 'prop1',
  title: 'AIP-11: Enable gas subsidy for L2 developers',
  description: `## Abstract
This proposal recommends enabling a gas rebate subsidy program for active Smart Contract developers deploying on Arbitrum L2. The objective is to lower entry barriers, incentivize developer growth, and increase daily transaction volume.

## Motivation
With competitor rollups subsidizing contracts, Arbitrum should lead developer onboarding.

## Proposed Action
- Allocate **150,000 ARB** from the DAO treasury.
- Refund up to 50% of deployment gas fees per verified team.
- Administered via a multi-signature review board comprised of three selected developers.`,
  status: 'VOTING',
  type: 'GENERAL',
  choices: ['For', 'Against', 'Abstain'],
  votes: [
    { choice: 'For', value: 12400000, percentage: 85.2, color: '#6366f1' },
    { choice: 'Against', value: 2100000, percentage: 14.4, color: '#f43f5e' },
    { choice: 'Abstain', value: 50000, percentage: 0.4, color: '#64748b' }
  ],
  aiSummary: `### AI Proposal Summary
This proposal, titled **"AIP-11: Enable gas subsidy for L2 developers"**, requests DAO approval to execute governance actions.

#### Key Highlights:
- **Core Objective**: Establishes a developer incentive rebate program.
- **Description Summary**: Allocates 150K ARB from the treasury to subsidize gas fees up to 50% for smart contract developers on Arbitrum.
- **Impact Assessment**: Promotes network activity and expands dApp utility.

*Generated automatically using the Governance AI model.*`,
  aiRiskAnalysis: `### AI Risk Assessment
**Overall Risk Level: MEDIUM (45/100)**

#### Risk Matrix:
1. **Treasury Outflow Risk**: MEDIUM. Involves a transfer of 150K ARB.
2. **Contract Security**: LOW. Implementation is managed through manual verification checks by a multi-sig board.
3. **Sybil/Exploit Risk**: MEDIUM. Strict developer verification is required to prevent multiple claims by the same project.

#### Recommendation:
✅ **Approved workflow**. Ensure that the multi-sig oversight board members are publicly verified and declare conflicts of interest.`,
  comments: [
    { id: 1, author: '0x3C44...93BC', content: 'Fully support this. Developer cost is currently the biggest hurdle on L2.', time: '2 hours ago' },
    { id: 2, author: '0x90F7...b906', content: 'Who controls the multi-sig board? We need clear rules on who gets verified.', time: '1 hour ago' },
  ]
};

export default function ProposalDetail() {
  const params = useParams();
  const id = params?.id || 'arbitrum';
  const proposalId = params?.proposalId || 'prop1';

  const { address, isConnected } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [voted, setVoted] = useState(false);
  const [signing, setSigning] = useState(false);
  const [comments, setComments] = useState(MOCK_PROPOSAL.comments);
  const [newComment, setNewComment] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'ai'>('info');

  const handleVoteSubmit = async () => {
    if (!selectedChoice) return;
    setSigning(true);

    try {
      if (isConnected && address) {
        const domain = {
          name: 'DAO Governance Platform',
          version: '1',
          chainId: 1,
          verifyingContract: '0x4f12Cd92929eB9d7F357fE768c8dfaE4D2574A9B' as `0x${string}`,
        };

        const types = {
          Vote: [
            { name: 'voter', type: 'address' },
            { name: 'proposalId', type: 'string' },
            { name: 'choice', type: 'string' },
            { name: 'weight', type: 'uint256' },
          ],
        };

        const message = {
          voter: address as `0x${string}`,
          proposalId: proposalId as string,
          choice: selectedChoice,
          weight: BigInt(1000),
        };

        await signTypedDataAsync({
          domain,
          types,
          primaryType: 'Vote',
          message,
        });
      }

      setVoted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    } catch (e) {
      console.error(e);
      alert('Signature rejected or voting failed');
    } finally {
      setSigning(false);
    }
  };

  const handleCommentSubmit = (e: any) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments((prev: any) => [
      ...prev,
      {
        id: Date.now(),
        author: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Voter',
        content: newComment,
        time: 'Just now',
      }
    ]);
    setNewComment('');
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/dao/${id}`} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6">
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="border-b border-slate-900 pb-6 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
              {MOCK_PROPOSAL.status}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase">{MOCK_PROPOSAL.type}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
            {MOCK_PROPOSAL.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Ends: July 4, 2026</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> IPFS: QmPvYt...bJg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex gap-4 border-b border-slate-900 pb-2">
              <button
                onClick={() => setActiveSubTab('info')}
                className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition ${
                  activeSubTab === 'info' 
                    ? 'border-indigo-500 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                Description
              </button>
              <button
                onClick={() => setActiveSubTab('ai')}
                className={`flex items-center gap-2 pb-2 text-sm font-semibold border-b-2 transition ${
                  activeSubTab === 'ai' 
                    ? 'border-indigo-500 text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Summary & Risk Matrix
              </button>
            </div>

            {activeSubTab === 'info' ? (
              <div className="glass-card p-6 sm:p-8 rounded-3xl text-sm leading-relaxed text-slate-300 space-y-4 whitespace-pre-line font-sans border border-slate-800">
                {MOCK_PROPOSAL.description}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-3xl text-sm leading-relaxed text-slate-300 space-y-4 border border-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: MOCK_PROPOSAL.aiSummary.replace(/\n/g, '<br/>') }} />
                </div>
                <div className="glass-card p-6 rounded-3xl text-sm leading-relaxed text-slate-300 space-y-4 border border-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: MOCK_PROPOSAL.aiRiskAnalysis.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Discussion Comments
              </h3>

              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Share your thoughts on this proposal..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-full border border-slate-800 bg-slate-900/60 focus:outline-none focus:border-indigo-500 text-sm text-slate-200"
                />
                <button 
                  type="submit"
                  className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-indigo-300">{comment.author}</span>
                      <span className="text-slate-500">{comment.time}</span>
                    </div>
                    <p className="text-sm text-slate-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-800">
              <h3 className="text-md font-bold text-white mb-4">Cast your Vote</h3>
              
              {voted ? (
                <div className="text-center py-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
                  <span className="text-emerald-400 font-bold block mb-1">Vote Submitted!</span>
                  <p className="text-xs text-slate-400">
                    Your off-chain signature was verified and counted.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {MOCK_PROPOSAL.choices.map((choice: string) => (
                    <button
                      key={choice}
                      onClick={() => setSelectedChoice(choice)}
                      className={`w-full py-2.5 px-4 rounded-xl border font-semibold text-sm transition text-left ${
                        selectedChoice === choice 
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' 
                          : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900/60'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                  
                  <button
                    onClick={handleVoteSubmit}
                    disabled={!selectedChoice || signing}
                    className="w-full mt-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {signing ? 'Signing Typed Message...' : 'Submit Cryptographic Vote'}
                  </button>
                </div>
              )}
            </div>

            <div className="glass-card p-6 rounded-3xl border border-slate-800">
              <h3 className="text-md font-bold text-white mb-4">Current Results</h3>
              
              <div className="space-y-4">
                {MOCK_PROPOSAL.votes.map((vote: any) => (
                  <div key={vote.choice} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{vote.choice}</span>
                      <span className="text-slate-400">
                        {vote.value.toLocaleString()} ({vote.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${vote.percentage}%`, backgroundColor: vote.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
