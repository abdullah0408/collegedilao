/**
 * Centralized data export module.
 * This file aggregates and re-exports shared data for the application.
 */

/**
 * Re-export everything from `footerData.ts`.
 * Makes `socialLinks`, `footerSections`, and `bottomLinks` available via `@/data`.
 *
 * Example:
 *   import { socialLinks, footerSections, bottomLinks } from "@/data";
 */
export * from "./footerData";
