// src/components/StartupWrapper.tsx
import React from "react";
import { useAppStartup } from "@/src/hooks/useAppStartup";

const StartupWrapper = () => {
    useAppStartup(); // ✅ safe now because it's inside SQLiteProvider
    return null;
};

export default StartupWrapper;
