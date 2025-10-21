/**
 * Message Model - Contact Form Submissions
 * 
 * This model handles all contact form submissions from the website.
 * Messages are stored in MongoDB with proper validation and indexing.
 */

class Message {
  /**
   * Message schema definition
   */
  static get schema() {
    return {
      // Required fields from contact form
      name: { 
        type: 'string', 
        required: true, 
        maxLength: 100,
        trim: true
      },
      email: { 
        type: 'string', 
        required: true, 
        maxLength: 255,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        trim: true
      },
      subject: { 
        type: 'string', 
        required: true,
        enum: ['general', 'programs', 'volunteer', 'partnership', 'support', 'sponsorships', 'other'],
        default: 'general'
      },
      message: { 
        type: 'string', 
        required: true, 
        minLength: 10,
        maxLength: 2000,
        trim: true
      },
      
      // System generated fields
      status: {
        type: 'string',
        enum: ['new', 'read', 'responded', 'archived'],
        default: 'new'
      },
      submittedAt: { 
        type: 'date', 
        required: true, 
        default: () => new Date() 
      },
      clientTimestamp: { 
        type: 'string', 
        required: false 
      },
      
      // Request metadata
      ipAddress: { 
        type: 'string', 
        required: false,
        maxLength: 45 // IPv6 max length
      },
      userAgent: { 
        type: 'string', 
        required: false,
        maxLength: 500
      },
      
      // Admin fields
      adminNotes: {
        type: 'string',
        required: false,
        maxLength: 1000
      },
      respondedAt: {
        type: 'date',
        required: false
      },
      respondedBy: {
        type: 'string',
        required: false,
        maxLength: 100
      }
    };
  }

  /**
   * MongoDB collection name
   */
  static get collectionName() {
    return 'messages';
  }

  /**
   * MongoDB indexes for performance
   */
  static get indexes() {
    return [
      { submittedAt: -1 }, // Sort by submission date (newest first)
      { status: 1 }, // Filter by status
      { email: 1 }, // Search by email
      { subject: 1 }, // Group by subject
      { 'submittedAt': 1, 'status': 1 } // Compound index for admin queries
    ];
  }

  /**
   * Validate message data against schema
   * @param {Object} data - Message data to validate
   * @returns {Object} - { valid: boolean, errors: array, sanitized: object }
   */
  static validate(data) {
    const errors = [];
    const sanitized = {};
    const schema = this.schema;

    // Validate each field according to schema
    for (const [fieldName, rules] of Object.entries(schema)) {
      const value = data[fieldName];

      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${fieldName} is required`);
        continue;
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === null) {
        if (rules.default !== undefined) {
          sanitized[fieldName] = typeof rules.default === 'function' ? rules.default() : rules.default;
        }
        continue;
      }

      // Type validation
      if (rules.type === 'string' && typeof value !== 'string') {
        errors.push(`${fieldName} must be a string`);
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
          errors.push(`${fieldName} format is invalid`);
          continue;
        }

        // Enum validation
        if (rules.enum && !rules.enum.includes(processedValue)) {
          errors.push(`${fieldName} must be one of: ${rules.enum.join(', ')}`);
          continue;
        }

        sanitized[fieldName] = processedValue;
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
   * Create a new message document
   * @param {Object} messageData - Raw message data from form
   * @param {Object} metadata - Request metadata (IP, user agent, etc.)
   * @returns {Object} - Validated and sanitized message document
   */
  static create(messageData, metadata = {}) {
    // Combine form data with metadata
    const fullData = {
      ...messageData,
      submittedAt: new Date(),
      status: 'new',
      ...metadata
    };

    // Validate the data
    const validation = this.validate(fullData);
    
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    return validation.sanitized;
  }

  /**
   * Get human-readable subject labels
   */
  static getSubjectLabel(subject) {
    const labels = {
      'general': 'General Inquiry',
      'programs': 'Program Information',
      'volunteer': 'Volunteer Opportunities',
      'partnership': 'Partnership',
      'support': 'Support/Donations',
      'sponsorships': 'Sponsorships',
      'other': 'Other'
    };
    return labels[subject] || subject;
  }

  /**
   * Get human-readable status labels
   */
  static getStatusLabel(status) {
    const labels = {
      'new': 'New',
      'read': 'Read',
      'responded': 'Responded',
      'archived': 'Archived'
    };
    return labels[status] || status;
  }
}

export default Message;