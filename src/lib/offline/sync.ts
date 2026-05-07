'use client';

import { useEffect } from 'react';
import { getPendingSOSPackets, markPacketSynced } from '@/lib/offline/db';

export function useOfflineSync() {
    useEffect(() => {
        const syncData = async () => {
            if (!navigator.onLine) return;

            const pending = await getPendingSOSPackets();
            for (const packet of pending) {
                try {
                    const response = await fetch('/api/sos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(packet),
                    });

                    if (response.ok) {
                        await markPacketSynced(packet.id);
                        console.log(`Synced SOS packet: ${packet.id}`);
                    }
                } catch (error) {
                    console.error('Sync failed for packet:', packet.id, error);
                }
            }
        };

        window.addEventListener('online', syncData);
        // Initial check
        syncData();

        return () => window.removeEventListener('online', syncData);
    }, []);
}
