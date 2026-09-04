import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";
import type { StockImage } from "@/lib/images";

const FIXTURE_IMAGE: StockImage = {
  src: "https://images.pexels.com/photos/1/test.jpeg",
  alt: "Fresadora CNC de prueba",
  width: 1920,
  height: 1280,
  credit: { photographer: "Test", url: "https://pexels.com/@test" },
};

describe("Hero", () => {
  it("shows the three technical metrics and the quote CTA", () => {
    render(<Hero image={FIXTURE_IMAGE} />);
    expect(screen.getAllByText("±0.001″")).toHaveLength(2);
    expect(screen.getByText("<24 h")).toBeInTheDocument();
    expect(screen.getByText("63 HRC")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar cotización" })).toHaveAttribute(
      "href",
      "/#cotizacion",
    );
  });

  it("renders the hero image with its alt text", () => {
    render(<Hero image={FIXTURE_IMAGE} />);
    expect(screen.getByAltText("Fresadora CNC de prueba")).toBeInTheDocument();
  });
});
