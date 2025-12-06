/**
 * Advanced AI Prompts for FraxGuardian AI
 * Sophisticated prompt engineering for better decision-making
 */

export const SYSTEM_PROMPT = `You are FraxGuardian AI, an elite DeFi arbitrage analyst with deep expertise in:
- Frax Finance ecosystem mechanics
- MEV (Maximal Extractable Value) strategies
- Risk assessment for automated trading
- On-chain liquidity analysis

Your role is to analyze arbitrage opportunities and provide clear, actionable recommendations.
Focus on protecting capital while maximizing returns. Be conservative but not overly cautious.`;

export const OPPORTUNITY_ANALYSIS_PROMPT = (data: {
    sourcePool: string;
    targetPool: string;
    sourcePriceFrax: string;
    targetPriceFrax: string;
    priceDifferencePercent: number;
    netProfitUsd: number;
    gasCostUsd: number;
    riskScore: number;
    gasPrice: string;
    liquidityAvailable: string;
}) => `Analyze this Frax Finance arbitrage opportunity:

OPPORTUNITY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source Pool:      ${data.sourcePool}
  └─ FRAX Price:  $${data.sourcePriceFrax}

Target Pool:      ${data.targetPool}
  └─ FRAX Price:  $${data.targetPriceFrax}

Price Difference: ${data.priceDifferencePercent.toFixed(3)}%
Net Profit:       $${data.netProfitUsd.toFixed(2)}
Gas Cost:         $${data.gasCostUsd.toFixed(3)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RISK ASSESSMENT:
Overall Risk Score: ${data.riskScore}/100
Liquidity Available: $${parseFloat(data.liquidityAvailable).toFixed(0)}
Current Gas Price: ${data.gasPrice} Gwei

ANALYSIS REQUIRED:
1. **Profit Margin Assessment**: Is ${data.priceDifferencePercent.toFixed(3)}% spread sufficient?
2. **Execution Risk**: What could go wrong during execution?
3. **Market Conditions**: Are current gas prices (${data.gasPrice} Gwei) acceptable?
4. **Recommendation**: EXECUTE, WAIT, or SKIP?

Provide a concise 3-sentence analysis focusing on actionable insights.`;

export const MARKET_CONTEXT_PROMPT = (data: {
    opportunityCount: number;
    avgRiskScore: number;
    avgProfit: number;
    krwqPrice?: number;
}) => `Current market context for Frax Finance arbitrage:

MARKET SNAPSHOT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Opportunities Detected: ${data.opportunityCount}
Average Risk Score:     ${data.avgRiskScore.toFixed(1)}/100
Average Profit:         $${data.avgProfit.toFixed(2)}
KRWQ Price:            ${data.krwqPrice ? `$${data.krwqPrice.toFixed(4)}` : 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Should we be aggressive or conservative in current market conditions?
Provide 2-sentence market assessment.`;

export const RISK_EXPLANATION_PROMPT = (data: {
    liquidityRisk: number;
    priceImpactRisk: number;
    gasCostRisk: number;
    volatilityRisk: number;
}) => `Explain the following risk factors in simple terms:

RISK BREAKDOWN:
Liquidity Risk:     ${data.liquidityRisk}/100
Price Impact Risk:  ${data.priceImpactRisk}/100
Gas Cost Risk:      ${data.gasCostRisk}/100
Volatility Risk:    ${data.volatilityRisk}/100

Which risk factor is most concerning and why? (1 sentence)`;
