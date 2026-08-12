"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateDiagram } from "@/lib/actions";

const DRAWIO_URL =
  process.env.NEXT_PUBLIC_DRAWIO_URL ?? "https://embed.diagrams.net";

export function DiagramEditor({
  diagramId,
  initialName,
  initialXml,
  projectId,
  projectName,
}: {
  diagramId: string;
  initialName: string;
  initialXml: string;
  projectId: string;
  projectName: string;
}) {
  const [name, setName] = useState(initialName);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const ready = useRef(false);
  const nameTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (typeof event.data !== "string") return;
      let msg: { event?: string; xml?: string };
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      if (msg.event === "init") {
        ready.current = true;
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            action: "load",
            xml: initialXml,
            autosave: 1,
          }),
          "*"
        );
      } else if (msg.event === "autosave" || msg.event === "save") {
        if (typeof msg.xml === "string") {
          updateDiagram(diagramId, { xml: msg.xml }).catch(() => {
            toast.error("No se pudo guardar el diagrama.");
          });
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId]);

  function handleNameChange(next: string) {
    setName(next);
    if (nameTimeout.current) clearTimeout(nameTimeout.current);
    nameTimeout.current = setTimeout(() => {
      updateDiagram(diagramId, { name: next }).catch(() => {
        toast.error("No se pudo renombrar el diagrama.");
      });
    }, 600);
  }

  const src = `${DRAWIO_URL}/?embed=1&proto=json&spin=1&noSaveBtn=1&saveAndExit=0&noExitBtn=1&ui=min`;

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
      <iframe
        ref={iframeRef}
        src={src}
        className="flex-1 border-0"
        title="Editor de diagramas"
      />
    </div>
  );
}
