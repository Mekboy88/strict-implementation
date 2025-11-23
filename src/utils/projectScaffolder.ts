import { RequestType } from './requestTypeDetector';

export interface FileToGenerate {
  path: string;
  content: string;
  description: string;
}

export interface ScaffoldPlan {
  filesToCreate: FileToGenerate[];
  filesToUpdate: string[];
  description: string;
}

const toPascalCase = (str: string): string => {
  return str
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

export const generateScaffoldPlan = (
  requestType: RequestType,
  entityName: string = 'unnamed',
  existingFiles: Set<string>
): ScaffoldPlan => {
  const plan: ScaffoldPlan = {
    filesToCreate: [],
    filesToUpdate: [],
    description: ''
  };
  
  const componentName = toPascalCase(entityName);
  const kebabName = toKebabCase(entityName);
  
  switch (requestType) {
    case 'page':
      plan.description = `Create new page: ${componentName}`;
      
      // Page component
      if (!existingFiles.has(`src/pages/${componentName}.tsx`)) {
        plan.filesToCreate.push({
          path: `src/pages/${componentName}.tsx`,
          content: generatePageTemplate(componentName),
          description: 'Main page component'
        });
      }
      
      // Page styles
      if (!existingFiles.has(`src/styles/${kebabName}.css`)) {
        plan.filesToCreate.push({
          path: `src/styles/${kebabName}.css`,
          content: generateStyleTemplate(componentName),
          description: 'Page styles'
        });
      }
      
      // Update routes
      plan.filesToUpdate.push('src/routes.ts');
      break;
      
    case 'component':
      plan.description = `Create new component: ${componentName}`;
      
      // Component file
      if (!existingFiles.has(`src/components/${componentName}.tsx`)) {
        plan.filesToCreate.push({
          path: `src/components/${componentName}.tsx`,
          content: generateComponentTemplate(componentName),
          description: 'Component file'
        });
      }
      
      // Component types
      if (!existingFiles.has(`src/components/${componentName}.types.ts`)) {
        plan.filesToCreate.push({
          path: `src/components/${componentName}.types.ts`,
          content: generateTypesTemplate(componentName),
          description: 'TypeScript types'
        });
      }
      
      // Component styles
      if (!existingFiles.has(`src/styles/${kebabName}.css`)) {
        plan.filesToCreate.push({
          path: `src/styles/${kebabName}.css`,
          content: generateStyleTemplate(componentName),
          description: 'Component styles'
        });
      }
      break;
      
    case 'layout':
      plan.description = `Create layout: ${componentName}Layout`;
      
      if (!existingFiles.has(`src/layouts/${componentName}Layout.tsx`)) {
        plan.filesToCreate.push({
          path: `src/layouts/${componentName}Layout.tsx`,
          content: generateLayoutTemplate(componentName),
          description: 'Layout component'
        });
      }
      break;
      
    case 'feature':
      plan.description = `Create feature: ${componentName} with services, hooks, and context`;
      
      // Service
      if (!existingFiles.has(`src/services/${kebabName}.service.ts`)) {
        plan.filesToCreate.push({
          path: `src/services/${kebabName}.service.ts`,
          content: generateServiceTemplate(componentName),
          description: 'Service layer'
        });
      }
      
      // Context
      if (!existingFiles.has(`src/context/${componentName}Context.tsx`)) {
        plan.filesToCreate.push({
          path: `src/context/${componentName}Context.tsx`,
          content: generateContextTemplate(componentName),
          description: 'Context provider'
        });
      }
      
      // Hook
      if (!existingFiles.has(`src/hooks/use${componentName}.ts`)) {
        plan.filesToCreate.push({
          path: `src/hooks/use${componentName}.ts`,
          content: generateHookTemplate(componentName),
          description: 'Custom hook'
        });
      }
      break;
      
    case 'state':
      plan.description = `Create state store: ${componentName}Store`;
      
      if (!existingFiles.has(`src/stores/use${componentName}Store.ts`)) {
        plan.filesToCreate.push({
          path: `src/stores/use${componentName}Store.ts`,
          content: generateStoreTemplate(componentName),
          description: 'Zustand store'
        });
      }
      break;
      
    case 'api':
      plan.description = `Create API service: ${componentName}`;
      
      if (!existingFiles.has(`src/services/${kebabName}.api.ts`)) {
        plan.filesToCreate.push({
          path: `src/services/${kebabName}.api.ts`,
          content: generateApiTemplate(componentName),
          description: 'API service'
        });
      }
      break;
      
    default:
      plan.description = 'Modify existing code';
      break;
  }
  
  return plan;
};

// Template generators

const generatePageTemplate = (name: string): string => {
  // Empty shell – real content will be generated by the AI so we avoid demo text
  return `import React from 'react';

const ${name}: React.FC = () => {
  return (
    <div>
      {/* ${name} page – content will be generated by UR-DEV AI */}
    </div>
  );
};

export default ${name};
`;
};

const generateComponentTemplate = (name: string): string => {
  // Empty shell – AI will generate real UI and logic
  return `import React from 'react';
import { ${name}Props } from './${name}.types';

const ${name}: React.FC<${name}Props> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ${name};
`;
};

const generateTypesTemplate = (name: string): string => {
  return `export interface ${name}Props {
  children?: React.ReactNode;
  className?: string;
}
`;
};

const generateStyleTemplate = (name: string): string => {
  // Minimal styles – AI will replace with real Tailwind/ CSS when needed
  return `.${toKebabCase(name)} {
}
`;
};

const generateLayoutTemplate = (name: string): string => {
  return `import React from 'react';

interface ${name}LayoutProps {
  children: React.ReactNode;
}

const ${name}Layout: React.FC<${name}LayoutProps> = ({ children }) => {
  return (
    <div className="${toKebabCase(name)}-layout">
      <header>
        <h1>${name} Layout</h1>
      </header>
      <main>{children}</main>
      <footer>© 2025</footer>
    </div>
  );
};

export default ${name}Layout;
`;
};

const generateServiceTemplate = (name: string): string => {
  return `class ${name}Service {
  async getData() {
    // Implement your service logic here
    return Promise.resolve([]);
  }
  
  async saveData(data: any) {
    // Implement save logic
    return Promise.resolve(true);
  }
}

export const ${toKebabCase(name)}Service = new ${name}Service();
`;
};

const generateContextTemplate = (name: string): string => {
  return `import React, { createContext, useContext, useState } from 'react';

interface ${name}ContextType {
  data: any;
  setData: (data: any) => void;
}

const ${name}Context = createContext<${name}ContextType | undefined>(undefined);

export const ${name}Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(null);
  
  return (
    <${name}Context.Provider value={{ data, setData }}>
      {children}
    </${name}Context.Provider>
  );
};

export const use${name}Context = () => {
  const context = useContext(${name}Context);
  if (!context) {
    throw new Error('use${name}Context must be used within ${name}Provider');
  }
  return context;
};
`;
};

const generateHookTemplate = (name: string): string => {
  return `import { useState, useEffect } from 'react';

export const use${name} = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Implement your hook logic here
  }, []);
  
  return { data, loading };
};
`;
};

const generateStoreTemplate = (name: string): string => {
  return `import { create } from 'zustand';

interface ${name}State {
  data: any[];
  setData: (data: any[]) => void;
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
}

export const use${name}Store = create<${name}State>((set) => ({
  data: [],
  
  setData: (data) => set({ data }),
  
  addItem: (item) => set((state) => ({
    data: [...state.data, item]
  })),
  
  removeItem: (id) => set((state) => ({
    data: state.data.filter((item) => item.id !== id)
  })),
}));
`;
};

const generateApiTemplate = (name: string): string => {
  return `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const ${toKebabCase(name)}Api = {
  async getAll() {
    const response = await fetch(\`\${API_BASE_URL}/${toKebabCase(name)}\`);
    return response.json();
  },
  
  async getById(id: string) {
    const response = await fetch(\`\${API_BASE_URL}/${toKebabCase(name)}/\${id}\`);
    return response.json();
  },
  
  async create(data: any) {
    const response = await fetch(\`\${API_BASE_URL}/${toKebabCase(name)}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  async update(id: string, data: any) {
    const response = await fetch(\`\${API_BASE_URL}/${toKebabCase(name)}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  async delete(id: string) {
    const response = await fetch(\`\${API_BASE_URL}/${toKebabCase(name)}/\${id}\`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
`;
};
