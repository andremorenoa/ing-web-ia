import fs from "node:fs";
import path from "node:path";

export type ServiceCategory =
  | "Maquinados CNC"
  | "Herramental y Troqueles"
  | "Estampado y Ensamble"
  | "Acabados y Tratamientos";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  materials: string[];
  specs: string[];
  leadTime: string;
  featured: boolean;
}

export interface CategoryGroup {
  category: ServiceCategory;
  services: Service[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Maquinados CNC",
  "Herramental y Troqueles",
  "Estampado y Ensamble",
  "Acabados y Tratamientos",
];

export function parseServicesCsv(csvText: string): Service[] {
  const rows = parseCsvRows(csvText);
  const [header, ...dataRows] = rows;
  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const record: Record<string, string> = {};
      header.forEach((key, i) => {
        record[key] = row[i] ?? "";
      });
      return {
        id: record.id,
        name: record.name,
        category: record.category as ServiceCategory,
        description: record.description,
        materials: splitList(record.materials, ","),
        specs: splitList(record.specs, ";"),
        leadTime: record.lead_time,
        featured: record.featured.trim().toUpperCase() === "TRUE",
      };
    });
}

export function getServices(): Service[] {
  const csvPath = path.join(process.cwd(), "docs", "services.csv");
  const csvText = fs.readFileSync(csvPath, "utf8");
  return parseServicesCsv(csvText);
}

export function getServicesByCategory(services: Service[] = getServices()): CategoryGroup[] {
  return SERVICE_CATEGORIES.map((category) => ({
    category,
    services: services.filter((s) => s.category === category),
  })).filter((group) => group.services.length > 0);
}

export function getFeaturedServices(services: Service[] = getServices()): Service[] {
  return services.filter((s) => s.featured);
}

function splitList(value: string, separator: string): string[] {
  return value
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
