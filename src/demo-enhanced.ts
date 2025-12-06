/**
 * Enhanced Demo - Showcase Day 2 Improvements
 * Demonstrates advanced risk engine and AI analysis
 */

import { FraxGuardianAgent } from './agent/index.js';
import { EnhancedRiskEngine } from './agent/risk-engine.js';

console.log('━'.repeat(80));
console.log('🛡️  FRAXGUARDIAN AI - ENHANCED DEMO (Day 2)');
console.log('━'.repeat(80));
console.log();
console.log('🚀 NEW FEATURES:');
console.log('   ✓ 6-factor risk assessment (up from 4)');
console.log('   ✓ MEV competition analysis');
console.log('   ✓ Slippage prediction');
console.log('   ✓ Advanced AI prompts');
console.log('   ✓ Enhanced confidence scoring');
console.log();
console.log('📊 This demo showcases:');
console.log('   • Sophisticated risk categorization (LOW/MEDIUM/HIGH)');
console.log('   • Improved decision-making algorithms');
console.log('   • Professional output formatting');
console.log();
console.log('━'.repeat(80));
console.log();

// Create agent with enhanced reasoning
const agent = new FraxGuardianAgent({
    executionMode: 'simulation',
    openAiApiKey: 'demo-mode',
    rpcUrl: 'https://sepolia.base.org',
    minProfitThreshold: 0.003,
});

console.log('⚙️  Configuration:');
console.log('   - Execution Mode: SIMULATION (safe testing)');
console.log('   - Min Profit: 0.3%');
console.log('   - Risk Engine: ENHANCED (6 factors)');
console.log('   - AI Analysis: GPT-powered');
console.log();
console.log('━'.repeat(80));
console.log();

// Run 3 iterations
agent.run(3).catch((error) => {
    console.error('\n❌ Demo error:', error.message);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Demo stopped by user');
    agent.stop();

    console.log();
    console.log('━'.repeat(80));
    console.log('📚 LEARN MORE:');
    console.log('   • README.md - Project overview');
    console.log('   • docs/ADK-TS-USAGE.md - Framework implementation');
    console.log('   • docs/ARCHITECTURE.md - Technical deep-dive');
    console.log('   • docs/BUSINESS_MODEL.md - Revenue model');
    console.log('━'.repeat(80));

    process.exit(0);
});
