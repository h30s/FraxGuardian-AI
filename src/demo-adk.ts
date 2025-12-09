/**
 * FraxGuardian AI - ADK-TS Demo (Corrected)
 * Demonstrates the agent using official @iqai/adk API
 */

import dotenv from 'dotenv';
import { FraxGuardianAgentADK } from './agent/index-adk.js';

dotenv.config();

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️  FRAXGUARDIAN AI - ADK-TS POWERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 FRAMEWORK: @iqai/adk (Official Agent Development Kit)

📊 ADK-TS API USED:
   ✓ createFunctionTool() - Creates tools from TypeScript functions
   ✓ LlmAgent - Configures agent with tools and instructions
   ✓ AgentBuilder.create() - Fluent builder for agent orchestration
   ✓ runner.ask() - Executes agent queries

📦 TOOLS REGISTERED:
   1. scan_frax_opportunities - Scans blockchain for arbitrage
   2. assess_risk - 4-factor risk assessment

🏗️ ARCHITECTURE: Perception-Reasoning-Action with ADK-TS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

async function main() {
    try {
        // Create ADK-TS powered agent
        const agent = new FraxGuardianAgentADK({
            executionMode: 'simulation',
            minProfitThreshold: 0.003,
            maxGasPriceGwei: 50,
        });

        // Run for 3 iterations to demonstrate capabilities
        await agent.run(3);

        // Display execution history
        const history = agent.getExecutionHistory();

        if (history.length > 0) {
            console.log('\n\n📜 EXECUTION HISTORY:');
            console.log('━'.repeat(80));
            history.forEach((exec, i) => {
                console.log(`\n${i + 1}. ${exec.success ? '✅ SUCCESS' : '❌ FAILED'}`);
                if (exec.success) {
                    console.log(`   💰 Profit: $${exec.actualProfit?.toFixed(2)}`);
                    console.log(`   🔗 TX: ${exec.transactionHash?.substring(0, 20)}...`);
                    console.log(`   ⛽ Gas: ${exec.gasUsed}`);
                }
            });
            console.log('\n' + '━'.repeat(80));
        }

        console.log('\n\n🎉 ADK-TS DEMO COMPLETED!');
        console.log('\n💡 This demo showcases the OFFICIAL @iqai/adk API:');
        console.log('   • createFunctionTool() for creating tools');
        console.log('   • LlmAgent for agent configuration');
        console.log('   • AgentBuilder.create() for fluent building');
        console.log('   • runner.ask() for agent execution\n');

    } catch (error) {
        console.error('\n❌ Demo error:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('\n💡 Tips:');
            console.error('   1. Make sure you have OPENAI_API_KEY or GOOGLE_API_KEY in your .env file');
            console.error('   2. Run npm install to ensure @iqai/adk is installed');
            console.error('   3. Check https://adk.iqai.com/docs for documentation\n');
        }
        process.exit(1);
    }
}

main();
