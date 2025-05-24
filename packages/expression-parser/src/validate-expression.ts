import {
  checkForDangerousOperations,
  expressionRegex,
  validateTemplateStructure,
} from './expression-utils.js';
import { Script } from 'vm';
import * as acorn from 'acorn';
import { simple } from 'acorn-walk';
import type { Node, Identifier, MemberExpression, CallExpression } from 'acorn';

/**
 * Extracts variable names from an expression using AST parsing
 * @param expression - The expression to analyze
 * @returns Set of variable names used in the expression
 */
function extractVariableNames(expression: string): Set<string> {
  const variableNames = new Set<string>();

  try {
    const ast = acorn.parse(expression, {
      ecmaVersion: 2020,
      sourceType: 'script',
    });

    simple(ast, {
      Identifier(node: Identifier & { parent?: Node }) {
        // Skip if this is a property of an object or array
        if (
          node.parent?.type === 'MemberExpression' &&
          (node.parent as MemberExpression).property === node
        ) {
          return;
        }

        // Skip if this is a method name in a call expression
        if (
          node.parent?.type === 'CallExpression' &&
          (node.parent as CallExpression).callee === node
        ) {
          return;
        }

        // Skip built-in JavaScript values
        if (
          ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'].includes(
            node.name,
          )
        ) {
          return;
        }

        variableNames.add(node.name);
      },
    });
  } catch {
    // If parsing fails, return empty set - syntax validation will catch this
    return new Set();
  }

  return variableNames;
}

/**
 * Validates the syntax of a single expression
 * @param expression - The expression to validate
 * @param allowedVariables - Optional list of allowed variable names
 * @returns An object containing validation results
 */
export function validateExpressionSyntax(
  expression: string,
  allowedVariables?: string[],
): {
  isValid: boolean;
  error?: string;
} {
  try {
    // Check for dangerous operations
    checkForDangerousOperations(expression);

    // Check for undefined variables if allowedVariables is provided
    if (allowedVariables) {
      const variables = new Set(allowedVariables);
      const usedVariables = extractVariableNames(expression);
      const undefinedVars = Array.from(usedVariables).filter(
        (varName) => !variables.has(varName),
      );

      if (undefinedVars.length > 0) {
        return {
          isValid: false,
          error: `Undefined variables used: ${undefinedVars.join(', ')}`,
        };
      }
    }

    // Try to parse the expression to check syntax
    new Script(expression);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid expression',
    };
  }
}

/**
 * Validates an expression without executing it
 * @param expression - The expression to validate
 * @returns An object containing validation results
 */
export function validateExpression(
  expression: string,
  allowedVariables?: string[],
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate template structure
  const structureResult = validateTemplateStructure(expression);
  if (!structureResult.isValid) {
    return structureResult;
  }

  // Check each expression individually
  let match: RegExpExecArray | null;
  while ((match = expressionRegex.exec(expression)) !== null) {
    const [, expr] = match;
    if (!expr) {
      continue;
    }
    const trimmedExpression = expr.trim();

    // Skip empty expressions
    if (trimmedExpression === '') {
      continue;
    }

    // Validate expression syntax and check for dangerous operations
    const syntaxResult = validateExpressionSyntax(
      trimmedExpression,
      allowedVariables,
    );
    if (!syntaxResult.isValid && syntaxResult.error) {
      errors.push(
        `Invalid expression "${trimmedExpression}": ${syntaxResult.error}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
