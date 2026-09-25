import { prisma } from "@/lib/prisma";

interface LogActivityParams {
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Mencatat aktivitas ke database.
 * Fungsi ini bersifat fire-and-forget: tidak akan melempar error
 * agar tidak mengganggu alur utama API.
 */
export async function logActivity(params: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entity_id: params.entityId || null,
        description: params.description,
        metadata: params.metadata || null,
      },
    });
  } catch (error) {
    // Log error tapi jangan lempar — jangan sampai gagal log menghancurkan flow utama
    console.error("[ActivityLog] Gagal mencatat log:", error);
  }
}

/**
 * Parse info perangkat dari request headers.
 * Digunakan untuk login & logout logging.
 */
export function getDeviceInfo(request: Request) {
  const userAgentString = request.headers.get("user-agent") || "Unknown";
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "Unknown";

  // Lazy-load ua-parser-js untuk menghindari overhead di routes yang tidak membutuhkannya
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  try {
    const UAParser = require("ua-parser-js");
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    browser = result.browser.name
      ? `${result.browser.name}${result.browser.version ? " " + result.browser.version.split(".")[0] : ""}`
      : "Unknown";

    os = result.os.name
      ? `${result.os.name}${result.os.version ? " " + result.os.version : ""}`
      : "Unknown";

    device = result.device.type
      ? result.device.type.charAt(0).toUpperCase() + result.device.type.slice(1)
      : "Desktop";
  } catch (e) {
    console.error("[ActivityLog] Gagal parse user-agent:", e);
  }

  return { browser, os, ip, device };
}
