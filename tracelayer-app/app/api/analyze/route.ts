import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type AnalyzeRequest = {
  context?: string;
  goal?: string;
  constraints?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    const context = body.context?.trim();
    const goal = body.goal?.trim();
    const constraints = body.constraints?.trim() ?? null;

    if (!context || !goal) {
      return NextResponse.json(
        {
          error: "context and goal are required"
        },
        { status: 400 }
      );
    }

    const facts = [
      {
        source: "user_input",
        value: context
      }
    ];

    const inferences = [
      {
        value: "The request requires structured decision analysis.",
        basis: "context_and_goal_provided"
      }
    ];

    const hypotheses = [
      {
        value: "A structured decision trace will improve execution and auditability.",
        confidence: 0.7
      }
    ];

    const recommendedActions = [
      {
        action: "Review the generated decision trace and approve or adjust the execution plan.",
        priority: "HIGH"
      }
    ];

    const executionPlan = [
      {
        step: "Validate context and goal",
        priority: "HIGH",
        dependency: "user_input",
        estimatedImpact: "MEDIUM",
        owner: "human_operator"
      },
      {
        step: "Convert analysis into operational tasks",
        priority: "MEDIUM",
        dependency: "approved_decision_trace",
        estimatedImpact: "HIGH",
        owner: "human_operator"
      }
    ];

    const complianceFlags = [
      {
        flag: "human_review_required",
        reason: "Decision output should be reviewed before execution."
      }
    ];

    const auditTrail = {
      criteriaUsed: ["context", "goal", "constraints"],
      rulesTriggered: ["human_review_required"],
      confidenceScore: 0.7,
      humanApprovalRequired: true,
      approved: false,
      decisionVersion: "v1"
    };

    const trace = await db.decisionTrace.create({
      data: {
        context,
        goal,
        constraints,
        factsJson: JSON.stringify(facts),
        inferencesJson: JSON.stringify(inferences),
        hypothesesJson: JSON.stringify(hypotheses),
        recommendedJson: JSON.stringify(recommendedActions),
        executionPlanJson: JSON.stringify(executionPlan),
        complianceFlagsJson: JSON.stringify(complianceFlags),
        auditTrailJson: JSON.stringify(auditTrail),
        confidenceScore: auditTrail.confidenceScore,
        humanApprovalRequired: auditTrail.humanApprovalRequired,
        approved: auditTrail.approved,
        decisionVersion: auditTrail.decisionVersion
      }
    });

    return NextResponse.json({
      decisionId: trace.id,
      timestamp: trace.createdAt,
      context,
      goal,
      facts,
      inferences,
      hypotheses,
      recommendedActions,
      executionPlan,
      complianceFlags,
      auditTrail
    });
  } catch (error) {
    console.error("Analyze route failed", error);

    return NextResponse.json(
      {
        error: "failed_to_analyze"
      },
      { status: 500 }
    );
  }
}
