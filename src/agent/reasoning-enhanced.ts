/**
 * FraxGuardian AI - Enhanced Reasoning Module (Day 2)
 * Advanced AI-powered decision making with improved risk assessment
 */

import { ChatOpenAI } from '@langchain/openai';
import {
    ArbitrageOpportunity,
    ReasoningResult,
    RiskScore,
    PerceptionData,
} from '../types/index.js';
import { EnhancedRiskEngine } from './risk-engine.js';
import { SYSTEM_PROMPT, OPPORTUNITY_ANALYSIS_PROMPT } from './prompts.js';

export class EnhancedReasoningModule {
    private llm: ChatOpenAI;
    private minProfitThreshold: number;

    constructor(openAiApiKey: string, minProfitThreshold: number = 5) {
        this.llm = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo',
            temperature: 0.3,
            openAIApiKey: openAiApiKey,
        });
        this.minProfitThreshold = minProfitThreshold;
    }

    /**
     * Main reasoning function - analyze opportunities with enhanced risk assessment
     */
    async reason(perceptionData: PerceptionData): Promise<ReasoningResult> {
        console.log('🧠 REASONING: Analyzing opportunities with enhanced AI...');

        if (perceptionData.opportunities.length === 0) {
            return {
                decision: 'WAIT',
                reasoning: 'No opportunities detected',
                confidence: 1.0,
                aiAnalysis: 'No arbitrage opportunities found in current market conditions.',
            };
        }

        // Calculate enhanced risk scores for all opportunities
        const scoredOpportunities = perceptionData.opportunities.map((opp) =>
            this.calculateEnhancedRiskScore(opp, perceptionData)
        );

        // Sort by net profit (descending)
        scoredOpportunities.sort((a, b) => b.netProfitUsd - a.netProfitUsd);

        // Select best opportunity
        const bestOpportunity = scoredOpportunities[0];

        // Get AI analysis for the best opportunity
        const aiAnalysis = await this.getEnhancedAIAnalysis(bestOpportunity, perceptionData);

        // Make decision based on enhanced risk score
        const decision = EnhancedRiskEngine.getRecommendation(
            bestOpportunity.riskScore.overall,
            bestOpportunity.netProfitUsd,
            this.minProfitThreshold
        );

        const result: ReasoningResult = {
            decision,
            selectedOpportunity: bestOpportunity,
            reasoning: bestOpportunity.riskScore.reasoning,
            confidence: this.calculateConfidence(bestOpportunity),
            aiAnalysis,
        };

        console.log(`✅ REASONING: Decision = ${decision} | Confidence = ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`   Risk Category: ${bestOpportunity.riskScore.overall < 35 ? 'LOW' : bestOpportunity.riskScore.overall < 65 ? 'MEDIUM' : 'HIGH'}`);

        return result;
    }

    /**
     * Calculate comprehensive risk score using enhanced engine
     */
    private calculateEnhancedRiskScore(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): ArbitrageOpportunity {
        const riskAssessment = EnhancedRiskEngine.calculateRisk(opportunity, perceptionData);

        const riskScore: RiskScore = {
            overall: riskAssessment.overall,
            factors: {
                liquidityRisk: riskAssessment.factors.liquidityRisk,
                priceImpactRisk: riskAssessment.factors.priceImpactRisk,
                gasCostRisk: riskAssessment.factors.gasCostRisk,
                volatilityRisk: riskAssessment.factors.volatilityRisk,
            },
            recommendation: EnhancedRiskEngine.getRecommendation(
                riskAssessment.overall,
                opportunity.netProfitUsd,
                this.minProfitThreshold
            ),
            reasoning: EnhancedRiskEngine.explainRisk(
                riskAssessment.overall,
                riskAssessment.factors,
                opportunity.netProfitUsd
            ),
        };

        return {
            ...opportunity,
            riskScore,
        };
    }

    /**
     * Get enhanced AI analysis using improved prompts
     */
    private async getEnhancedAIAnalysis(
        opportunity: ArbitrageOpportunity,
        perceptionData: PerceptionData
    ): Promise<string> {
        // Skip AI analysis in demo mode
        if (this.llm.openAIApiKey === 'demo-mode') {
            return `[Demo Mode] ${opportunity.riskScore.reasoning}`;
        }

        try {
            const prompt = OPPORTUNITY_ANALYSIS_PROMPT({
                sourcePool: opportunity.sourcePool,
                targetPool: opportunity.targetPool,
                sourcePriceFrax: opportunity.sourcePriceFrax,
                targetPriceFrax: opportunity.targetPriceFrax,
                priceDifferencePercent: opportunity.priceDifferencePercent,
                netProfitUsd: opportunity.netProfitUsd,
                gasCostUsd: opportunity.estimatedGasCostUsd,
                riskScore: opportunity.riskScore.overall,
                gasPrice: perceptionData.gasPrice,
                liquidityAvailable: opportunity.liquidityAvailable,
            });

            const response = await this.llm.invoke([
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt },
            ] as any);

            return response.content as string;
        } catch (error) {
            // Silently fall back to risk score reasoning
            return `${opportunity.riskScore.reasoning}`;
        }
    }

    /**
     * Calculate confidence level with enhanced factors
     */
    private calculateConfidence(opportunity: ArbitrageOpportunity): number {
        // Higher confidence for:
        // 1. Lower risk
        // 2. Higher profit
        // 3. Better profit/gas ratio

        const riskFactor = (100 - opportunity.riskScore.overall) / 100;
        const profitFactor = Math.min(opportunity.netProfitUsd / 50, 1);
        const profitGasRatio = opportunity.netProfitUsd / (opportunity.netProfitUsd + opportunity.estimatedGasCostUsd);

        return (riskFactor * 0.5 + profitFactor * 0.3 + profitGasRatio * 0.2);
    }
}
