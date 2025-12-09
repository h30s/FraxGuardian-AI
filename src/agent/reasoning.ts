/**
 * FraxGuardian AI - Reasoning Module (ADK-TS Implementation)
 * AI-powered decision making using official @iqai/adk API
 */

import { AgentBuilder, LlmAgent } from '@iqai/adk';
import {
    ArbitrageOpportunity,
    ReasoningResult,
    RiskScore,
    PerceptionData,
} from '../types/index.js';

export class ReasoningModule {
    private modelName: string;

    constructor(openAiApiKey?: string) {
        // Store model name for later use
        this.modelName = 'gpt-3.5-turbo';

        if (!openAiApiKey) {
            console.warn('⚠️ No OpenAI API key provided - AI analysis will use fallback');
        }
    }

    /**
     * Main reasoning function - analyze opportunities and make decisions
     */
    async reason(perceptionData: PerceptionData): Promise<ReasoningResult> {
        console.log('🧠 REASONING: Analyzing opportunities with ADK-TS AI...');

        if (perceptionData.opportunities.length === 0) {
            return {
                decision: 'WAIT',
                reasoning: 'No opportunities detected',
                confidence: 1.0,
                aiAnalysis: 'No arbitrage opportunities found in current market conditions.',
            };
        }

        // Calculate risk scores for all opportunities
        const scoredOpportunities = perceptionData.opportunities.map((opp) =>
            this.calculateRiskScore(opp, perceptionData)
        );

        // Sort by net profit (descending)
        scoredOpportunities.sort((a, b) => b.netProfitUsd - a.netProfitUsd);

        // Select best opportunity
        const bestOpportunity = scoredOpportunities[0];

        // Get AI analysis for the best opportunity using ADK-TS agent
        const aiAnalysis = await this.getAIAnalysis(bestOpportunity, perceptionData);

        // Make decision based on risk score and profit
        const decision = this.makeDecision(bestOpportunity);

        const result: ReasoningResult = {
            decision,
            selectedOpportunity: bestOpportunity,
            reasoning: bestOpportunity.riskScore.reasoning,
            confidence: this.calculateConfidence(bestOpportunity),
            aiAnalysis,
        };

        console.log(`✅ REASONING (ADK-TS): Decision = ${decision} | Confidence = ${(result.confidence * 100).toFixed(1)}%`);
        return result;
    }

    /**
     * Calculate comprehensive risk score for an opportunity
     */
    private calculateRiskScore(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): ArbitrageOpportunity {
        // Risk Factor 1: Liquidity Risk (0-100)
        const liquidityValue = parseFloat(opportunity.liquidityAvailable);
        const liquidityRisk = liquidityValue < 100000 ? 70 : liquidityValue < 500000 ? 40 : 20;

        // Risk Factor 2: Price Impact Risk (0-100)
        const priceImpactRisk = opportunity.priceDifferencePercent > 2 ? 60 : 30;

        // Risk Factor 3: Gas Cost Risk (0-100)
        const gasPriceGwei = parseFloat(perceptionData.gasPrice);
        const gasCostRisk = gasPriceGwei > 50 ? 70 : gasPriceGwei > 20 ? 40 : 20;

        // Risk Factor 4: Volatility Risk (simplified)
        const volatilityRisk = 30; // Placeholder

        // Overall risk score (weighted average)
        const overallRisk = Math.round(
            liquidityRisk * 0.3 +
            priceImpactRisk * 0.2 +
            gasCostRisk * 0.3 +
            volatilityRisk * 0.2
        );

        // Determine recommendation
        let recommendation: 'EXECUTE' | 'WAIT' | 'SKIP';
        let reasoning: string;

        if (overallRisk < 40 && opportunity.netProfitUsd > 5) {
            recommendation = 'EXECUTE';
            reasoning = `Low risk (${overallRisk}/100) with attractive profit potential ($${opportunity.netProfitUsd.toFixed(2)})`;
        } else if (overallRisk < 60) {
            recommendation = 'WAIT';
            reasoning = `Moderate risk (${overallRisk}/100), monitoring for better conditions`;
        } else {
            recommendation = 'SKIP';
            reasoning = `High risk (${overallRisk}/100) does not justify potential profit`;
        }

        const riskScore: RiskScore = {
            overall: overallRisk,
            factors: {
                liquidityRisk,
                priceImpactRisk,
                gasCostRisk,
                volatilityRisk,
            },
            recommendation,
            reasoning,
        };

        return {
            ...opportunity,
            riskScore,
        };
    }

    /**
     * Get AI analysis using ADK-TS agent
     */
    private async getAIAnalysis(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): Promise<string> {
        try {
            // Create a simple reasoning agent using AgentBuilder
            const { runner } = await AgentBuilder.create('reasoning_agent')
                .withModel(this.modelName)
                .withDescription('Expert DeFi arbitrage analyst')
                .withInstruction(`You are FraxGuardian AI, an elite DeFi arbitrage analyst.
Your expertise is in analyzing arbitrage opportunities in the Frax Finance ecosystem.
You provide concise, actionable analysis focusing on:
1. Profit margin assessment (risk vs reward)
2. Execution risks (gas, slippage, competition)
3. Market conditions
4. Clear recommendation: EXECUTE, WAIT, or SKIP

Always be brief (2-3 sentences) and decisive.`)
                .build();

            const prompt = `Analyze this Frax Finance arbitrage opportunity:

Opportunity Details:
- Source Pool: ${opportunity.sourcePool} (Price: $${opportunity.sourcePriceFrax})
- Target Pool: ${opportunity.targetPool} (Price: $${opportunity.targetPriceFrax})
- Price Difference: ${opportunity.priceDifferencePercent.toFixed(2)}%
- Estimated Net Profit: $${opportunity.netProfitUsd.toFixed(2)}
- Gas Cost: $${opportunity.estimatedGasCostUsd.toFixed(2)}
- Risk Score: ${opportunity.riskScore.overall}/100

Market Context:
- Current Gas Price: ${perceptionData.gasPrice} Gwei
- KRWQ Price: $${perceptionData.krwqPrice || 'N/A'}

Provide your analysis and recommendation.`;

            // Use ADK-TS runner to get response
            const response = await runner.ask(prompt);
            return response || 'Analysis completed.';
        } catch (error) {
            console.error('Error getting ADK-TS AI analysis:', error);
            return `Analysis unavailable. Risk score: ${opportunity.riskScore.overall}/100. ${opportunity.riskScore.reasoning}`;
        }
    }

    /**
     * Make final decision based on risk assessment
     */
    private makeDecision(opportunity: ArbitrageOpportunity): 'EXECUTE' | 'WAIT' | 'SKIP' {
        return opportunity.riskScore.recommendation;
    }

    /**
     * Calculate confidence level (0-1)
     */
    private calculateConfidence(opportunity: ArbitrageOpportunity): number {
        // Higher confidence for lower risk and higher profit
        const riskFactor = (100 - opportunity.riskScore.overall) / 100;
        const profitFactor = Math.min(opportunity.netProfitUsd / 50, 1);

        return (riskFactor * 0.6 + profitFactor * 0.4);
    }
}
