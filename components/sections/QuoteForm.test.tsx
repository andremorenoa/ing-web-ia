import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/sections/QuoteForm";

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Tolerancia requerida"), {
    target: { value: "±0.001″" },
  });
  fireEvent.change(screen.getByLabelText("Volumen estimado"), {
    target: { value: "50 piezas" },
  });
}

describe("QuoteForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("submits the form as JSON to /api/quote", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(<QuoteForm />);
    fillRequiredFields();
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/quote");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      process: "Fresado CNC",
      tolerance: "±0.001″",
      quantity: "50 piezas",
      dueDate: "",
      materials: ["D2"],
    });
  });

  it("shows a success message once the webhook accepts the submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));

    render(<QuoteForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/enviada/i);
  });

  it("shows an error message when the webhook proxy fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));

    render(<QuoteForm />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Enviar solicitud" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/no pudimos/i);
  });

  it("uses a date picker for the due date that can't select today or earlier", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2027, 2, 15, 10, 0, 0));

    render(<QuoteForm />);
    const dueDate = screen.getByLabelText("Fecha límite de entrega") as HTMLInputElement;
    expect(dueDate.type).toBe("date");
    expect(dueDate.min).toBe("2027-03-16");

    vi.useRealTimers();
  });
});
