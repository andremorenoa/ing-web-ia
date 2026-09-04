export function AboutHistory() {
  return (
    <section className="border-b border-steel-700">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <h1 className="mb-8 max-w-[20ch] text-[3rem] font-bold leading-[1.05] tracking-[-0.01em]">
          Un taller que creció con el corredor automotriz de Saltillo
        </h1>
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="max-w-[60ch] text-lg leading-[1.6] text-steel-300">
            Vektor Precision CNC abrió piso en Saltillo maquinando piezas de reemplazo para
            líneas de estampado que no podían parar. De ahí salió el resto del taller: cuando una
            planta automotriz no puede esperar una pieza fuera de tolerancia, cada proceso que
            agregamos — torneado, herramental, ensamble — tuvo que responder a esa misma
            urgencia.
          </p>
          <p className="max-w-[60ch] text-lg leading-[1.6] text-steel-300">
            Hoy el taller trabaja en dos turnos sobre centros Mazak y Okuma, surtiendo piezas
            críticas a proveedores Tier 1 y Tier 2 del corredor Saltillo–Ramos Arizpe–Derramadero,
            con la frontera de Laredo a tres horas por carretera.
          </p>
        </div>
      </div>
    </section>
  );
}
