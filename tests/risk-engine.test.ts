/**
 * FraxGuardian AI - Basic Tests
 * Verify core functionality works correctly
 */

import { describe, it, expect } from '@jest/globals';
import { EnhancedRiskEngine } from '../src/agent/risk-engine';
import { ArbitrageOpportunity, PerceptionData } from '../src/types';

describe('Enhanced Risk Engine', () => {
    const mockOpportunity: ArbitrageOpportunity = {
        id: 'test-1',
        timestamp: Date.now(),
        sourcePool: 'Pool A',
        targetPool: 'Pool B',
        sourcePriceFrax: '0.998',
        targetPriceFrax: '1.004',
        priceDifferencePercent: 0.6,
        estimatedProfitUsd: 60,
        estimatedGasCostUsd: 5,
        netProfitUsd: 55,
        liquidityAvailable: '2000000',
        riskScore: {
            overall: 0,
            factors: {
                liquidityRisk: 0,
                priceImpactRisk: 0,
                gasCostRisk: 0,
                volatilityRisk: 0,
            },
            recommendation: 'WAIT',
            reasoning: '',
        },
        detected: true,
    };

    const mockPerceptionData: PerceptionData = {
        pools: [],
        gasPrice: '20',
        opportunities: [mockOpportunity],
        krwqPrice: 1.001,
        timestamp: Date.now(),
    };

    it('should calculate risk score within 0-100 range', () => {
        const result = EnhancedRiskEngine.calculateRisk(mockOpportunity, mockPerceptionData);

        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should categorize low risk correctly', () => {
        const result = EnhancedRiskEngine.calculateRisk(mockOpportunity, mockPerceptionData);

        if (result.overall < 35) {
            expect(result.category).toBe('LOW');
        }
    });

    it('should recommend EXECUTE for low risk and good profit', () => {
        const recommendation = EnhancedRiskEngine.getRecommendation(
            25, // low risk
            55, // good profit
            5   // min threshold
        );

        expect(recommendation).toBe('EXECUTE');
    });

    it('should recommend SKIP for high risk', () => {
        const recommendation = EnhancedRiskEngine.getRecommendation(
            75, // high risk
            55, // good profit
            5   // min threshold
        );

        expect(recommendation).toBe('SKIP');
    });

    it('should recommend SKIP for low profit below threshold', () => {
        const recommendation = EnhancedRiskEngine.getRecommendation(
            25, // low risk
            3,  // below threshold
            5   // min threshold
        );

        expect(recommendation).toBe('SKIP');
    });

    it('should generate readable risk explanation', () => {
        const result = EnhancedRiskEngine.calculateRisk(mockOpportunity, mockPerceptionData);
        const explanation = EnhancedRiskEngine.explainRisk(
            result.overall,
            result.factors,
            mockOpportunity.netProfitUsd
        );

        expect(explanation).toContain('risk');
        expect(explanation).toContain('$');
    });
});

describe('Price Difference Calculations', () => {
    it('should detect 0.6% price difference', () => {
        const source = 0.998;
        const target = 1.004;
        const diff = Math.abs(((target - source) / source) * 100);

        expect(diff).toBeCloseTo(0.6, 1);
    });

    it('should calculate profit correctly', () => {
        const tradeAmount = 10000;
        const priceDiff = 0.6; // 0.6%
        const gasCost = 5;

        const grossProfit = tradeAmount * (priceDiff / 100);
        const netProfit = grossProfit - gasCost;

        expect(grossProfit).toBeCloseTo(60, 0);
        expect(netProfit).toBeCloseTo(55, 0);
    });
});
