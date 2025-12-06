# FraxGuardian AI - Technical Architecture

## System Overview

FraxGuardian AI is an autonomous agent that monitors Frax Finance pools for arbitrage opportunities and executes profitable trades using AI-powered decision-making.

## High-Level Architecture

```
                                  ┌─────────────────────┐
                                  │   User/Investor     │
                                  │   (ATP Platform)    │
                                  └──────────┬──────────┘
                                             │
                                             ↓
┌──────────────────────────────────────────────────────────────────────┐
│                          DASHBOARD LAYER                              │
│  ┌────────────────┐  ┌─────────────────┐  ┌───────────────────────┐ │
│  │  Opportunities │  │  AI Reasoning   │  │ Execution History     │ │
│  │     Feed       │  │  Visualization  │  │   + Analytics         │ │
│  └────────────────┘  └─────────────────┘  └───────────────────────┘ │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │ API
                                   ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        ADK-TS AGENT CORE                              │
│                                                                       │
│  ┌──────────────────────┐                                           │
│  │  PERCEPTION MODULE   │  ← Blockchain Data, Price Feeds, KRWQ     │
│  │  - Pool Monitor      │                                           │
│  │  - Price Fetcher     │                                           │
│  │  - Opp Scanner       │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ↓                                                        │
│  ┌──────────────────────┐                                           │
│  │  REASONING MODULE    │  ← GPT-4/3.5 AI Analysis                  │
│  │  - Risk Scoring      │                                           │
│  │  - AI Analysis       │                                           │
│  │  - Decision Engine   │                                           │
│  └──────────┬───────────┘                                           │
│             │                                                        │
│             ↓                                                        │
│  ┌──────────────────────┐                                           │
│  │   ACTION MODULE      │  → Base Sepolia Testnet                   │
│  │  - Trade Simulator   │                                           │
│  │  - Testnet Executor  │                                           │
│  │  - Result Tracker    │                                           │
│  └──────────────────────┘                                           │
│                                                                       │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │
                                    ↓
                    ┌───────────────────────────────┐
                    │  EXTERNAL INTEGRATIONS        │
                    │  - Frax Finance Pools         │
                    │  - KRWQ Stablecoin           │
                    │  - Base Blockchain           │
                    │  - OpenAI API               │
                    └───────────────────────────────┘
```

## Component Details

### 1. Perception Module

**Purpose**: Environmental sensing and opportunity detection

**Responsibilities**:
- Monitor Frax Finance pool prices on Base testnet
- Fetch gas prices for cost calculation
- Integrate KRWQ price feed
- Detect arbitrage opportunities (>0.3% price difference)
- Structure data for reasoning module

**Data Flow**:
```
Blockchain RPC → ethers.js → Pool Contracts → Reserve Data
                                                   ↓
KRWQ API ───────────────────────────────────────→ Price Aggregation
                                                   ↓
Gas Price Oracle ────────────────────────────────→ Opportunity Detection
                                                   ↓
                                            PerceptionData Output
```

**Key Technologies**:
- ethers.js v6 for blockchain interaction
- Uniswap V2 pair ABI for reserve fetching
- REST API integration for KRWQ

### 2. Reasoning Module

**Purpose**: AI-powered risk assessment and decision-making

**Responsibilities**:
- Calculate multi-factor risk scores
- Integrate GPT for contextual analysis
- Make EXECUTE/WAIT/SKIP decisions
- Generate human-readable explanations

**Risk Scoring Algorithm**:
```typescript
Risk Score = (
  Liquidity Risk * 0.3 +
  Price Impact Risk * 0.2 +
  Gas Cost Risk * 0.3 +
  Volatility Risk * 0.2
)

Decision Rules:
  Risk < 40 && Profit > $5  → EXECUTE
  40 ≤ Risk < 60            → WAIT
  Risk ≥ 60                 → SKIP
```

**AI Integration**:
```
Opportunity Data → Structured Prompt → GPT-3.5-turbo → Analysis
                                                          ↓
                                              "This opportunity has..."
```

**Key Technologies**:
- LangChain for LLM orchestration
- OpenAI GPT-3.5-turbo for analysis
- Custom risk scoring algorithm

### 3. Action Module

**Purpose**: Safe trade execution with multiple modes

**Responsibilities**:
- Simulate trades for demo/testing
- Execute on Base Sepolia testnet
- Verify transaction success
- Track execution history

**Execution Modes**:

| Mode       | Use Case           | Safety      | Real Blockchain |
|------------|--------------------|-------------|-----------------|
| Simulation | Demo/Testing       | 100% safe   | No              |
| Testnet    | Pre-production     | Safe (fake $)| Yes            |
| Mainnet    | Production         | Real money  | Yes             |

**Execution Flow**:
```
Decision: EXECUTE
       ↓
Check Execution Mode
       ↓
┌──────┴──────┐
│ Simulation  │ → Mock TX → Success (90%) → Result Logged
└─────────────┘

┌──────┴──────┐
│  Testnet    │ → Real TX → Wait Confirm → Verify → Result Logged
└─────────────┘
```

### 4. Main Agent Orchestrator

**Purpose**: Coordinate the Perception-Reasoning-Action loop

**Agent Loop**:
```typescript
while (isRunning) {
  // 1. PERCEPTION
  perceptionData = await perception.perceive();
  
  if (noOpportunities) {
    sleep(5000);
    continue;
  }
  
  // 2. REASONING
  reasoningResult = await reasoning.reason(perceptionData);
  
  // 3. ACTION
  if (reasoningResult.decision === 'EXECUTE') {
    executionResult = await action.execute(opportunity);
    history.push(executionResult);
  }
  
  sleep(10000);
}
```

**Configuration Management**:
- Environment-based config (.env)
- Validation on startup
- Safety checks for mainnet execution

## Data Models

### Core Interfaces

```typescript
// Opportunity detected by perception
interface ArbitrageOpportunity {
  id: string;
  timestamp: number;
  sourcePool: string;
  targetPool: string;
  priceDifferencePercent: number;
  netProfitUsd: number;
  riskScore: RiskScore;
}

// Risk assessment from reasoning
interface RiskScore {
  overall: number;  // 0-100
  factors: {
    liquidityRisk: number;
    priceImpactRisk: number;
    gasCostRisk: number;
    volatilityRisk: number;
  };
  recommendation: 'EXECUTE' | 'WAIT' | 'SKIP';
  reasoning: string;
}

// Execution outcome from action
interface ExecutionResult {
  success: boolean;
  transactionHash?: string;
  actualProfit?: number;
  error?: string;
  timestamp: number;
}
```

## Security Considerations

### 1. Private Key Safety
- Never committed to Git (.env in .gitignore)
- Separate testnet/mainnet wallets
- Simulation mode requires no private key

### 2. API Key Protection
- Environment variables only
- Rate limiting on OpenAI calls
- Fallback to cached analysis if API fails

### 3. Execution Safety
- Testnet-first deployment strategy
- Simulation mode for all demos
- Manual approval required for mainnet

### 4. Smart Contract Risks
- Read-only operations during perception
- Slippage protection on swaps
- Gas limit enforcement

## Scalability Design

### Current Architecture (MVP)
- Single-threaded agent
- Sequential opportunity processing
- In-memory execution history

### Future Scaling Path

**Phase 1 (Current)**:
```
1 Agent → 2 Pools → ~10 opportunities/day
```

**Phase 2 (Multi-Pool)**:
```
1 Agent → 10 Pools → ~50 opportunities/day
Database for history
```

**Phase 3 (Multi-Chain)**:
```
N Agents → M Chains → ~500 opportunities/day
Distributed architecture
Redis for caching
PostgreSQL for analytics
```

## Deployment Architecture

### Current: Monorepo Structure
```
fraxguardian-ai/
├── src/agent/           # Backend agent
└── dashboard/           # Frontend (Next.js)
```

### Production Deployment:
```
┌─────────────────┐         ┌──────────────────┐
│   Vercel        │         │  Railway/Render  │
│  (Dashboard)    │◄───────►│  (Agent Backend) │
│  Next.js        │   API   │  Node.js Server  │
└─────────────────┘         └────────┬─────────┘
                                     │
                                     ↓
                            ┌────────────────────┐
                            │  Base Blockchain   │
                            │  (Sepolia/Mainnet) │
                            └────────────────────┘
```

## Technology Stack

| Layer               | Technology           | Purpose                    |
|---------------------|----------------------|----------------------------|
| Agent Framework     | ADK-TS               | Architecture pattern       |
| Runtime             | Node.js 18+          | JavaScript execution       |
| Language            | TypeScript 5.6       | Type safety               |
| Blockchain          | ethers.js v6         | Smart contract interaction |
| AI/ML               | LangChain + OpenAI   | Decision intelligence      |
| Testing             | Jest                 | Unit tests                |
| Frontend (Day 3)    | Next.js 14           | Dashboard                 |
| UI Components       | shadcn/ui            | Component library         |
| Styling             | Tailwind CSS         | Responsive design         |

## Performance Characteristics

### Latency Targets
- **Perception**: < 2 seconds (blockchain calls)
- **Reasoning**: < 5 seconds (GPT API call)
- **Action**: < 30 seconds (testnet TX confirmation)
- **Total Iteration**: < 45 seconds

### Resource Usage
- **Memory**: ~150 MB (Node.js agent)
- **API Calls**: ~10-20 OpenAI requests/hour
- **Blockchain RPC**: ~100-200 calls/hour
- **Cost**: ~$0.10/hour (OpenAI + Infura free tier)

## Error Handling

### Fault Tolerance Strategy

```typescript
try {
  perceptionData = await perception.perceive();
} catch (error) {
  log.error('Perception failed:', error);
  // Continue to next iteration - don't crash
  continue;
}

try {
  reasoningResult = await reasoning.reason(perceptionData);
} catch (error) {
  log.error('Reasoning failed:', error);
  // Fall back to simple heuristic decision
  reasoningResult = fallbackReasoning(perceptionData);
}

try {
  executionResult = await action.execute(opportunity);
} catch (error) {
  log.error('Execution failed:', error);
  // Log failure, don't retry automatically
  executionHistory.push({ success: false, error });
}
```

### Recovery Mechanisms
- Automatic retry on network errors (3 attempts)
- Graceful degradation (GPT failure → heuristic decision)
- Persistent logging for post-mortem analysis

## Monitoring & Observability

### Logging Strategy
```
[PERCEPTION] → Opportunities detected
[REASONING]  → Decision + confidence
[ACTION]     → Execution outcome
[SUMMARY]    → Session statistics
```

### Metrics Tracked
- Opportunities detected per hour
- Average risk score
- Execution success rate
- Total profit (cumulative)
- API latency
- Blockchain RPC health

## Future Architecture Enhancements

### 1. Database Integration
```
PostgreSQL for:
- Execution history persistence
- Historical price data
- Performance analytics
```

### 2. Microservices
```
Perception Service  (Pool monitoring)
Reasoning Service   (AI analysis)
Execution Service   (Trade execution)
API Gateway         (Coordination)
```

### 3. Event-Driven
```
Pool Price Change → Event Bus → Perception → Reasoning → Action
```

---

**Last Updated**: December 6, 2025  
**Version**: 1.0 (MVP)
