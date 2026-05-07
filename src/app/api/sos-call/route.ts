import { NextResponse } from 'next/server';

/**
 * SOS SIMULATION API (REPLACED EXOTEL)
 * Handles emergency trigger logic without external dependencies.
 */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Extract patient details from request body
        const emergencyNumber = body?.emergencyContact || "NOT_FOUND";
        const name = body?.name || "GUEST_USER";
        const address = body?.address || "LOCATION_NOT_SET";

        console.log("-----------------------------------------");
        console.log("🚨 SOS TRIGGERED (SIMULATION)");
        console.log("Calling:", emergencyNumber);
        console.log("Patient:", name);
        console.log("Location:", address);
        console.log("Status: Simulation Success");
        console.log("-----------------------------------------");

        // Simulate a tiny network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            message: "Emergency simulated",
            number: emergencyNumber,
            patient: name,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("❌ SOS SIMULATION ERROR:", error.message);
        return NextResponse.json({
            success: false,
            error: "Simulation processing failed",
            details: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
