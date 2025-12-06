/**
 * FraxGuardian AI - Blockchain Utilities
 * Helper functions for blockchain interactions using ethers.js
 */

import { ethers } from 'ethers';
import { PoolData } from '../types/index.js';
import { ERC20_ABI, UNISWAP_V2_PAIR_ABI } from '../config/contracts.js';

/**
 * Create a provider instance
 */
export function createProvider(rpcUrl: string): ethers.JsonRpcProvider {
    return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Create a signer from private key
 */
export function createSigner(
    privateKey: string,
    provider: ethers.JsonRpcProvider
): ethers.Wallet {
    return new ethers.Wallet(privateKey, provider);
}

/**
 * Get current gas price in Gwei
 */
export async function getGasPrice(provider: ethers.JsonRpcProvider): Promise<string> {
    try {
        const feeData = await provider.getFeeData();
        const gasPriceWei = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
        return ethers.formatUnits(gasPriceWei, 'gwei');
    } catch (error) {
        console.error('Error fetching gas price:', error);
        return '1'; // Default to 1 Gwei
    }
}

/**
 * Fetch pool reserves and calculate price
 */
export async function getPoolData(
    poolAddress: string,
    poolName: string,
    provider: ethers.JsonRpcProvider
): Promise<PoolData | null> {
    try {
        const pairContract = new ethers.Contract(poolAddress, UNISWAP_V2_PAIR_ABI, provider);

        const [reserves, token0Address, token1Address] = await Promise.all([
            pairContract.getReserves(),
            pairContract.token0(),
            pairContract.token1(),
        ]);

        const reserve0 = reserves[0];
        const reserve1 = reserves[1];

        // Calculate price (reserve1 / reserve0)
        const price = (Number(reserve1) / Number(reserve0)).toFixed(6);

        // Calculate liquidity (simplified - just sum of reserves)
        const liquidity = (Number(reserve0) + Number(reserve1)).toString();

        return {
            address: poolAddress,
            name: poolName,
            token0: token0Address,
            token1: token1Address,
            reserve0: reserve0.toString(),
            reserve1: reserve1.toString(),
            price,
            liquidity,
            lastUpdate: Date.now(),
        };
    } catch (error) {
        console.error(`Error fetching pool data for ${poolName}:`, error);
        return null;
    }
}

/**
 * Calculate price difference percentage between two pools
 */
export function calculatePriceDifference(price1: string, price2: string): number {
    const p1 = parseFloat(price1);
    const p2 = parseFloat(price2);

    if (p1 === 0 || p2 === 0) return 0;

    return Math.abs(((p2 - p1) / p1) * 100);
}

/**
 * Estimate profit from arbitrage (simplified)
 */
export function estimateProfit(
    priceDiff: number,
    tradeAmount: number,
    gasCostUsd: number
): { gross: number; net: number } {
    // Simplified profit calculation
    // In reality, you'd need to account for slippage, fees, etc.
    const grossProfit = tradeAmount * (priceDiff / 100);
    const netProfit = grossProfit - gasCostUsd;

    return {
        gross: grossProfit,
        net: netProfit,
    };
}

/**
 * Format wei to human-readable format
 */
export function formatWei(wei: bigint, decimals: number = 18): string {
    return ethers.formatUnits(wei, decimals);
}

/**
 * Parse human-readable value to wei
 */
export function parseToWei(value: string, decimals: number = 18): bigint {
    return ethers.parseUnits(value, decimals);
}

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): boolean {
    try {
        return ethers.isAddress(address);
    } catch {
        return false;
    }
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
