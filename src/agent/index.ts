/**
 * FraxGuardian AI - Main Agent
 * ADK-TS Agent orchestrating Perception → Reasoning → Action loop
 */

import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { PerceptionModule } from './perception.js';
import { ReasoningModule } from './reasoning.js';
import { ActionModule } from './action.js';
import { createProvider, createSigner } from '../utils/blockchain.js';
import { AgentConfig, ExecutionResult } from '../types/index.js';

// Load environment variables
dotenv.config();

export class FraxGuardianAgent {
    private config: AgentConfig;
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet | null;
    private perception: PerceptionModule;
    private reasoning: ReasoningModule;
    private action: ActionModule;
    private isRunning: boolean = false;
    private executionHistory: ExecutionResult[] = [];

    constructor(config?: Partial<AgentConfig>) {
        // Load configuration from environment or defaults
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

        // Validate configuration
        this.validateConfig();

        // Initialize blockchain connection
        this.provider = createProvider(this.config.rpcUrl);
        this.signer = this.config.privateKey
            ? createSigner(this.config.privateKey, this.provider)
            : null;

        // Initialize agent modules
        this.perception = new PerceptionModule(
            this.provider,
            this.config.minProfitThreshold
        );
        this.reasoning = new ReasoningModule(this.config.openAiApiKey);
        this.action = new ActionModule(
            this.provider,
            this.signer,
            this.config.executionMode
        );

        console.log('🤖 FraxGuardian AI Agent initialized');
        console.log(`   Mode: ${this.config.executionMode.toUpperCase()}`);
        console.log(`   Min Profit: ${(this.config.minProfitThreshold * 100).toFixed(2)}%`);
    }

    /**
     * Validate agent configuration
     */
    private validateConfig(): void {
        if (!this.config.openAiApiKey && this.config.executionMode !== 'simulation') {
            console.warn('⚠️  No OpenAI API key provided - AI analysis will be limited');
        }

        if (this.config.executionMode !== 'simulation' && !this.config.privateKey) {
            throw new Error('Private key required for non-simulation execution');
        }
    }

    /**
     * Main agent loop - Perception → Reasoning → Action
     */
    async run(iterations: number = 1): Promise<void> {
        this.isRunning = true;
        console.log('\n🚀 Starting FraxGuardian AI Agent...\n');
        console.log('='.repeat(80));

        for (let i = 0; i < iterations && this.isRunning; i++) {
            console.log(`\n📍 ITERATION ${i + 1}/${iterations}`);
            console.log('─'.repeat(80));

            try {
                // STEP 1: PERCEPTION - Gather data and detect opportunities
                const perceptionData = await this.perception.perceive();

                if (perceptionData.opportunities.length === 0) {
                    console.log('😴 No opportunities detected. Waiting for next iteration...\n');
                    await this.sleep(5000); // Wait 5 seconds
                    continue;
                }

                // STEP 2: REASONING - Analyze and make decision
                const reasoningResult = await this.reasoning.reason(perceptionData);

                console.log('\n📊 REASONING RESULT:');
                console.log(`   Decision: ${reasoningResult.decision}`);
                console.log(`   Confidence: ${(reasoningResult.confidence * 100).toFixed(1)}%`);
                console.log(`   Reasoning: ${reasoningResult.reasoning}`);

                if (this.config.openAiApiKey) {
                    console.log('\n🤖 AI ANALYSIS:');
                    console.log(`   ${reasoningResult.aiAnalysis}`);
                }

                // STEP 3: ACTION - Execute if decision is EXECUTE
                if (reasoningResult.decision === 'EXECUTE' && reasoningResult.selectedOpportunity) {
                    console.log('\n⚡ EXECUTING TRADE...');

                    const executionResult = await this.action.execute(
                        reasoningResult.selectedOpportunity
                    );

                    this.executionHistory.push(executionResult);

                    if (executionResult.success) {
                        console.log('\n🎉 EXECUTION SUCCESSFUL!');
                        console.log(`   Profit: $${executionResult.actualProfit?.toFixed(2)}`);
                        console.log(`   TX Hash: ${executionResult.transactionHash}`);
                    } else {
                        console.log('\n❌ EXECUTION FAILED');
                        console.log(`   Error: ${executionResult.error}`);
                    }
                } else {
                    console.log(`\n⏸️  SKIPPING EXECUTION: ${reasoningResult.decision}`);
                }

                console.log('\n' + '='.repeat(80));

                // Wait between iterations
                if (i < iterations - 1) {
                    await this.sleep(10000); // Wait 10 seconds between iterations
                }
            } catch (error) {
                console.error('\n❌ ERROR in agent loop:', error);
                if (error instanceof Error) {
                    console.error('   Message:', error.message);
                }
            }
        }

        this.isRunning = false;
        this.printSummary();
    }

    /**
     * Print execution summary
     */
    private printSummary(): void {
        console.log('\n\n📊 EXECUTION SUMMARY');
        console.log('='.repeat(80));
        console.log(`Total Executions: ${this.executionHistory.length}`);

        const successful = this.executionHistory.filter((r) => r.success).length;
        const failed = this.executionHistory.length - successful;

        console.log(`Successful: ${successful}`);
        console.log(`Failed: ${failed}`);

        const totalProfit = this.executionHistory
            .filter((r) => r.success)
            .reduce((sum, r) => sum + (r.actualProfit || 0), 0);

        console.log(`Total Profit: $${totalProfit.toFixed(2)}`);
        console.log('='.repeat(80));
        console.log('\n✅ Agent stopped\n');
    }

    /**
     * Stop the agent
     */
    stop(): void {
        console.log('\n⏸️  Stopping agent...');
        this.isRunning = false;
    }

    /**
     * Get execution history
     */
    getExecutionHistory(): ExecutionResult[] {
        return this.executionHistory;
    }

    /**
     * Sleep utility
     */
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Run the agent if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const agent = new FraxGuardianAgent();

    // Run for 3 iterations as demo
    agent.run(3).catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Received SIGINT signal');
        agent.stop();
    });
}
