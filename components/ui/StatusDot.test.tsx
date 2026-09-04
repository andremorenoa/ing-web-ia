import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "@/components/ui/StatusDot";

describe("StatusDot", () => {
  it("renders the default label for the available status", () => {
    render(<StatusDot status="available" />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("renders a custom label when given one", () => {
    render(<StatusDot status="queued" label="En cola (2 d)" />);
    expect(screen.getByText("En cola (2 d)")).toBeInTheDocument();
  });
});
