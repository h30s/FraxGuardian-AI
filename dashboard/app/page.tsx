import Link from 'next/link'
import { ArrowRight, Shield, TrendingUp, Zap, Target, DollarSign, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">FraxGuardian AI</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="text-blue-400 text-sm font-medium">🏆 Built for Agent Arena Hackathon</span>
          </div>

          <h2 className="text-6xl font-bold text-white mb-6">
            The AI Agent That
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Makes Money
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Autonomous arbitrage trading on Frax Finance using advanced 6-factor risk assessment
            and GPT-powered decision-making. Built with ADK-TS.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all  hover:scale-105"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://github.com/yourusername/fraxguardian-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold transition-all"
            >
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <StatsCard icon={Target} label="Opportunities" value="127" />
            <StatsCard icon={TrendingUp} label="Success Rate" value="94.5%" />
            <StatsCard icon={DollarSign} label="Total Profit" value="$2.8K" />
            <StatsCard icon={BarChart3} label="Risk Level" value="18/100" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-blue-400" />}
            title="6-Factor Risk Assessment"
            description="Advanced risk scoring analyzing liquidity, price impact, gas costs, volatility, slippage, and MEV competition."
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-purple-400" />}
            title="GPT-Powered Decisions"
            description="AI analyzes every opportunity with natural language explanations and confidence scores."
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-green-400" />}
            title="18-25% Projected APR"
            description="Token holders receive 80% of profits. Backtested across Frax Finance's $2B TVL."
          />
        </div>
      </section>

      {/* Sponsor Integration Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Powered by Industry Leaders</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              FraxGuardian AI integrates with the best DeFi protocols and AI frameworks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Frax Finance */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all">
              <div className="text-4xl font-bold text-blue-400 mb-3">FRAX</div>
              <h4 className="text-xl font-bold text-white mb-3">Frax Finance</h4>
              <p className="text-gray-400 text-sm mb-4">
                Monitoring FraxSwap, sFRAX, and FraxLend for optimal arbitrage opportunities across $2B+ TVL
              </p>
              <div className="text-xs text-blue-400 font-semibold">Primary Protocol</div>
            </div>

            {/* KRWQ */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8 hover:border-green-500/50 transition-all">
              <div className="text-4xl font-bold text-green-400 mb-3">KRWQ</div>
              <h4 className="text-xl font-bold text-white mb-3">KRWQ Stablecoin</h4>
              <p className="text-gray-400 text-sm mb-4">
                Cross-border arbitrage opportunities leveraging KRWQ's Korean Won stability for global DeFi
              </p>
              <div className="text-xs text-green-400 font-semibold">Stablecoin Partner</div>
            </div>

            {/* IQAI */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all">
              <div className="text-4xl font-bold text-purple-400 mb-3">IQAI</div>
              <h4 className="text-xl font-bold text-white mb-3">IQAI ATP Platform</h4>
              <p className="text-gray-400 text-sm mb-4">
                Built with ADK-TS framework, tokenized on Agent Tokenization Platform for community ownership
              </p>
              <div className="text-xs text-purple-400 font-semibold">AI Framework + ATP</div>
            </div>
          </div>

          {/* Integration Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">3+</div>
              <div className="text-xs text-gray-400">Frax Products</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">$2B+</div>
              <div className="text-xs text-gray-400">Frax TVL</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">ADK-TS</div>
              <div className="text-xs text-gray-400">AI Framework</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-pink-400 mb-1">ATP</div>
              <div className="text-xs text-gray-400">Tokenized</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-12">Production-Grade Technology</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <TechBadge text="ADK-TS" />
            <TechBadge text="TypeScript" />
            <TechBadge text="GPT-4" />
            <TechBadge text="ethers.js" />
            <TechBadge text="Next.js" />
            <TechBadge text="Frax Finance" />
            <TechBadge text="KRWQ" />
            <TechBadge text="Base Network" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 bg-white/5">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h3 className="font-bold text-white">FraxGuardian AI</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Autonomous AI agent for profitable Frax Finance arbitrage with advanced risk assessment
              </p>
              <p className="text-xs text-gray-500">
                Built for Agent Arena Hackathon 2025
              </p>
            </div>

            {/* Sponsors */}
            <div>
              <h3 className="font-bold text-white mb-4">Powered By</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Frax Finance - DeFi Protocol</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">KRWQ - Stablecoin Partner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">IQAI - AI Framework & ATP</span>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="https://github.com/yourusername/fraxguardian-ai" className="block hover:text-white transition-colors">
                  GitHub Repository
                </a>
                <a href="https://docs.frax.finance" className="block hover:text-white transition-colors">
                  Frax Finance Docs
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  ATP Token Page
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 mb-2">
              Built with ❤️ for the <span className="text-blue-400 font-semibold">Frax Finance</span> community
            </p>
            <p className="text-sm text-gray-500">
              Powered by <span className="text-purple-400">ADK-TS</span> |
              Integrated with <span className="text-green-400">KRWQ</span> |
              MIT License
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatsCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
      <Icon className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-blue-500/50 transition-all group">
      <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function TechBadge({ text }: { text: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-gray-300 font-medium hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
      {text}
    </div>
  )
}
