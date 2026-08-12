"use client";

import "@excalidraw/excalidraw/index.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import type {
  NonDeletedExcalidrawElement,
  OrderedExcalidrawElement,
} from "@excalidraw/excalidraw/element/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import { Input } from "@/components/ui/input";
import { updateCanvas } from "@/lib/actions";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

const SAVE_DELAY = 1200;

export function CanvasEditor({
  canvasId,
  initialName,
  projectId,
  projectName,
  initialElements,
  initialFiles,
}: {
  canvasId: string;
  initialName: string;
  projectId: string;
  projectName: string;
  initialElements: unknown[];
  initialFiles: Record<string, unknown>;
}) {
  const [name, setName] = useState(initialName);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialData: ExcalidrawInitialDataState = {
    elements: initialElements as NonDeletedExcalidrawElement[],
    files: initialFiles as BinaryFiles,
  };

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], _appState: unknown, files: BinaryFiles) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        try {
          const { exportToBlob } = await import("@excalidraw/excalidraw");
          const scene = { elements, files };
          let thumbnail: string | undefined;

          if (elements.length > 0 && apiRef.current) {
            const blob = await exportToBlob({
              elements: elements as unknown as NonDeletedExcalidrawElement[],
              files,
              appState: apiRef.current.getAppState(),
              mimeType: "image/png",
              getDimensions: () => ({ width: 480, height: 300 }),
            });
            thumbnail = await blobToDataUrl(blob);
          }

          await updateCanvas(canvasId, { scene, thumbnail });
        } catch {
          toast.error("No se pudo guardar el canvas.");
        }
      }, SAVE_DELAY);
    },
    [canvasId]
  );

  function handleNameChange(next: string) {
    setName(next);
    if (nameTimeout.current) clearTimeout(nameTimeout.current);
    nameTimeout.current = setTimeout(() => {
      updateCanvas(canvasId, { name: next }).catch(() => {
        toast.error("No se pudo renombrar el canvas.");
      });
    }, 600);
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <Link
          href={`/projects/${projectId}`}
          className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {projectName}
        </Link>
        <Input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="h-8 max-w-xs border-transparent bg-transparent px-2 font-medium shadow-none hover:border-border focus-visible:border-border"
        />
      </div>
      <div className="relative flex-1">
        <Excalidraw
          initialData={initialData}
          excalidrawAPI={(api) => {
            apiRef.current = api;
          }}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
