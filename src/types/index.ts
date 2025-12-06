/**
 * FraxGuardian AI - Type Definitions
 * Core TypeScript types for the arbitrage detection and execution system
 */

export interface ArbitrageOpportunity {
    id: string;
    timestamp: number;
    sourcePool: string;
    targetPool: string;
    sourcePriceFrax: string;
    targetPriceFrax: string;
    priceDifferencePercent: number;
    estimatedProfitUsd: number;
    estimatedGasCostUsd: number;
    netProfitUsd: number;
    liquidityAvailable: string;
    riskScore: RiskScore;
    detected: boolean;
}

export interface RiskScore {
    overall: number; // 0-100, where 0 is lowest risk
    factors: {
        liquidityRisk: number;
        priceImpactRisk: number;
        gasCostRisk: number;
        volatilityRisk: number;
    };
    recommendation: 'EXECUTE' | 'WAIT' | 'SKIP';
    reasoning: string;
}

export interface PoolData {
    address: string;
    name: string;
    token0: string;
    token1: string;
    reserve0: string;
    reserve1: string;
    price: string;
    liquidity: string;
    lastUpdate: number;
}

export interface ExecutionRequest {
    opportunityId: string;
    sourcePool: string;
    targetPool: string;
    amount: string;
    maxSlippage: number;
    gasLimit: string;
}

export interface ExecutionResult {
    success: boolean;
    transactionHash?: string;
    actualProfit?: number;
    gasUsed?: string;
    error?: string;
    timestamp: number;
}

export interface AgentConfig {
    rpcUrl: string;
    privateKey: string;
    openAiApiKey: string;
    minProfitThreshold: number;
    maxGasPriceGwei: number;
    executionMode: 'simulation' | 'testnet' | 'mainnet';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface PerceptionData {
    pools: PoolData[];
    gasPrice: string;
    opportunities: ArbitrageOpportunity[];
    krwqPrice?: number;
    timestamp: number;
}

export interface ReasoningResult {
    decision: 'EXECUTE' | 'WAIT' | 'SKIP';
    selectedOpportunity?: ArbitrageOpportunity;
    reasoning: string;
    confidence: number;
    aiAnalysis: string;
}

export interface FraxContracts {
    fraxToken: string;
    usdcToken: string;
    fraxswapRouter: string;
}

export interface KRWQData {
    price: number;
    volume24h: number;
    lastUpdate: number;
}
