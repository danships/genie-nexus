import { describe, expect, it } from 'vitest';
import { validateExpression } from './validate-expression.js';

describe('validateExpression', () => {
  describe('Basic Validation', () => {
    it('should validate simple expressions', () => {
      const result = validateExpression('{{ 1 + 1 }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate multiple expressions', () => {
      const result = validateExpression('{{ 1 + 1 }}-{{ 2 + 2 }}-{{ 3 + 3 }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate complex expressions', () => {
      const result = validateExpression('Result: {{ Math.pow(2, 3) }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate object and array expressions', () => {
      const result = validateExpression('Keys: {{ Object.keys({a:1,b:2}) }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Variable Validation', () => {
    it('should validate expressions with variables', () => {
      const result = validateExpression('{{ x + y }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate expressions with undefined variables', () => {
      const result = validateExpression('{{ x + y }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate built-in JavaScript values', () => {
      const result = validateExpression('{{ true && false }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const result2 = validateExpression('{{ null }}');
      expect(result2.isValid).toBe(true);
      expect(result2.errors).toHaveLength(0);

      const result3 = validateExpression('{{ undefined }}');
      expect(result3.isValid).toBe(true);
      expect(result3.errors).toHaveLength(0);

      const result4 = validateExpression('{{ NaN }}');
      expect(result4.isValid).toBe(true);
      expect(result4.errors).toHaveLength(0);

      const result5 = validateExpression('{{ Infinity }}');
      expect(result5.isValid).toBe(true);
      expect(result5.errors).toHaveLength(0);
    });

    it('should validate object property access', () => {
      const result = validateExpression('{{ obj.prop }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate array index access', () => {
      const result = validateExpression('{{ arr[0] }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate function calls on variables', () => {
      const result = validateExpression('{{ str.length }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Error Cases', () => {
    it('should detect missing expressions', () => {
      const result = validateExpression('plain text');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Template must contain at least one expression'
      );
    });

    it('should detect unclosed expressions', () => {
      const result = validateExpression('{{ 1 + 1');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unclosed expression detected');
    });

    it('should detect syntax errors', () => {
      const result = validateExpression('{{ 2 + }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toMatch(/Invalid expression/);
    });

    it('should detect dangerous operations', () => {
      const result = validateExpression('{{ while(true) {} }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should detect multiple errors', () => {
      const result = validateExpression('{{ while(true) {} }}{{ 2 + }}');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('Empty Expressions', () => {
    it('should handle empty expressions', () => {
      const result = validateExpression('{{}}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle whitespace-only expressions', () => {
      const result = validateExpression('{{    }}');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Security Restrictions', () => {
    it('should block while loops', () => {
      const result = validateExpression('{{ while(true) {} }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block for loops', () => {
      const result = validateExpression('{{ for(;;) {} }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block do-while loops', () => {
      const result = validateExpression('{{ do {} while(true) }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block require statements', () => {
      const result = validateExpression('{{ require("fs") }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block import statements', () => {
      const result = validateExpression('{{ import("fs") }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block process access', () => {
      const result = validateExpression('{{ process.exit() }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block setTimeout', () => {
      const result = validateExpression('{{ setTimeout(() => {}, 1000) }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });

    it('should block setInterval', () => {
      const result = validateExpression('{{ setInterval(() => {}, 1000) }}');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('potentially dangerous operations');
    });
  });
});
