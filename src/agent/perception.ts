/**
 * FraxGuardian AI - Perception Module
 * Data gathering and opportunity detection (ADK-TS Perception Layer)
 */

import { ethers } from 'ethers';
import {
    PerceptionData,
    ArbitrageOpportunity,
    PoolData,
    KRWQData,
} from '../types/index.js';
import { getPoolData, getGasPrice, calculatePriceDifference, estimateProfit } from '../utils/blockchain.js';

export class PerceptionModule {
    private provider: ethers.JsonRpcProvider;
    private minProfitThreshold: number;

    constructor(provider: ethers.JsonRpcProvider, minProfitThreshold: number = 0.003) {
        this.provider = provider;
        this.minProfitThreshold = minProfitThreshold;
    }

    /**
     * Main perception function - gather all data from blockchain
     */
    async perceive(): Promise<PerceptionData> {
        console.log('🔍 PERCEPTION: Scanning blockchain for opportunities...');

        // For MVP, we'll simulate pool data since we might not have testnet pools
        // In production, you'd fetch from actual contract addresses
        const pools = await this.fetchPoolData();
        const gasPrice = await getGasPrice(this.provider);
        const krwqPrice = await this.fetchKRWQPrice();

        // Detect arbitrage opportunities
        const opportunities = this.detectOpportunities(pools, parseFloat(gasPrice));

        const perceptionData: PerceptionData = {
            pools,
            gasPrice,
            opportunities,
            krwqPrice: krwqPrice?.price,
            timestamp: Date.now(),
        };

        console.log(`✅ PERCEPTION: Found ${opportunities.length} potential opportunities`);
        return perceptionData;
    }

    /**
     * Fetch pool data from blockchain
     */
    private async fetchPoolData(): Promise<PoolData[]> {
        // For MVP/Demo: Simulate pool data with realistic values
        // In production, replace with actual contract calls
        console.log('📊 Fetching pool data...');

        // Simulated pools for demo
        const simulatedPools: PoolData[] = [
            {
                address: '0x1111111111111111111111111111111111111111',
                name: 'FraxSwap FRAX/USDC Pool A',
                token0: '0xFRAX0000000000000000000000000000',
                token1: '0xUSDC0000000000000000000000000000',
                reserve0: ethers.parseUnits('1000000', 18).toString(),
                reserve1: ethers.parseUnits('998000', 6).toString(),
                price: '0.998',
                liquidity: ethers.parseUnits('2000000', 18).toString(),
                lastUpdate: Date.now(),
            },
            {
                address: '0x2222222222222222222222222222222222222222',
                name: 'FraxSwap FRAX/USDC Pool B',
                token0: '0xFRAX0000000000000000000000000000',
                token1: '0xUSDC0000000000000000000000000000',
                reserve0: ethers.parseUnits('500000', 18).toString(),
                reserve1: ethers.parseUnits('502000', 6).toString(),
                price: '1.004',
                liquidity: ethers.parseUnits('1000000', 18).toString(),
                lastUpdate: Date.now(),
            },
        ];

        return simulatedPools;

        /* Uncomment for real contract interaction:
        const poolAddresses = [
          { address: process.env.POOL_A_ADDRESS!, name: 'Pool A' },
          { address: process.env.POOL_B_ADDRESS!, name: 'Pool B' },
        ];
    
        const poolDataPromises = poolAddresses.map(({ address, name }) =>
          getPoolData(address, name, this.provider)
        );
    
        const results = await Promise.all(poolDataPromises);
        return results.filter((pool): pool is PoolData => pool !== null);
        */
    }

    /**
     * Detect arbitrage opportunities by comparing pool prices
     */
    private detectOpportunities(
        pools: PoolData[],
        gasPriceGwei: number
    ): ArbitrageOpportunity[] {
        const opportunities: ArbitrageOpportunity[] = [];

        // Compare each pool pair
        for (let i = 0; i < pools.length; i++) {
            for (let j = i + 1; j < pools.length; j++) {
                const poolA = pools[i];
                const poolB = pools[j];

                const priceDiff = calculatePriceDifference(poolA.price, poolB.price);

                // Check if price difference exceeds threshold (0.3% = 0.003)
                if (priceDiff >= this.minProfitThreshold * 100) {
                    // Estimate profit (simplified calculation)
                    const tradeAmountUsd = 1000; // $1000 trade for simulation
                    const gasCostUsd = gasPriceGwei * 0.001; // Simplified gas cost
                    const profit = estimateProfit(priceDiff, tradeAmountUsd, gasCostUsd);

                    const opportunity: ArbitrageOpportunity = {
                        id: `opp_${Date.now()}_${i}_${j}`,
                        timestamp: Date.now(),
                        sourcePool: poolA.name,
                        targetPool: poolB.name,
                        sourcePriceFrax: poolA.price,
                        targetPriceFrax: poolB.price,
                        priceDifferencePercent: priceDiff,
                        estimatedProfitUsd: profit.gross,
                        estimatedGasCostUsd: gasCostUsd,
                        netProfitUsd: profit.net,
                        liquidityAvailable: poolA.liquidity,
                        riskScore: {
                            overall: 50, // Will be calculated by reasoning module
                            factors: {
                                liquidityRisk: 0,
                                priceImpactRisk: 0,
                                gasCostRisk: 0,
                                volatilityRisk: 0,
                            },
                            recommendation: 'WAIT',
                            reasoning: 'Awaiting AI analysis',
                        },
                        detected: true,
                    };

                    opportunities.push(opportunity);
                    console.log(
                        `💡 Found opportunity: ${poolA.name} → ${poolB.name} | Profit: $${profit.net.toFixed(2)}`
                    );
                }
            }
        }

        return opportunities;
    }

    /**
     * Fetch KRWQ price data (simulated for demo)
     */
    private async fetchKRWQPrice(): Promise<KRWQData | null> {
        try {
            // For MVP: Simulate KRWQ data
            // In production, integrate with actual KRWQ API
            return {
                price: 1.001,
                volume24h: 150000,
                lastUpdate: Date.now(),
            };

            /* Uncomment for real API integration:
            const response = await fetch(process.env.KRWQ_API_ENDPOINT!);
            const data = await response.json();
            return {
              price: data.price,
              volume24h: data.volume24h,
              lastUpdate: Date.now(),
            };
            */
        } catch (error) {
            console.error('Error fetching KRWQ price:', error);
            return null;
        }
    }
}
