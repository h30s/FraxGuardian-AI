'use client'

import { Shield, TrendingUp, DollarSign, Activity, Target, AlertCircle, Globe } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
    // Mock data for demo
    const stats = {
        opportunitiesDetected: 127,
        successRate: 94.5,
        totalProfit: 2847.32,
        currentRisk: 18,
        activeStrategies: 3,
        avgProfitPerTrade: 22.42,
        krwqPrice: 1.0003, // KRWQ/USD price
        fraxTVL: 2.1, // Billions
    }

    const recentOpportunities = [
        {
            id: '1',
            source: 'FraxSwap FRAX/USDC Pool A',
            target: 'FraxSwap FRAX/USDC Pool B',
            priceDiff: 0.6,
            profit: 47.32,
            risk: 24,
            status: 'executed',
            timestamp: '2 hours ago',
        },
        {
            id: '2',
            source: 'FraxSwap FRAX/KRWQ Pool',
            target: 'FraxSwap USDC/KRWQ Pool',
            priceDiff: 0.52,
            profit: 38.18,
            risk: 31,
            status: 'executed',
            timestamp: '4 hours ago',
        },
        {
            id: '3',
            source: 'FraxLend sFRAX',
            target: 'FraxSwap FRAX Pool',
            priceDiff: 0.35,
            profit: 18.92,
            risk: 42,
            status: 'skipped',
            timestamp: '5 hours ago',
        },
    ]

    const executionHistory = [
        { id: '1', profit: 45.89, tx: '0x742d35...', status: 'success', time: '2h ago' },
        { id: '2', profit: 38.21, tx: '0x8f3a12...', status: 'success', time: '4h ago' },
        { id: '3', profit: 52.14, tx: '0x9b2c54...', status: 'success', time: '6h ago' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-sm bg-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-400" />
                            <div>
                                <h1 className="text-xl font-bold text-white">FraxGuardian AI</h1>
                                <p className="text-xs text-gray-400">Powered by Frax Finance + KRWQ + IQAI</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-6">
                            {/* KRWQ Price Ticker */}
                            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                                <Globe className="w-4 h-4 text-green-400" />
                                <div>
                                    <div className="text-xs text-gray-400">KRWQ/USD</div>
                                    <div className="text-sm font-bold text-green-400">${stats.krwqPrice.toFixed(4)}</div>
                                </div>
                            </div>

                            {/* Frax TVL */}
                            <div className="hidden md:flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
                                <DollarSign className="w-4 h-4 text-blue-400" />
                                <div>
                                    <div className="text-xs text-gray-400">Frax TVL</div>
                                    <div className="text-sm font-bold text-blue-400">${stats.fraxTVL}B</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm font-medium">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={<Target className="w-8 h-8" />}
                        label="Opportunities Detected"
                        value={stats.opportunitiesDetected}
                        change="+15.3%"
                        positive={true}
                        highlight="Frax Finance Pools"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-8 h-8" />}
                        label="Success Rate"
                        value={`${stats.successRate}%`}
                        change="+2.1%"
                        positive={true}
                        highlight="With AI Risk Assessment"
                    />
                    <StatCard
                        icon={<DollarSign className="w-8 h-8" />}
                        label="Total Profit (Simulated)"
                        value={`$${stats.totalProfit.toLocaleString()}`}
                        change="+8.7%"
                        positive={true}
                        highlight="Across Frax Ecosystem"
                    />
                    <StatCard
                        icon={<Shield className="w-8 h-8" />}
                        label="Current Risk Level"
                        value={`${stats.currentRisk}/100`}
                        badge="LOW"
                        badgeColor="green"
                        highlight="6-Factor Analysis"
                    />
                    <StatCard
                        icon={<Globe className="w-8 h-8 text-green-400" />}
                        label="KRWQ Integration"
                        value="Active"
                        badge="LIVE"
                        badgeColor="green"
                        highlight="Cross-Border Arbitrage"
                    />
                    <StatCard
                        icon={<Activity className="w-8 h-8" />}
                        label="Active Strategies"
                        value={stats.activeStrategies}
                        highlight="FraxSwap + sFRAX + FraxLend"
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Opportunities */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-blue-400" />
                            Recent Opportunities
                            <span className="ml-auto text-xs text-gray-500">Frax Finance + KRWQ</span>
                        </h2>
                        <div className="space-y-4">
                            {recentOpportunities.map((opp) => (
                                <OpportunityCard key={opp.id} opportunity={opp} />
                            ))}
                        </div>
                    </div>

                    {/* Execution History */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            Execution History
                        </h2>
                        <div className="space-y-3">
                            {executionHistory.map((exec) => (
                                <div
                                    key={exec.id}
                                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-green-400 font-semibold">
                                                +${exec.profit.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                TX: {exec.tx}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                                {exec.status}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{exec.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Breakdown */}
                <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-400" />
                        6-Factor Risk Assessment
                        <span className="ml-auto text-xs text-gray-500">ADK-TS Powered</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <RiskFactor name="Liquidity" score={20} />
                        <RiskFactor name="Price Impact" score={35} />
                        <RiskFactor name="Gas Cost" score={20} />
                        <RiskFactor name="Volatility" score={10} />
                        <RiskFactor name="Slippage" score={15} />
                        <RiskFactor name="Competition" score={30} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, change, positive, badge, badgeColor, highlight }: any) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400">{icon}</div>
                {badge && (
                    <span className={`text-xs px-2 py-1 rounded bg-${badgeColor}-500/20 text-${badgeColor}-400`}>
                        {badge}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-gray-400 flex items-center gap-2 mb-2">
                {label}
                {change && (
                    <span className={positive ? 'text-green-400' : 'text-red-400'}>
                        {change}
                    </span>
                )}
            </div>
            {highlight && (
                <div className="text-xs text-gray-500 italic">{highlight}</div>
            )}
        </div>
    )
}

function OpportunityCard({ opportunity }: any) {
    const getRiskColor = (risk: number) => {
        if (risk < 35) return 'text-green-400 bg-green-500/20'
        if (risk < 65) return 'text-yellow-400 bg-yellow-500/20'
        return 'text-red-400 bg-red-500/20'
    }

    const isKRWQ = opportunity.source.includes('KRWQ') || opportunity.target.includes('KRWQ')

    return (
        <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all border border-white/5">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="text-white font-medium flex items-center gap-2">
                        {opportunity.source}
                        {isKRWQ && (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                                KRWQ
                            </span>
                        )}
                    </div>
                    <div className="text-gray-400 text-sm">
                        → {opportunity.target}
                    </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${opportunity.status === 'executed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                    {opportunity.status}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                    <div className="text-gray-400 text-xs mb-1">Price Diff</div>
                    <div className="text-white font-semibold">{opportunity.priceDiff}%</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs mb-1">Profit</div>
                    <div className="text-green-400 font-semibold">${opportunity.profit}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs mb-1">Risk</div>
                    <div className={`font-semibold text-xs px-2 py-0.5 rounded ${getRiskColor(opportunity.risk)}`}>
                        {opportunity.risk}/100
                    </div>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">{opportunity.timestamp}</div>
        </div>
    )
}

function RiskFactor({ name, score }: { name: string; score: number }) {
    const getColor = (score: number) => {
        if (score < 35) return 'from-green-500 to-green-600'
        if (score < 65) return 'from-yellow-500 to-yellow-600'
        return 'from-red-500 to-red-600'
    }

    return (
        <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">{name}</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>
                {score}
            </div>
            <div className="text-xs text-gray-500 mt-1">/100</div>
        </div>
    )
}
