'use client';

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { SyncManager } from "@/components/services/SyncManager";
import { BottomNav } from "@/components/layout/BottomNav";
import { SettingsDrawer } from "@/components/layout/SettingsDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { AmbientBackground } from "@/components/layout/AmbientBackground";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AmbientBackground />
          <SyncManager />
          {children}
          <BottomNav onSettingsClick={() => setIsSettingsOpen(true)} />
          <SettingsDrawer
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </ToastProvider>
      </body>
    </html>
  );
}
