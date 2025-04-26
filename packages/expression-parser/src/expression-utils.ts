// Regular expression to match expressions within {{ }}
export const expressionRegex = /{{(.*?)}}/g;

// List of dangerous patterns to block
export const DANGEROUS_PATTERNS = [
  /\bwhile\b/i, // while loops
  /\bfor\b/i, // for loops
  /\bdo\b/i, // do-while loops
  /\b(require|import)\s*\(/i, // Module imports
  /\b(process|global)\b/i, // Process and global access
  /\b(fs|http|https|net|child_process)\b/i, // Node.js modules
  /\b(eval|Function)\s*\(/i, // Dynamic code execution
  /\b(document|window)\b/i, // Browser globals
  /\b(fetch|XMLHttpRequest)\b/i, // Network requests
  /\b(setTimeout|setInterval)\b/i, // Timers
  /\b(new Function)\b/i, // Dynamic function creation
  /\b(new RegExp)\b/i, // Dynamic RegExp creation
];

/**
 * Checks if an expression contains dangerous operations
 * @param expression - The expression to check
 * @throws Error if dangerous operations are detected
 */
export function checkForDangerousOperations(expression: string): void {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(expression)) {
      throw new Error('Expression contains potentially dangerous operations.');
    }
  }
}

/**
 * Validates the basic structure of a template
 * @param template - The template to validate
 * @returns An object containing validation results
 */
export function validateTemplateStructure(template: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if the string contains any expressions
  if (!template.includes('{{')) {
    errors.push('Template must contain at least one expression');
    return { isValid: false, errors };
  }

  // Check for unclosed expressions
  const openCount = (template.match(/{{/g) || []).length;
  const closeCount = (template.match(/}}/g) || []).length;
  if (openCount !== closeCount) {
    errors.push('Unclosed expression detected');
    return { isValid: false, errors };
  }

  return { isValid: true, errors };
}
