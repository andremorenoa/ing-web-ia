import { Button } from "@/components/ui/Button";

const FIELD_CLASSES =
  "h-11 rounded-chamfer border border-steel-700 bg-carbon-900 px-3 text-paper-50 outline-none focus:border-torch-500 focus:shadow-[var(--ring-focus)]";
const LABEL_CLASSES = "font-mono text-xs uppercase tracking-[0.06em] text-steel-400";

export function QuoteForm() {
  return (
    <section id="cotizacion" className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Cotización
        </span>
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Solicitar cotización
        </h2>
        <form className="grid max-w-[640px] gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Material</span>
            <select name="material" required className={FIELD_CLASSES}>
              <option>D2</option>
              <option>H13</option>
              <option>Vanadis</option>
              <option>Otro</option>
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
            <span className={LABEL_CLASSES}>Cantidad</span>
            <input
              name="quantity"
              type="text"
              placeholder="Ej. 50 piezas"
              required
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Fecha de entrega deseada</span>
            <input name="dueDate" type="text" placeholder="DD/MM/AAAA" className={FIELD_CLASSES} />
          </label>
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
