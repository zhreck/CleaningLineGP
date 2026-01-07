/**
 * Performance monitoring utilities for pagination and infinite scroll
 * Requirements: 1.1 - Performance monitoring for load times
 */

export interface PerformanceMetric {
    operation: string;
    duration: number;
    timestamp: number;
    metadata?: Record<string, any>;
}

export interface MemoryMetric {
    operation: string;
    heapUsed: number;
    heapTotal: number;
    timestamp: number;
    itemCount?: number;
}

class PerformanceMonitor {
    private metrics: PerformanceMetric[] = [];
    private memoryMetrics: MemoryMetric[] = [];
    private maxMetrics = 100; // Keep only last 100 metrics

    /**
     * Start timing an operation
     */
    startTiming(operation: string): () => void {
        const startTime = performance.now();

        return (metadata?: Record<string, any>) => {
            const endTime = performance.now();
            const duration = endTime - startTime;

            this.addMetric({
                operation,
                duration,
                timestamp: Date.now(),
                metadata
            });

            return duration;
        };
    }

    /**
     * Add a performance metric
     */
    addMetric(metric: PerformanceMetric): void {
        this.metrics.push(metric);

        // Keep only the most recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${metric.operation}: ${metric.duration.toFixed(2)}ms`, metric.metadata);

            // Warn about slow operations
            if (metric.duration > 2000) {
                console.warn(`[Performance Warning] Slow operation: ${metric.operation} took ${metric.duration.toFixed(2)}ms`);
            }
        }
    }

    /**
     * Record memory usage for infinite scroll monitoring
     */
    recordMemoryUsage(operation: string, itemCount?: number): void {
        if (typeof window === 'undefined' || !('performance' in window) || !('memory' in (window.performance as any))) {
            return; // Memory API not available
        }

        const memory = (window.performance as any).memory;

        const memoryMetric: MemoryMetric = {
            operation,
            heapUsed: memory.usedJSHeapSize,
            heapTotal: memory.totalJSHeapSize,
            timestamp: Date.now(),
            itemCount
        };

        this.memoryMetrics.push(memoryMetric);

        // Keep only the most recent memory metrics
        if (this.memoryMetrics.length > this.maxMetrics) {
            this.memoryMetrics = this.memoryMetrics.slice(-this.maxMetrics);
        }

        // Log memory usage in development
        if (process.env.NODE_ENV === 'development') {
            const heapUsedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
            const heapTotalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
            console.log(`[Memory] ${operation}: ${heapUsedMB}MB / ${heapTotalMB}MB (${itemCount} items)`);
        }
    }

    /**
     * Get performance statistics
     */
    getStats(): {
        averageLoadTime: number;
        slowestOperation: PerformanceMetric | null;
        fastestOperation: PerformanceMetric | null;
        totalOperations: number;
        memoryTrend: 'stable' | 'increasing' | 'decreasing' | 'unknown';
    } {
        if (this.metrics.length === 0) {
            return {
                averageLoadTime: 0,
                slowestOperation: null,
                fastestOperation: null,
                totalOperations: 0,
                memoryTrend: 'unknown'
            };
        }

        const durations = this.metrics.map(m => m.duration);
        const averageLoadTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;

        const slowestOperation = this.metrics.reduce((slowest, current) =>
            current.duration > slowest.duration ? current : slowest
        );

        const fastestOperation = this.metrics.reduce((fastest, current) =>
            current.duration < fastest.duration ? current : fastest
        );

        // Analyze memory trend
        let memoryTrend: 'stable' | 'increasing' | 'decreasing' | 'unknown' = 'unknown';
        if (this.memoryMetrics.length >= 3) {
            const recent = this.memoryMetrics.slice(-3);
            const first = recent[0].heapUsed;
            const last = recent[recent.length - 1].heapUsed;
            const diff = last - first;
            const threshold = 1024 * 1024; // 1MB threshold

            if (Math.abs(diff) < threshold) {
                memoryTrend = 'stable';
            } else if (diff > threshold) {
                memoryTrend = 'increasing';
            } else {
                memoryTrend = 'decreasing';
            }
        }

        return {
            averageLoadTime,
            slowestOperation,
            fastestOperation,
            totalOperations: this.metrics.length,
            memoryTrend
        };
    }

    /**
     * Get recent metrics for debugging
     */
    getRecentMetrics(count: number = 10): PerformanceMetric[] {
        return this.metrics.slice(-count);
    }

    /**
     * Get recent memory metrics for debugging
     */
    getRecentMemoryMetrics(count: number = 10): MemoryMetric[] {
        return this.memoryMetrics.slice(-count);
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics = [];
        this.memoryMetrics = [];
    }

    /**
     * Check if performance is within acceptable thresholds
     */
    checkPerformanceThresholds(): {
        initialLoadOk: boolean;
        subsequentLoadOk: boolean;
        memoryStable: boolean;
        warnings: string[];
    } {
        const stats = this.getStats();
        const warnings: string[] = [];

        // Check initial load time (should be < 2 seconds)
        const initialLoadMetrics = this.metrics.filter(m => m.operation.includes('initial') || m.metadata?.page === 1);
        const avgInitialLoad = initialLoadMetrics.length > 0
            ? initialLoadMetrics.reduce((sum, m) => sum + m.duration, 0) / initialLoadMetrics.length
            : 0;
        const initialLoadOk = avgInitialLoad < 2000;

        if (!initialLoadOk && avgInitialLoad > 0) {
            warnings.push(`Initial load time is ${avgInitialLoad.toFixed(0)}ms (should be < 2000ms)`);
        }

        // Check subsequent load times (should be < 500ms)
        const subsequentLoadMetrics = this.metrics.filter(m => m.metadata?.page && m.metadata.page > 1);
        const avgSubsequentLoad = subsequentLoadMetrics.length > 0
            ? subsequentLoadMetrics.reduce((sum, m) => sum + m.duration, 0) / subsequentLoadMetrics.length
            : 0;
        const subsequentLoadOk = avgSubsequentLoad < 500;

        if (!subsequentLoadOk && avgSubsequentLoad > 0) {
            warnings.push(`Subsequent load time is ${avgSubsequentLoad.toFixed(0)}ms (should be < 500ms)`);
        }

        // Check memory stability
        const memoryStable = stats.memoryTrend === 'stable' || stats.memoryTrend === 'unknown';

        if (!memoryStable) {
            warnings.push(`Memory usage is ${stats.memoryTrend}`);
        }

        return {
            initialLoadOk,
            subsequentLoadOk,
            memoryStable,
            warnings
        };
    }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Make it available globally for debugging
if (typeof window !== 'undefined') {
    (window as any).performanceMonitor = performanceMonitor;
}