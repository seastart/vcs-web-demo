// VCSContext.tsx
import React from "react";

// 假设VCSClient是一个类型，需要根据实际情况替换
type VCSClientType = any; // 使用适当的类型替换

export const VCSContext = React.createContext<VCSClientType | null>(null);
