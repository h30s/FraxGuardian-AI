/**
 * FraxGuardian AI - Main Agent (ADK-TS Implementation)
 * Uses the official @iqai/adk API: createFunctionTool, LlmAgent, AgentBuilder
 */

import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { AgentBuilder, createFunctionTool, LlmAgent } from '@iqai/adk';
import { PerceptionModule } from './perception.js';
import { ActionModule } from './action.js';
import { createProvider, createSigner } from '../utils/blockchain.js';
import { AgentConfig, ExecutionResult, PerceptionData, ArbitrageOpportunity } from '../types/index.js';

// Load environment variables
dotenv.config();

// Global instances for tools to access
let perceptionModuleInstance: PerceptionModule | null = null;

/**
 * Scans Frax Finance pools for arbitrage opportunities.
 * Use this to detect profitable arbitrage opportunities in the Frax ecosystem.
 */
async function scanFraxOpportunities(): Promise<string> {
    if (!perceptionModuleInstance) {
        return JSON.stringify({
            status: 'error',
            message: 'Perception module not initialized'
        });
    }

    const data = await perceptionModuleInstance.perceive();

    if (data.opportunities.length === 0) {
        return JSON.stringify({
            status: 'no_opportunities',
            message: 'No arbitrage opportunities found',
            gasPrice: data.gasPrice,
            krwqPrice: data.krwqPrice
        });
    }

    const opp = data.opportunities[0];
    return JSON.stringify({
        status: 'opportunity_found',
        opportunity: {
            sourcePool: opp.sourcePool,
            targetPool: opp.targetPool,
            sourcePriceFrax: opp.sourcePriceFrax,
            targetPriceFrax: opp.targetPriceFrax,
            priceDifferencePercent: opp.priceDifferencePercent,
            netProfitUsd: opp.netProfitUsd,
            estimatedGasCostUsd: opp.estimatedGasCostUsd,
            liquidityAvailable: opp.liquidityAvailable
        },
        gasPrice: data.gasPrice,
        krwqPrice: data.krwqPrice,
        opportunityCount: data.opportunities.length
    }, null, 2);
}

/**
 * Calculates a comprehensive 4-factor risk score for an arbitrage opportunity.
 * Use this to assess whether an opportunity is safe to execute.
 * 
 * @param priceDifferencePercent - The price difference percentage between pools
 * @param netProfitUsd - The estimated net profit in USD
 * @param liquidityAvailable - The available liquidity in the pool
 * @param gasPriceGwei - The current gas price in Gwei
 */
function assessRisk(
    priceDifferencePercent: number,
    netProfitUsd: number,
    liquidityAvailable: number,
    gasPriceGwei: number
): string {
    // Risk Factor 1: Liquidity Risk (0-100)
    const liquidityRisk = liquidityAvailable < 100000 ? 70 : liquidityAvailable < 500000 ? 40 : 20;

    // Risk Factor 2: Price Impact Risk (0-100)
    const priceImpactRisk = priceDifferencePercent > 2 ? 60 : 30;

    // Risk Factor 3: Gas Cost Risk (0-100)
    const gasCostRisk = gasPriceGwei > 50 ? 70 : gasPriceGwei > 20 ? 40 : 20;

    // Risk Factor 4: Volatility Risk (simplified)
    const volatilityRisk = 30;

    // Overall risk score (weighted average)
    const overallRisk = Math.round(
        liquidityRisk * 0.3 +
        priceImpactRisk * 0.2 +
        gasCostRisk * 0.3 +
        volatilityRisk * 0.2
    );

    let recommendation: 'EXECUTE' | 'WAIT' | 'SKIP';
    let reasoning: string;

    if (overallRisk < 40 && netProfitUsd > 5) {
        recommendation = 'EXECUTE';
        reasoning = `Low risk (${overallRisk}/100) with attractive profit ($${netProfitUsd.toFixed(2)})`;
    } else if (overallRisk < 60) {
        recommendation = 'WAIT';
        reasoning = `Moderate risk (${overallRisk}/100), monitor for better conditions`;
    } else {
        recommendation = 'SKIP';
        reasoning = `High risk (${overallRisk}/100) does not justify potential profit`;
    }

    const confidence = ((100 - overallRisk) / 100 * 0.6 + Math.min(netProfitUsd / 50, 1) * 0.4);

    return JSON.stringify({
        overallRisk,
        factors: {
            liquidityRisk,
            priceImpactRisk,
            gasCostRisk,
            volatilityRisk
        },
        recommendation,
        reasoning,
        confidence: confidence.toFixed(2)
    }, null, 2);
}

// Create ADK-TS Function Tools using the official API
const scanOpportunitiesTool = createFunctionTool(scanFraxOpportunities, {
    name: 'scan_frax_opportunities',
    description: 'Scans Frax Finance pools for arbitrage opportunities and returns market data including price differences, profit potential, and gas costs.'
});

const assessRiskTool = createFunctionTool(assessRisk, {
    name: 'assess_risk',
    description: 'Calculates a comprehensive 4-factor risk score (liquidity, price impact, gas cost, volatility) for an arbitrage opportunity and provides a recommendation (EXECUTE, WAIT, or SKIP).'
});

/**
 * FraxGuardian AI Agent using ADK-TS
 */
export class FraxGuardianAgent {
    private config: AgentConfig;
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet | null;
    private perception: PerceptionModule;
    private action: ActionModule;
    private isRunning: boolean = false;
    private executionHistory: ExecutionResult[] = [];

    constructor(config?: Partial<AgentConfig>) {
        // Load configuration
        this.config = {
            rpcUrl: process.env.RPC_URL || 'https://sepolia.base.org',
            privateKey: process.env.PRIVATE_KEY || '',
            openAiApiKey: process.env.OPENAI_API_KEY || '',
            minProfitThreshold: parseFloat(process.env.MIN_PROFIT_THRESHOLD || '0.003'),
            maxGasPriceGwei: parseInt(process.env.MAX_GAS_PRICE_GWEI || '50'),
            executionMode: (process.env.EXECUTION_MODE as any) || 'simulation',
            logLevel: (process.env.LOG_LEVEL as any) || 'info',
            ...config,
        };

        this.validateConfig();

        // Initialize blockchain connection
        this.provider = createProvider(this.config.rpcUrl);
        this.signer = this.config.privateKey
            ? createSigner(this.config.privateKey, this.provider)
            : null;

        // Initialize perception and action modules
        this.perception = new PerceptionModule(
            this.provider,
            this.config.minProfitThreshold
        );
        this.action = new ActionModule(
            this.provider,
            this.signer,
            this.config.executionMode
        );

        // Set global instance for tools to access
        perceptionModuleInstance = this.perception;

        console.log('🤖 FraxGuardian AI Agent (ADK-TS) initialized');
        console.log(`   Mode: ${this.config.executionMode.toUpperCase()}`);
        console.log(`   Min Profit: ${(this.config.minProfitThreshold * 100).toFixed(2)}%`);
        console.log(`   🔧 Tools: scan_frax_opportunities, assess_risk`);
        console.log(`   📦 Framework: @iqai/adk (createFunctionTool + LlmAgent)`);
    }

    private validateConfig(): void {
        if (!this.config.openAiApiKey && this.config.executionMode !== 'simulation') {
            console.warn('⚠️  No OpenAI API key - AI analysis will be limited');
        }

        if (this.config.executionMode !== 'simulation' && !this.config.privateKey) {
            throw new Error('Private key required for non-simulation execution');
        }
    }

    /**
     * Create the ADK-TS agent using the official API
     */
    private async createAgent() {
        // Create the agent using LlmAgent with tools
        const agent = new LlmAgent({
            name: 'frax_guardian_agent',
            description: 'Autonomous AI agent for profitable Frax Finance arbitrage',
            instruction: `You are FraxGuardian AI, an autonomous DeFi arbitrage agent.

Your mission: Find and analyze profitable arbitrage opportunities in Frax Finance pools.

WORKFLOW:
1. Use scan_frax_opportunities tool to detect arbitrage opportunities
2. If an opportunity is found, use assess_risk tool to calculate risk scores
3. Make a decision: EXECUTE, WAIT, or SKIP based on risk/reward
4. Explain your reasoning clearly

DECISION CRITERIA:
- EXECUTE: Risk < 40/100 AND profit > $5
- WAIT: Risk 40-60/100 
- SKIP: Risk > 60/100 OR profit < $5

Always provide:
1. Your decision (EXECUTE/WAIT/SKIP)
2. Risk analysis summary
3. Brief justification (2-3 sentences)`,
            tools: [scanOpportunitiesTool, assessRiskTool],
        });

        // Build with AgentBuilder for model configuration
        const { runner } = await AgentBuilder.create('frax_guardian_root')
            .withModel('gpt-3.5-turbo')
            .withDescription('Root agent for FraxGuardian arbitrage system')
            .withSubAgents([agent])
            .build();

        return runner;
    }

    /**
     * Run ADK-TS agent loop
     */
    async run(iterations: number = 1): Promise<void> {
        this.isRunning = true;
        console.log('\n🚀 Starting FraxGuardian AI Agent (ADK-TS)...\n');
        console.log('━'.repeat(80));

        // Create the agent
        const runner = await this.createAgent();

        for (let i = 0; i < iterations && this.isRunning; i++) {
            console.log(`\n📍 ITERATION ${i + 1}/${iterations}`);
            console.log('─'.repeat(80));

            try {
                // Use ADK-TS agent to perceive and reason
                const prompt = `Scan for Frax Finance arbitrage opportunities and decide whether to execute.`;

                console.log('🧠 ADK-TS AGENT: Processing with tools...\n');
                const response = await runner.ask(prompt);

                console.log('🤖 AGENT RESPONSE:\n', response);

                // Parse decision from agent output
                const decision = this.parseDecision(response);

                if (decision === 'EXECUTE') {
                    console.log('\n⚡ EXECUTING TRADE (SIMULATION)...');

                    // Get the latest perception data for execution
                    const perceptionData = await this.perception.perceive();

                    if (perceptionData.opportunities.length > 0) {
                        const opportunity = perceptionData.opportunities[0];
                        const executionResult = await this.action.execute(opportunity);

                        this.executionHistory.push(executionResult);

                        if (executionResult.success) {
                            console.log('\n🎉 EXECUTION SUCCESSFUL!');
                            console.log(`   Profit: $${executionResult.actualProfit?.toFixed(2)}`);
                            console.log(`   TX Hash: ${executionResult.transactionHash}`);
                        } else {
                            console.log('\n❌ EXECUTION FAILED');
                            console.log(`   Error: ${executionResult.error}`);
                        }
                    }
                } else {
                    console.log(`\n⏸️  SKIPPING EXECUTION: ${decision}`);
                }

                console.log('\n' + '━'.repeat(80));

                // Wait between iterations
                if (i < iterations - 1) {
                    await this.sleep(10000);
                }
            } catch (error) {
                console.error('\n❌ ERROR in ADK-TS agent loop:', error);
                if (error instanceof Error) {
                    console.error('   Message:', error.message);
                }
            }
        }

        this.isRunning = false;
        this.printSummary();
    }

    /**
     * Parse decision from agent output
     */
    private parseDecision(output: string): 'EXECUTE' | 'WAIT' | 'SKIP' {
        const upperOutput = output.toUpperCase();
        if (upperOutput.includes('EXECUTE')) return 'EXECUTE';
        if (upperOutput.includes('WAIT')) return 'WAIT';
        return 'SKIP';
    }

    private printSummary(): void {
        console.log('\n\n📊 EXECUTION SUMMARY (ADK-TS)');
        console.log('━'.repeat(80));
        console.log(`Total Executions: ${this.executionHistory.length}`);

        const successful = this.executionHistory.filter((r) => r.success).length;
        const failed = this.executionHistory.length - successful;

        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${failed}`);

        const totalProfit = this.executionHistory
            .filter((r) => r.success)
            .reduce((sum, r) => sum + (r.actualProfit || 0), 0);

        console.log(`Total Profit: $${totalProfit.toFixed(2)}`);
        console.log('━'.repeat(80));
        console.log('\n✅ ADK-TS Agent stopped\n');
    }

    stop(): void {
        console.log('\n⏸️  Stopping ADK-TS agent...');
        this.isRunning = false;
    }

    getExecutionHistory(): ExecutionResult[] {
        return this.executionHistory;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Run the agent if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const agent = new FraxGuardianAgent();

    agent.run(3).catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

    process.on('SIGINT', () => {
        console.log('\n\n🛑 Received SIGINT signal');
        agent.stop();
    });
}
