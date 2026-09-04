import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuoteForm } from "@/components/sections/QuoteForm";

describe("QuoteForm", () => {
  it("has the core required fields and a submit button", () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText("Proceso requerido")).toBeInTheDocument();
    expect(screen.getByLabelText("Tolerancia requerida")).toBeInTheDocument();
    expect(screen.getByLabelText("Volumen estimado")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha límite de entrega")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar solicitud" })).toBeInTheDocument();
  });

  it("offers the five process options from the brief", () => {
    render(<QuoteForm />);
    const select = screen.getByLabelText("Proceso requerido") as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((option) => option.textContent);
    expect(optionLabels).toEqual([
      "Fresado CNC",
      "Torneado",
      "Shims / Lainas",
      "Rectificado",
      "Ensamble",
    ]);
  });

  it("offers a multi-select set of material checkboxes", () => {
    render(<QuoteForm />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.map((checkbox) => checkbox.getAttribute("value"))).toEqual([
      "D2",
      "H13",
      "4140",
      "6061",
      "Nylamid",
      "Acero inoxidable",
    ]);
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    fireEvent.click(checkboxes[2]);
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("shows the CAD dropzone with its confidentiality message", () => {
    render(<QuoteForm />);
    expect(
      screen.getByText("Arrastra planos CAD (.STEP, .IGES, .DXF, .PDF)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Acuerdos de confidencialidad (NDA) garantizados")).toBeInTheDocument();
  });

  it("lists selected file names after a file is chosen", () => {
    render(<QuoteForm />);
    const fileInput = screen.getByLabelText("Planos CAD") as HTMLInputElement;
    const file = new File(["dummy"], "pieza-01.step", { type: "application/octet-stream" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText("pieza-01.step")).toBeInTheDocument();
  });
});
