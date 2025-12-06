/**
 * FraxGuardian AI - Contract Configuration
 * Smart contract addresses and ABIs for Frax Finance ecosystem
 */

export interface ContractAddresses {
    fraxToken: string;
    usdcToken: string;
    fraxswapRouter: string;
    // Add more as needed
}

// Base Sepolia Testnet Addresses (Placeholder - update with actual addresses)
export const BASE_SEPOLIA_CONTRACTS: ContractAddresses = {
    fraxToken: '0x0000000000000000000000000000000000000000', // Update with actual FRAX address
    usdcToken: '0x0000000000000000000000000000000000000000', // Update with actual USDC address
    fraxswapRouter: '0x0000000000000000000000000000000000000000', // Update with actual router
};

// Minimal ERC20 ABI for token interactions
export const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
] as const;

// Minimal UniswapV2 Pair ABI for price fetching
export const UNISWAP_V2_PAIR_ABI = [
    'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'function totalSupply() view returns (uint256)',
] as const;

// Minimal Router ABI for swap operations
export const FRAXSWAP_ROUTER_ABI = [
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)',
    'function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)',
] as const;

// Network Configuration
export const NETWORK_CONFIG = {
    baseSepolia: {
        chainId: 84532,
        name: 'Base Sepolia',
        rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
        blockExplorer: 'https://sepolia.basescan.org',
    },
} as const;
