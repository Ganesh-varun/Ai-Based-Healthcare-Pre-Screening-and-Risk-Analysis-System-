
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, location, timestamp } = body;

        // Log the SOS request for now since database connectivity is removed from this route.
        // In a real scenario, this would forward to the backend service or external API.
        console.log('🚨 SOS Alert Received (Ephemeral Mode):', {
            userId: userId || 'anonymous',
            location,
            timestamp: new Date(timestamp),
            status: 'active'
        });

        return NextResponse.json({
            success: true,
            message: 'SOS Alert Logged (Database Disconnected)',
            processedAt: new Date().toISOString()
        }, { status: 201 });
    } catch (error: any) {
        console.error('SOS Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to process SOS alert' }, { status: 500 });
    }
}
