"use client";

import { Pencil } from "lucide-react";

interface InfoCardProps {
  name: string;
  hostIdentity: string;
  thumbnailUrl: string | null;
  viewerIdentity: string;
}

export const InfoCard = ({
  name,
  hostIdentity,
  thumbnailUrl,
  viewerIdentity,
}: InfoCardProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;

  return (
    <div className="px-4">
      <div className="rounded-xl bg-background">
        <div className="flex items-center gap-x-2.5 p-4">
          <div className="rounded-md bg-cyan-600 p-2 h-auto w-auto">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm lg:text-lg font-semibold capitalize">
              Edit your stream info
            </h2>
            <p className="text-muted-foreground text-xs lg:text-sm">
              Maximize your visibility
            </p>
          </div>
          {/* TODO: Add a modal button */}
        </div>
      </div>
    </div>
  );
};
