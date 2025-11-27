/**
 * Inline React-like runtime for CDN-free preview
 * Provides a lightweight createElement implementation that works without external scripts
 */

export const INLINE_REACT_RUNTIME = `
// Lightweight React-like runtime (CDN-free)
window.React = {
  createElement: function(type, props, ...children) {
    return { type, props: props || {}, children: children.flat() };
  },
  Fragment: Symbol('Fragment')
};

window.h = window.React.createElement;
window.Fragment = window.React.Fragment;

// Simple renderer that converts virtual DOM to real DOM
function render(vnode, container) {
  if (container._rootVNode) {
    container.innerHTML = '';
  }
  container._rootVNode = vnode;
  
  const dom = createDOM(vnode);
  container.appendChild(dom);
}

function createDOM(vnode) {
  // Handle null, undefined, boolean
  if (vnode == null || typeof vnode === 'boolean') {
    return document.createTextNode('');
  }
  
  // Handle strings and numbers
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode);
  }
  
  // Handle arrays
  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment();
    vnode.forEach(child => {
      fragment.appendChild(createDOM(child));
    });
    return fragment;
  }
  
  // Handle Fragment
  if (vnode.type === window.Fragment) {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => {
      fragment.appendChild(createDOM(child));
    });
    return fragment;
  }
  
  // Handle function components
  if (typeof vnode.type === 'function') {
    const props = { ...vnode.props, children: vnode.children };
    const rendered = vnode.type(props);
    return createDOM(rendered);
  }
  
  // Handle regular elements
  const el = document.createElement(vnode.type);
  
  // Set properties
  if (vnode.props) {
    Object.entries(vnode.props).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        const event = key.substring(2).toLowerCase();
        el.addEventListener(event, value);
      } else if (key !== 'children') {
        el.setAttribute(key, value);
      }
    });
  }
  
  // Append children
  vnode.children.forEach(child => {
    el.appendChild(createDOM(child));
  });
  
  return el;
}

window.ReactDOM = {
  render: render,
  createRoot: function(container) {
    return {
      render: function(vnode) {
        render(vnode, container);
      }
    };
  }
};
`;

export const INLINE_TAILWIND_RESET = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; }
`;