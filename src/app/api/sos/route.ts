import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import SOS from '@/models/SOS';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        const newSOS = await SOS.create({
            userId: data.userId || 'anonymous',
            location: data.location,
            timestamp: new Date(data.timestamp),
            status: 'active'
        });

        return NextResponse.json({ success: true, id: newSOS._id }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
