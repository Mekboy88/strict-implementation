export const UI_COMPONENTS_TASKS = {
  buttons: {
    patterns: [
      'create a button', 'add button', 'make button', 'build button',
      'primary button', 'secondary button', 'outline button', 'icon button',
      'loading button', 'disabled button', 'button group', 'toggle button'
    ],
    instructions: `
# Button Creation Guide

## Basic Button Pattern
\`\`\`tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Click Me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
\`\`\`

## Button with Icon
\`\`\`tsx
import { Plus } from "lucide-react";
<Button><Plus className="mr-2 h-4 w-4" />Add Item</Button>
\`\`\`

## Loading Button
\`\`\`tsx
import { Loader2 } from "lucide-react";
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
\`\`\`

## Size Variants
\`\`\`tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus className="h-4 w-4" /></Button>
\`\`\`
`,
    examples: ['Login button with loading state', 'Add to cart button', 'Social login buttons', 'Button group for filters']
  },

  cards: {
    patterns: [
      'create a card', 'add card', 'make card component',
      'product card', 'pricing card', 'profile card', 'stat card',
      'feature card', 'testimonial card', 'blog card'
    ],
    instructions: `
# Card Component Guide

## Basic Card
\`\`\`tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

## Stat Card
\`\`\`tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
    <DollarSign className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
  </CardContent>
</Card>
\`\`\`

## Product Card
\`\`\`tsx
// products.map((product) => (
<Card className="overflow-hidden">
  <div className="aspect-square overflow-hidden">
    <img src="/product.jpg" alt="Product" className="object-cover w-full h-full" />
  </div>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>$99.99</CardDescription>
  </CardHeader>
  <CardFooter>
    <Button className="w-full">Add to Cart</Button>
  </CardFooter>
</Card>
// ))
\`\`\`
`,
    examples: ['E-commerce product cards', 'Dashboard stat cards', 'Pricing tier cards', 'Blog post cards']
  },

  forms: {
    patterns: [
      'create form', 'build form', 'add form',
      'login form', 'registration form', 'contact form',
      'input field', 'textarea', 'select dropdown', 'checkbox', 'radio button',
      'form validation', 'file upload', 'date picker'
    ],
    instructions: `
# Form Component Guide

## Basic Form with Validation
\`\`\`tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </Form>
  );
}
\`\`\`

## Select Field
\`\`\`tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<FormField
  control={form.control}
  name="country"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Country</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
\`\`\`

## Checkbox
\`\`\`tsx
import { Checkbox } from "@/components/ui/checkbox";

<FormField
  control={form.control}
  name="acceptTerms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormLabel className="!mt-0">Accept terms and conditions</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
\`\`\`
`,
    examples: ['Login form with email/password', 'Multi-step registration', 'Contact form with file upload', 'Profile edit form']
  },

  modals: {
    patterns: [
      'create modal', 'add dialog', 'make popup',
      'confirmation dialog', 'alert dialog', 'form modal',
      'delete confirmation', 'image modal', 'fullscreen modal'
    ],
    instructions: `
# Modal/Dialog Guide

## Basic Dialog
\`\`\`tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here</DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
  </DialogContent>
</Dialog>
\`\`\`

## Confirmation Dialog
\`\`\`tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your data.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
\`\`\`

## Form Modal
\`\`\`tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Add New</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Name" />
      <Button type="submit">Save</Button>
    </form>
  </DialogContent>
</Dialog>
\`\`\`
`,
    examples: ['Delete confirmation', 'Edit user modal', 'Image lightbox', 'Settings modal']
  },

  navigation: {
    patterns: [
      'create navbar', 'add navigation', 'build menu',
      'sidebar', 'header', 'footer', 'breadcrumbs',
      'tabs', 'pagination', 'mobile menu', 'dropdown menu'
    ],
    instructions: `
# Navigation Components Guide

## Navbar with Mobile Menu
\`\`\`tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">Logo</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="hover:text-primary">Home</a>
            <a href="/about" className="hover:text-primary">About</a>
            <a href="/contact" className="hover:text-primary">Contact</a>
          </div>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="/" className="block py-2 hover:text-primary">Home</a>
            <a href="/about" className="block py-2 hover:text-primary">About</a>
            <a href="/contact" className="block py-2 hover:text-primary">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
}
\`\`\`

## Tabs Navigation
\`\`\`tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
  <TabsContent value="reports">Reports content</TabsContent>
</Tabs>
\`\`\`

## Sidebar
\`\`\`tsx
import { Home, Settings, Users } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background h-screen p-4">
      <nav className="space-y-2">
        <a href="/" className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </a>
        <a href="/users" className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
          <Users className="h-5 w-5" />
          <span>Users</span>
        </a>
        <a href="/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-accent">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}
\`\`\`
`,
    examples: ['Responsive navbar', 'Dashboard sidebar', 'Tab navigation', 'Breadcrumb trail']
  },

  tables: {
    patterns: [
      'create table', 'data table', 'build table',
      'sortable table', 'filterable table', 'paginated table',
      'expandable rows', 'table with actions', 'editable table'
    ],
    instructions: `
# Table Component Guide

## Basic Table
\`\`\`tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.status}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
\`\`\`

## Sortable Table
\`\`\`tsx
const [sortField, setSortField] = useState('name');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

const sortedData = [...data].sort((a, b) => {
  if (sortDirection === 'asc') {
    return a[sortField] > b[sortField] ? 1 : -1;
  }
  return a[sortField] < b[sortField] ? 1 : -1;
});

const handleSort = (field: string) => {
  if (sortField === field) {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  } else {
    setSortField(field);
    setSortDirection('asc');
  }
};

<TableHead onClick={() => handleSort('name')} className="cursor-pointer">
  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
</TableHead>
\`\`\`
`,
    examples: ['User management table', 'Product inventory table', 'Order history table', 'Analytics data table']
  },

  lists: {
    patterns: [
      'create list', 'build list component',
      'ordered list', 'unordered list', 'list with icons',
      'timeline', 'feed', 'activity list'
    ],
    instructions: `
# List Component Guide

## Icon List
\`\`\`tsx
import { Check, X, AlertCircle } from 'lucide-react';

const features = [
  { icon: Check, text: 'Feature 1', available: true },
  { icon: Check, text: 'Feature 2', available: true },
  { icon: X, text: 'Feature 3', available: false },
];

<ul className="space-y-2">
  {features.map((feature, i) => (
    <li key={i} className="flex items-center space-x-2">
      <feature.icon className={feature.available ? 'text-green-500' : 'text-red-500'} />
      <span>{feature.text}</span>
    </li>
  ))}
</ul>
\`\`\`

## Timeline
\`\`\`tsx
const events = [
  { date: '2024-01-01', title: 'Event 1', description: 'Description' },
  { date: '2024-01-05', title: 'Event 2', description: 'Description' },
];

<div className="space-y-4">
  {events.map((event, i) => (
    <div key={i} className="flex space-x-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-primary" />
        {i < events.length - 1 && <div className="w-0.5 h-full bg-border mt-2" />}
      </div>
      <div className="flex-1 pb-8">
        <p className="text-sm text-muted-foreground">{event.date}</p>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </div>
    </div>
  ))}
</div>
\`\`\`
`,
    examples: ['Feature list', 'Activity timeline', 'Social media feed', 'Notification list']
  },

  alerts: {
    patterns: [
      'create alert', 'add notification', 'toast message',
      'success alert', 'error alert', 'warning alert', 'info alert',
      'dismissible alert', 'toast notification'
    ],
    instructions: `
# Alert & Toast Guide

## Alert Component
\`\`\`tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You have pending notifications.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <XCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
\`\`\`

## Toast Notifications
\`\`\`tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// Success toast
toast({
  title: "Success!",
  description: "Your changes have been saved.",
});

// Error toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
});

// Loading toast
toast({
  title: "Loading...",
  description: "Please wait while we process your request.",
});
\`\`\`

## Dismissible Alert
\`\`\`tsx
const [show, setShow] = useState(true);

{show && (
  <Alert className="relative">
    <AlertTitle>Notice</AlertTitle>
    <AlertDescription>This is an important message.</AlertDescription>
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-2 top-2"
      onClick={() => setShow(false)}
    >
      <X className="h-4 w-4" />
    </Button>
  </Alert>
)}
\`\`\`
`,
    examples: ['Form validation errors', 'Success messages', 'System notifications', 'Loading states']
  },

  progress: {
    patterns: [
      'create progress bar', 'add loading indicator',
      'progress circle', 'step indicator', 'skeleton loader',
      'spinner', 'loading animation'
    ],
    instructions: `
# Progress & Loading Guide

## Progress Bar
\`\`\`tsx
import { Progress } from "@/components/ui/progress";

<Progress value={progress} className="w-full" />
\`\`\`

## Step Indicator
\`\`\`tsx
const steps = ['Personal Info', 'Address', 'Payment', 'Confirm'];
const currentStep = 2;

<div className="flex items-center justify-between">
  {steps.map((step, i) => (
    <div key={i} className="flex items-center">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
        i < currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {i + 1}
      </div>
      <span className="ml-2">{step}</span>
      {i < steps.length - 1 && <div className="h-0.5 w-16 bg-border mx-4" />}
    </div>
  ))}
</div>
\`\`\`

## Skeleton Loader
\`\`\`tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
\`\`\`

## Spinner
\`\`\`tsx
import { Loader2 } from "lucide-react";

<Loader2 className="h-8 w-8 animate-spin" />
\`\`\`
`,
    examples: ['File upload progress', 'Multi-step form', 'Loading skeleton', 'Infinite scroll loader']
  }
};
