"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { onUnblock } from "@/actions/block";
import { Button } from "@/components/ui/button";

interface UnblockButtonProps {
  userId: string;
}

export const UnblockButton = ({ userId }: UnblockButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((result) =>
          toast.success(`Succesfully unblocked ${result.blocked.username} `)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Button
        disabled={isPending}
        onClick={onClick}
        variant="link"
        size="sm"
        className="text-cyan-500 w-full" 
    >
        Unblock
    </Button>
  );
};
