/**
 * Demo Script - Run without requiring API keys
 * Shows FraxGuardian AI capabilities with simulated data
 */

import { FraxGuardianAgent } from './agent/index.js';

console.log('='.repeat(80));
console.log('🛡️  FRAXGUARDIAN AI - DEMO MODE');
console.log('='.repeat(80));
console.log();
console.log('This demo runs in SIMULATION mode - no API keys required');
console.log('The agent will demonstrate:');
console.log('  ✓ Perception: Detecting arbitrage opportunities');
console.log('  ✓ Reasoning: AI-powered risk assessment');
console.log('  ✓ Action: Simulated trade execution');
console.log();
console.log('Press Ctrl+C to stop at any time');
console.log();
console.log('='.repeat(80));
console.log();

// Create agent without requiring API keys for demo
const agent = new FraxGuardianAgent({
    executionMode: 'simulation',
    openAiApiKey: 'demo-mode', // Demo mode - no actual API calls
    rpcUrl: 'https://sepolia.base.org',
    minProfitThreshold: 0.003,
});

// Run 3 iterations for demo
agent.run(3).catch((error) => {
    console.error('\n❌ Demo error:', error.message);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Demo stopped by user');
    agent.stop();
    process.exit(0);
});
