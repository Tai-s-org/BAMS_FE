"use client"

import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Định nghĩa các biến thể cho Label
const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// Tạo Label component với React.forwardRef
const Label = React.forwardRef(
    ({ className, ...props }, ref) => (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        />
    )
);

// Đặt tên cho component Label
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
