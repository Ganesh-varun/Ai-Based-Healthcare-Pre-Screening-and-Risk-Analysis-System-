import { openDB } from "idb";

const DB_NAME = "healthcare-pwa";
const DB_VERSION = 1;
const SOS_STORE = "sos-requests";

export interface SOSPacket {
    id: string;
    timestamp: number;
    location: {
        lat: number;
        lng: number;
        accuracy: number;
    };
    userId?: string;
    status: "pending" | "synced";
}
const isBrowser = typeof window !== "undefined";

export async function initDB() {
    if (!isBrowser) return null;

    return openDB<SOSPacket>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(SOS_STORE)) {
                db.createObjectStore(SOS_STORE, { keyPath: "id" });
            }
        }
    });
}

export async function saveSOSPacket(packet: SOSPacket) {
    const db = await initDB();
    if (!db) return;
    return db.put(SOS_STORE, packet);
}

export async function getPendingSOSPackets(): Promise<SOSPacket[]> {
    const db = await initDB();
    if (!db) return [];

    const all = await db.getAll(SOS_STORE);
    return all.filter((p) => p.status === "pending");
}

export async function markPacketSynced(id: string) {
    const db = await initDB();
    if (!db) return;

    const packet = await db.get(SOS_STORE, id);
    if (!packet) return;

    packet.status = "synced";
    await db.put(SOS_STORE, packet);
}
