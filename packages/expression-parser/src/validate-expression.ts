import {
  expressionRegex,
  validateTemplateStructure,
  validateExpressionSyntax,
} from './expression-utils';

/**
 * Validates an expression without executing it
 * @param expression - The expression to validate
 * @returns An object containing validation results
 */
export function validateExpression(expression: string): {
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

    // Validate expression syntax
    const syntaxResult = validateExpressionSyntax(trimmedExpression);
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
