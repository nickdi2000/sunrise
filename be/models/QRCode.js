/**
 * QRCode Model - QR Code Management
 * 
 * This model handles QR code links that redirect to external URLs.
 * QR codes have immutable codes and editable links/descriptions.
 */

class QRCode {
  /**
   * QRCode schema definition
   */
  static get schema() {
    return {
      // Required fields
      code: { 
        type: 'string', 
        required: true, 
        maxLength: 50,
        trim: true,
        pattern: /^[a-zA-Z0-9-_]+$/,
        immutable: true // Cannot be changed after creation
      },
      link: { 
        type: 'string', 
        required: true, 
        maxLength: 2000,
        trim: true,
        pattern: /^https?:\/\/.+/
      },
      description: { 
        type: 'string', 
        required: false,
        maxLength: 500,
        trim: true
      },
      
      // System generated fields
      createdAt: { 
        type: 'date', 
        required: true, 
        default: () => new Date() 
      },
      updatedAt: { 
        type: 'date', 
        required: true, 
        default: () => new Date() 
      },
      createdBy: {
        type: 'string',
        required: false,
        maxLength: 100
      },
      
      // Analytics fields (optional for future use)
      clickCount: {
        type: 'number',
        default: 0
      },
      lastClickedAt: {
        type: 'date',
        required: false
      }
    };
  }

  /**
   * MongoDB collection name
   */
  static get collectionName() {
    return 'qrcodes';
  }

  /**
   * MongoDB indexes for performance
   */
  static get indexes() {
    return [
      { code: 1 }, // Unique index on code for fast lookups
      { createdAt: -1 }, // Sort by creation date
      { updatedAt: -1 } // Sort by update date
    ];
  }

  /**
   * Validate QR code data against schema
   * @param {Object} data - QR code data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   * @returns {Object} - { valid: boolean, errors: array, sanitized: object }
   */
  static validate(data, isUpdate = false) {
    const errors = [];
    const sanitized = {};
    const schema = this.schema;

    // Validate each field according to schema
    for (const [fieldName, rules] of Object.entries(schema)) {
      const value = data[fieldName];

      // Skip immutable fields on updates
      if (isUpdate && rules.immutable) {
        continue;
      }

      // Check required fields (only on create, not update)
      if (!isUpdate && rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${fieldName} is required`);
        continue;
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === null) {
        if (!isUpdate && rules.default !== undefined) {
          sanitized[fieldName] = typeof rules.default === 'function' ? rules.default() : rules.default;
        }
        continue;
      }

      // Type validation
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${fieldName} must be a string`);
        continue;
      }

      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${fieldName} must be a number`);
        continue;
      }

      if (rules.type === 'date' && !(value instanceof Date) && typeof value !== 'string') {
        errors.push(`${fieldName} must be a valid date`);
        continue;
      }

      // String-specific validations
      if (rules.type === 'string') {
        let processedValue = rules.trim ? value.trim() : value;

        // Length validation
        if (rules.minLength && processedValue.length < rules.minLength) {
          errors.push(`${fieldName} must be at least ${rules.minLength} characters long`);
          continue;
        }

        if (rules.maxLength && processedValue.length > rules.maxLength) {
          errors.push(`${fieldName} must be no more than ${rules.maxLength} characters long`);
          continue;
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(processedValue)) {
          if (fieldName === 'code') {
            errors.push(`${fieldName} can only contain letters, numbers, hyphens, and underscores`);
          } else if (fieldName === 'link') {
            errors.push(`${fieldName} must be a valid URL starting with http:// or https://`);
          } else {
            errors.push(`${fieldName} format is invalid`);
          }
          continue;
        }

        sanitized[fieldName] = processedValue;
      } else if (rules.type === 'number') {
        sanitized[fieldName] = value;
      } else {
        // For non-string types, use value as-is (with potential conversion)
        if (rules.type === 'date' && typeof value === 'string') {
          sanitized[fieldName] = new Date(value);
        } else {
          sanitized[fieldName] = value;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized
    };
  }

  /**
   * Create a new QR code document
   * @param {Object} qrCodeData - Raw QR code data
   * @param {string} createdBy - Username of creator
   * @returns {Object} - Validated and sanitized QR code document
   */
  static create(qrCodeData, createdBy = 'admin') {
    // Combine form data with metadata
    const fullData = {
      ...qrCodeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy,
      clickCount: 0
    };

    // Validate the data
    const validation = this.validate(fullData, false);
    
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return validation.sanitized;
  }

  /**
   * Prepare update data for an existing QR code
   * @param {Object} updateData - Fields to update
   * @returns {Object} - Validated and sanitized update data
   */
  static prepareUpdate(updateData) {
    // Add updatedAt timestamp
    const fullData = {
      ...updateData,
      updatedAt: new Date()
    };

    // Validate the data (as update)
    const validation = this.validate(fullData, true);
    
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return validation.sanitized;
  }

  /**
   * Increment click count for analytics
   * @returns {Object} - Update object for MongoDB
   */
  static incrementClick() {
    return {
      $inc: { clickCount: 1 },
      $set: { lastClickedAt: new Date() }
    };
  }
}

export default QRCode;

