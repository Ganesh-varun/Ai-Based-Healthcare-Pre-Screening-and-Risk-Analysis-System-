'use client';

import { useOfflineSync } from "@/lib/offline/sync";

export function SyncManager() {
    useOfflineSync();
    return null;
}
