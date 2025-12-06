/**
 * Enhanced Risk Scoring Engine
 * Advanced algorithms for multi-factor risk assessment
 */

import { ArbitrageOpportunity, PerceptionData } from '../types/index.js';

export interface RiskFactors {
    liquidityRisk: number;
    priceImpactRisk: number;
    gasCostRisk: number;
    volatilityRisk: number;
    slippageRisk: number;
    competitionRisk: number;
}

export class EnhancedRiskEngine {
    /**
     * Calculate comprehensive risk score with 6 factors
     */
    static calculateRisk(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): { overall: number; factors: RiskFactors; category: 'LOW' | 'MEDIUM' | 'HIGH' } {
        const factors = this.calculateAllFactors(opportunity, perceptionData);

        // Weighted average of all risk factors
        const overall = Math.round(
            factors.liquidityRisk * 0.25 +
            factors.priceImpactRisk * 0.20 +
            factors.gasCostRisk * 0.20 +
            factors.volatilityRisk * 0.15 +
            factors.slippageRisk * 0.10 +
            factors.competitionRisk * 0.10
        );

        const category = overall < 35 ? 'LOW' : overall < 65 ? 'MEDIUM' : 'HIGH';

        return { overall, factors, category };
    }

    /**
     * Calculate all individual risk factors
     */
    private static calculateAllFactors(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): RiskFactors {
        return {
            liquidityRisk: this.calculateLiquidityRisk(opportunity),
            priceImpactRisk: this.calculatePriceImpactRisk(opportunity),
            gasCostRisk: this.calculateGasCostRisk(opportunity, perceptionData),
            volatilityRisk: this.calculateVolatilityRisk(opportunity),
            slippageRisk: this.calculateSlippageRisk(opportunity),
            competitionRisk: this.calculateCompetitionRisk(opportunity),
        };
    }

    /**
     * Liquidity Risk: Based on pool depth
     */
    private static calculateLiquidityRisk(opportunity: ArbitrageOpportunity): number {
        const liquidity = parseFloat(opportunity.liquidityAvailable);

        // Thresholds based on DeFi best practices
        if (liquidity > 5_000_000) return 10; // Very safe
        if (liquidity > 1_000_000) return 25; // Safe
        if (liquidity > 500_000) return 40;   // Moderate
        if (liquidity > 100_000) return 65;   // Risky
        return 90; // Very risky
    }

    /**
     * Price Impact Risk: Based on trade size vs liquidity
     */
    private static calculatePriceImpactRisk(opportunity: ArbitrageOpportunity): number {
        const priceDiff = opportunity.priceDifferencePercent;

        // Large price differences may indicate:
        // 1. Low liquidity (risky)
        // 2. Market inefficiency (opportunity)
        // 3. Price manipulation (very risky)

        if (priceDiff < 0.5) return 20;  // Normal spread
        if (priceDiff < 1.0) return 35;  // Moderate spread
        if (priceDiff < 2.0) return 50;  // Large spread
        if (priceDiff < 5.0) return 70;  // Very large spread (suspicious)
        return 95; // Extreme spread (likely issue)
    }

    /**
     * Gas Cost Risk: Profit margin vs gas costs
     */
    private static calculateGasCostRisk(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): number {
        const gasPriceGwei = parseFloat(perceptionData.gasPrice);
        const profitMargin = opportunity.netProfitUsd / (opportunity.netProfitUsd + opportunity.estimatedGasCostUsd);

        // High gas prices
        if (gasPriceGwei > 100) return 80;
        if (gasPriceGwei > 50) return 60;

        // Profit margin concerns
        if (profitMargin < 0.3) return 70; // Gas eating 70%+ of profit
        if (profitMargin < 0.5) return 50; // Gas eating 50%+ of profit
        if (profitMargin < 0.7) return 30; // Gas eating 30%+ of profit

        return 15; // Good profit/gas ratio
    }

    /**
     * Volatility Risk: Price stability assessment
     */
    private static calculateVolatilityRisk(opportunity: ArbitrageOpportunity): number {
        // For stable pairs like FRAX/USDC, volatility should be low
        // In production, this would use historical price variance

        const sourceFrax = parseFloat(opportunity.sourcePriceFrax);
        const targetFrax = parseFloat(opportunity.targetPriceFrax);
        const avgPrice = (sourceFrax + targetFrax) / 2;

        // FRAX should be ~$1.00
        const deviationFromPeg = Math.abs(avgPrice - 1.0);

        if (deviationFromPeg < 0.005) return 10;  // <0.5% from peg
        if (deviationFromPeg < 0.01) return 25;   // <1% from peg
        if (deviationFromPeg < 0.02) return 45;   // <2% from peg
        if (deviationFromPeg < 0.05) return 70;   // <5% from peg
        return 95; // Major de-pegging event
    }

    /**
     * Slippage Risk: Estimated slippage during execution
     */
    private static calculateSlippageRisk(opportunity: ArbitrageOpportunity): number {
        const liquidity = parseFloat(opportunity.liquidityAvailable);
        const estimatedTradeSize = 10000; // $10k trade for calculation

        // Slippage = Trade Size / Available Liquidity
        const slippageRatio = estimatedTradeSize / liquidity;

        if (slippageRatio < 0.001) return 10;  // <0.1% slippage
        if (slippageRatio < 0.005) return 25;  // <0.5% slippage
        if (slippageRatio < 0.01) return 40;   // <1% slippage
        if (slippageRatio < 0.02) return 60;   // <2% slippage
        return 85; // High slippage expected
    }

    /**
     * Competition Risk: MEV bot competition assessment
     */
    private static calculateCompetitionRisk(opportunity: ArbitrageOpportunity): number {
        // In testnet/simulation, lower competition
        // In mainnet, high competition for obvious opportunities

        const profitSize = opportunity.netProfitUsd;

        // Larger profits attract more MEV bots
        if (profitSize > 1000) return 75; // Very competitive
        if (profitSize > 500) return 60;  // Competitive
        if (profitSize > 100) return 45;  // Moderate competition
        if (profitSize > 50) return 30;   // Low competition
        return 20; // Minimal competition
    }

    /**
     * Get recommendation based on risk profile
     */
    static getRecommendation(
        riskScore: number,
        netProfit: number,
        minProfitThreshold: number
    ): 'EXECUTE' | 'WAIT' | 'SKIP' {
        // Must meet minimum profit threshold
        if (netProfit < minProfitThreshold) return 'SKIP';

        // Risk-based decision
        if (riskScore < 35 && netProfit > 10) return 'EXECUTE';  // Low risk, good profit
        if (riskScore < 50 && netProfit > 25) return 'EXECUTE';  // Medium risk, high profit
        if (riskScore < 65) return 'WAIT';                       // Moderate risk, monitor
        return 'SKIP';                                           // High risk, avoid
    }

    /**
     * Generate human-readable explanation
     */
    static explainRisk(
        riskScore: number,
        factors: RiskFactors,
        netProfit: number
    ): string {
        const category = riskScore < 35 ? 'LOW' : riskScore < 65 ? 'MEDIUM' : 'HIGH';

        // Find highest risk factor
        const factorEntries = Object.entries(factors);
        const highestRisk = factorEntries.reduce((max, current) =>
            current[1] > max[1] ? current : max
        );

        const factorName = highestRisk[0].replace('Risk', '');

        return `${category} risk (${riskScore}/100). Main concern: ${factorName} (${highestRisk[1]}/100). ` +
            `Estimated profit: $${netProfit.toFixed(2)}.`;
    }
}
