/**
 * Performance benchmarks for pagination and infinite scroll
 * Requirements: 1.1 - Create performance benchmarks for load times
 */

import { performanceMonitor } from './performanceMonitor';

export interface BenchmarkResult {
    name: string;
    passed: boolean;
    actualValue: number;
    expectedValue: number;
    unit: string;
    details?: string;
}

export interface BenchmarkSuite {
    name: string;
    results: BenchmarkResult[];
    overallPassed: boolean;
    timestamp: number;
}

/**
 * Performance benchmarks based on requirements
 */
export const PERFORMANCE_BENCHMARKS = {
    // Requirement 1.1: Initial load within 2 seconds
    INITIAL_LOAD_TIME: 2000, // ms

    // Subsequent loads should be faster
    SUBSEQUENT_LOAD_TIME: 500, // ms

    // Memory should remain stable during infinite scroll
    MEMORY_GROWTH_THRESHOLD: 50 * 1024 * 1024, // 50MB

    // API response time thresholds
    API_RESPONSE_TIME: 1000, // ms

    // Render time thresholds
    RENDER_TIME: 100, // ms
} as const;

/**
 * Run performance benchmarks
 */
export function runPerformanceBenchmarks(): BenchmarkSuite {
    const stats = performanceMonitor.getStats();
    const thresholds = performanceMonitor.checkPerformanceThresholds();
    const recentMetrics = performanceMonitor.getRecentMetrics(10);
    const memoryMetrics = performanceMonitor.getRecentMemoryMetrics(5);

    const results: BenchmarkResult[] = [];

    // Benchmark 1: Initial Load Time
    const initialLoadMetrics = recentMetrics.filter(m =>
        m.operation.includes('initial') || m.metadata?.page === 1
    );

    if (initialLoadMetrics.length > 0) {
        const avgInitialLoad = initialLoadMetrics.reduce((sum, m) => sum + m.duration, 0) / initialLoadMetrics.length;
        results.push({
            name: 'Initial Load Time',
            passed: avgInitialLoad <= PERFORMANCE_BENCHMARKS.INITIAL_LOAD_TIME,
            actualValue: avgInitialLoad,
            expectedValue: PERFORMANCE_BENCHMARKS.INITIAL_LOAD_TIME,
            unit: 'ms',
            details: `Average of ${initialLoadMetrics.length} initial loads`
        });
    }

    // Benchmark 2: Subsequent Load Time
    const subsequentLoadMetrics = recentMetrics.filter(m =>
        m.metadata?.page && m.metadata.page > 1
    );

    if (subsequentLoadMetrics.length > 0) {
        const avgSubsequentLoad = subsequentLoadMetrics.reduce((sum, m) => sum + m.duration, 0) / subsequentLoadMetrics.length;
        results.push({
            name: 'Subsequent Load Time',
            passed: avgSubsequentLoad <= PERFORMANCE_BENCHMARKS.SUBSEQUENT_LOAD_TIME,
            actualValue: avgSubsequentLoad,
            expectedValue: PERFORMANCE_BENCHMARKS.SUBSEQUENT_LOAD_TIME,
            unit: 'ms',
            details: `Average of ${subsequentLoadMetrics.length} subsequent loads`
        });
    }

    // Benchmark 3: Memory Stability
    if (memoryMetrics.length >= 2) {
        const firstMemory = memoryMetrics[0].heapUsed;
        const lastMemory = memoryMetrics[memoryMetrics.length - 1].heapUsed;
        const memoryGrowth = lastMemory - firstMemory;

        results.push({
            name: 'Memory Growth',
            passed: memoryGrowth <= PERFORMANCE_BENCHMARKS.MEMORY_GROWTH_THRESHOLD,
            actualValue: memoryGrowth,
            expectedValue: PERFORMANCE_BENCHMARKS.MEMORY_GROWTH_THRESHOLD,
            unit: 'bytes',
            details: `Growth over ${memoryMetrics.length} measurements`
        });
    }

    // Benchmark 4: Average Response Time
    if (stats.totalOperations > 0) {
        results.push({
            name: 'Average Response Time',
            passed: stats.averageLoadTime <= PERFORMANCE_BENCHMARKS.API_RESPONSE_TIME,
            actualValue: stats.averageLoadTime,
            expectedValue: PERFORMANCE_BENCHMARKS.API_RESPONSE_TIME,
            unit: 'ms',
            details: `Average of ${stats.totalOperations} operations`
        });
    }

    // Benchmark 5: Slowest Operation
    if (stats.slowestOperation) {
        results.push({
            name: 'Slowest Operation',
            passed: stats.slowestOperation.duration <= PERFORMANCE_BENCHMARKS.INITIAL_LOAD_TIME,
            actualValue: stats.slowestOperation.duration,
            expectedValue: PERFORMANCE_BENCHMARKS.INITIAL_LOAD_TIME,
            unit: 'ms',
            details: `Operation: ${stats.slowestOperation.operation}`
        });
    }

    const overallPassed = results.every(r => r.passed);

    return {
        name: 'Pagination Performance Benchmarks',
        results,
        overallPassed,
        timestamp: Date.now()
    };
}

/**
 * Generate a performance report
 */
export function generatePerformanceReport(): string {
    const benchmarks = runPerformanceBenchmarks();
    const stats = performanceMonitor.getStats();

    let report = `# Performance Report\n\n`;
    report += `Generated: ${new Date(benchmarks.timestamp).toISOString()}\n`;
    report += `Overall Status: ${benchmarks.overallPassed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

    report += `## Benchmark Results\n\n`;
    benchmarks.results.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        report += `${status} **${result.name}**\n`;
        report += `   - Actual: ${result.actualValue.toFixed(2)} ${result.unit}\n`;
        report += `   - Expected: ≤ ${result.expectedValue} ${result.unit}\n`;
        if (result.details) {
            report += `   - Details: ${result.details}\n`;
        }
        report += `\n`;
    });

    report += `## Performance Statistics\n\n`;
    report += `- Total Operations: ${stats.totalOperations}\n`;
    report += `- Average Load Time: ${stats.averageLoadTime.toFixed(2)}ms\n`;
    report += `- Memory Trend: ${stats.memoryTrend}\n`;

    if (stats.slowestOperation) {
        report += `- Slowest Operation: ${stats.slowestOperation.duration.toFixed(2)}ms (${stats.slowestOperation.operation})\n`;
    }

    if (stats.fastestOperation) {
        report += `- Fastest Operation: ${stats.fastestOperation.duration.toFixed(2)}ms (${stats.fastestOperation.operation})\n`;
    }

    return report;
}

/**
 * Log performance benchmarks to console
 */
export function logPerformanceBenchmarks(): void {
    const benchmarks = runPerformanceBenchmarks();

    console.group('🚀 Performance Benchmarks');
    console.log(`Overall Status: ${benchmarks.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);

    benchmarks.results.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        console.log(`${status} ${result.name}: ${result.actualValue.toFixed(2)}${result.unit} (expected ≤ ${result.expectedValue}${result.unit})`);
        if (result.details) {
            console.log(`   ${result.details}`);
        }
    });

    console.groupEnd();
}

/**
 * Automated performance monitoring
 * Runs benchmarks periodically and logs warnings
 */
export function startPerformanceMonitoring(intervalMs: number = 30000): () => void {
    const interval = setInterval(() => {
        const benchmarks = runPerformanceBenchmarks();

        if (!benchmarks.overallPassed) {
            console.warn('⚠️ Performance benchmarks failed!');
            logPerformanceBenchmarks();
        }

        // Log to performance monitor for tracking
        performanceMonitor.addMetric({
            operation: 'benchmark-check',
            duration: benchmarks.overallPassed ? 0 : 1, // Use as pass/fail indicator
            timestamp: Date.now(),
            metadata: {
                passed: benchmarks.overallPassed,
                failedCount: benchmarks.results.filter(r => !r.passed).length
            }
        });

    }, intervalMs);

    return () => clearInterval(interval);
}

/**
 * Export performance data for analysis
 */
export function exportPerformanceData(): {
    benchmarks: BenchmarkSuite;
    stats: ReturnType<typeof performanceMonitor.getStats>;
    recentMetrics: ReturnType<typeof performanceMonitor.getRecentMetrics>;
    memoryMetrics: ReturnType<typeof performanceMonitor.getRecentMemoryMetrics>;
} {
    return {
        benchmarks: runPerformanceBenchmarks(),
        stats: performanceMonitor.getStats(),
        recentMetrics: performanceMonitor.getRecentMetrics(20),
        memoryMetrics: performanceMonitor.getRecentMemoryMetrics(10)
    };
}