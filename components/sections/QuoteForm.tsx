"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

const FIELD_CLASSES =
  "h-11 rounded-chamfer border border-steel-700 bg-carbon-900 px-3 text-paper-50 outline-none focus:border-torch-500 focus:shadow-[var(--ring-focus)]";
const LABEL_CLASSES = "font-mono text-xs uppercase tracking-[0.06em] text-steel-400";

const PROCESS_OPTIONS = ["Fresado CNC", "Torneado", "Shims / Lainas", "Rectificado", "Ensamble"];
const MATERIAL_OPTIONS = ["D2", "H13", "4140", "6061", "Nylamid", "Acero inoxidable"];

export function QuoteForm() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setFileNames(Array.from(files).map((file) => file.name));
  }

  return (
    <section id="cotizacion" className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Solicitar cotización
        </h2>
        <form className="grid max-w-[720px] gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Proceso requerido</span>
            <select name="process" required className={FIELD_CLASSES}>
              {PROCESS_OPTIONS.map((process) => (
                <option key={process}>{process}</option>
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

          <fieldset className="sm:col-span-2">
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
            <input name="dueDate" type="text" placeholder="DD/MM/AAAA" className={FIELD_CLASSES} />
          </label>

          <div className="sm:col-span-2">
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
              className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-chamfer border border-dashed px-6 py-10 text-center transition-colors ${
                isDragActive ? "border-torch-500 bg-torch-950/40" : "border-steel-700"
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

          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">
              Enviar solicitud
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
