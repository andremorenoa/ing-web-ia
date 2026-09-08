"use client";

import { Suspense, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PROCESS_OPTIONS, isProcessOption } from "@/lib/quote";

const FIELD_CLASSES =
  "h-11 rounded-chamfer border border-steel-700 bg-carbon-900 px-3 text-paper-50 outline-none focus:border-torch-500 focus:shadow-[var(--ring-focus)]";
const LABEL_CLASSES = "font-mono text-xs uppercase tracking-[0.06em] text-steel-400";

const MATERIAL_OPTIONS = ["D2", "H13", "4140", "6061", "Nylamid", "Acero inoxidable"];

function tomorrowAsDateInputValue(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function noExternalUpdates() {
  return () => {};
}

function noMinDueDateDuringSsr(): string | undefined {
  return undefined;
}

function QuoteFormFields({ initialProcess }: { initialProcess: string }) {
  const [process, setProcess] = useState(initialProcess);
  // initialProcess comes from the URL's `proceso` param, which can change via a
  // client-side navigation (clicking another card's CTA) without remounting
  // this component — resync during render (React's documented pattern for
  // adjusting state from a changed prop) rather than in an effect.
  const [prevInitialProcess, setPrevInitialProcess] = useState(initialProcess);
  if (initialProcess !== prevInitialProcess) {
    setPrevInitialProcess(initialProcess);
    setProcess(initialProcess);
  }
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  // Reads the browser's clock without baking a stale "today" into the
  // static/server-rendered markup: the server snapshot is always undefined,
  // so hydration matches, then the real value takes over on the client.
  const minDueDate = useSyncExternalStore(
    noExternalUpdates,
    tomorrowAsDateInputValue,
    noMinDueDateDuringSsr,
  );

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setFileNames(Array.from(files).map((file) => file.name));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      process: formData.get("process"),
      tolerance: formData.get("tolerance"),
      quantity: formData.get("quantity"),
      dueDate: formData.get("dueDate") ?? "",
      materials: formData.getAll("materials"),
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900/60 p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Proceso requerido</span>
          <select
            name="process"
            required
            value={process}
            onChange={(event) => setProcess(event.target.value)}
            className={FIELD_CLASSES}
          >
            {PROCESS_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Tolerancia requerida</span>
          <input
            name="tolerance"
            type="text"
            placeholder="±0.001″"
            required
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Volumen estimado</span>
          <input
            name="quantity"
            type="text"
            placeholder="Ej. 50 piezas"
            required
            className={FIELD_CLASSES}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASSES}>Fecha límite de entrega</span>
          <input
            name="dueDate"
            type="date"
            min={minDueDate}
            className={FIELD_CLASSES}
          />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className={LABEL_CLASSES}>Materiales / aleaciones</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {MATERIAL_OPTIONS.map((material) => (
            <label
              key={material}
              className="cursor-pointer rounded-chamfer border border-steel-700 px-3 py-1.5 font-mono text-sm text-steel-300 transition-colors has-[:checked]:border-torch-500 has-[:checked]:text-torch-400"
            >
              <input type="checkbox" name="materials" value={material} className="sr-only" />
              {material}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <span className={LABEL_CLASSES}>Planos CAD</span>
        <div
          role="button"
          tabIndex={0}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
            handleFiles(event.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragActive ? "border-amber-500 bg-amber-500/10" : "border-zinc-700 hover:border-amber-500"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".step,.stp,.iges,.igs,.dxf,.pdf"
            onChange={(event) => handleFiles(event.target.files)}
            className="sr-only"
            aria-label="Planos CAD"
          />
          <p className="font-mono text-sm text-steel-300">
            Arrastra planos CAD (.STEP, .IGES, .DXF, .PDF)
          </p>
          <p className="text-xs text-steel-400">
            Acuerdos de confidencialidad (NDA) garantizados
          </p>
          {fileNames.length > 0 && (
            <ul className="mt-3 space-y-1 font-mono text-xs text-readout-400">
              {fileNames.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Enviar solicitud"}
        </Button>
        {status === "success" && (
          <p role="status" className="mt-3 text-sm text-signal-green">
            Solicitud enviada. Te contactaremos pronto.
          </p>
        )}
        {status === "error" && (
          <p role="status" className="mt-3 text-sm text-signal-red">
            No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente.
          </p>
        )}
      </div>
    </form>
  );
}

function QuoteFormWithPreselection() {
  const searchParams = useSearchParams();
  const proceso = searchParams?.get("proceso");
  const initialProcess = proceso && isProcessOption(proceso) ? proceso : PROCESS_OPTIONS[0];
  return <QuoteFormFields initialProcess={initialProcess} />;
}

export function QuoteForm() {
  return (
    <section id="cotizacion" className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Solicitar cotización
        </h2>
        <Suspense fallback={<QuoteFormFields initialProcess={PROCESS_OPTIONS[0]} />}>
          <QuoteFormWithPreselection />
        </Suspense>
      </div>
    </section>
  );
}
