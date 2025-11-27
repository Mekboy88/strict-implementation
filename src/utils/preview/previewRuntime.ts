/**
 * CDN-Free Preview Runtime
 * All scripts needed for the preview iframe, provided as inline strings
 */

export const PREVIEW_RUNTIME = `
// Lightweight React-like runtime
window.React = {
  createElement(type, props, ...children) {
    return { type, props: props || {}, children: children.flat() };
  }
};

// JSX helper function
window.jsx = (type, props, ...children) => {
  return React.createElement(type, props, ...children);
};

// DOM renderer
window.ReactDOM = {
  render(vnode, container) {
    container.innerHTML = "";
    const dom = renderVNode(vnode);
    container.appendChild(dom);
  }
};

function renderVNode(vnode) {
  // Handle null, undefined, boolean
  if (vnode == null || typeof vnode === 'boolean') {
    return document.createTextNode('');
  }
  
  // Handle strings and numbers
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }
  
  // Handle arrays
  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach(child => fragment.appendChild(renderVNode(child)));
    return fragment;
  }
  
  // Handle function components
  if (typeof vnode.type === 'function') {
    const props = { ...vnode.props, children: vnode.children };
    const rendered = vnode.type(props);
    return renderVNode(rendered);
  }
  
  // Handle regular elements
  const el = document.createElement(vnode.type);
  
  // Set properties
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key === "className") {
        el.className = vnode.props[key];
      } else if (key === "style" && typeof vnode.props[key] === "object") {
        Object.assign(el.style, vnode.props[key]);
      } else if (key.startsWith("on")) {
        // Skip event handlers in static preview
        continue;
      } else if (key !== "children") {
        el.setAttribute(key, vnode.props[key]);
      }
    }
  }
  
  // Render children
  if (vnode.children) {
    vnode.children.forEach(child => {
      el.appendChild(renderVNode(child));
    });
  }
  
  return el;
}
`;

export const PREVIEW_STYLES = `
/* Tailwind-like utilities */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; }

/* Layout */
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.flex-col { flex-direction: column; }

/* Spacing */
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }

/* Typography */
.text-sm { font-size: 0.875rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-4xl { font-size: 2.25rem; }
.font-bold { font-weight: 700; }
.text-center { text-align: center; }

/* Colors */
.bg-white { background-color: #ffffff; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-900 { color: #111827; }
.border { border: 1px solid #e5e7eb; }
.border-gray-200 { border-color: #e5e7eb; }

/* Effects */
.rounded-lg { border-radius: 0.5rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

/* Width */
.max-w-2xl { max-width: 42rem; }
.w-full { width: 100%; }
`;
