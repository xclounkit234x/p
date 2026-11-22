const plugins = new Map();

/**
 * Register a plugin by its unique name.
 * @param {{ name: string, install?: Function, [key: string]: unknown }} plugin
 * @returns {unknown} The registered plugin.
 */
export function registerPlugin(plugin) {
  if (!plugin || typeof plugin !== "object") {
    throw new TypeError("A plugin must be an object.");
  }

  if (typeof plugin.name !== "string" || !plugin.name.trim()) {
    throw new TypeError("A plugin must have a non-empty name.");
  }

  if (plugins.has(plugin.name)) {
    throw new Error(`Plugin "${plugin.name}" is already registered.`);
  }

  plugins.set(plugin.name, plugin);
  return plugin;
}

/** Retrieve a registered plugin by name. */
export function getPlugin(name) {
  return plugins.get(name);
}

/** Return a snapshot of all registered plugins. */
export function getPlugins() {
  return [...plugins.values()];
}

/** Remove a registered plugin by name. */
export function unregisterPlugin(name) {
  return plugins.delete(name);
}
