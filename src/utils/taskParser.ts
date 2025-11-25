/**
 * Parses AI responses to extract actionable tasks
 */

export interface ExtractedTask {
  text: string;
  type: 'numbered' | 'bullet' | 'step';
}

/**
 * Extract tasks from AI response text
 * Looks for:
 * - Numbered lists (1., 2., 3., etc.)
 * - Bullet points (-, *, •) with action verbs
 * - Lines starting with "Step X:" or "Task X:"
 */
export function extractTasksFromResponse(text: string): ExtractedTask[] {
  const tasks: ExtractedTask[] = [];
  const lines = text.split('\n');
  
  // Action verbs that indicate a task
  const actionVerbs = [
    'create', 'add', 'build', 'implement', 'set up', 'setup', 'configure', 
    'install', 'write', 'define', 'update', 'modify', 'change', 'fix',
    'remove', 'delete', 'refactor', 'optimize', 'test', 'deploy', 'connect',
    'integrate', 'design', 'style', 'import', 'export', 'fetch', 'handle',
    'validate', 'check', 'ensure', 'make', 'use', 'apply', 'enable', 'disable'
  ];
  
  const actionVerbRegex = new RegExp(`^(${actionVerbs.join('|')})\\b`, 'i');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 5) continue;
    
    // Check for numbered lists: "1.", "1)", "1:"
    const numberedMatch = trimmed.match(/^(\d+)[.):\-]\s+(.+)/);
    if (numberedMatch) {
      const taskText = numberedMatch[2].trim();
      // Skip if it's too short or looks like a heading
      if (taskText.length >= 10 && !taskText.endsWith(':')) {
        tasks.push({ text: cleanTaskText(taskText), type: 'numbered' });
      }
      continue;
    }
    
    // Check for "Step X:" or "Task X:" patterns
    const stepMatch = trimmed.match(/^(step|task)\s*\d*[:.]\s*(.+)/i);
    if (stepMatch) {
      const taskText = stepMatch[2].trim();
      if (taskText.length >= 10 && !taskText.endsWith(':')) {
        tasks.push({ text: cleanTaskText(taskText), type: 'step' });
      }
      continue;
    }
    
    // Check for bullet points with action verbs
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (bulletMatch) {
      const taskText = bulletMatch[1].trim();
      // Only add if it starts with an action verb and is long enough
      if (taskText.length >= 10 && actionVerbRegex.test(taskText) && !taskText.endsWith(':')) {
        tasks.push({ text: cleanTaskText(taskText), type: 'bullet' });
      }
      continue;
    }
  }
  
  // Remove duplicates based on similar text
  const uniqueTasks = removeDuplicateTasks(tasks);
  
  // Limit to reasonable number of tasks
  return uniqueTasks.slice(0, 10);
}

/**
 * Clean up task text for display
 */
function cleanTaskText(text: string): string {
  // Remove markdown bold/italic
  let cleaned = text.replace(/\*\*(.+?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
  cleaned = cleaned.replace(/_(.+?)_/g, '$1');
  
  // Remove backticks
  cleaned = cleaned.replace(/`(.+?)`/g, '$1');
  
  // Capitalize first letter
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  
  // Truncate if too long
  if (cleaned.length > 80) {
    cleaned = cleaned.substring(0, 77) + '...';
  }
  
  return cleaned;
}

/**
 * Remove duplicate or very similar tasks
 */
function removeDuplicateTasks(tasks: ExtractedTask[]): ExtractedTask[] {
  const seen = new Set<string>();
  const result: ExtractedTask[] = [];
  
  for (const task of tasks) {
    // Create a normalized version for comparison
    const normalized = task.text.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if we've seen something similar
    let isDuplicate = false;
    for (const seenText of seen) {
      if (normalized.includes(seenText) || seenText.includes(normalized)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate && normalized.length > 10) {
      seen.add(normalized);
      result.push(task);
    }
  }
  
  return result;
}

/**
 * Check if the response likely contains tasks worth extracting
 */
export function hasExtractableTasks(text: string): boolean {
  const tasks = extractTasksFromResponse(text);
  return tasks.length >= 2; // Only show if there are at least 2 tasks
}
