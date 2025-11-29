export const CODE_EDITING_TASKS = {
  patterns: [
    // Adding content
    'add section', 'add component', 'add feature', 'add button', 'add form',
    'insert', 'include', 'append', 'create new',
    
    // Modifying existing
    'change', 'modify', 'update', 'edit', 'alter', 'adjust',
    'replace', 'swap', 'switch', 'convert',
    
    // Styling changes
    'change color', 'update style', 'make bigger', 'make smaller',
    'change font', 'add animation', 'add hover effect',
    
    // Removing content
    'remove', 'delete', 'take out', 'get rid of',
    
    // Refactoring
    'refactor', 'clean up', 'optimize', 'improve',
    'split component', 'extract function', 'combine',
    
    // Fixing issues
    'fix bug', 'fix error', 'resolve issue', 'correct',
    'debug', 'troubleshoot'
  ],

  instructions: `
# Code Editing Best Practices

## When Adding New Content

1. **Read the existing file first** - Always view the current file before editing
2. **Preserve existing code** - Don't remove or break existing functionality
3. **Match the style** - Follow existing patterns, naming conventions, and formatting
4. **Add imports** - Include any new imports needed at the top
5. **Update types** - Add TypeScript types if applicable

Example: Adding a new section to a page
\`\`\`tsx
// BEFORE
export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

// AFTER - Adding testimonials section
export function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection /> {/* NEW */}
    </div>
  );
}
\`\`\`

## When Modifying Existing Content

1. **Identify the target** - Find the exact element/component to modify
2. **Minimal changes** - Change only what's requested
3. **Preserve state** - Keep existing state, props, handlers
4. **Update related code** - If changing a prop name, update all uses

Example: Changing button variant
\`\`\`tsx
// BEFORE
<Button variant="outline">Click Me</Button>

// AFTER
<Button variant="default">Click Me</Button>
\`\`\`

## When Removing Content

1. **Remove cleanly** - Delete the component and its imports
2. **Check dependencies** - Remove any props/state only used by removed content
3. **Update layout** - Adjust grid/flex layouts if needed

Example: Removing a section
\`\`\`tsx
// BEFORE
<div className="grid grid-cols-3">
  <Section1 />
  <Section2 />
  <Section3 />
</div>

// AFTER - Removing Section2
<div className="grid grid-cols-2"> {/* Changed from 3 to 2 */}
  <Section1 />
  <Section3 />
</div>
\`\`\`

## When Refactoring

1. **Extract reusable parts** - Move repeated code to components
2. **Simplify logic** - Remove unnecessary complexity
3. **Improve naming** - Use clear, descriptive names
4. **Add comments** - Document complex logic

Example: Extracting a reusable component
\`\`\`tsx
// BEFORE - Repeated code
<div className="flex items-center space-x-2">
  <Avatar src={user1.avatar} />
  <span>{user1.name}</span>
</div>
<div className="flex items-center space-x-2">
  <Avatar src={user2.avatar} />
  <span>{user2.name}</span>
</div>

// AFTER - Extracted component
function UserItem({ user }) {
  return (
    <div className="flex items-center space-x-2">
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
    </div>
  );
}

<UserItem user={user1} />
<UserItem user={user2} />
\`\`\`

## Common Edit Patterns

### Changing Colors
\`\`\`tsx
// From: className="text-blue-500"
// To: className="text-primary"  // Use semantic tokens

// From: className="bg-gray-100"
// To: className="bg-muted"  // Use design system
\`\`\`

### Adding Event Handlers
\`\`\`tsx
// BEFORE
<Button>Click Me</Button>

// AFTER
<Button onClick={handleClick}>Click Me</Button>

// Add handler function
const handleClick = () => {
  console.log('Button clicked');
};
\`\`\`

### Updating State Management
\`\`\`tsx
// BEFORE
const [count, setCount] = useState(0);

// AFTER - Adding persistence
const [count, setCount] = useState(() => {
  const saved = localStorage.getItem('count');
  return saved ? parseInt(saved) : 0;
});

useEffect(() => {
  localStorage.setItem('count', count.toString());
}, [count]);
\`\`\`

### Adding Props to Components
\`\`\`tsx
// BEFORE
function Card({ title, children }) {
  return <div><h2>{title}</h2>{children}</div>;
}

// AFTER - Adding variant prop
function Card({ title, children, variant = 'default' }) {
  return (
    <div className={cn('card', variant === 'highlighted' && 'border-primary')}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
\`\`\`

## File Path Handling During Edits

When editing files, always:
1. Show the FULL file path in comments: \`// File: src/components/MyComponent.tsx\`
2. Use accurate, real file paths that exist in the project
3. Don't create placeholder paths like \`components/NewComponent.tsx\`
4. Check existing file structure before suggesting paths

## Type-Safe Edits

When working with TypeScript:
\`\`\`tsx
// Define interfaces for new props
interface CardProps {
  title: string;
  description?: string;
  variant?: 'default' | 'highlighted';
  onClick?: () => void;
}

// Use the interface
function Card({ title, description, variant = 'default', onClick }: CardProps) {
  // Implementation
}
\`\`\`

## State Updates

When modifying state logic:
\`\`\`tsx
// BEFORE - Simple state
const [users, setUsers] = useState([]);

// AFTER - With loading and error states
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchUsers()
    .then(setUsers)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
\`\`\`
`,

  examples: [
    'Add a new section below the hero',
    'Change button color to primary',
    'Remove the sidebar component',
    'Update the form validation rules',
    'Add loading state to the submit button',
    'Extract repeated card code into a component',
    'Change the layout from 3 columns to 4',
    'Add hover effect to the navigation items',
    'Update the API endpoint URL',
    'Fix the spacing between sections',
    'Add error handling to the form',
    'Change font size of the heading',
    'Remove unused imports',
    'Add TypeScript types to the component',
    'Refactor the data fetching logic'
  ]
};
