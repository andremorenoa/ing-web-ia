import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, LinkButton } from "@/components/ui/Button";

describe("Button", () => {
  it("renders the primary variant with the action-accent background class", () => {
    render(<Button variant="primary">Solicitar cotización</Button>);
    const button = screen.getByRole("button", { name: "Solicitar cotización" });
    expect(button.className).toContain("bg-torch-500");
  });

  it("defaults to the primary variant", () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole("button").className).toContain("bg-torch-500");
  });
});

describe("LinkButton", () => {
  it("renders an anchor with the given href", () => {
    render(
      <LinkButton href="/capacidades" variant="secondary">
        Ver capacidades
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Ver capacidades" });
    expect(link).toHaveAttribute("href", "/capacidades");
  });
});
