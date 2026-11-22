/**
 * xk.js — modular browser plugin framework
 * @packageDocumentation
 */

export { VERSION } from "./version.js";
export {
  registerPlugin,
  getPlugin,
  getPlugins,
  unregisterPlugin
} from "./core/registry.js";
