import { Script, createContext } from 'vm';
import {
  expressionRegex,
  checkForDangerousOperations,
  validateTemplateStructure,
} from './expression-utils';

/**
 * Evaluates a single expression in a secure sandbox
 * @param expression - The expression to evaluate
 * @returns The result of the evaluation
 */
function evaluateSingleExpression(
  expression: string,
): number | string | boolean | object | null {
  // First check for dangerous operations
  checkForDangerousOperations(expression);

  // Create a secure context with limited access
  const context = createContext({
    // Allow basic math operations
    Math,
    // Allow basic comparison operators
    Boolean,
    // Allow basic number operations
    Number,
    // Allow basic string operations
    String,
    // Allow basic array operations
    Array,
    // Allow basic object operations
    Object,
    // Allow basic date operations
    Date,
    // Allow basic JSON operations
    JSON,
  });

  try {
    // Create a new script with the expression
    const script = new Script(expression);
    // Run the script in the secure context
    const result = script.runInContext(context) as
      | number
      | string
      | boolean
      | object
      | null;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Expression evaluation failed: ${error.message}`);
    }
    throw new Error('Expression evaluation failed with unknown error');
  }
}

/**
 * Converts a value to a string representation
 * @param value - The value to convert
 * @returns String representation of the value
 */
function valueToString(
  value: number | string | boolean | object | null,
): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Evaluates a template string containing expressions within {{ }}
 * @param template - The template string to evaluate
 * @returns The evaluated string with expressions replaced by their results
 */
export function evaluateExpression(template: string): string {
  // Validate template structure
  const structureResult = validateTemplateStructure(template);
  if (!structureResult.isValid) {
    throw new Error(structureResult.errors[0]);
  }

  // Replace each expression with its evaluated result
  return template.replace(
    expressionRegex,
    (_match: string, expression: string) => {
      // Handle empty expressions
      if (expression.trim() === '') {
        return '';
      }

      try {
        // Evaluate the expression
        const result = evaluateSingleExpression(expression.trim());
        return valueToString(result);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Failed to evaluate expression "${expression}": ${error.message}`,
          );
        }
        throw error;
      }
    },
  );
}
