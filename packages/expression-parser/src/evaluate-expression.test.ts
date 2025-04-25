import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './evaluate-expression';

describe('evaluateExpression', () => {
  describe('Template Expressions', () => {
    it('should evaluate simple template expressions', () => {
      expect(evaluateExpression('index-{{ 1 + 1 }}')).toBe('index-2');
      expect(evaluateExpression('{{ 2 + 2 }} is 4')).toBe('4 is 4');
    });

    it('should handle multiple expressions in one template', () => {
      expect(evaluateExpression('{{ 1 + 1 }}-{{ 2 + 2 }}-{{ 3 + 3 }}')).toBe(
        '2-4-6',
      );
      expect(evaluateExpression('Start {{ 1 }} middle {{ 2 }} end')).toBe(
        'Start 1 middle 2 end',
      );
    });

    it('should handle complex expressions in templates', () => {
      expect(evaluateExpression('Result: {{ Math.pow(2, 3) }}')).toBe(
        'Result: 8',
      );
      expect(evaluateExpression('Length: {{ "hello".length }}')).toBe(
        'Length: 5',
      );
    });

    it('should handle object and array expressions', () => {
      expect(evaluateExpression('Array: {{ [1,2,3].map(x => x * 2) }}')).toBe(
        'Array: [2,4,6]',
      );
      expect(evaluateExpression('Keys: {{ Object.keys({a:1,b:2}) }}')).toBe(
        'Keys: ["a","b"]',
      );
    });

    it('should handle empty expressions', () => {
      expect(evaluateExpression('{{}}')).toBe('');
      expect(evaluateExpression('text{{}}text')).toBe('texttext');
    });

    it('should handle whitespace in expressions', () => {
      expect(evaluateExpression('{{ 1 + 1 }}')).toBe('2');
      expect(evaluateExpression('{{    1 + 1    }}')).toBe('2');
    });
  });

  describe('Basic Math Operations', () => {
    it('should evaluate simple addition', () => {
      expect(evaluateExpression('{{ 2 + 2 }}')).toBe('4');
    });

    it('should evaluate complex math expressions', () => {
      expect(evaluateExpression('{{ (2 + 3) * 4 }}')).toBe('20');
      expect(evaluateExpression('{{ Math.sqrt(16) }}')).toBe('4');
      expect(evaluateExpression('{{ Math.pow(2, 3) }}')).toBe('8');
    });
  });

  describe('String Operations', () => {
    it('should handle string operations', () => {
      expect(evaluateExpression('{{ "hello".toUpperCase() }}')).toBe('HELLO');
      expect(evaluateExpression('{{ "hello".length }}')).toBe('5');
      expect(evaluateExpression('{{ "hello" + " world" }}')).toBe(
        'hello world',
      );
    });
  });

  describe('Array Operations', () => {
    it('should handle array operations', () => {
      expect(evaluateExpression('{{ [1,2,3].length }}')).toBe('3');
      expect(evaluateExpression('{{ [1,2,3].map(x => x * 2) }}')).toBe(
        '[2,4,6]',
      );
      expect(evaluateExpression('{{ [1,2,3].filter(x => x > 1) }}')).toBe(
        '[2,3]',
      );
    });
  });

  describe('Object Operations', () => {
    it('should handle object operations', () => {
      expect(evaluateExpression('{{ Object.keys({a: 1, b: 2}) }}')).toBe(
        '["a","b"]',
      );
      expect(evaluateExpression('{{ Object.values({a: 1, b: 2}) }}')).toBe(
        '[1,2]',
      );
    });
  });

  describe('Date Operations', () => {
    it('should handle date operations', () => {
      const currentYear = new Date().getFullYear();
      expect(evaluateExpression('{{ new Date().getFullYear() }}')).toBe(
        String(currentYear),
      );
    });
  });

  describe('Security Restrictions', () => {
    describe('Loop Detection', () => {
      it('should block while loops', () => {
        expect(() => evaluateExpression('{{ while(true) {} }}')).toThrow(
          'potentially dangerous operations',
        );
        expect(() => evaluateExpression('{{ while (true) {} }}')).toThrow(
          'potentially dangerous operations',
        );
      });

      it('should block for loops', () => {
        expect(() => evaluateExpression('{{ for(;;) {} }}')).toThrow(
          'potentially dangerous operations',
        );
        expect(() =>
          evaluateExpression('{{ for(let i=0;i<10;i++) {} }}'),
        ).toThrow('potentially dangerous operations');
      });

      it('should block do-while loops', () => {
        expect(() => evaluateExpression('{{ do {} while(true) }}')).toThrow(
          'potentially dangerous operations',
        );
      });
    });

    describe('Module Access', () => {
      it('should block require statements', () => {
        expect(() => evaluateExpression('{{ require("fs") }}')).toThrow(
          'potentially dangerous operations',
        );
      });

      it('should block import statements', () => {
        expect(() => evaluateExpression('{{ import("fs") }}')).toThrow(
          'potentially dangerous operations',
        );
      });
    });

    describe('System Access', () => {
      it('should block process access', () => {
        expect(() => evaluateExpression('{{ process.exit() }}')).toThrow(
          'potentially dangerous operations',
        );
      });

      it('should block global object access', () => {
        expect(() => evaluateExpression('{{ global }}')).toThrow(
          'potentially dangerous operations',
        );
      });

      it('should block Node.js module access', () => {
        expect(() => evaluateExpression('{{ fs.readFile() }}')).toThrow(
          'potentially dangerous operations',
        );
        expect(() => evaluateExpression('{{ http.get() }}')).toThrow(
          'potentially dangerous operations',
        );
      });
    });

    describe('Dynamic Code Execution', () => {
      it('should block eval', () => {
        expect(() => evaluateExpression('{{ eval("1+1") }}')).toThrow(
          'potentially dangerous operations',
        );
      });

      it('should block Function constructor', () => {
        expect(() =>
          evaluateExpression('{{ new Function("return 1+1") }}'),
        ).toThrow('potentially dangerous operations');
      });
    });

    describe('Network Access', () => {
      it('should block fetch', () => {
        expect(() =>
          evaluateExpression('{{ fetch("http://example.com") }}'),
        ).toThrow('potentially dangerous operations');
      });

      it('should block XMLHttpRequest', () => {
        expect(() => evaluateExpression('{{ new XMLHttpRequest() }}')).toThrow(
          'potentially dangerous operations',
        );
      });
    });

    describe('Timers', () => {
      it('should block setTimeout', () => {
        expect(() =>
          evaluateExpression('{{ setTimeout(() => {}, 1000) }}'),
        ).toThrow('potentially dangerous operations');
      });

      it('should block setInterval', () => {
        expect(() =>
          evaluateExpression('{{ setInterval(() => {}, 1000) }}'),
        ).toThrow('potentially dangerous operations');
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw on invalid expressions', () => {
      expect(() => evaluateExpression('{{ invalid expression }}')).toThrow();
    });

    it('should throw on syntax errors', () => {
      expect(() => evaluateExpression('{{ 2 + }}')).toThrow();
    });

    it('should throw on unclosed expressions', () => {
      expect(() => evaluateExpression('{{ 1 + 1')).toThrow();
    });

    it('should throw on non-template strings', () => {
      expect(() => evaluateExpression('plain text')).toThrow();
    });
  });
});
