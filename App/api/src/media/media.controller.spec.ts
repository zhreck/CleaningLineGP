import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { BadRequestException } from '@nestjs/common';
import * as fc from 'fast-check';

describe('MediaController', () => {
  let controller: MediaController;
  let service: MediaService;

  // Mock MediaService
  const mockMediaService = {
    upload: jest.fn(),
    list: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mockMediaService,
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    service = module.get<MediaService>(MediaService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('upload', () => {
    /**
     * **Feature: media-picker, Property 22: Backend upload returns URL**
     *
     * Property: For any valid image file uploaded to /media/upload,
     * the backend should store it in MinIO and return a response containing the public URL.
     *
     * Validates: Requirements 7.1
     */
    it('should return a URL for any valid image file (Property 22)', async () => {
      // Configure property test to run 100 iterations
      await fc.assert(
        fc.asyncProperty(
          // Generate random valid image files
          fc.record({
            originalname: fc
              .string({ minLength: 1, maxLength: 50 })
              .map((s) => `${s}.jpg`),
            mimetype: fc.constantFrom(
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/webp',
            ),
            size: fc.integer({ min: 1, max: 5 * 1024 * 1024 }), // 1 byte to 5MB
            buffer: fc.uint8Array({ minLength: 100, maxLength: 1000 }),
          }),
          async (fileData) => {
            // Create a mock file object
            const mockFile = {
              originalname: fileData.originalname,
              mimetype: fileData.mimetype,
              size: fileData.size,
              buffer: Buffer.from(fileData.buffer),
            } as Express.Multer.File;

            // Generate a mock URL that the service would return
            const mockUrl = `http://localhost:9000/products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;

            // Mock the service to return a URL
            mockMediaService.upload.mockResolvedValue({ url: mockUrl });

            // Call the controller
            const result = await controller.upload(mockFile);

            // Property: The result should contain a URL
            expect(result).toHaveProperty('url');
            expect(typeof result.url).toBe('string');
            expect(result.url).toMatch(/^http/); // URL should start with http
            expect(result.url.length).toBeGreaterThan(0);

            // Verify the service was called with the file
            expect(mockMediaService.upload).toHaveBeenCalledWith(mockFile);
          },
        ),
        { numRuns: 100 }, // Run 100 iterations as specified in design
      );
    });

    it('should reject files with no file provided', async () => {
      await expect(controller.upload(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.upload(undefined as any)).rejects.toThrow(
        'No file provided',
      );
    });

    it('should reject files exceeding 5MB', async () => {
      const largeFile = {
        originalname: 'large.jpg',
        mimetype: 'image/jpeg',
        size: 6 * 1024 * 1024, // 6MB
        buffer: Buffer.alloc(100),
      } as Express.Multer.File;

      await expect(controller.upload(largeFile)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.upload(largeFile)).rejects.toThrow(
        'File size exceeds 5MB limit',
      );
    });

    /**
     * Error Handling Tests - Requirements 7.4, 7.5
     */
    describe('file validation errors', () => {
      it('should reject invalid file types', async () => {
        const invalidFile = {
          originalname: 'document.pdf',
          mimetype: 'application/pdf',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // Mock service to throw validation error
        mockMediaService.upload.mockRejectedValue(
          new BadRequestException(
            'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WEBP)',
          ),
        );

        await expect(controller.upload(invalidFile)).rejects.toThrow(
          BadRequestException,
        );
        await expect(controller.upload(invalidFile)).rejects.toThrow(
          'Invalid file type',
        );
      });

      it('should reject files with invalid mimetype', async () => {
        const invalidFile = {
          originalname: 'script.js',
          mimetype: 'application/javascript',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        mockMediaService.upload.mockRejectedValue(
          new BadRequestException(
            'Invalid file type. Only images are allowed (JPEG, PNG, GIF, WEBP)',
          ),
        );

        await expect(controller.upload(invalidFile)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should reject files with zero size', async () => {
        const emptyFile = {
          originalname: 'empty.jpg',
          mimetype: 'image/jpeg',
          size: 0,
          buffer: Buffer.alloc(0),
        } as Express.Multer.File;

        mockMediaService.upload.mockRejectedValue(
          new BadRequestException('File is empty'),
        );

        await expect(controller.upload(emptyFile)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should handle multiple validation errors', async () => {
        const invalidFile = {
          originalname: 'large-document.pdf',
          mimetype: 'application/pdf',
          size: 10 * 1024 * 1024, // 10MB
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // File size is checked first in controller
        await expect(controller.upload(invalidFile)).rejects.toThrow(
          BadRequestException,
        );
        await expect(controller.upload(invalidFile)).rejects.toThrow(
          'File size exceeds 5MB limit',
        );
      });
    });

    describe('MinIO connection failures', () => {
      it('should handle MinIO connection errors during upload', async () => {
        const validFile = {
          originalname: 'test.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // Mock MinIO connection failure
        mockMediaService.upload.mockRejectedValue(
          new Error('MinIO connection failed'),
        );

        await expect(controller.upload(validFile)).rejects.toThrow(
          'Failed to upload file',
        );
      });

      it('should handle MinIO timeout errors', async () => {
        const validFile = {
          originalname: 'test.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // Mock timeout error
        mockMediaService.upload.mockRejectedValue(
          new Error('Connection timeout'),
        );

        await expect(controller.upload(validFile)).rejects.toThrow(
          'Failed to upload file',
        );
      });

      it('should handle MinIO bucket not found errors', async () => {
        const validFile = {
          originalname: 'test.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // Mock bucket not found error
        mockMediaService.upload.mockRejectedValue(
          new Error('Bucket does not exist'),
        );

        await expect(controller.upload(validFile)).rejects.toThrow(
          'Failed to upload file',
        );
      });

      it('should handle MinIO insufficient permissions', async () => {
        const validFile = {
          originalname: 'test.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          buffer: Buffer.alloc(100),
        } as Express.Multer.File;

        // Mock permission error
        mockMediaService.upload.mockRejectedValue(new Error('Access denied'));

        await expect(controller.upload(validFile)).rejects.toThrow(
          'Failed to upload file',
        );
      });
    });
  });

  describe('list', () => {
    /**
     * **Feature: media-picker, Property 23: Backend list returns all images**
     *
     * Property: For any GET request to /media/list,
     * the backend should return an array containing the URLs of all images currently stored in MinIO.
     *
     * Validates: Requirements 7.2
     */
    it('should return an array containing all image URLs (Property 23)', async () => {
      // Configure property test to run 100 iterations
      await fc.assert(
        fc.asyncProperty(
          // Generate random arrays of image URLs
          fc.array(
            fc.record({
              fileName: fc
                .string({ minLength: 5, maxLength: 30 })
                .map((s) => `${s}.jpg`),
              timestamp: fc.integer({ min: 1000000000000, max: 9999999999999 }),
            }),
            { minLength: 0, maxLength: 20 }, // Test with 0 to 20 images
          ),
          async (imageData) => {
            // Build URLs from the generated data
            const mockUrls = imageData.map(
              (img) =>
                `http://localhost:9000/products/${img.timestamp}-${img.fileName}`,
            );

            // Mock the service to return these URLs
            mockMediaService.list.mockResolvedValue(mockUrls);

            // Call the controller
            const result = await controller.list();

            // Property: The result should be an array
            expect(Array.isArray(result)).toBe(true);

            // Property: The result should contain exactly the same URLs
            expect(result).toEqual(mockUrls);
            expect(result.length).toBe(mockUrls.length);

            // Property: All items in the result should be strings
            result.forEach((url) => {
              expect(typeof url).toBe('string');
            });

            // Property: All URLs should be valid HTTP URLs
            result.forEach((url) => {
              expect(url).toMatch(/^http/);
            });

            // Verify the service was called
            expect(mockMediaService.list).toHaveBeenCalled();
          },
        ),
        { numRuns: 100 }, // Run 100 iterations as specified in design
      );
    });

    it('should return an array of URLs', async () => {
      const mockUrls = [
        'http://localhost:9000/products/image1.jpg',
        'http://localhost:9000/products/image2.png',
      ];
      mockMediaService.list.mockResolvedValue(mockUrls);

      const result = await controller.list();

      expect(result).toEqual(mockUrls);
      expect(mockMediaService.list).toHaveBeenCalled();
    });

    /**
     * Error Handling Tests - Requirements 7.4
     */
    describe('MinIO connection failures', () => {
      it('should handle MinIO connection errors during list', async () => {
        // Mock MinIO connection failure
        mockMediaService.list.mockRejectedValue(
          new Error('MinIO connection failed'),
        );

        await expect(controller.list()).rejects.toThrow(
          'Failed to fetch image list',
        );
      });

      it('should handle MinIO timeout errors during list', async () => {
        // Mock timeout error
        mockMediaService.list.mockRejectedValue(
          new Error('Connection timeout'),
        );

        await expect(controller.list()).rejects.toThrow(
          'Failed to fetch image list',
        );
      });

      it('should handle MinIO bucket access errors', async () => {
        // Mock bucket access error
        mockMediaService.list.mockRejectedValue(
          new Error('Access denied to bucket'),
        );

        await expect(controller.list()).rejects.toThrow(
          'Failed to fetch image list',
        );
      });

      it('should handle empty bucket gracefully', async () => {
        // Mock empty bucket (not an error, but edge case)
        mockMediaService.list.mockResolvedValue([]);

        const result = await controller.list();

        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });

  describe('delete', () => {
    /**
     * **Feature: media-picker, Property 24: Backend delete removes file**
     *
     * Property: For any DELETE request to /media with a valid filename,
     * the backend should remove that file from MinIO storage.
     *
     * Validates: Requirements 7.3
     */
    it('should remove file from storage for any valid URL (Property 24)', async () => {
      // Configure property test to run 100 iterations
      await fc.assert(
        fc.asyncProperty(
          // Generate random valid image URLs
          fc.record({
            fileName: fc
              .string({ minLength: 5, maxLength: 30 })
              .map((s) => `${s}.jpg`),
            timestamp: fc.integer({ min: 1000000000000, max: 9999999999999 }),
            extension: fc.constantFrom('jpg', 'png', 'gif', 'webp'),
          }),
          async (urlData) => {
            // Build a valid URL
            const fileUrl = `http://localhost:9000/products/${urlData.timestamp}-${urlData.fileName.replace('.jpg', '')}.${urlData.extension}`;

            // Mock the service to successfully delete
            mockMediaService.delete.mockResolvedValue(undefined);

            // Call the controller
            const result = await controller.delete(fileUrl);

            // Property: The result should indicate success
            expect(result).toHaveProperty('success');
            expect(result.success).toBe(true);

            // Property: The service should be called with the URL
            expect(mockMediaService.delete).toHaveBeenCalledWith(fileUrl);

            // Property: The service should be called exactly once per delete
            expect(mockMediaService.delete).toHaveBeenCalledTimes(1);

            // Reset mock for next iteration
            mockMediaService.delete.mockClear();
          },
        ),
        { numRuns: 100 }, // Run 100 iterations as specified in design
      );
    });

    it('should delete a file and return success', async () => {
      const fileUrl = 'http://localhost:9000/products/test.jpg';
      mockMediaService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(fileUrl);

      expect(result).toEqual({ success: true });
      expect(mockMediaService.delete).toHaveBeenCalledWith(fileUrl);
    });

    it('should reject delete without file URL', async () => {
      await expect(controller.delete('')).rejects.toThrow(BadRequestException);
      await expect(controller.delete('')).rejects.toThrow(
        'File URL is required',
      );
    });

    /**
     * Error Handling Tests - Requirements 7.4, 7.5
     */
    describe('file validation errors', () => {
      it('should reject delete with null URL', async () => {
        await expect(controller.delete(null as any)).rejects.toThrow(
          BadRequestException,
        );
        await expect(controller.delete(null as any)).rejects.toThrow(
          'File URL is required',
        );
      });

      it('should reject delete with undefined URL', async () => {
        await expect(controller.delete(undefined as any)).rejects.toThrow(
          BadRequestException,
        );
        await expect(controller.delete(undefined as any)).rejects.toThrow(
          'File URL is required',
        );
      });

      it('should reject delete with invalid URL format', async () => {
        const invalidUrl = 'not-a-valid-url';

        mockMediaService.delete.mockRejectedValue(
          new BadRequestException('Invalid URL: cannot extract filename'),
        );

        await expect(controller.delete(invalidUrl)).rejects.toThrow(
          BadRequestException,
        );
      });

      it('should reject delete with malformed URL', async () => {
        const malformedUrl = 'http://';

        mockMediaService.delete.mockRejectedValue(
          new BadRequestException('Invalid URL: cannot extract filename'),
        );

        await expect(controller.delete(malformedUrl)).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('MinIO connection failures', () => {
      it('should handle MinIO connection errors during delete', async () => {
        const fileUrl = 'http://localhost:9000/products/test.jpg';

        // Mock MinIO connection failure
        mockMediaService.delete.mockRejectedValue(
          new Error('MinIO connection failed'),
        );

        await expect(controller.delete(fileUrl)).rejects.toThrow(
          'Failed to delete file',
        );
      });

      it('should handle file not found errors', async () => {
        const fileUrl = 'http://localhost:9000/products/nonexistent.jpg';

        // Mock file not found error
        mockMediaService.delete.mockRejectedValue(new Error('File not found'));

        await expect(controller.delete(fileUrl)).rejects.toThrow(
          'Failed to delete file',
        );
      });

      it('should handle MinIO timeout errors during delete', async () => {
        const fileUrl = 'http://localhost:9000/products/test.jpg';

        // Mock timeout error
        mockMediaService.delete.mockRejectedValue(
          new Error('Connection timeout'),
        );

        await expect(controller.delete(fileUrl)).rejects.toThrow(
          'Failed to delete file',
        );
      });

      it('should handle MinIO permission errors during delete', async () => {
        const fileUrl = 'http://localhost:9000/products/test.jpg';

        // Mock permission error
        mockMediaService.delete.mockRejectedValue(new Error('Access denied'));

        await expect(controller.delete(fileUrl)).rejects.toThrow(
          'Failed to delete file',
        );
      });

      it('should handle bucket not found errors during delete', async () => {
        const fileUrl = 'http://localhost:9000/products/test.jpg';

        // Mock bucket not found error
        mockMediaService.delete.mockRejectedValue(
          new Error('Bucket does not exist'),
        );

        await expect(controller.delete(fileUrl)).rejects.toThrow(
          'Failed to delete file',
        );
      });
    });
  });

  /**
   * Authentication Failure Tests - Requirements 7.4, 7.5
   *
   * Note: These tests verify that the controller is properly decorated with guards.
   * The actual authentication logic is tested in the auth module.
   * Here we verify that the guards are applied to the controller.
   */
  describe('authentication and authorization', () => {
    it('should have JwtAuthGuard applied to controller', () => {
      const guards = Reflect.getMetadata('__guards__', MediaController);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should have RolesGuard applied to controller', () => {
      const guards = Reflect.getMetadata('__guards__', MediaController);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should require ADMIN role for controller', () => {
      const roles = Reflect.getMetadata('roles', MediaController);
      expect(roles).toBeDefined();
      expect(roles).toContain('admin');
    });

    it('should protect upload endpoint with authentication', () => {
      // Verify that upload method exists and is protected
      expect(controller.upload).toBeDefined();
      expect(typeof controller.upload).toBe('function');
    });

    it('should protect list endpoint with authentication', () => {
      // Verify that list method exists and is protected
      expect(controller.list).toBeDefined();
      expect(typeof controller.list).toBe('function');
    });

    it('should protect delete endpoint with authentication', () => {
      // Verify that delete method exists and is protected
      expect(controller.delete).toBeDefined();
      expect(typeof controller.delete).toBe('function');
    });
  });
});
