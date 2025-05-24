import { createContext, Script } from 'node:vm';
import {
  checkForDangerousOperations,
  expressionRegex,
  validateTemplateStructure,
} from './expression-utils.js';

/**
 * Configuration options for expression evaluation
 */
export interface EvaluationConfig {
  /**
   * Maximum time in milliseconds that an expression can take to evaluate
   * @default 1000 (1 second)
   */
  timeout?: number;

  /**
   * Values for the allowed variables
   * @default undefined (variables will be undefined)
   */
  variableValues?: Record<string, unknown>;
}

/**
 * Default evaluation configuration
 */
const DEFAULT_CONFIG: EvaluationConfig = {
  timeout: 1000, // 1 second default timeout
};

/**
 * Evaluates a single expression in a secure sandbox
 * @param expression - The expression to evaluate
 * @param config - Optional configuration for evaluation
 * @returns The result of the evaluation
 */
function evaluateSingleExpression(
  expression: string,
  config: EvaluationConfig = DEFAULT_CONFIG,
): number | string | boolean | object | null {
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
    // Add allowed variables to the context
    ...(config.variableValues || {}),
  });

  try {
    // Create a new script with the expression
    const script = new Script(expression);
    // Run the script in the secure context with timeout
    const result = script.runInContext(context, {
      timeout: config.timeout,
    }) as number | string | boolean | object | null;
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Script execution timed out')) {
        throw new Error(
          `Expression evaluation timed out after ${config.timeout}ms`,
        );
      }
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
 * @param config - Optional configuration for evaluation
 * @returns The evaluated string with expressions replaced by their results
 */
export function evaluateExpression(
  template: string,
  config: EvaluationConfig = DEFAULT_CONFIG,
): string {
  // Validate template structure
  const structureResult = validateTemplateStructure(template);
  if (!structureResult.isValid) {
    throw new Error(structureResult.errors[0]);
  }

  // Extract all expressions and validate them first
  const expressions = Array.from(template.matchAll(expressionRegex));
  for (const [, expression] of expressions) {
    if (!expression || expression.trim() === '') {
      continue;
    }

    // Check for dangerous operations and validate variables
    checkForDangerousOperations(expression);
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
        const result = evaluateSingleExpression(expression.trim(), config);
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
