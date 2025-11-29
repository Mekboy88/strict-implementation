export const BUG_FIXING_TASKS = {
  commonErrors: {
    'blank screen': {
      causes: [
        'Missing return statement in component',
        'Syntax error in JSX',
        'Uncaught exception breaking render',
        'Missing Router wrapper',
        'Import error'
      ],
      solutions: `
# Blank Screen Fixes

## Check for Missing Returns
\`\`\`tsx
// WRONG
function MyComponent() {
  <div>Content</div>  // Missing return!
}

// CORRECT
function MyComponent() {
  return <div>Content</div>;
}
\`\`\`

## Check for Syntax Errors
\`\`\`tsx
// WRONG
<div className={active ? 'active' : 'inactive'}>  // Missing closing tag

// CORRECT
<div className={active ? 'active' : 'inactive'}>Content</div>
\`\`\`

## Check Router Setup
\`\`\`tsx
// main.tsx must have Router
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>
\`\`\`

## Check Console for Errors
Look for:
- Import errors
- "Cannot read property of undefined"
- Syntax errors
- Missing dependencies
`
    },

    'element type is invalid': {
      causes: [
        'Incorrect import statement',
        'Component not exported properly',
        'Trying to render undefined component',
        'Wrong import path'
      ],
      solutions: `
# Element Type Invalid Fixes

## Check Named vs Default Exports
\`\`\`tsx
// File: MyComponent.tsx
export function MyComponent() { ... }  // Named export

// WRONG import
import MyComponent from './MyComponent';  // Default import

// CORRECT import
import { MyComponent } from './MyComponent';  // Named import
\`\`\`

## Check Import Paths
\`\`\`tsx
// WRONG
import { Button } from 'components/ui/button';

// CORRECT
import { Button } from '@/components/ui/button';
\`\`\`

## Check Component Definition
\`\`\`tsx
// WRONG - Not exported
function MyComponent() { return <div>Test</div>; }

// CORRECT
export function MyComponent() { return <div>Test</div>; }
\`\`\`
`
    },

    'cannot read property of undefined': {
      causes: [
        'Accessing property before data is loaded',
        'Missing null/undefined check',
        'Async data not handled',
        'Optional chaining needed'
      ],
      solutions: `
# Undefined Property Fixes

## Add Optional Chaining
\`\`\`tsx
// WRONG
<div>{user.name}</div>  // Crashes if user is undefined

// CORRECT
<div>{user?.name}</div>
\`\`\`

## Add Loading States
\`\`\`tsx
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.name}</div>;  // Safe now
}
\`\`\`

## Provide Default Values
\`\`\`tsx
// WRONG
const name = user.name;

// CORRECT
const name = user?.name || 'Unknown';
\`\`\`

## Check Before Mapping
\`\`\`tsx
// WRONG
{users.map(user => <div key={user.id}>{user.name}</div>)}

// CORRECT
{users?.length > 0 && users.map(user => (
  <div key={user.id}>{user.name}</div>
))}
\`\`\`
`
    },

    'button not working': {
      causes: [
        'Missing onClick handler',
        'Event not propagating',
        'Button is disabled',
        'Z-index issue',
        'Pointer events disabled'
      ],
      solutions: `
# Button Not Working Fixes

## Check onClick Handler
\`\`\`tsx
// WRONG
<Button onClick={handleClick()}>  // Executes immediately!

// CORRECT
<Button onClick={handleClick}>  // Pass function reference
<Button onClick={() => handleClick()}>  // Arrow function
\`\`\`

## Check Disabled State
\`\`\`tsx
// Check if button is disabled
<Button disabled={isLoading}>Submit</Button>

// Make sure disabled state is correct
const [isLoading, setIsLoading] = useState(false);
\`\`\`

## Check Event Propagation
\`\`\`tsx
// If button is inside clickable parent
<div onClick={parentHandler}>
  <Button onClick={(e) => {
    e.stopPropagation();  // Prevent parent handler
    handleClick();
  }}>
    Click Me
  </Button>
</div>
\`\`\`

## Check Z-Index/Overlays
\`\`\`tsx
// Make sure nothing is covering the button
<Button className="relative z-10">Click Me</Button>
\`\`\`
`
    },

    'styles not applying': {
      causes: [
        'Tailwind classes spelled wrong',
        'Custom CSS not imported',
        'Specificity issues',
        'Class names conflicting',
        'Purge configuration'
      ],
      solutions: `
# Styling Not Applying Fixes

## Check Tailwind Class Names
\`\`\`tsx
// WRONG
<div className="text-center padding-4">  // padding-4 doesn't exist

// CORRECT
<div className="text-center p-4">
\`\`\`

## Use cn() for Conditional Classes
\`\`\`tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)}>
\`\`\`

## Check CSS Import
\`\`\`tsx
// In main.tsx or index.tsx
import './index.css';  // Must import global styles
\`\`\`

## Use Inline Styles as Fallback
\`\`\`tsx
// If Tailwind not working, use inline
<div style={{ color: 'red', padding: '16px' }}>
\`\`\`

## Check Design System Tokens
\`\`\`tsx
// WRONG - Direct colors
<div className="text-white bg-black">

// CORRECT - Use semantic tokens
<div className="text-foreground bg-background">
\`\`\`
`
    },

    'form not submitting': {
      causes: [
        'Missing event.preventDefault()',
        'Validation failing',
        'Form not wrapping inputs',
        'Submit button outside form',
        'Type not set to submit'
      ],
      solutions: `
# Form Not Submitting Fixes

## Prevent Default Behavior
\`\`\`tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();  // CRITICAL: Prevent page reload
  // Handle form submission
};

<form onSubmit={handleSubmit}>
  <Input name="email" />
  <Button type="submit">Submit</Button>
</form>
\`\`\`

## Check Button Type
\`\`\`tsx
// WRONG
<Button>Submit</Button>  // Defaults to button, not submit

// CORRECT
<Button type="submit">Submit</Button>
\`\`\`

## Check Form Structure
\`\`\`tsx
// Button must be inside form
<form onSubmit={handleSubmit}>
  <Input />
  <Button type="submit">Submit</Button>  // Inside form
</form>
\`\`\`

## Add Loading State
\`\`\`tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await submitData();
    toast({ title: 'Success!' });
  } catch (error) {
    toast({ variant: 'destructive', title: 'Error' });
  } finally {
    setLoading(false);
  }
};
\`\`\`
`
    },

    'state not updating': {
      causes: [
        'Mutating state directly',
        'Async setState not handled',
        'Using stale state in closure',
        'Missing dependencies in useEffect'
      ],
      solutions: `
# State Not Updating Fixes

## Don't Mutate State Directly
\`\`\`tsx
// WRONG
const handleAdd = () => {
  users.push(newUser);  // Direct mutation
  setUsers(users);  // Won't trigger re-render
};

// CORRECT
const handleAdd = () => {
  setUsers([...users, newUser]);  // Create new array
};
\`\`\`

## Update Objects Immutably
\`\`\`tsx
// WRONG
const handleUpdate = () => {
  user.name = 'New Name';  // Direct mutation
  setUser(user);
};

// CORRECT
const handleUpdate = () => {
  setUser({ ...user, name: 'New Name' });
};
\`\`\`

## Use Functional Updates
\`\`\`tsx
// WRONG - Using stale state
const increment = () => {
  setCount(count + 1);  // May use old value
};

// CORRECT
const increment = () => {
  setCount(prev => prev + 1);  // Always gets latest
};
\`\`\`

## Fix useEffect Dependencies
\`\`\`tsx
// WRONG - Missing dependencies
useEffect(() => {
  fetchData(userId);
}, []);  // Missing userId

// CORRECT
useEffect(() => {
  fetchData(userId);
}, [userId]);  // Include all dependencies
\`\`\`
`
    },

    'infinite loop': {
      causes: [
        'useEffect with missing/wrong dependencies',
        'setState in render',
        'Updating state that triggers useEffect',
        'Recursive component rendering'
      ],
      solutions: `
# Infinite Loop Fixes

## Fix useEffect Dependencies
\`\`\`tsx
// WRONG - Updates state that's in dependency array
useEffect(() => {
  setData(processData(data));  // Causes infinite loop
}, [data]);

// CORRECT - Only run on mount or specific changes
useEffect(() => {
  setData(processData(initialData));
}, []);  // Empty deps or specific trigger
\`\`\`

## Don't Set State in Render
\`\`\`tsx
// WRONG
function MyComponent() {
  setCount(count + 1);  // Infinite loop!
  return <div>{count}</div>;
}

// CORRECT
function MyComponent() {
  const handleClick = () => {
    setCount(count + 1);  // Only in event handler
  };
  return <button onClick={handleClick}>{count}</button>;
}
\`\`\`

## Use Refs for Values That Don't Need Re-render
\`\`\`tsx
// Instead of state for tracking values
const countRef = useRef(0);

useEffect(() => {
  countRef.current += 1;  // Doesn't trigger re-render
}, []);
\`\`\`
`
    }
  },

  debuggingSteps: `
# Debugging Process

1. **Check Console** - Look for error messages
2. **Check Network Tab** - Verify API calls
3. **Add Console Logs** - Track execution flow
4. **Use React DevTools** - Inspect component state
5. **Check Imports** - Verify all imports are correct
6. **Verify File Paths** - Ensure paths are accurate
7. **Check Types** - Verify TypeScript types
8. **Test in Isolation** - Simplify to minimal reproduction
9. **Check Dependencies** - Ensure packages are installed
10. **Clear Cache** - Try clearing browser/build cache
`
};
