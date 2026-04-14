import { describe, it, expect } from 'vitest';
import { 
  validateCityName, 
  validateCoordinates, 
  sanitizeInput,
  validateCountryCode 
} from '../validation';

describe('Validation', () => {
  describe('validateCityName', () => {
    it('should accept valid city names', () => {
      const result1 = validateCityName('Paris');
      expect(result1.isValid).toBe(true);
      expect(result1.sanitized).toBe('Paris');
      
      const result2 = validateCityName('New York');
      expect(result2.isValid).toBe(true);
      expect(result2.sanitized).toBe('New York');
      
      const result3 = validateCityName('São Paulo');
      expect(result3.isValid).toBe(true);
      expect(result3.sanitized).toBe('São Paulo');
    });

    it('should reject empty city names', () => {
      const result = validateCityName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le nom de la ville est requis');
    });

    it('should reject city names that are too long', () => {
      const longName = 'a'.repeat(101);
      const result = validateCityName(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le nom de la ville ne doit pas dépasser 100 caractères');
    });

    it('should reject city names with dangerous characters', () => {
      const result = validateCityName('Paris<script>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le nom de la ville contient des caractères non autorisés');
    });

    it('should sanitize city names', () => {
      const result = validateCityName('  Paris  ');
      expect(result.sanitized).toBe('Paris');
    });
  });

  describe('validateCoordinates', () => {
    it('should accept valid coordinates', () => {
      const result1 = validateCoordinates(48.8566, 2.3522);
      expect(result1.isValid).toBe(true);
      
      const result2 = validateCoordinates(-33.8688, 151.2093);
      expect(result2.isValid).toBe(true);
    });

    it('should reject invalid latitude', () => {
      const result = validateCoordinates(91, 0);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Latitude invalide');
    });

    it('should reject invalid longitude', () => {
      const result = validateCoordinates(0, 181);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Longitude invalide');
    });

    it('should reject non-numeric values', () => {
      expect(validateCoordinates(NaN, 0).isValid).toBe(false);
      expect(validateCoordinates(0, NaN).isValid).toBe(false);
      expect(validateCoordinates(null as unknown as number, 0).isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("test")</script>')).toBe('alert(test)');
      expect(sanitizeInput('<div>Hello</div>')).toBe('Hello');
    });

    it('should escape special characters', () => {
      expect(sanitizeInput('Hello & World')).toBe('Hello &amp; World');
      expect(sanitizeInput('Test < value > 5')).toBe('Test &lt; value &gt; 5');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null as unknown as string)).toBe('');
      expect(sanitizeInput(undefined as unknown as string)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world');
    });
  });

  describe('validateCountryCode', () => {
    it('should accept valid country codes', () => {
      expect(validateCountryCode('FR')).toEqual({ isValid: true, value: 'FR' });
      expect(validateCountryCode('US')).toEqual({ isValid: true, value: 'US' });
      expect(validateCountryCode('gb')).toEqual({ isValid: true, value: 'GB' });
    });

    it('should reject invalid country codes', () => {
      expect(validateCountryCode('FRA').isValid).toBe(false);
      expect(validateCountryCode('F').isValid).toBe(false);
      expect(validateCountryCode('12').isValid).toBe(false);
    });
  });
});
